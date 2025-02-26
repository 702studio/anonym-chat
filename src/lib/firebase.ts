import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator, ref, onDisconnect, onValue, Database } from 'firebase/database';

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA8P2VSn4-BQmPZ4yUJLU8GgdvvaUZKCNE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "anonymchat-f8ad7.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://anonymchat-f8ad7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "anonymchat-f8ad7",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "anonymchat-f8ad7.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "169544621618",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:169544621618:web:5b4e49c676a96132c5a62b"
};

console.log("Firebase yapılandırması yükleniyor:", { 
  apiKey: firebaseConfig.apiKey ? "***" : "YOK",
  authDomain: firebaseConfig.authDomain,
  databaseURL: firebaseConfig.databaseURL,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket ? "AYARLI" : "YOK",
  messagingSenderId: firebaseConfig.messagingSenderId ? "AYARLI" : "YOK",
  appId: firebaseConfig.appId ? "AYARLI" : "YOK"
});

// Firebase bağlantısı kurma ve dayanıklılık ekleme işlemleri
function setupFirebaseResilience(database: Database) {
  try {
    console.log("Firebase database bağlantısı yapılandırılıyor...");
    console.log("Veritabanı URL:", firebaseConfig.databaseURL);
    
    // Çevrimdışı özellikleri etkinleştir
    if (typeof window !== "undefined") {
      console.log("Tarayıcı ortamı algılandı, bağlantı izleniyor...");
      const connectedRef = ref(database, '.info/connected');
      
      // Bağlantı durumunu izle
      onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          console.log("✅ Firebase'e bağlandı");
        } else {
          console.log("❌ Firebase bağlantısı kesildi");
        }
      }, (error) => {
        console.error("❌❌ Bağlantı durumu izleme hatası:", error);
      });
      
      // Firebase'in cache kullanmasını sağlayarak bağlantı kesintilerinde dayanıklılık
      database.app.automaticDataCollectionEnabled = true;
      console.log("Otomatik veri toplama etkinleştirildi");
    } else {
      console.log("Bu kod sunucu tarafında çalışıyor, tarayıcı özellikleri atlanıyor.");
    }
  } catch (error) {
    console.error("❌❌❌ Firebase dayanıklılık kurulumu hatası:", error);
  }
}

// Firebase başlatma ve database örnekleme
let database: Database | null = null;

try {
  console.log("Firebase uygulaması başlatılıyor...");
  const app = initializeApp(firebaseConfig);
  console.log("Firebase uygulaması başarıyla başlatıldı.");

  // Realtime Database referansını al
  console.log("Realtime Database referansı alınıyor...");
  database = getDatabase(app);
  console.log("Realtime Database referansı başarıyla alındı.");

  // Bağlantı dayanıklılığını kur
  setupFirebaseResilience(database);

  // Eğer lokalde çalışıyorsak ve emülatör kullanmak istiyorsak:
  // if (process.env.NODE_ENV === 'development') {
  //   connectDatabaseEmulator(database, 'localhost', 9000);
  // }
} catch (error) {
  console.error("❌❌❌ Firebase başlatma hatası:", error);
  database = null;
}

// Database'i dışa aktar
export { database }; 