# Anonim Chat Uygulaması

Gerçek zamanlı, minimal bir chat uygulaması. Bu proje kullanıcıların nickname ile oda oluşturabildiği, paylaşabildiği ve gerçek zamanlı mesajlaşabildiği basit bir web uygulamasıdır.

## Özellikler

- Nickname ile oda oluşturma
- Oda bağlantısını kopyalama ve paylaşma
- Gerçek zamanlı mesajlaşma
- Minimalist UI/UX
- IBM Plex Mono font kullanımı

## Teknik Stack

- Next.js (React framework)
- Firebase Realtime Database
- TypeScript
- IBM Carbon Design System komponentleri

## Kurulum ve Çalıştırma

### Gereksinimler

- Node.js (v14+)
- npm veya yarn
- Firebase projesi

### Adımlar

1. Projeyi klonlayın
```
git clone [repo-url]
cd anonym-chat
```

2. Bağımlılıkları yükleyin
```
npm install
```

3. Firebase yapılandırmasını ayarlayın
- `/src/lib/firebase.ts` dosyasındaki `firebaseConfig` değişkenini kendi Firebase projenizin bilgileriyle güncelleyin.

4. Geliştirme sunucusunu başlatın
```
npm run dev
```

5. Tarayıcınızda açın
```
http://localhost:3000
```

## Kullanım

1. Ana sayfada bir nickname girin
2. "Yeni Oda Oluştur" butonuna tıklayın veya mevcut bir oda ID'si ile odaya katılın
3. Oda linkini kopyalayıp arkadaşlarınızla paylaşın
4. Mesajlaşmaya başlayın!

## Deployment

Vercel'e deployment yapmak için aşağıdaki komutları kullanabilirsiniz:

```
npm run build
npm run start
```

Veya doğrudan:

```
vercel
```

## Lisans

MIT 