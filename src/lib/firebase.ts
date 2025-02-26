import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator, ref, onDisconnect, onValue, Database } from 'firebase/database';

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyA8P2VSn4-BQmPZ4yUJLU8GgdvvaUZKCNE",
  authDomain: "anonymchat-f8ad7.firebaseapp.com",
  databaseURL: "https://anonymchat-f8ad7-default-rtdb.firebasedatabase.app",
  projectId: "anonymchat-f8ad7",
  storageBucket: "anonymchat-f8ad7.appspot.com",
  messagingSenderId: "169544621618",
  appId: "1:169544621618:web:5b4e49c676a96132c5a62b"
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