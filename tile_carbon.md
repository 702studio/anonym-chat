# Chat Uygulamasında IBM Carbon **Tile** Bileşeni Entegrasyonu

IBM Carbon Design System'in **Tile** bileşeni, chat uygulamanızın landing page'inde oda oluşturma ve var olan odaya katılma gibi eylemleri **kart tarzında** sunmak için kullanılabilir. Tile bileşenleri, esnek yapıları sayesinde minimal arayüzünüze modern bir görünüm ve tutarlılık katacaktır. Aşağıda, Tile bileşenini en iyi şekilde entegre etmek için senaryolar, tasarım önerileri, etkileşim detayları, responsive/erişilebilirlik ipuçları ve örnek kod yer almaktadır.

## Tile Bileşeninin Kullanım Senaryoları

- **Yeni Oda Oluşturma**: Tile bileşenini, kullanıcıların yeni bir sohbet odası oluşturmasını sağlayan bir kart olarak kullanabilirsiniz. Örneğin, bir Tile kartının içinde "Yeni Oda Oluştur" başlığı ve ilgili bir ikon (örn. *artı* simgesi) ile kısa bir açıklama yer alır. Kullanıcı bu tile'a tıkladığında yeni bir oda oluşturma akışı başlatılır. Tile bileşenleri; bilgilendirici içerikler, başlangıç adımları veya "sonraki adım" niteliğindeki yönlendirmeler gibi çok çeşitli içerikleri sergileyebilen **son derece esnek** bileşenlerdir.

- **Mevcut Odaya Katılma**: Bir diğer tile bileşenini de mevcut bir sohbete katılım için kullanabilirsiniz. Bu kart içinde "Odaya Katıl" başlığı, uygun bir ikon (örn. *ok*/giriş simgesi) ve alt metin olarak örneğin "Var olan bir sohbet odasına katılmak için oda kodunu girin" gibi bir açıklama bulunur. Bu tile'ın içinde doğrudan bir metin girişi ve katılma butonu sunarak kullanıcıya odanın ID'sini girip katılma imkânı verebilirsiniz.

- **Diğer Senaryolar (Opsiyonel)**: Uygulamanız ileride genişler ve kullanıcıya birden fazla seçenek sunmak isterseniz (örneğin *"oda listesi"*, *"popüler odalar"* veya *"farklı sohbet konuları"*), Tile bileşenlerinden yararlanabilirsiniz. Birden fazla tile'ı bir arada kullanarak, örneğin çeşitli sohbet odalarını veya seçenekleri kartlar halinde listeleyebilirsiniz.

## UI/UX Tasarım Önerileri

Tile bileşenini chat uygulamanızın arayüzüne entegre ederken, **kullanıcı deneyimini iyileştirecek tasarım detaylarına** dikkat edin:

- **Başlık ve Metin Hiyerarşisi**: Her bir Tile içinde, kullanıcının ilk bakışta anlayacağı net bir başlık (**kısa ve eylem odaklı**) ve gerekiyorsa açıklayıcı bir alt metin bulundurun. Örneğin, *"Yeni Oda Oluştur"* başlığı büyük/koyu bir yazı stiliyle, altına daha küçük puntoda *"Yeni bir sohbet odası başlatın ve başkalarını davet edin"* gibi bir açıklama metni koyulabilir.

- **İkon Kullanımı**: Tile içeriğinde ikonlar, kullanıcıya sunulan seçeneğin ne olduğunu görsel olarak destekler. Örneğin, yeni oda oluşturma tile'ında bir **artı (+)** simgesi veya bir *kalem* simgesi (yeni bir şey oluşturmayı temsil eden) kullanılabilirken, odaya katılma tile'ında bir *anahtar* veya *ok* simgesi (içe doğru yönelen) tercih edilebilir.

- **Renk ve Kontrast**: Tile bileşenleri, içinde bulundukları temaya göre arka plan rengine sahiptir. Dark tema kullanıyorsanız, tile'lar muhtemelen genel arka plandan biraz daha açık tonda (örn. gri) görünecektir. Metin rengi olarak Carbon'un `$text-01` token'ını kullanın ki yazılar arka planda okunaklı olsun.

- **Boşluk ve Hizalama**: Tile bileşeninin kenar boşlukları ve iç dolguları Carbon tarafından iyi ayarlanmıştır (varsayılan olarak yaklaşık **16px iç boşluk** bulunur). Bu, içeriklerin sıkışık olmadan, ferah bir şekilde görünmesini sağlar. Yine de, tile içindeki öğeleri düzenlerken Carbon'un **spacing** kurallarını takip edebilirsiniz.

- **Görsel Geri Bildirimler**: Kullanıcı fareyi tile üzerine getirdiğinde veya dokunduğunda bir etkileşim olacağını anlamalıdır. Carbon bu konuda bize hazır stiller sunuyor: Örneğin kullanıcı bir **ClickableTile** üzerine geldiğinde arka plan rengi `$hover-ui` token'ı ile hafifçe vurgulanır, ve tile'a odaklandığında (klavye ile gezinirken) `$focus` token rengiyle belirgin bir odak çerçevesi çizilir.

## Tile Bileşeniyle Etkileşim Tasarımı

Tile bileşeninin nasıl **etkileşeceği**, kullanıcı akışını doğrudan etkileyecektir. Bu nedenle, tile'ların tıklanabilir olup olmayacağını ve içlerinde hangi öğelerin interaktif olacağını dikkatlice planlayın:

- **Tüm Tile'ı Tıklanabilir Yapma**: Eğer tile kartının tamamı tek bir eyleme götürüyorsa (örneğin "Yeni Oda Oluştur" tile'ına tıklayınca hemen oda oluşturulup sohbet ekranına geçilecekse), **Clickable Tile** yaklaşımı uygun olabilir. IBM Carbon'da bunun karşılığı `ClickableTile` bileşenidir.

- **Tile İçinde Buton/Form Kullanma**: Özellikle "Odaya Katıl" senaryosunda olduğu gibi, tile içerisinde bir **form alanı** ve bir **buton** kullanmak gerekebilir. Bu durumda tile'ı bir konteyner (read-only tile) gibi tutup içindeki bileşenleri interaktif yapabilirsiniz.

- **Gezinti Akışı**: Kullanıcı bir tile (veya içindeki butonu) tıkladığında ne olacağı konusunda tutarlı olun. "Yeni Oda Oluştur" eylemi muhtemelen hemen yeni bir oda ID oluşturup chat ekranına geçiş yapacak – bu durumda ya yeni sayfaya yönlendirin ya da tek sayfa uygulamasıysa route değiştirin.

- **Durum ve Hata İletişimi**: Eğer "Odaya Katıl" işleminde yanlış bir oda kodu girilirse veya oda bulunamazsa, Tile içinde bir hata mesajı göstermek gerekebilir. Bu durumda Carbon'un *InlineNotification* bileşenini tile içerisine ekleyebilirsiniz.

## Responsive Tasarım ve Erişilebilirlik Kriterleri

### Responsive Tasarım

Landing page'iniz hem masaüstü hem mobilde iyi görünmeli. **Tile bileşenleri, esnek bir grid düzeni içinde kullanılabilir**. Birden fazla tile'ı yan yana koyarken, büyük ekranlarda yatay dizmek doğal bir akıştır. Örneğin masaüstünde "Yeni Oda Oluştur" ve "Odaya Katıl" tile'larını iki sütunlu (yarı yarıya) bir düzenle yan yana koyabilirsiniz. Küçük ekranlarda (tablet, mobil) ise bu tile'lar üst üste tek sütun halinde akmalıdır ki dar ekranda sıkışmasınlar.

### Erişilebilirlik

IBM Carbon Design System, erişilebilirlik standartlarına uyum konusunda titiz davranır. **Tile** bileşeni de WCAG 2.1 AA kriterlerine göre test edilmiştir ve erişilebilir bir yapı sunar. Yine de, bizim uygulama özelinde dikkat edilmesi gereken noktalar vardır:

- **Metin Alternatifleri ve Etiketler**: Tile içerisindeki tüm metinler ve etkileşimli öğeler için anlamlı etiketler kullanın. Örneğin, ikon kullandıysanız salt dekoratif değilse (bilgi iletiyorsa) ona uygun bir `aria-label` verin.

- **Odak (Focus) ve Klavye Navigasyonu**: Tüm işlevler klavye ile de kullanılabilmelidir. Carbon tile bileşeni, eğer ClickableTile ise bir link gibi `tabindex` alarak odaklanabilir durumdadır.

- **Birden Fazla Etkileşim ve Eylem Geri Bildirimi**: Tıklanabilir bir tile içinde ikinci bir etkileşimli öge koymamaya özen gösterin – bu ekran okuyucu kullanıcıları için de kafa karıştırıcı olabilir.

- **Erişilebilir Bileşen Kullanımı**: Tile içerisinde kullandığımız her şeyi Carbon'un kendi bileşen ailesinden seçmek, çoğu erişilebilirlik ayrıntısını bizim yerimize halleder.

- **Kontrast ve Renk Körlüğü**: Dark temada bile olsanız, metinlerin arkaplan ile kontrastı WCAG'nin önerdiği oranda olmalıdır (en az 4.5:1). Carbon'un `$text-01` ve `$ui-01` kombinasyonu bu kontrastı sağlar.

## Tile Bileşeninin React ile Entegrasyonu (Kod Örnekleri)

IBM Carbon Design System'in React kütüphanesini kullanarak Tile bileşenlerini projenize eklemek oldukça kolaydır. Aşağıda, **landing page** için iki tile içeren basit bir React bileşeni örneği verilmiştir:

1. **Gerekli Carbon Bileşenlerini İçe Aktarın**:
   ```js
   import { Tile, ClickableTile, TextInput, Button } from '@carbon/react';
   import '@carbon/styles/css/styles.css'; // Carbon global stiller
   ```

2. **Tile Bileşenlerini Kullanarak Arayüzü Oluşturun**:
   
```jsx
// Carbon Grid yapısını kullanarak iki kolonlu düzen (opsiyonel)
<Grid>
  {/* 1. Tile: Yeni Oda Oluştur (ClickableTile olarak) */}
  <Column sm={4} md={4} lg={8}>  {/* Küçük ekranda 4 birim (tam genişlik), büyükte 8 birim (yarı) */}
    <ClickableTile onClick={handleCreateRoom} className="create-room-tile">
      {/* Icon + Başlık */}
      <Add16 aria-label="Yeni oda ikonu" style={{ marginRight: '0.5rem' }} />
      <h3 className="tile-title">Yeni Oda Oluştur</h3>
      <p className="tile-desc">Kendi sohbet odanızı başlatın</p>
      {/* ClickableTile içinde ayrı bir buton/link KULLANILMIYOR, tüm tile tıklanabilir */}
    </ClickableTile>
  </Column>

  {/* 2. Tile: Odaya Katıl (içinde TextInput ve Button ile) */}
  <Column sm={4} md={4} lg={8}>
    <Tile className="join-room-tile">
      <h3 className="tile-title">Odaya Katıl</h3>
      <p className="tile-desc">Mevcut bir odaya dahil olun</p>
      <TextInput
        id="room-id"
        labelText="Oda Kodu"
        placeholder="Oda kodunu girin"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <Button kind="secondary" onClick={() => handleJoinRoom(roomCode)} style={{ marginTop: '1rem' }}>
        Odaya Katıl
      </Button>
    </Tile>
  </Column>
</Grid>
```

Yukarıdaki kodda: 
- İlk tile için `ClickableTile` kullandık ve `onClick` prop'u ile tıklandığında `handleCreateRoom` fonksiyonunu çağırıyoruz.
- İkinci tile için normal `Tile` bileşeni kullandık (bu tile komple link değil, içindeki buton ile aksiyon alacak).

3. **Stil ve Sınıflar**: Carbon bileşenleri kendi varsayılan stilini getirse de, gerektiğinde özelleştirmek için className atayabilirsiniz. Örneğin iki tile'ın yan yana boşluk bırakması için dış kapsayıcıda Carbon `Grid` ve her birinde `Column` kullandık.

4. **Erişilebilirlik için İnce Ayarlar**: Kod içinde de görüldüğü gibi, `TextInput` bileşeni bir `labelText` alıyor. Bu, HTML çıktısında bir `<label>` oluşturup input ile ilişkilendirir. Butonun metni de zaten anlamlı.

Yukarıdaki örnek, Carbon'un Tile bileşenini chat uygulamanızın giriş sayfasına entegre etmenin temel yolunu gösteriyor. Bu yapıyı ihtiyaçlarınıza göre genişletebilir veya özelleştirebilirsiniz. Önemli olan, **kullanıcı deneyimi** (kolay anlaşılır kartlar, tutarlı tasarım), **etkileşim mantığı** (basit ve tekil aksiyon alanları) ve **erişilebilirlik** kriterlerinin (etiketler, odak, kontrast) gözetilmesidir. 