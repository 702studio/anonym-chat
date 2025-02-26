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
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  ContentSwitcher,
  Switch
} from '@carbon/react';
import { 
  Copy, 
  Send,
  ChatBot,
  Information,
  UserAvatar,
  ArrowLeft,
  FolderDetails,
  Share
} from '@carbon/icons-react';
import { database } from '@/lib/firebase';
import ChatMessage from '@/components/ChatMessage';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

export default function RoomPage() {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [nickname, setNickname] = useState<string>('');
  const [roomLink, setRoomLink] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
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

    // Kullanıcı için benzersiz ID oluştur veya varolan ID'yi al
    let currentUserId = localStorage.getItem(`anonymChat_userId_${roomId}`);
    if (!currentUserId) {
      currentUserId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem(`anonymChat_userId_${roomId}`, currentUserId);
    }
    setUserId(currentUserId);
    
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
          console.log("[Firebase] %cTest bağlantısı kontrol ediliyor...", "color: blue; font-weight: bold");
          const testRef = ref(database, '.info/connected');
          
          // 5 saniye içinde bağlantı kurulamazsa hata ver (timeout süresini düşürdük)
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Bağlantı zaman aşımı (5 saniye)")), 5000);
          });
          
          const connectionPromise = new Promise((resolve) => {
            let unsub: (() => void) | undefined; // undefined olarak başlat
            unsub = onValue(testRef, (snapshot) => {
              if (snapshot.val() === true) {
                console.log("[Firebase] %c✅ Test bağlantısı başarılı!", "color: green; font-weight: bold");
                if (unsub) unsub(); // null check ekle
                resolve(true);
              }
            });
          });
          
          // Yarış koşulu - hangisi önce gerçekleşirse
          await Promise.race([connectionPromise, timeoutPromise])
            .catch(error => {
              console.error("[Firebase] %c❌ Test bağlantısı başarısız:", "color: red; font-weight: bold", error);
              throw new Error("Firebase bağlantı testi başarısız: " + error.message);
            });
            
          // Bağlantı başarılı olduysa
          setConnectionStatus('bağlı');
        } catch (testError) {
          console.error("[Firebase] %c❌ Test bağlantı hatası:", "color: red; font-weight: bold", testError);
          if (retry < maxRetries) {
            console.log(`[Firebase] %c🔄 Test bağlantısı başarısız, yeniden deneniyor (${retry + 1}/${maxRetries})...`, "color: orange; font-weight: bold");
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

  const handleSendMessage = async () => {
    if (message.trim() === '' || sendingMessage) return;
    
    try {
      setSendingMessage(true);
      
      if (!database) {
        throw new Error("Firebase bağlantısı kurulamadı. Mesaj gönderilemiyor.");
      }
      
      // Yeni mesaj referansı oluştur
      if (!messagesRef.current) {
        messagesRef.current = ref(database, `rooms/${roomId}/messages`);
      }
      
      const newMessageRef = push(messagesRef.current);
      const messageData = {
        sender: nickname,
        senderId: userId,
        text: message,
        timestamp: Date.now()
      };
      
      // Mesajı veritabanına yaz
      await set(newMessageRef, messageData);
      
      // Input'u temizle
      setMessage('');
    } catch (err) {
      console.error("Mesaj gönderme hatası:", err);
      setError(`Mesaj gönderilirken bir hata oluştu: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
    } finally {
      setSendingMessage(false);
    }
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
          <InlineLoading 
            status="active" 
            iconDescription="Mesajlar yükleniyor" 
            description="Mesajlar yükleniyor..." 
            className="chat-loading-indicator"
          />
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
        <ChatMessage 
          key={msg.id}
          id={msg.id}
          text={msg.text}
          sender={msg.sender}
          timestamp={msg.timestamp}
          isCurrentUser={msg.senderId ? msg.senderId === userId : msg.sender === nickname}
          getUserColor={getUserColor}
          getInitial={getInitial}
        />
      ));
  };

  return (
    <div className="cds--g100 chat-page" data-carbon-theme="g100">
      {/* Ana Header - Sabit Başlık */}
      <Header aria-label="Anonim Chat" className="chat-header">
        <HeaderName prefix="" className="chat-header-name">
          <Button
            kind="ghost"
            renderIcon={ArrowLeft}
            iconDescription="Ana Sayfaya Dön"
            hasIconOnly
            size="sm"
            className="back-button"
            onClick={goToHome}
          />
          <span className="app-title"><ChatBot size={20} /> Anonim Chat</span>
        </HeaderName>
        
        <div className="chat-tabs-container">
          <Tabs>
            <TabList aria-label="Oda sekmeleri">
              <Tab className="room-tab">
                <div className="room-tab-content">
                  <FolderDetails size={16} />
                  <span>{roomId}</span>
                </div>
              </Tab>
            </TabList>
          </Tabs>
        </div>
        
        <HeaderGlobalBar>
          {connectionStatus.includes('bağlanıyor') ? (
            <InlineLoading 
              status="active" 
              iconDescription="Bağlanıyor" 
              description={connectionStatus} 
              className="connection-status-loading"
            />
          ) : (
            <div className="connection-status">
              <span 
                className={`connection-dot ${
                  connectionStatus.includes('hata') ? 'error' : 
                  connectionStatus === 'bağlı' || connectionStatus.includes('bağlı') ? 'connected' : 
                  'connecting'
                }`}
              />
              <span className="connection-text">{
                connectionStatus.includes('mesaj') ? 
                  connectionStatus.match(/\((\d+) mesaj\)/)?.[1] || '' : ''
              }</span>
            </div>
          )}
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
      
      {/* Ana Chat Container - Genişliği Kontrollü */}
      <div className="chat-container">
        <div className="chat-unified-tile">
          {/* Oda Bilgisi - Sabit Üst Kısım */}
          <div className="chat-room-header">
            <div className="room-share-container">
              <div className="room-link-compact">
                <span className="room-link-label">
                  <Share size={16} />
                </span>
                <TextInput
                  id="room-link"
                  labelText="Oda bağlantısı"
                  hideLabel
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
          </div>
          
          {/* Mesaj Alanı - Ortada Kaydırılabilir */}
          <div className="chat-messages-area">
            <div className="messages-container">
              {renderMessages()}
            </div>
          </div>
          
          {/* Mesaj Gönderme Alanı - Sabit Altta */}
          <div className="chat-input-area">
            <div className="message-input-group">
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
                disabled={sendingMessage || connectionStatus.includes('hata')}
              />
              <Button 
                renderIcon={Send} 
                onClick={handleSendMessage} 
                disabled={sendingMessage || message.trim() === '' || connectionStatus.includes('hata')}
                kind="primary"
                size="lg"
                className="send-button"
                iconDescription="Mesaj gönder"
                hasIconOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 