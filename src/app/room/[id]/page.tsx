'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ref, onValue, push, set, DatabaseReference, get } from 'firebase/database';
import { 
  Button, 
  TextInput, 
  InlineLoading, 
  Tag,
  ToastNotification,
  Header,
  HeaderName,
  HeaderGlobalAction,
  HeaderGlobalBar,
  Tile,
  SkeletonText,
  Grid,
  Column,
  Content
} from '@carbon/react';
import { 
  Copy, 
  Send,
  ChatBot,
  Information,
  UserAvatar,
  ArrowLeft
} from '@carbon/icons-react';
import { database } from '@/lib/firebase';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

export default function RoomPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [nickname, setNickname] = useState('');
  const [roomLink, setRoomLink] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('bağlanıyor');
  
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const messagesRef = useRef<DatabaseReference | null>(null);
  
  const roomId = params.id as string;

  // Renk belirleyici fonksiyon - kullanıcı adına göre tutarlı bir renk üretir
  const getUserColor = (username: string) => {
    const colors = [
      '#8a3ffc', // purple
      '#33b1ff', // blue
      '#007d79', // teal
      '#ff7eb6', // magenta
      '#fa4d56', // red
      '#4589ff', // blue
      '#08bdba', // teal
      '#d12771', // magenta
      '#d2a106', // yellow
      '#e78c3a', // orange
    ];
    
    let sum = 0;
    for (let i = 0; i < username.length; i++) {
      sum += username.charCodeAt(i);
    }
    
    return colors[sum % colors.length];
  };

  // Avatar için harf oluşturma - kullanıcı adının ilk harfi
  const getInitial = (username: string) => {
    const withoutPrefix = username.replace('User-', '');
    if (withoutPrefix.length > 0 && /[a-zA-Z]/.test(withoutPrefix[0])) {
      return withoutPrefix[0].toUpperCase();
    }
    return 'U';
  };

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let retryCount = 0;
    const maxRetries = 3;
    
    // URL'den nickname'i al
    const urlNickname = searchParams.get('nickname');
    if (!urlNickname) {
      router.push('/');
      return;
    }
    
    setNickname(urlNickname);
    
    // Oda linkini oluştur
    try {
      const host = window.location.host;
      const protocol = window.location.protocol;
      const fullRoomUrl = `${protocol}//${host}/room/${roomId}?nickname=${encodeURIComponent(urlNickname)}`;
      setRoomLink(fullRoomUrl);
    } catch (err) {
      console.error("URL oluşturma hatası:", err);
      const fallbackUrl = `/room/${roomId}?nickname=${encodeURIComponent(urlNickname)}`;
      setRoomLink(fallbackUrl);
    }
    
    // Firebase'den mesajları al (retry mekanizması ile)
    async function fetchMessages(retry = 0) {
      try {
        setLoading(true);
        setConnectionStatus(retry > 0 ? `bağlanıyor (deneme ${retry}/${maxRetries})` : 'bağlanıyor');
        
        console.log("[Firebase] Bağlantı başlatılıyor...");
        console.log("[Firebase] RoomID:", roomId);
        console.log("[Firebase] Firebase config:", JSON.stringify({
          databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "hardcoded kullanılıyor",
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hardcoded kullanılıyor"
        }));
        
        // Database null kontrolü
        if (!database) {
          console.error("[Firebase] Database null! Firebase bağlantısı kurulamadı.");
          setError("Firebase veritabanı bağlantısı başlatılamadı. Tarayıcı konsolunu kontrol edin ve sayfayı yenileyin.");
          setConnectionStatus('kritik hata');
          setLoading(false);
          return;
        }
        
        // Test bağlantısı yapalım
        try {
          console.log("[Firebase] Test bağlantısı kontrol ediliyor...");
          const testRef = ref(database, '.info/connected');
          
          // 10 saniye içinde bağlantı kurulamazsa hata ver
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Bağlantı zaman aşımı")), 10000);
          });
          
          const connectionPromise = new Promise((resolve) => {
            const unsub = onValue(testRef, (snapshot) => {
              if (snapshot.val() === true) {
                console.log("[Firebase] Test bağlantısı başarılı!");
                unsub();
                resolve(true);
              }
            });
          });
          
          // Yarış koşulu - hangisi önce gerçekleşirse
          await Promise.race([connectionPromise, timeoutPromise])
            .catch(error => {
              console.error("[Firebase] Test bağlantısı başarısız:", error);
              throw new Error("Firebase bağlantı testi başarısız: " + error.message);
            });
        } catch (testError) {
          console.error("[Firebase] Test bağlantı hatası:", testError);
          if (retry < maxRetries) {
            console.log(`[Firebase] Test bağlantısı başarısız, yeniden deneniyor (${retry + 1}/${maxRetries})...`);
            setTimeout(() => fetchMessages(retry + 1), 2000);
            return;
          }
          
          setError("Firebase sunucusuna ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin ve sayfayı yenileyin.");
          setConnectionStatus('bağlantı hatası');
          setLoading(false);
          return;
        }
        
        // Firebase referansını oluştur
        messagesRef.current = ref(database, `rooms/${roomId}/messages`);
        console.log("[Firebase] Oda referansı oluşturuldu:", `rooms/${roomId}/messages`);
        
        // İlk verileri çek
        try {
          console.log("[Firebase] İlk veri çekme işlemi başlatılıyor...");
          
          if (!messagesRef.current) {
            throw new Error("Mesaj referansı oluşturulamadı!");
          }
          
          const snapshot = await get(messagesRef.current);
          console.log("[Firebase] Snapshot alındı:", snapshot.exists() ? "Veri var" : "Veri yok");
          
          if (snapshot.exists()) {
            setConnectionStatus('bağlandı');
            console.log("[Firebase] Oda verisi başarıyla alındı:", snapshot.val());
          } else {
            console.log("[Firebase] Oda henüz mesaj içermiyor, ama bağlantı başarılı.");
            setConnectionStatus('bağlandı (boş oda)');
          }
        } catch (getError) {
          console.error("[Firebase] İlk veri çekme hatası:", getError);
          setError("Veri çekme hatası: " + JSON.stringify(getError));
          
          if (retry < maxRetries) {
            console.log(`[Firebase] Veri çekme başarısız, yeniden deneniyor (${retry + 1}/${maxRetries})...`);
            setTimeout(() => fetchMessages(retry + 1), 2000);
            return;
          }
          setError("Mesajları yüklerken bir sorun oluştu. Lütfen tekrar deneyin.");
          setConnectionStatus('hata');
          setLoading(false);
          return;
        }
        
        // Gerçek zamanlı güncelleme dinleyicisi ekle
        try {
          console.log("[Firebase] Gerçek zamanlı veri dinleyicisi ekleniyor...");
          unsubscribe = onValue(messagesRef.current, (snapshot) => {
            console.log("[Firebase] onValue callback çağrıldı - veri alındı");
            setLoading(false);
            
            const data = snapshot.val();
            const loadedMessages: Message[] = [];
            
            if (data) {
              console.log("[Firebase] Alınan veri:", JSON.stringify(data).substring(0, 100) + "...");
              Object.keys(data).forEach((key) => {
                loadedMessages.push({
                  id: key,
                  ...data[key]
                });
              });
              
              // Mesajları zaman damgasına göre sırala
              loadedMessages.sort((a, b) => a.timestamp - b.timestamp);
              
              // Mesaj sayısında değişiklik oldu mu kontrol et
              const oldMessagesCount = messages.length;
              setMessages(loadedMessages);
              
              // Yeni mesaj geldiyse ve son mesajı gönderen kullanıcı bu değilse bildirim sesi çal
              const hasNewMessages = loadedMessages.length > oldMessagesCount;
              if (hasNewMessages && loadedMessages.length > 0) {
                const lastMessage = loadedMessages[loadedMessages.length - 1];
                if (lastMessage.sender !== nickname) {
                  try {
                    // Basit ses bildirimi
                    const audio = new Audio('/sounds/message.mp3');
                    audio.volume = 0.5;
                    audio.play().catch(e => console.log('[Firebase] Ses çalma hatası:', e));
                  } catch (audioError) {
                    console.log('[Firebase] Ses bildirimi çalınamadı:', audioError);
                  }
                }
              }
              
              // Mesaj geldiyse yükleme durumunu kapat
              if (loadedMessages.length > 0) {
                setLoading(false);
                setConnectionStatus('bağlı (' + loadedMessages.length + ' mesaj)');
              }
            } else {
              // Mesaj yoksa yükleme durumunu kapat
              console.log("[Firebase] Oda boş, mesaj yok");
              setLoading(false);
              setConnectionStatus('bağlı (boş oda)');
            }
          }, (errorObject) => {
            console.error('[Firebase] Veri okuma hatası:', errorObject);
            setError('Mesajları alma sırasında bir hata oluştu: ' + errorObject.message);
            setLoading(false);
            setConnectionStatus('bağlantı hatası');
            
            // Hata durumunda yeniden deneme
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`[Firebase] Bağlantı hatası, yeniden deneniyor (${retryCount}/${maxRetries})...`);
              setTimeout(() => {
                if (unsubscribe) {
                  unsubscribe();
                  unsubscribe = null;
                }
                fetchMessages(retryCount);
              }, 2000 * retryCount); // Artan bekleme süresi
            }
          });
        } catch (listenerError: any) {
          console.error("[Firebase] Veri dinleyicisi ekleme hatası:", listenerError);
          setError("Gerçek zamanlı veri dinleme başarısız oldu: " + (listenerError?.message || 'Bilinmeyen hata'));
          setLoading(false);
          setConnectionStatus('bağlantı hatası');
        }
      } catch (err) {
        console.error('Firebase bağlantı hatası:', err);
        setError('Sunucu bağlantısı kurulamadı. Lütfen daha sonra tekrar deneyin.');
        setLoading(false);
        setConnectionStatus('bağlantı hatası');
        
        // Genel hata durumunda yeniden deneme
        if (retry < maxRetries) {
          setTimeout(() => fetchMessages(retry + 1), 2000);
        }
      }
    }
    
    fetchMessages();
    
    // Temizlik fonksiyonu - component unmount olduğunda çalışır
    return () => {
      console.log("Oda sayfasından ayrılıyor, dinleyiciler temizleniyor...");
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [roomId, searchParams, router, messages.length]);
  
  // Yeni mesaj geldiğinde otomatik kaydır (column-reverse için düzenlendi)
  useEffect(() => {
    if (messages.length > 0) {
      // Column-reverse yapısında en yeni mesajlar altta olduğu için
      // scrollTop değerini 0'a çekerek otomatik olarak en son mesaja odaklanıyoruz
      const messagesContainer = document.querySelector('.messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = 0;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() === '' || !messagesRef.current) return;
    
    // Gönderilecek mesaj içeriğini kaydet ve formu temizle
    const messageText = message.trim();
    setMessage('');
    
    setSendingMessage(true);
    const newMessageRef = push(messagesRef.current);
    
    const newMessage = {
      sender: nickname,
      text: messageText,
      timestamp: Date.now()
    };
    
    console.log("Mesaj gönderiliyor:", newMessage);
    
    set(newMessageRef, newMessage)
    .then(() => {
      console.log("Mesaj başarıyla gönderildi:", newMessage);
      setSendingMessage(false);
      
      // Gönderilen mesaj sonrası aşağı kaydırma (column-reverse için düzenlendi)
      setTimeout(() => {
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
          messagesContainer.scrollTop = 0;
        }
      }, 100);
    })
    .catch((error) => {
      console.error("Mesaj gönderme hatası:", error);
      setError("Mesaj gönderilemedi: " + error.message);
      setSendingMessage(false);
      // Mesaj gönderilemediğinde, kullanıcıya yazdığı mesajı geri verelim
      setMessage(messageText);
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(roomLink)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error('Link kopyalama hatası:', err);
        setError('Link kopyalanamadı.');
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const goToHome = () => {
    router.push('/');
  };

  const renderMessages = () => {
    if (loading && messages.length === 0) {
      return (
        <div className="chat-loading">
          <SkeletonText heading width="100%" lineCount={3} />
        </div>
      );
    }
    
    if (messages.length === 0) {
      return (
        <Tile className="chat-empty">
          <ChatBot size={32} className="chat-empty-icon" />
          <p>Henüz hiç mesaj yok. İlk mesajı gönderen siz olun!</p>
        </Tile>
      );
    }
    
    // Mesajları ters sırada göster (yeniden eskiye doğru)
    return [...messages]
      .reverse()
      .map((msg) => (
        <div 
          key={msg.id} 
          className={`chat-message ${msg.sender === nickname ? 'chat-message-mine' : 'chat-message-others'}`}
        >
          <div className="chat-message-header">
            {msg.sender !== nickname && (
              <div 
                className="chat-avatar" 
                style={{ backgroundColor: getUserColor(msg.sender) }}
                aria-label={`${msg.sender} avatarı`}
              >
                {getInitial(msg.sender)}
              </div>
            )}
            <div className="chat-message-sender">
              {msg.sender === nickname ? 'Siz' : msg.sender}
            </div>
          </div>
          <div className="chat-message-text">
            {msg.text}
          </div>
          <div className="chat-message-timestamp">
            {new Date(msg.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ));
  };

  return (
    <div className="cds--g100 chat-page" data-carbon-theme="g100">
      {/* Ana Header - Sabit Başlık */}
      <Header aria-label="Anonim Chat" className="chat-header">
        <HeaderName prefix="">
          <Button
            kind="ghost"
            renderIcon={ArrowLeft}
            iconDescription="Ana Sayfaya Dön"
            hasIconOnly
            size="sm"
            className="back-button"
            onClick={goToHome}
          />
          <ChatBot size={20} /> Anonim Chat 
          <Tag className="room-tag" type="blue">Oda: {roomId}</Tag>
        </HeaderName>
        
        <HeaderGlobalBar>
          <HeaderGlobalAction
            aria-label="Bağlantı Durumu"
            isActive={false}
          >
            <Tag type={connectionStatus.includes('hata') ? 'red' : connectionStatus.includes('bağlanıyor') ? 'purple' : 'green'} className="status-tag">
              {connectionStatus}
            </Tag>
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
      
      {/* Bildirimler */}
      {error && (
        <div className="notification-wrapper">
          <ToastNotification
            kind="error"
            title="Hata"
            subtitle={error}
            onClose={() => setError(null)}
            timeout={5000}
            className="error-notification"
          />
        </div>
      )}
      
      {copySuccess && (
        <div className="notification-wrapper">
          <ToastNotification
            kind="success"
            title="Başarılı"
            subtitle="Bağlantı kopyalandı"
            timeout={3000}
            className="copy-notification"
          />
        </div>
      )}
      
      {/* Ana Chat Container - Full Screen Layout */}
      <div className="chat-container">
        <div className="chat-unified-tile">
          {/* Oda Bilgisi - Sabit Üst Kısım */}
          <div className="chat-room-header">
            <div className="room-link-container">
              <TextInput
                id="room-link"
                labelText="Oda bağlantısı"
                value={roomLink}
                readOnly
                light
                size="sm"
                className="room-link-input"
              />
              <Button 
                hasIconOnly 
                renderIcon={Copy} 
                iconDescription="Kopyala" 
                onClick={handleCopyLink}
                kind="primary"
                size="sm"
              />
            </div>
          </div>
          
          {/* Mesaj Alanı - Ortada Kaydırılabilir */}
          <div className="chat-messages-area">
            <div className="messages-container">
              {renderMessages()}
            </div>
          </div>
          
          {/* Mesaj Gönderme Alanı - Sabit Altta */}
          <div className="chat-input-area">
            <TextInput
              id="message-input"
              labelText="Mesaj"
              hideLabel
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              onKeyDown={handleKeyDown}
              size="lg"
              className="message-input"
            />
            <Button 
              renderIcon={Send} 
              onClick={handleSendMessage} 
              disabled={sendingMessage || message.trim() === ''}
              kind="primary"
              size="lg"
              className="send-button"
            >
              {sendingMessage ? 'Gönderiliyor...' : 'Gönder'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 