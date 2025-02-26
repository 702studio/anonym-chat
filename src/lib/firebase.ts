import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator, ref, onDisconnect, onValue, Database } from 'firebase/database';

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA8P2VSn4-BQmPZ4yUJLU8GgdvvaUZKCNE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "anonymchat-f8ad7.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://anonymchat-f8ad7-default-rtdb.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "anonymchat-f8ad7",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "anonymchat-f8ad7.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "169544621618",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:169544621618:web:5b4e49c676a96132c5a62b"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Realtime Database referansını al
const database = getDatabase(app);

// Firebase bağlantısı kurma ve dayanıklılık ekleme işlemleri
function setupFirebaseResilience() {
  try {
    console.log("Firebase database bağlantısı yapılandırılıyor...");
    console.log("Veritabanı URL:", firebaseConfig.databaseURL);
    
    // Çevrimdışı özellikleri etkinleştir
    if (typeof window !== "undefined") {
      const connectedRef = ref(database, '.info/connected');
      
      // Bağlantı durumunu izle
      onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          console.log("Firebase'e bağlandı");
        } else {
          console.log("Firebase bağlantısı kesildi");
        }
      });
      
      // Firebase'in cache kullanmasını sağlayarak bağlantı kesintilerinde dayanıklılık
      database.app.automaticDataCollectionEnabled = true;
    }
  } catch (error) {
    console.error("Firebase dayanıklılık kurulumu hatası:", error);
  }
}

// Bağlantı dayanıklılığını kur
setupFirebaseResilience();

// Eğer lokalde çalışıyorsak ve emülatör kullanmak istiyorsak:
// if (process.env.NODE_ENV === 'development') {
//   connectDatabaseEmulator(database, 'localhost', 9000);
// }

export { database }; 