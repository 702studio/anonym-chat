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
  SkeletonText
} from '@carbon/react';
import { 
  Copy, 
  Send,
  ChatBot,
  Information,
  UserAvatar
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
        
        // Firebase referansını oluştur
        messagesRef.current = ref(database, `rooms/${roomId}/messages`);
        
        // İlk verileri çek
        try {
          const snapshot = await get(messagesRef.current);
          if (snapshot.exists()) {
            setConnectionStatus('bağlandı');
            console.log("Oda verisi başarıyla alındı:", snapshot.val());
          } else {
            console.log("Oda henüz mesaj içermiyor, ama bağlantı başarılı.");
            setConnectionStatus('bağlandı (boş oda)');
          }
        } catch (getError) {
          console.error("İlk veri çekme hatası:", getError);
          if (retry < maxRetries) {
            console.log(`Veri çekme başarısız, yeniden deneniyor (${retry + 1}/${maxRetries})...`);
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
          console.log("Gerçek zamanlı veri dinleyicisi ekleniyor...");
          unsubscribe = onValue(messagesRef.current, (snapshot) => {
            setLoading(false);
            
            const data = snapshot.val();
            const loadedMessages: Message[] = [];
            
            if (data) {
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
                    const audio = new Audio('/message.mp3');
                    audio.volume = 0.5;
                    audio.play().catch(e => console.log('Ses çalma hatası:', e));
                  } catch (audioError) {
                    console.log('Ses bildirimi çalınamadı:', audioError);
                  }
                }
              }
              
              // Mesaj geldiyse yükleme durumunu kapat
              if (loadedMessages.length > 0) {
                setLoading(false);
                setConnectionStatus('bağlı (' + loadedMessages.length + ' mesaj)');
                
                // Yeni mesaj eklendiğinde otomatik kaydır
                setTimeout(() => {
                  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            } else {
              // Mesaj yoksa yükleme durumunu kapat
              setLoading(false);
              setConnectionStatus('bağlı (boş oda)');
            }
          }, (errorObject) => {
            console.error('Firebase veri okuma hatası:', errorObject);
            setError('Mesajları alma sırasında bir hata oluştu: ' + errorObject.message);
            setLoading(false);
            setConnectionStatus('bağlantı hatası');
            
            // Hata durumunda yeniden deneme
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`Bağlantı hatası, yeniden deneniyor (${retryCount}/${maxRetries})...`);
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
          console.error("Veri dinleyicisi ekleme hatası:", listenerError);
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
  }, [roomId, searchParams, router]);
  
  // Yeni mesaj geldiğinde aşağı kaydır
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      
      // Gönderilen mesaj sonrası aşağı kaydırma
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    
    return messages.map((msg) => (
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
    <div className="cds--g100 chat-container">
      {/* Basitleştirilmiş Header */}
      <Header aria-label="Anonim Chat" data-carbon-theme="g100">
        <HeaderName onClick={goToHome} prefix="">
          <ChatBot size={20} /> Anonim Chat <Tag className="room-tag" type="blue">Oda: {roomId}</Tag>
        </HeaderName>
        
        <HeaderGlobalBar>
          <HeaderGlobalAction
            aria-label="Bağlantı Durumu"
            isActive={false}
            tooltipAlignment="center"
          >
            <Tag type={connectionStatus.includes('hata') ? 'red' : connectionStatus.includes('bağlanıyor') ? 'purple' : 'green'} className="status-tag">
              {connectionStatus}
            </Tag>
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
      
      {/* Basitleştirilmiş Chat İçeriği */}
      <main className="chat-content">
        {error && (
          <ToastNotification
            kind="error"
            title="Hata"
            subtitle={error}
            onClose={() => setError(null)}
            timeout={5000}
            className="error-notification"
          />
        )}
        
        {copySuccess && (
          <ToastNotification
            kind="success"
            title="Başarılı"
            subtitle="Bağlantı kopyalandı"
            timeout={3000}
            className="copy-notification"
          />
        )}
        
        {/* Oda Bilgisi */}
        <Tile className="room-info-tile">
          <div className="room-info-content">
            <div className="room-title">
              <h3>Oda: {roomId}</h3>
              <Tag type={connectionStatus.includes('hata') ? 'red' : connectionStatus.includes('bağlanıyor') ? 'purple' : 'green'}>
                {connectionStatus}
              </Tag>
            </div>
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
        </Tile>
        
        {/* Mesaj Alanı */}
        <div className="messages-container">
          {renderMessages()}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Mesaj Gönderme Alanı */}
        <div className="chat-input-container">
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
      </main>
    </div>
  );
} 