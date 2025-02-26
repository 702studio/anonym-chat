Tamam, IBM Carbon Design System'i eksiksiz bir şekilde mevcut anonim chat uygulamanıza entegre etmek için araştırma yapıyorum. Bu araştırma, Carbon'un tüm temel bileşenlerini (tipografi, butonlar, giriş alanları, bildirimler, renk şeması, grid sistemi vb.) eksiksiz uygulamanıza dahil etmeyi içerecek. 

Entegrasyon sürecini tam anlamıyla anlamak için, Carbon Design’ın React kütüphanesini nasıl kullanacağınızı, uygulamanızın mevcut yapısına nasıl dahil edileceğini ve en iyi uygulama yöntemlerini ele alacağım. Sonuçları en kısa sürede sizinle paylaşacağım.

# Tipografi (Typography)  
IBM Carbon Design System, IBM Plex yazı tipini temel alır; bu ailenin bir parçası olan **IBM Plex Mono**’yu projeye dahil etmek doğru bir başlangıç olacaktır. Carbon’un tipografi sistemi “**type token**” adı verilen hazır stil tanımları kullanır ve IBM Plex ile uyumlu olacak şekilde kalibre edilmiştir ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=Carbon%20uses%20type%20tokens%20to,source%20IBM%20Plex%20typeface)). Öncelikle IBM Plex Mono font dosyalarını projeye ekleyin veya bir CDN üzerinden yükleyin (ör. Google Fonts üzerinden doğrudan kullanmak mümkün ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=IBM%20Plex%20is%20also%20available,for%20use%20through%20Google%20fonts))). Ardından uygulamanın global stilinde varsayılan fontu IBM Plex Mono olarak ayarlayın (örneğin, `body { font-family: 'IBM Plex Mono', monospace; }`). 

Carbon tipografi ölçeklendirmesi, farklı başlık ve metin boyutlarını tutarlı şekilde tanımlayan **productive** ve **expressive** adlı iki set içerir ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=Carbon%20defines%20typographies%20for%20two,will%20use%20Productive%20design%20typography)). Bir chat uygulaması gibi ürün odaklı arayüzlerde *productive* tipografi seti kullanılır. Bu set, belirlenmiş başlık boyutları (`heading-01` en küçük başlık, `heading-07` en büyük gibi) ve metin stilleri (`body-long-01`, `body-short-01` gibi) tanımlar. Carbon’un varsayılan CSS’ini projeye dahil ettiğinizde, birçok HTML etiketine (ör. `h1, h2, p` vb.) bu ölçeklendirmeye uygun varsayılan stil uygulanır ([carbon/docs/guides/sass.md at main · carbon-design-system/carbon · GitHub](https://github.com/carbon-design-system/carbon/blob/main/docs/guides/sass.md#:~:text=Global%20flag%20Description%20Default%20value,swap)). Örneğin, Carbon’da **Body long 01** metin stili 14px boyutunda IBM Plex yazı tipini, 20px satır yüksekliğini ve 0.16px harf aralığını tanımlar ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=.body,spacing%3A%200.16px%3B)). Başlıklar için benzer şekilde **Heading** stil sınıfları/kullanımları vardır (örn. *productive-heading-03* stilini bir başlığa uygulayarak 1.25rem (~20px) boyut ve uygun satır yüksekliği elde edilebilir ([JSDoc: Source: audits/carbon-design-system/text-usage-audit.js](https://ibm.github.io/beacon-for-ibm-dotcom/audits_carbon-design-system_text-usage-audit.js.html#:~:text=audit.js%20ibm.github.io%20%20%27,height%27%3A%20%5B%271.4%27%5D%2C))).  

Uygulamada Carbon tipografisini eksiksiz kullanmak için:  
- **IBM Plex Mono entegrasyonu:** Fontu yükledikten sonra Carbon’un CSS reset ve font-face tanımlarının etkin olduğundan emin olun. Carbon’un Sass ayarlarında `$css--font-face: true` varsayılan değerdir, bu da IBM Plex fontlarını @font-face ile dahil etmeye çalışır ([carbon/docs/guides/sass.md at main · carbon-design-system/carbon · GitHub](https://github.com/carbon-design-system/carbon/blob/main/docs/guides/sass.md#:~:text=Global%20flag%20Description%20Default%20value,swap)). Fontları kendiniz barındırıyorsanız `$font-path` değişkenini güncelleyebilirsiniz. Aksi halde en pratik yöntem, HTML `<head>` bölümüne IBM Plex Mono için `<link>` etiketi eklemektir.  
- **Başlık ve metin boyutları:** Carbon’un tanımlı tipografi ölçeğini kullanın. Örneğin, ana başlık için Carbon’un önerdiği bir heading stilini uygulayın. Bunu yapmanın bir yolu, Carbon’un Sass yardımcılarını kullanmak (`@include carbon--type-style('productive-heading-03')` gibi) veya Carbon’un sağladığı hazır CSS değişkenlerinden faydalanmaktır. Carbon v11 ile birçok tipografi özelliği CSS değişkenleri olarak sunuluyor (örn. `--cds-productive-heading-03-font-size` gibi değişkenler mevcuttur ([JSDoc: Source: audits/carbon-design-system/text-usage-audit.js](https://ibm.github.io/beacon-for-ibm-dotcom/audits_carbon-design-system_text-usage-audit.js.html#:~:text=audit.js%20ibm.github.io%20%20%27,height%27%3A%20%5B%271.4%27%5D%2C))). Bu sayede kendi CSS’inizde bir başlık sınıfı tanımlayıp bu değişkenleri kullanarak Carbon ölçeğine sadık kalabilirsiniz.  
- **Tutarlılık:** Tüm metin öğelerinde (mesaj içerikleri, kullanıcı adları vb.) IBM Plex Mono kullanılacaksa, Carbon’un genel tasarım diliyle uyumlu olması için metin boyutlarını ve ağırlıklarını Carbon’un *token* değerlerine göre ayarlayın. Örneğin mesaj metinleri için 14px (Body style) yeterliyken, oda başlığı veya uygulama adı gibi ögeler için 20px’lik bir heading stili kullanılabilir. Böylece uygulamanın tipografisi Carbon prensipleriyle tutarlı olacaktır ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=Carbon%20uses%20type%20tokens%20to,source%20IBM%20Plex%20typeface)).

# Bileşenler (Components)  
Carbon Design System, arayüz geliştirmede kullanabileceğiniz zengin bir bileşen kütüphanesi sunar. Toplamda 30’dan fazla **React bileşeni**, çeşitli arayüz ihtiyaçlarına yönelik olarak hazır gelir ve hepsi birbiriyle tutarlı çalışacak şekilde tasarlanmıştır ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=application%20of%20these%20principles,dialogs%2C%20notifications%2C%20filtering%2C%20and%20search)). Anonim chat uygulamasına Carbon bileşenlerini entegre etmek için öncelikle Carbon’un React paketini projeye ekleyin:  

```bash
npm install @carbon/react @carbon/styles
``` 

Yukarıdaki komut Carbon’un React bileşenlerini (`@carbon/react`) ve stillerini (`@carbon/styles`) yükleyecektir. Ardından uygulamanızın giriş noktasında Carbon stillerini içe aktarın:  

```js
// Tüm Carbon CSS stillerini global olarak projenize dahil edin
import '@carbon/styles/css/styles.css';
``` 

Bu, Carbon’un varsayılan stillerini (tipografi ayarları, tema renkleri, vb.) uygulamaya yükleyecektir. Artık Carbon React bileşenlerini kullanmaya başlayabilirsiniz. Örneğin:  

```jsx
import React from 'react';
import { Button, TextInput, InlineNotification, Modal } from '@carbon/react';

function ChatUI() {
  return (
    <>
      {/* Carbon Button kullanımı */}
      <Button onClick={sendMessage}>Gönder</Button>

      {/* Carbon TextInput kullanımı */}
      <TextInput id="message-input" placeholder="Mesajınızı yazın..." />

      {/* Hata durumunda Carbon InlineNotification kullanımı */}
      {error && (
        <InlineNotification
          kind="error"
          title="Hata"
          subtitle="Mesaj gönderilemedi"
          onClose={() => setError(false)}
        />
      )}

      {/* Örneğin, bir modal kullanımı */}
      <Modal open={isModalOpen} modalHeading="Bilgi" passiveModal>
        <p>Modal içeriği buraya gelebilir.</p>
      </Modal>
    </>
  );
}
``` 

Yukarıdaki örnek, Carbon’un buton, metin girişi, bildirim ve modal bileşenlerinin temel kullanımını göstermektedir. Carbon bileşenlerini kullanırken dikkat edilmesi gereken noktalar:  

- **Prop ve özellikler:** Carbon bileşenleri, IBM’in tasarım kurallarına uygun çeşitli prop’lar sunar. Örneğin `<Button>` bileşeni için `kind` prop’u ile **primary**, **secondary**, **tertiary** gibi stil varyasyonları seçilebilir. Chat uygulamasında “Mesaj Gönder” butonu önemli bir eylem olduğundan **primary** (varsayılan) stil uygun olacaktır, “Odaya Katıl” gibi ikincil aksiyonlar için secondary kullanılabilir. Benzer şekilde `<TextInput>` bileşeninde `labelText` ile etiket eklenebilir veya `placeholder` ile ipucu metni verilebilir.  
- **Carbon bileşenlerini import etme:** İhtiyaç duyduğunuz bileşenleri tek tek import etmeye özen gösterin. Örneğin sadece Button ve TextInput kullanıyorsanız, `@carbon/react`’ten yalnızca bunları çekin. `import { Button, TextInput } from '@carbon/react';` şeklinde çoklu import yapabilirsiniz ([carbon/packages/react/src/components/Grid/Grid.mdx at main · carbon-design-system/carbon · GitHub](https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/Grid/Grid.mdx#:~:text=Carbon%27s%20grid%20components%20help%20developers,carbon%2Freact)). Bu sayede sadece kullandığınız bileşenler projeye dahil olur (ağaç sarsma - tree shaking ile kullanılmayanlar dışarıda kalır).  
- **Tüm temel UI parçaları:** Carbon’un bileşen seti buton ve input ile sınırlı değildir. Bildirimler (InlineNotification, ToastNotification), açılır pencereler (Modal), onay kutuları, radyo düğmeleri, açılır menüler, yükleme spinnerları gibi pek çok öğeyi içerir ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=application%20of%20these%20principles,dialogs%2C%20notifications%2C%20filtering%2C%20and%20search)). MVP chat uygulamanızda gerekli olabilecek diğer bileşenleri de (örneğin kullanıcı listelemesi için **Avatar** benzeri bir bileşen Carbon’da yoktur ancak belki **Tag** veya **Tooltip** gibi bileşenler kullanılabilir) Carbon kütüphanesinden seçebilirsiniz. Özetle, mevcut her UI unsurunu Carbon bileşenleriyle değiştirmeyi hedefleyin ki arayüz tutarlı olsun.

# Grid Sistemi  
Carbon’un **2x Grid** sistemi, uygulamanıza duyarlı (responsive) ve düzenli bir yerleşim kazandırmak için kullanılabilir. Carbon grid, 16 kolonlu bir düzene dayanır ve çeşitli ekran boyutları için ön tanımlı aralıklar içerir. React ortamında Carbon’un grid’ini kullanmak için `Grid` ve `Column` bileşenlerini kütüphaneden alabilirsiniz ([carbon/packages/react/src/components/Grid/Grid.mdx at main · carbon-design-system/carbon · GitHub](https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/Grid/Grid.mdx#:~:text=Carbon%27s%20grid%20components%20help%20developers,carbon%2Freact)). Örneğin:  

```jsx
import { Grid, Column } from '@carbon/react';

function ChatLayout() {
  return (
    <Grid fullWidth>
      {/* Sol kolon: mesajlar listesi */}
      <Column lg={13} md={8} sm={4}>
        ...mesajlar...
      </Column>

      {/* Sağ kolon: kullanıcı listesi veya boşluk (örnek olarak 3 kolonu boş bırakıyoruz) */}
      <Column lg={3} md={0} sm={0}>
        ...yan panel...
      </Column>
    </Grid>
  );
}
``` 

Yukarıdaki örnekte `Grid fullWidth` ile tam genişlikte bir grid başlatılıyor ve iki adet `Column` kullanılıyor. `Column` bileşenine verilen **sm, md, lg** prop’ları, farklı kırılma noktalarında (small, medium, large ekran) kolonun kaç birim yer kaplayacağını belirtir ([carbon/packages/react/src/components/Grid/Grid.mdx at main · carbon-design-system/carbon · GitHub](https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/Grid/Grid.mdx#:~:text=To%20specify%20how%20many%20columns,4%20columns%20at%20that%20breakpoint)). Carbon’un öntanımlı kırılma noktaları mobil için 4 kolon, orta boyutlu ekran için 8 kolon, geniş ekran için 16 kolon olacak şekilde ayarlanmıştır. Örnekte: birinci kolon geniş ekranda 13/16, orta ekranda 8/16, küçük ekranda 4/4 (tam genişlik) alacak şekilde; ikinci kolon ise geniş ekranda 3/16 yer kaplarken daha küçük ekranlarda gizlenmektedir.  

Mevcut chat uygulaması muhtemelen çok karmaşık bir düzene sahip olmayacaktır (mesajlar alanı + yan panel veya sadece tek bir sohbet alanı). Yine de Carbon grid kullanımı ile şu avantajları elde edersiniz: 

- **Duyarlı tasarım:** Grid sistemi, farklı ekran boyutlarında düzenin otomatik uyum sağlamasını kolaylaştırır. Örneğin sohbet uygulaması mobilde tam ekran bir mesajlaşma alanı gösterirken, masaüstünde yanına bir katılımcı listesi paneli eklemek grid ile zahmetsizdir.  
- **Boşluk ve hiza:** Carbon grid, sütunlar arası boşlukları (gutter) ve sayfa marjinlerini tasarım diline uygun şekilde ayarlar. Böylece elle CSS yazmadan, Carbon’un standart boşluk ölçüleriyle uyumlu bir yerleşim elde edilir.  
- **Uygulama mevcut layout adaptasyonu:** Mevcut uygulamanızda HTML yapısını Carbon grid ile değiştirebilirsiniz. Örneğin üstte bir başlık veya oda bilgisi barı varsa, bunu ayrı bir satır (`Grid`) içine alıp altına ikinci bir `Grid` ile asıl chat ve yan panel satırını koyabilirsiniz. Grid bileşenleri birbirine iç içe de girebilir; her `Grid` tam genişlikli konteyner görevi görür ve içinde `Column` bileşenleri bulunur ([carbon/packages/react/src/components/Grid/Grid.mdx at main · carbon-design-system/carbon · GitHub](https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/Grid/Grid.mdx#:~:text=Every%20layout%20starts%20with%20the,width%20of%20its%20container)) ([carbon/packages/react/src/components/Grid/Grid.mdx at main · carbon-design-system/carbon · GitHub](https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/Grid/Grid.mdx#:~:text=Next%2C%20you%20will%20use%20a,of%20columns%20in%20the%20grid)). Bu esneklik, ihtiyaç halinde iç içe düzenleri (örn. mesaj listesinde zaman damgalarını ayrı sütunda tutmak gibi) uygulamanıza olanak tanır.

# Renk Şeması ve Temalar (Color Scheme & Themes)  
Carbon Design System, tutarlı renk uygulaması için **tema** ve **renk token** kavramlarını kullanır. Carbon’da iki adet açık (White ve Gray 10) ve iki adet koyu (Gray 90 ve Gray 100) tema bulunmaktadır ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=Carbon%20uses%20tokens%20and%20themes,is%20using%20the%20White%20theme)). Tamamen koyu bir arayüz elde etmek için **Gray 100** temasını uygulamanız gerekir, ki bu tema neredeyse siyah bir zemin ve yüksek kontrastlı açık metin renkleri içerir (örneğin arka plan için #171717 değeri, metin için beyaz tonu kullanılır ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=To%20achieve%20a%20consistent%20experience%2C,it%20would%20take%20the%20value))).  

Her tema, bileşen ve arayüz öğeleri için tanımlanmış ~50 kadar renk değişkenine (token) sahiptir ([Themes - Carbon Design System](https://v10.carbondesignsystem.com/guidelines/themes/overview/#:~:text=Each%20theme%20is%20assigned%2052,color%20application%20across%20themes)). Bu token’lar **rol bazlı** tanımlanır; yani “primary button rengi”, “arka plan rengi”, “birincil metin rengi” gibi tanımlamalara sahiptir. Temayı değiştirdiğinizde bu token’ların değeri yeni temaya uygun olacak şekilde otomatik değişir ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=To%20achieve%20a%20consistent%20experience%2C,171717)). Örneğin Carbon’da sayfa arka planı için `$ui-background` token’ı kullanılır – White temada `#ffffff` iken Gray 100 temada `#171717` değerini alır ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=To%20achieve%20a%20consistent%20experience%2C,it%20would%20take%20the%20value)). Benzer şekilde birincil metin rengi `$text-01`, açık temada koyu gri iken koyu temada beyaz olarak tanımlıdır. Carbon sayesinde aynı token isimlerini kullanarak açık/koyu mod arasında geçiş yapabilirsiniz ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=There%20are%20multiple%20other%20roles,com%2Fguidelines%2Fcolor%2Fusage)).

**Koyu temanın entegrasyonu:** Uygulamayı Gray 100 temasıyla çalıştırmak için birkaç yaklaşım vardır: 

- *En kolay yöntem*, Carbon’un önderlenmiş CSS’ini kullanırken HTML’de temaya özel bir sınıf uygulamaktır. Carbon v10’da body etiketine `bx--g100` gibi bir sınıf eklemek koyu temayı aktif hale getiriyordu; Carbon v11’de ise CSS Custom Property’ler kullanıldığı için benzer şekilde tüm uygulamayı saran bir sınıfa CSS değişken atamaları yapılabilir. Örneğin kendi CSS’inizde `.app--dark-theme { --cds-background: #161616; --cds-text-01: #ffffff; ... }` gibi Carbon’un Gray100 değişken değerlerini tanımlayabilirsiniz. Ancak bunu elle yapmak yerine Carbon’un Sass API’ını kullanmak daha güvenlidir.  
- *Sass ile tema ayarı:* Eğer projede Sass derleyebiliyorsanız, Carbon’un tema paketini kullanarak doğrudan koyu tema ile derleme yapabilirsiniz. `@carbon/styles` içinde gelen default theme White’tır. Bunu değiştirmek için Carbon Sass’ini import etmeden önce `$carbon--theme` veya yeni v11 modüler yapısında `$theme` değişkenini ayarlayabilirsiniz. Örneğin:  
  ```scss
  @use '@carbon/themes/scss/themes' as *;
  @use '@carbon/styles' with (
    $theme: $g100
  );
  ```  
  Bu kod, Carbon stillerini Gray 100 temasıyla derleyecektir ([carbon/packages/themes/README.md at main · carbon-design-system/carbon · GitHub](https://github.com/carbon-design-system/carbon/blob/main/packages/themes/README.md#:~:text=By%20default%2C%20the%20white%20theme,For%20example)). Sonuç olarak üretilen CSS dosyasında tüm ilgili token’lar (arka plan, metin, buton vs.) koyu tema renklerinde olacaktır.  
- *Inline tema değiştirme:* Carbon Themes paketi, belirli bir kapsama (scope) sınıfına tema uygulamak için Sass mixin’leri de sağlar. Örneğin yalnızca belirli bir div içinde koyu tema kullanmak isterseniz:  
  ```scss
  @use '@carbon/themes/scss/theme';
  @use '@carbon/themes/scss/themes';
  
  .dark-container {
    @include theme.theme(themes.$g100);
  }
  ```  
  Bu sayede `.dark-container` sınıfı uygulanan bir kapsayıcı içinde Carbon bileşenleri koyu tema ile görünecektir ([carbon/packages/themes/README.md at main · carbon-design-system/carbon · GitHub](https://github.com/carbon-design-system/carbon/blob/main/packages/themes/README.md#:~:text=%2F%2F%20Uses%20the%20default%20white,theme%20here)). Tüm uygulama için body’e bu sınıfı vermek benzer etkiyi yaratır.

Chat uygulamanızda büyük ihtimalle tüm arayüz koyu tonda olacağından, en pratik yol global olarak Gray100 temasını aktifleştirmektir. Bileşenlerin kendi stilinde ek bir işlem yapmanıza gerek kalmaz; örneğin Carbon `<Button>` bileşeni otomatik olarak koyu arka planda uygun mavi tonunda görünecek (Primary button için `$interactive-01` koyu temada Blue-60 #0f62fe’dir ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=To%20achieve%20a%20consistent%20experience%2C,171717))), metinler `$text-01` token’ı sayesinde otomatik açık renkte olacaktır. Kendi oluşturduğunuz özel öğelerde (mesaj balonları gibi), Carbon renk token’larını kullanarak stil vermelisiniz. Örneğin:  

```css
.my-message {
  background-color: var(--cds-layer-01); /* Koyu temada katman rengi (tipik kart/mesaj zemini) */
  color: var(--cds-text-01);            /* Birincil metin rengi */
  padding: var(--cds-spacing-03);       /* Carbon spacing kullanımı, örneğin 8px iç boşluk */
}
.partner-message {
  background-color: var(--cds-interactive-01); /* Örneğin diğer kullanıcının mesajı için vurgulu renk (mavi ton) */
  color: var(--cds-text-04); /* Kontrast için uygun metin rengi (interactive arka planda kullanılan metin rengi token’ı) */
  padding: var(--cds-spacing-03);
}
``` 

Yukarıdaki örnekte, Carbon’un CSS Custom Property’lerini (değişkenlerini) kullanarak mesaj balonları stillendirildi. `--cds-layer-01` token’ı, temaya göre uygun arka plan katman rengini temsil eder (koyu temada koyu gri, açık temada beyaz ton). Benzer şekilde `--cds-interactive-01` ana etkileşim rengi (buton ve vurgular için, IBM mavi tonu) temelden alınmıştır. Bu token’ları kullanmak, uygulamanın ileride tema değiştirme veya Carbon güncellemelerine karşı uyumlu olmasını sağlar ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=for%20a%20unique%20role%20or,171717)).

Özetle, Carbon’un koyu teması entegre edildiğinde arka plan, metin ve bileşen renkleri tasarım sistemine uygun şekilde ayarlanacak; ek olarak tutarlılık için kendi UI öğelerinizi de aynı token’larla stilize etmeye özen göstermelisiniz. 

> **Not:** Carbon’un renk sistemi ve temaları hakkında daha detaylı bilgi için Carbon dokümantasyonundaki **Color** ve **Themes** kılavuzlarına başvurabilirsiniz. Temel prensip, ürününüz için bir açık bir de koyu tema seçerek tüm renkleri tokenlar üzerinden uygulamaktır ([color token - Carbon Design System](https://carbondesignsystem.com/elements/color/usage/#:~:text=color%20token%20,and%20a)) – bu sayede gerektiğinde tek merkezden tema geçişi mümkün olur.

# Stil ve Boşluklar (Style and Spacing)  
Carbon Design System, arayüzde tutarlı boşluk kullanımı için bir **spacing scale** (boşluk ölçeği) tanımlar. Bu ölçek, çok küçükten oldukça genişe kadar uzanan ve 8px temel gridine oturan artışlar içerir ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=Carbon%20defines%20a%20spacing%20scale,level%20layout%20designs)). Spacing token’ları `$spacing-01`den `$spacing-13`’e kadar isimlendirilmiştir ve değerleri şu şekildedir: 2px, 4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px … (devam eder) ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=%40spacing,09%3A%2048px)). Görüldüğü gibi Carbon’da çoğu boşluk 8’in katları olacak şekilde (arada 12px gibi ara değerler de var) tanımlanmıştır. 

Uygulamada margin/padding gibi boşluk ayarlarını bu token’ları kullanarak yapmak, tasarım bütünlüğünü sağlar. Örneğin, Carbon’un 16px boşluk değeri `$spacing-05` ile ifade edilir; 8px ise `$spacing-03`’tür. React komponentleriniz içinde stil verirken: 

- **CSS ile:** Carbon v11, spacing token’larını da CSS custom property olarak sunuyor olabilir (tipografi ve renklerde olduğu gibi). Nitekim örnekte kullandığımız `--cds-spacing-03` değeri, Carbon’un 8px’ine karşılık geliyor. Bu değişkenleri doğrudan CSS’inizde kullanabilirsiniz. Eğer bu değişkenler yüklü gelmiyorsa, o durumda sabit px yerine Sass token’larını tercih etmek gerekir.  
- **Sass ile:** `@carbon/layout` paketini kullanarak ya da Carbon’un genel Sass’ini kullanarak `$spacing-03` gibi değişkenlere erişebilirsiniz ([carbon/packages/layout/docs/sass.md at main · carbon-design-system/carbon · GitHub](https://github.com/carbon-design-system/carbon/blob/main/packages/layout/docs/sass.md#:~:text=Export%20Description%20%21default%20%60%24spacing,09%60%20%E2%9C%85)). Örneğin, bir kart bileşenine alt boşluk vermek için `margin-bottom: $spacing-05;` yazdığınızda bu derlenmiş CSS’te `margin-bottom: 16px;` olacaktır. Carbon dokümantasyonu, spacing token’larının margin/padding tanımlarında nasıl kullanılacağına dair örnekler sunar: 
  ```scss
  .some-class {
    margin: $spacing-03 $spacing-05;  // dikeyde 8px, yatayda 16px boşluk
  }
  ``` 
   ([Spacing - Carbon Design System](https://v10.carbondesignsystem.com/guidelines/spacing/overview/#:~:text=The%20following%20are%20all%20approved,07)).

**Mevcut chat uygulamasında spacing uygulama örnekleri:** Mesaj balonlarının etrafında yeterli boşluk bırakmak kullanıcı deneyimi için önemlidir. Her mesajın kendi etrafına Carbon ölçeğinden uygun padding koyabilirsiniz (örn. tüm kenarlara `$spacing-03` = 8px). Mesajlar arası dikey boşluk için parent konteyner içerisindeki her mesaj bileşenine alt marjin verilebilir (örn. `.message + .message { margin-top: var(--cds-spacing-04) }` ile her mesaj arasında 12px boşluk ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=%40spacing,09%3A%2048px))). Butonlar ve giriş alanları gibi form bileşenlerini dikeyde ayırmak için yine token kullanımı (örn. butonların üstüne `$spacing-05` = 16px marjin) arayüzün ferah ve dengeli görünmesini sağlar. 

Aynı şekilde Carbon, komponent içi boşluklar konusunda da tutarlılık sunar. Örneğin Carbon buton bileşeni, kendi içinde tasarım sistemine göre padding alır; ekstra bir şey yapmanıza gerek yok. Ancak sizin yerleştirdiğiniz custom bir `<div>` veya container varsa, onun iç boşluklarını Carbon değerlerinden seçmeye dikkat edin. Bu yaklaşımla “göz kararı” yerleştirme yapmadan, tasarım sisteminin önerdiği ölçülerle çalışırsınız ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=Carbon%20defines%20a%20spacing%20scale,level%20layout%20designs)).

Özetle, Carbon’un spacing sistemini entegre etmek için tüm manuel boşluk tanımlarınızı gözden geçirin ve mümkün olan her yerde Carbon’un `$spacing-*` tokenlarını (ya da karşılık gelen CSS değişkenlerini) kullanın. Bu, arayüz genelinde tutarlı bir ritim ve hiyerarşi oluşturacak, ayrıca ileride yapılacak tasarım değişikliklerinde (örneğin genel boşluk yoğunluğunu artırmak gibi) tek noktadan ayar yapmanıza imkân tanıyacaktır.

# Performans ve Optimizasyon  
Carbon Design System’i uygulamaya eklerken performansı korumak önemlidir. Tasarım sistemleri kapsamlı olduğu için, dikkat edilmezse gereksiz kod ve stil yükü getirebilir. IBM Carbon ekibi, performansı iyileştirmek adına paketlerini olabildiğince modüler ve ağaç sarsmaya (tree-shaking) uygun hale getirmiştir. Bunu en iyi şekilde kullanmak için aşağıdaki en iyi uygulamaları takip edin:

- **Gereksiz CSS yüklemeyin:** `@carbon/styles/css/styles.css` dosyası tüm Carbon bileşenlerinin stillerini içerir ve ~500KB civarı (tema ve tüm bileşenler dahil) ham CSS olabilir. Uygulamanızda tüm bileşenleri kullanmıyorsanız, bu dosyanın tamamını yüklemek gereksiz stil taşıyabilir. İki yaklaşım mümkün:  
  1. **Sass ile seçmeli import:** Carbon’un SCSS yapısını kullanarak, sadece ihtiyacınız olan bileşenlerin stilini dahil edebilirsiniz. Örneğin sadece Button ve Form elemanlarını kullanıyorsanız, Carbon’un Sass dosyalarında ilgili parçalara import yapıp geri kalanını dışarıda bırakabilirsiniz. Carbon’un resmi rehberi, Sass derlemelerinizi optimize etmek için her modülün tekil import edilebildiğini belirtir ([carbon/docs/guides/sass.md at main · carbon-design-system/carbon · GitHub](https://github.com/carbon-design-system/carbon/blob/main/docs/guides/sass.md#:~:text=If%20you%20are%20looking%20to,will%20be%20included%20as%20well)) ([carbon/docs/guides/sass.md at main · carbon-design-system/carbon · GitHub](https://github.com/carbon-design-system/carbon/blob/main/docs/guides/sass.md#:~:text=As%20such%2C%20when%20configuring%20or,order)). Yani, `@use '@carbon/styles/scss/components/button';` gibi doğrudan bileşen SCSS dosyasını kullanabilirsiniz (bağımlı olduğu diğer parça ve değişkenler otomatik çekilecektir). Bu yöntemle üretilecek CSS boyutu ciddi oranda azalır. Hatta Carbon ekibinin bir örneğinde, sadece Button bileşeni için CSS alındığında çıktı boyutunun 26KB gzip’ten 2.4KB’a düştüğü rapor edilmiştir ([Minimal CSS with Carbon - Medium](https://medium.com/carbondesign/minimal-css-with-carbon-b0c089ccfa71#:~:text=If%20we%20compare%20this%20one,4kB)). Bu, ne kadar kazanç elde edebileceğinizi göstermesi açısından önemlidir.  
  2. **PostCSS/Unused CSS eleme:** Eğer Sass ile uğraşmak istemiyorsanız ve uygulamanız küçükse, geçici olarak tüm Carbon CSS’ini yükleyip sonra kullanılmayan CSS’i ortadan kaldıran bir araç (PurgeCSS gibi) kullanmayı düşünebilirsiniz. Ancak bu dikkat gerektirir, zira Carbon’un gelecekte kullanılabilecek dinamik class’larını vs. yanlışlıkla silebilirsiniz. En sağlıklısı, birinci yöntemdir.  

- **JS tarafında ağaç sarsma:** Carbon’un React bileşenlerini named import ile kullandığınızda (yukarıdaki örneklerde gösterildiği gibi), Webpack/Parcel gibi bundler’lar sadece kullandıklarınızı paketler. Yine de, Carbon’un ikon paketleri gibi alt paketlerini import ederken dikkat edin. Örneğin `@carbon/icons-react` kütüphanesinden bir ikon alıyorsanız, doğrudan spesifik ikonu import edin (`import { Chat } from '@carbon/icons-react';` gibi) ve tüm ikon setini çekmekten kaçının. Bu, paket boyutunu düşük tutacaktır. Carbon bileşenlerinin kendisi oldukça optimize olsa da, ikonlar ve ek araçlar boyutu şişirebilir ([Package performance and bundle-size · Issue #4882 - GitHub](https://github.com/carbon-design-system/carbon/issues/4882#:~:text=I%27ve%20recently%20noticed%20that%20on,only%20importing%20a%20single%20icon)) ([Minimal CSS with Carbon - Medium](https://medium.com/carbondesign/minimal-css-with-carbon-b0c089ccfa71#:~:text=Minimal%20CSS%20with%20Carbon%20,4kB)).  
- **Tema yükü:** Carbon’un tüm temalarını birden kullanmayacaksanız, sadece gereken temayı dahil etmek de boyutu düşürebilir. Örneğin Sass ile `$theme: $g100` belirterek derlediğinizde, muhtemelen sadece Gray 100 ile ilgili custom property’ler ve değerler CSS’e dahil olur. Aksi halde hem açık hem koyu temaya dair değişkenler yer alabilir.  
- **Geliştirme modu vs üretim:** Carbon’u entegre ederken, uygulamanızı üretim modunda derlediğinizden emin olun. CRA (Create React App) veya Next.js gibi yapılar, production build’de kodu minify eder, NODE_ENV=production ile React’ın development uyarılarını çıkarır vb. Carbon’un kendisi de bazen development modda uyarılar loglayabilir; bunlar üretimde devre dışı olur. Bu yüzden, performans testlerinizi ve ölçümlerinizi üretim derlemesi üzerinde yapın.  

Sonuç olarak, Carbon Design System’i **eksiksiz** entegre ederken bile, kullanmadığınız kısımları dahil etmeme prensibini uygulayın. IBM’in önerisi, Sass modüllerini seçerek projeyi ince ayar yapmak yönündedir: Yalnız ihtiyaç duyulan stilleri import etmek, Carbon’un Sass yapılandırmasını gerektiğinde özelleştirmek (örneğin `$use-flexbox-grid: false` gibi bir bayrakla eski grid yapısını kapatmak da CSS’i azaltır) mümkün. **“Sadece ihtiyaç duyduğun şeyi yükle”** felsefesiyle hareket ederseniz Carbon, kapsamına rağmen oldukça performanslı çalışacaktır. Nitekim Carbon ekibi de, Sass derlemelerinde seçici davranarak CSS çıktısını optimize etmeyi tavsiye etmektedir ([How am I supposed to use IBM's Svelte Carbon Components when ...](https://www.reddit.com/r/sveltejs/comments/sehb96/how_am_i_supposed_to_use_ibms_svelte_carbon/#:~:text=How%20am%20I%20supposed%20to,guide%20on%20Optimizing%20SASS%20builds)). 

> **Not:** Performans optimizasyonu ileri seviye bir konu olduğu için, öncelikle entegrasyonu doğru çalışır şekilde yapıp ardından analiz araçlarıyla (Webpack Bundle Analyzer, Lighthouse vb.) hangi kısımların ağırlık getirdiğini tespit edin. Sonrasında yukarıdaki tekniklerle gereksiz kısımları çıkarabilirsiniz. Bu yaklaşım, fonksiyonellik ve tasarım doğruluğunu riske atmadan kademeli optimizasyon yapmanızı sağlar.

# Kod Örnekleri ve Entegrasyon Adımları  
Son olarak, Carbon Design System’i mevcut chat uygulamanıza entegre etme sürecini adım adım özetleyelim. Bu adımlar, yukarıda bahsedilen tüm konuların uygulamaya dökülmüş halini temsil eder:

**1. Carbon ve IBM Plex’in Kurulumu:**  
   - **Paketleri yükleyin:** Proje dizininde `npm install @carbon/react @carbon/styles @carbon/themes` komutunu çalıştırın. Bu, Carbon’un React bileşenlerini, stil katmanını ve tema tanımlarını projenize ekleyecektir.  
   - **IBM Plex Mono fontunu ekleyin:** Carbon, IBM Plex font ailesini kullanır ancak font dosyalarını otomatik getirmez. IBM Plex Mono’yu projenize Google Fonts üzerinden link ile ekleyebilirsiniz ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=IBM%20Plex%20is%20also%20available,for%20use%20through%20Google%20fonts)) veya `npm install @ibm/plex` ile font paketini indirip CSS ile import edebilirsiniz. Örneğin, public/index.html dosyanızın `<head>` kısmına şu satırı eklemek IBM Plex Mono Light ve Regular ağırlıklarını dahil edecektir:  
     ```html
     <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet">
     ```  
   - **Global stil ayarları:** Uygulamanızın en tepesine (ör. App.css veya index.css) Carbon’un stil dosyasını import edin:  
     ```css
     @import "~@carbon/styles/css/styles.css";
     ```  
     Bu, Carbon’un gerekli tüm temel stillerini (reset, tipografi ölçekleri, vb.) yükleyecektir. Ardından `body { font-family: 'IBM Plex Mono', monospace; }` tanımlayarak varsayılan fontu ayarlayın (eğer Carbon’un varsayılan font-family’si IBM Plex’in başka bir varyantı ise onu Mono ile override ediyoruz).  

**2. Koyu Tema’nın Aktifleştirilmesi:**  
   - Carbon varsayılan olarak White (açık) tema ile gelir. Uygulamayı koyu temada çalıştırmak için Carbon Sass’ini özelleştirebiliriz. `src/index.scss` adında bir Sass dosyası oluşturun (projenizde Sass yapılandırması mevcutsa):  
     ```scss
     @use '@carbon/themes/scss/themes' as *;
     @use '@carbon/styles' with ($theme: $g100);
     ```  
     Ardından index.js’de bu SCSS dosyasını import edin: `import './index.scss';`. Bu, uygulamanın tamamını Gray 100 (en koyu) tema ile stilendirecektir ([carbon/packages/themes/README.md at main · carbon-design-system/carbon · GitHub](https://github.com/carbon-design-system/carbon/blob/main/packages/themes/README.md#:~:text=By%20default%2C%20the%20white%20theme,For%20example)). Eğer Sass kullanmak istemiyorsanız, alternatif olarak tüm uygulamayı saran bir `<div class="dark-theme">` tanımlayıp, CSS’te `.dark-theme { ... }` içinde Carbon’un gerekli CSS custom property tanımlarını yapabilirsiniz (önceki bölümde bahsedilen yöntem). Önemli olan, Carbon token’larının koyu tema değerlerine ayarlanmasıdır. Bunu yaptığınızda arayüzünüz koyu renk şemasına bürünecektir.  

**3. Carbon Bileşenleriyle Arayüzü Oluşturma:**  
   - Mevcut UI öğelerinizi Carbon’un eşdeğer bileşenleriyle değiştirin. Örneğin, oda oluşturma ve odaya katılma için kullandığınız `<button>` elementlerini `<Button>` bileşenleriyle değiştirin. Gerekli importları yapmayı unutmayın:  
     ```jsx
     import { Button, TextInput } from '@carbon/react';
     ```  
   - Bir örnek giriş sayfası arayüzü:  
     ```jsx
     function Lobby() {
       return (
         <Grid className="lobby-page">
           <Column lg={8} md={6} sm={4}>
             <h1 className="cds--heading-03">Anonim Chat</h1>
             <Button onClick={createRoom}>Yeni Oda Oluştur</Button>
             <div style={{ margin: 'var(--cds-spacing-05) 0' }}>veya</div>
             <TextInput id="room-id" labelText="Oda ID" placeholder="Oda ID'sini girin" />
             <Button kind="secondary" onClick={joinRoom}>Odaya Katıl</Button>
           </Column>
         </Grid>
       );
     }
     ```  
     Bu kodda bir Grid yapısı içinde tek bir Column kullanıldı ve tüm içerik onun içine yerleştirildi. Başlık için Carbon’un sağladığı bir heading stil sınıfı (`cds--heading-03`) kullanıldı (Carbon CSS, bu sınıf aracılığıyla ilgili tipografi stilini uygular). Butonlar ve TextInput Carbon bileşenleridir – örneğin `<TextInput>` içinde `labelText` ile üst etiket eklendi. Ayrıca birincil ve ikincil buton tipleri `kind` prop’u ile ayırt edildi.  
   - Chat ekranı arayüzü: Mesajlar listesini oluşturan elemanları Carbon stilleriyle donatın. Carbon’da doğrudan “mesaj balonu” bileşeni yoktur ancak kendi mesaj komponentinizi Carbon prensipleriyle yazabilirsiniz. Örneğin her mesaj satırını bir `<Tile>` (Carbon’un Card/Tile bileşeni) olarak yapabilir ya da sadece basit bir `<div>` kullanıp Carbon token’ları ile stil verebilirsiniz. Bir örnek mesaj listesi:  
     ```jsx
     import { Tile } from '@carbon/react';
     function ChatRoom({ messages }) {
       return (
         <Grid className="chat-room">
           <Column lg={16} sm={4}>
             <div className="messages-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
               {messages.map((msg, idx) => (
                 <Tile key={idx} className="message-tile" style={{
                   backgroundColor: msg.isOwn ? 'var(--cds-interactive-01)' : 'var(--cds-layer-01)',
                   color: msg.isOwn ? 'var(--cds-text-04)' : 'var(--cds-text-01)',
                   marginBottom: 'var(--cds-spacing-03)'
                 }}>
                   <span className="message-sender">{msg.sender}</span>: {msg.text}
                 </Tile>
               ))}
             </div>
             <div className="message-input-area">
               <TextInput id="chat-message" placeholder="Mesaj yazın..." value={text} onChange={e => setText(e.target.value)} />
               <Button onClick={sendMessage}>Gönder</Button>
             </div>
           </Column>
         </Grid>
       );
     }
     ```  
     Bu kod, mesajları Carbon’un **Tile** bileşeni içinde görüntülemeyi gösteriyor. `Tile` kullanımı isteğe bağlı; sadece stil amaçlı kullandık. Her bir Tile’ın arka plan rengini gönderene göre ayırdık: Kendi mesajımız ise `interactive-01` (temadaki birincil interaktif renk, koyu temada mavi) ile, diğer mesajlar ise `layer-01` (kart/zemin rengi, koyu temada grafit gri) ile renklendiriliyor. Yazı rengi de arka plana göre uygun token ile ayarlandı (mavi zemin üzerinde okunaklı olması için `text-04`, koyu gri zemin üzerinde ise standart `text-01`). Bu değerler Carbon’un tanımladığı tema token’larıdır ve üstte seçtiğimiz Gray 100 temasına göre otomatik doğru hex değerlerine karşılık gelir ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=To%20achieve%20a%20consistent%20experience%2C,171717)). Mesajlar arasında alt marjin olarak spacing-03 (8px) verdik. Mesaj girişi alanında TextInput ve Button yanyana konumlandı (Grid kolon yapısı içinde blok elementler olduğu için otomatik yan yana gelirler; gerektiğinde ek `Column` bileşenleri ile daha hassas kontrol edilebilir).  
   - Bildirim ve geri bildirimler: Örneğin bir hata oluştuğunda Carbon’un `<InlineNotification>` bileşenini kullanarak kullanıcıya uyarı gösterin. Bu bileşen, Carbon stiliyle kırmızı bir uyarı çubuğu görüntüler. Yukarıdaki kod parçasında `error` durumunda bunu zaten ekledik. Benzer şekilde başarılı işlemler için yeşil onay bildirimleri de kullanılabilir (kind="success").  
   - Diyaloglar: Carbon’un `<Modal>` bileşeni, sohbet odasından çıkarken onay almak veya bilgi göstermek için kullanılabilir. Entegre etmek için state tabanlı `open` prop’unu kontrol edin ve içerik olarak istediğiniz JSX’i verin. Carbon, modalların stillerini ve odak yönetimini otomatik yapacaktır.

**4. Son Kontroller ve Test:**  
   - Tüm bileşenlerin beklendiği gibi göründüğünü doğrulayın. Özellikle tipografinin IBM Plex Mono’ya döndüğünden emin olun. Bunu sağlamak için Chrome geliştirici aracında bir metin öğesini inceleyerek font-family’sinin Plex Mono olduğuna bakabilirsiniz.  
   - Renklerin Carbon temasına uygun şekilde uygulandığını kontrol edin. Arka plan renginizin tam siyah yerine hafif bir gri (Gray100 = #161616) olduğunu, metinlerin tam beyaz (#FFFFFF) olduğunu görebilirsiniz – bu Carbon’un kontrast optimizasyonudur.  
   - Bileşenlerin etkileşimlerini deneyin. Özellikle buton hover durumunda Carbon’un etkileşim rengi biraz daha koyu bir maviye dönecektir, bildirim bileşeninde kapatma (x) ikonuna tıkladığınızda düzgün kapandığını kontrol edin vb.  

Tüm bu adımlar sonucunda, chat uygulamanızın arayüzü IBM Carbon Design System ile tamamen uyumlu hale gelecektir. Tipografiden renklere, boşluk kullanımından bileşen davranışlarına kadar Carbon’un en iyi uygulamalarını yansıtan bir arayüz elde etmiş olacaksınız. Bu entegrasyon sayesinde arayüzünüz sadece görsel olarak IBM’in tasarım standartlarına uymakla kalmayacak, aynı zamanda tutarlılık ve erişilebilirlik açısından da güçlü bir altyapıya sahip olacaktır.

**Kaynaklar:** Carbon Design System resmi dokümantasyonu ve topluluk rehberleri entegrasyon sürecinde en büyük yardımcınızdır. Özellikle Carbon’un kendi sitesindeki React bileşen belgeleri ve Carbon Design System örnek projeleri, spesifik kullanım detayları için incelenebilir. Aşağıda, araştırma sırasında referans alınan bazı kaynaklar listelenmiştir:

- Carbon Typography Guidelines ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=Carbon%20uses%20type%20tokens%20to,source%20IBM%20Plex%20typeface)) ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=Carbon%20defines%20typographies%20for%20two,will%20use%20Productive%20design%20typography))  
- Carbon React Components & Patterns ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=application%20of%20these%20principles,dialogs%2C%20notifications%2C%20filtering%2C%20and%20search))  
- Carbon Grid Documentation ([carbon/packages/react/src/components/Grid/Grid.mdx at main · carbon-design-system/carbon · GitHub](https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/Grid/Grid.mdx#:~:text=To%20specify%20how%20many%20columns,4%20columns%20at%20that%20breakpoint))  
- Carbon Color Tokens and Themes ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=Carbon%20uses%20tokens%20and%20themes,is%20using%20the%20White%20theme)) ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=There%20are%20multiple%20other%20roles,com%2Fguidelines%2Fcolor%2Fusage))  
- Carbon Spacing Scale ([Carbon Design System – A Practical Example – DESIGN.GOTHE.SE  ](https://design.gothe.se/10251/#:~:text=Carbon%20defines%20a%20spacing%20scale,level%20layout%20designs))  
- Carbon Performance Tips (Sass Optimization) ([How am I supposed to use IBM's Svelte Carbon Components when ...](https://www.reddit.com/r/sveltejs/comments/sehb96/how_am_i_supposed_to_use_ibms_svelte_carbon/#:~:text=How%20am%20I%20supposed%20to,guide%20on%20Optimizing%20SASS%20builds)) ([Minimal CSS with Carbon - Medium](https://medium.com/carbondesign/minimal-css-with-carbon-b0c089ccfa71#:~:text=If%20we%20compare%20this%20one,4kB))

