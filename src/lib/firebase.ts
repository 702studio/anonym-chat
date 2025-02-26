import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator, ref, onDisconnect, onValue, Database } from 'firebase/database';

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Çevre değişkenlerinin eksik olup olmadığını kontrol et
const missingEnvVars = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  console.error(
    "[Firebase] ⚠️ UYARI: Bazı Firebase yapılandırma değerleri eksik veya boş:",
    missingEnvVars.join(", ")
  );
  console.error(
    "[Firebase] Lütfen `.env.local` dosyanızın doğru ayarlandığından emin olun. " +
    "API anahtarınızı ve diğer bilgileri `.env.local` dosyasına eklemelisiniz."
  );
}

// Kritik yapılandırma değerlerinin varlığını kontrol et ve fallback değerler sağla
// NOT: Bu fallback değerler sadece geliştirme amaçlıdır ve gerçek projelerde kullanılmamalıdır
if (!firebaseConfig.databaseURL) {
  console.warn("[Firebase] ⚠️ databaseURL eksik! Geliştirme için varsayılan değer kullanılıyor.");
  firebaseConfig.databaseURL = "https://anonymchat-f8ad7-default-rtdb.europe-west1.firebasedatabase.app";
}

if (!firebaseConfig.apiKey) {
  console.warn("[Firebase] ⚠️ apiKey eksik! Geliştirme için geçici değer kullanılıyor");
  // Geçici ve sınırlı API anahtarı - sadece geliştirme amaçlıdır!
  firebaseConfig.apiKey = "AIzaSyDUMMY_FOR_LOCAL_DEVELOPMENT_ONLY";
}

console.log("[Firebase] Yapılandırma yükleniyor:", { 
  apiKey: firebaseConfig.apiKey ? "***" : "YOK ⚠️",
  authDomain: firebaseConfig.authDomain || "YOK ⚠️",
  databaseURL: firebaseConfig.databaseURL || "YOK ⚠️",
  projectId: firebaseConfig.projectId || "YOK ⚠️",
  storageBucket: firebaseConfig.storageBucket ? "AYARLI" : "YOK ⚠️",
  messagingSenderId: firebaseConfig.messagingSenderId ? "AYARLI" : "YOK ⚠️",
  appId: firebaseConfig.appId ? "AYARLI" : "YOK ⚠️"
});

// Firebase bağlantısı kurma ve dayanıklılık ekleme işlemleri
function setupFirebaseResilience(database: Database) {
  try {
    console.log("[Firebase] Database bağlantısı yapılandırılıyor...");
    console.log("[Firebase] Veritabanı URL:", firebaseConfig.databaseURL);
    
    // Çevrimdışı özellikleri etkinleştir
    if (typeof window !== "undefined") {
      console.log("[Firebase] Tarayıcı ortamı algılandı, bağlantı izleniyor...");
      const connectedRef = ref(database, '.info/connected');
      
      // Bağlantı durumunu izle
      onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          console.log("[Firebase] ✅ Firebase'e bağlandı");
          // Bağlantı durumu elementi varsa güncelle
          if (typeof document !== 'undefined') {
            const statusElement = document.querySelector('.status-tag');
            if (statusElement) {
              statusElement.textContent = 'bağlı';
              statusElement.className = statusElement.className.replace('red', 'green');
            }
          }
        } else {
          console.log("[Firebase] ❌ Firebase bağlantısı kesildi");
          // Bağlantı durumu elementi varsa güncelle
          if (typeof document !== 'undefined') {
            const statusElement = document.querySelector('.status-tag');
            if (statusElement) {
              statusElement.textContent = 'bağlantı kesildi';
              statusElement.className = statusElement.className.replace('green', 'red');
            }
          }
        }
      }, (error) => {
        console.error("[Firebase] ❌❌ Bağlantı durumu izleme hatası:", error);
        // Hata durumunu UI'da göster
        if (typeof document !== 'undefined') {
          const statusElement = document.querySelector('.status-tag');
          if (statusElement) {
            statusElement.textContent = 'bağlantı hatası';
            statusElement.className = statusElement.className.replace('green', 'red');
          }
        }
      });
      
      // Firebase'in cache kullanmasını sağlayarak bağlantı kesintilerinde dayanıklılık
      database.app.automaticDataCollectionEnabled = true;
      console.log("[Firebase] Otomatik veri toplama etkinleştirildi");
    } else {
      console.log("[Firebase] Bu kod sunucu tarafında çalışıyor, tarayıcı özellikleri atlanıyor.");
    }
  } catch (error) {
    console.error("[Firebase] ❌❌❌ Firebase dayanıklılık kurulumu hatası:", error);
  }
}

// Firebase başlatma ve database örnekleme
let database: Database | null = null;

try {
  console.log("[Firebase] Firebase uygulaması başlatılıyor...");
  
  // Firebase uygulamasını başlat
  const app = initializeApp(firebaseConfig);
  console.log("[Firebase] Firebase uygulaması başarıyla başlatıldı.");

  // Realtime Database referansını al
  console.log("[Firebase] Realtime Database referansı alınıyor...");
  database = getDatabase(app);
  console.log("[Firebase] Realtime Database referansı başarıyla alındı.");
  
  // Test veritabanı bağlantısı
  const testRef = ref(database, '.info/connected');
  console.log("[Firebase] Test bağlantısı referansı oluşturuldu:", testRef.key);

  // Bağlantı dayanıklılığını kur
  setupFirebaseResilience(database);

  // Eğer lokalde çalışıyorsak ve emülatör kullanmak istiyorsak:
  // if (process.env.NODE_ENV === 'development') {
  //   console.log("[Firebase] Emülatör bağlantısı kuruluyor...");
  //   connectDatabaseEmulator(database, 'localhost', 9000);
  //   console.log("[Firebase] Emülatör bağlantısı kuruldu!");
  // }
} catch (error) {
  console.error("[Firebase] ❌❌❌ Firebase başlatma hatası:", error);
  console.error("[Firebase] Hata detayları:", JSON.stringify(error));
  database = null;
}

// Database'i dışa aktar
export { database }; 