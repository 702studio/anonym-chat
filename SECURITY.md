# Firebase Güvenliği İçin Adımlar

## API Anahtarı Güvenliği

Firebase API anahtarınız sızdırıldığında yapmanız gerekenler:

1. **API Anahtarını Değiştirin**: Firebase konsolunda eski API anahtarınızı iptal edip yeni bir anahtar oluşturun.
   - Firebase Konsoluna gidin: [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Projenizi seçin
   - "Project Settings" > "General" sekmesine gidin
   - "Web API Key" kısmındaki anahtarı döndürün/yenileyin

2. **Ortam Değişkenlerini Güncelleyin**: Tüm .env.local dosyalarınızı yeni API anahtarıyla güncelleyin.
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=yeni_api_anahtarınız
   ```

3. **Güvenlik Kurallarını Kontrol Edin**: Firebase Realtime Database güvenlik kurallarınızı gözden geçirin ve sadece gerekli işlemlere izin verin.
   - Firebase Konsolunda "Realtime Database" > "Rules" bölümüne gidin
   - Aşağıdaki gibi güvenli kurallar tanımlayın:
   
   ```json
   {
     "rules": {
       "rooms": {
         "$roomId": {
           ".read": true,
           ".write": true,
           "messages": {
             ".read": true,
             ".write": true,
             "$messageId": {
               ".validate": "newData.hasChildren(['sender', 'text', 'timestamp'])"
             }
           }
         }
       }
     }
   }
   ```

4. **API Kısıtlamaları Ekleyin**: Firebase konsolunda API anahtarınıza kısıtlamalar ekleyin:
   - Firebase Konsolunda "Project Settings" > "API restrictions" bölümüne gidin
   - Sadece uygulamanızın ihtiyaç duyduğu API'lere izin verin
   - Referrer kısıtlamaları ekleyin

5. **Kodunuzu Gözden Geçirin**: Gizli anahtarların kodda hardcoded olarak bulunmadığından emin olun:
   - Tüm yapılandırma bilgilerini ortam değişkenlerinden alın
   - .gitignore dosyasında .env.local ve diğer gizli dosyaların listelendiğinden emin olun
   - Gizli bilgileri içeren commitler için git history'i temizleyin

## Genel Firebase Güvenlik Önlemleri

1. **Authentication Yapılandırma**: Kullanıcı doğrulama sistemini etkinleştirin
2. **HTTPS Kullanımı**: Tüm Firebase isteklerinin HTTPS üzerinden yapıldığından emin olun
3. **Firebase Security Rules**: Veritabanı ve depolama kurallarınızı doğru yapılandırın
4. **Düzenli Denetimler**: Güvenlik yapılandırmanızı düzenli olarak denetleyin
5. **Logları İzleme**: Firebase konsolunda anormal aktiviteleri izleyin

## Sızıntı Durumunda

API anahtarınız veya diğer gizli bilgileriniz sızdırıldığında, hemen değiştirin ve yukarıdaki adımları takip edin. Bu durumu bir güvenlik ihlali olarak değerlendirin ve gerekli önlemleri alın.

## Build ve Bağlantı Sorunları

Eğer Firebase entegrasyonu sonrası build veya bağlantı sorunları yaşarsanız, aşağıdaki adımları izleyin:

1. **Önbelleği Temizleyin**: Next.js önbelleğini temizleyin:
   ```
   rm -rf .next
   # veya Windows için:
   Remove-Item -Recurse -Force .next
   ```

2. **NPM Önbelleğini Temizleyin**:
   ```
   npm cache clean --force
   ```

3. **Bağımlılıkları Yeniden Yükleyin**:
   ```
   npm install
   ```

4. **Fallback Mekanizmasını Kontrol Edin**: Firebase yapılandırma dosyasında kritik değerler (apiKey, databaseURL) için fallback değerlerinin olduğundan emin olun.

5. **Ortam Değişkenlerini Doğrulayın**: `.env.local` dosyasında tüm Firebase konfigürasyon değerlerinin doğru şekilde ayarlandığından emin olun.

6. **Yeniden Build Alın**:
   ```
   npm run build
   ```

7. **Yeniden Başlatın**:
   ```
   npm run dev
   ```
