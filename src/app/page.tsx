'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sanitizeRoomId, generateUsername } from '@/lib/utils';
import { 
  Button, 
  TextInput, 
  Grid, 
  Column, 
  Heading,
  Content,
  Tile,
  Modal,
  Header,
  HeaderName
} from '@carbon/react';
import { 
  Chat, 
  Add, 
  Login
} from '@carbon/icons-react';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleCreateRoom = () => {
    try {
      const nickname = generateUsername();
      // Benzersiz bir oda ID'si oluştur
      const uniqueRoomId = Math.random().toString(36).substring(2, 8);
      console.log("Oda oluşturuluyor:", uniqueRoomId);
      console.log("Kullanıcı adı:", nickname);
      
      // Yönlendirme öncesi 100ms bekle - bu gecikme, tarayıcının durumunu daha iyi senkronize eder
      setTimeout(() => {
        try {
          router.push(`/room/${uniqueRoomId}?nickname=${encodeURIComponent(nickname)}`);
        } catch (routerError) {
          console.error("Yönlendirme hatası:", routerError);
          // Yönlendirme hatası durumunda klasik navigate yöntemini dene
          window.location.href = `/room/${uniqueRoomId}?nickname=${encodeURIComponent(nickname)}`;
        }
      }, 100);
    } catch (error) {
      console.error("Oda oluşturma hatası:", error);
      alert("Oda oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      setError('Lütfen bir oda ID girin');
      return;
    }

    try {
      const sanitized = sanitizeRoomId(roomId);
      const nickname = generateUsername();
      console.log("Odaya katılınıyor:", sanitized);
      console.log("Kullanıcı adı:", nickname);
      
      // Yönlendirme öncesi kısa bir gecikme ekle
      setTimeout(() => {
        try {
          router.push(`/room/${sanitized}?nickname=${encodeURIComponent(nickname)}`);
          setIsModalOpen(false);
        } catch (routerError) {
          console.error("Yönlendirme hatası:", routerError);
          // Yönlendirme hatası durumunda klasik navigate yöntemini dene
          window.location.href = `/room/${sanitized}?nickname=${encodeURIComponent(nickname)}`;
          setIsModalOpen(false);
        }
      }, 100);
    } catch (err) {
      console.error("Odaya katılma hatası:", err);
      setError('Geçersiz oda ID. Lütfen sadece harf ve rakamlar kullanın.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  return (
    <div className="cds--g100 home-page" data-carbon-theme="g100">
      {/* Carbon Header */}
      <Header aria-label="Anonim Chat" className="home-header">
        <HeaderName prefix="">
          <Chat size={20} /> Anonim Chat
        </HeaderName>
      </Header>
      
      {/* Ana İçerik - Carbon Grid Yapısı */}
      <Content>
        <Grid fullWidth className="home-grid">
          <Column lg={8} md={6} sm={4} className="welcome-column">
            <Tile className="welcome-tile">
              <div className="welcome-content">
                <div className="welcome-icon">
                  <Chat size={42} />
                </div>
                
                <Heading className="welcome-title">
                  Anonim Sohbet Odalarına Hoş Geldiniz
                </Heading>
                
                <p className="welcome-description cds--body-long-01">
                  Hızlı ve kolay şekilde anonim sohbet odalarına katılın. 
                  Kullanıcı adı otomatik oluşturulur, gizlilik korunur ve kayıt gerektirmez.
                </p>
                
                <div className="welcome-actions">
                  <Button 
                    onClick={handleCreateRoom} 
                    renderIcon={Add}
                    size="lg"
                    className="welcome-button"
                  >
                    Yeni Oda Oluştur
                  </Button>
                  
                  <div className="welcome-divider">veya</div>
                  
                  <Button 
                    onClick={() => setIsModalOpen(true)}
                    kind="secondary"
                    renderIcon={Login}
                    size="lg"
                    className="welcome-button"
                  >
                    Mevcut Odaya Katıl
                  </Button>
                </div>
              </div>
            </Tile>
          </Column>
          
          <Column lg={8} md={2} sm={0} className="features-column">
            <Tile className="features-tile">
              <h3 className="features-title">Özelllikler</h3>
              <ul className="features-list">
                <li>Gizli ve anonim sohbet</li>
                <li>Kayıt veya kullanıcı hesabı gerektirmez</li>
                <li>Otomatik kullanıcı adı oluşturma</li>
                <li>Benzersiz oda bağlantısı</li>
                <li>Gerçek zamanlı mesajlaşma</li>
                <li>Tamamen ücretsiz</li>
              </ul>
            </Tile>
          </Column>
        </Grid>
      </Content>
      
      {/* Odaya Katıl Modalı */}
      <Modal
        open={isModalOpen}
        modalHeading="Odaya Katıl"
        primaryButtonText="Katıl"
        secondaryButtonText="İptal"
        onRequestSubmit={handleJoinRoom}
        onRequestClose={() => {
          setIsModalOpen(false);
          setError('');
          setRoomId('');
        }}
      >
        <p className="modal-description">
          Katılmak istediğiniz odanın ID'sini girin
        </p>
        <TextInput
          id="room-id-modal"
          labelText="Oda ID"
          placeholder="Örn: abc123"
          value={roomId}
          onChange={(e) => {
            setRoomId(e.target.value);
            setError('');
          }}
          onKeyDown={handleKeyDown}
          invalid={!!error}
          invalidText={error}
          style={{ marginTop: '1rem' }}
        />
      </Modal>
    </div>
  );
} 