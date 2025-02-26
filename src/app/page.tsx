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
  Modal
} from '@carbon/react';
import { Chat } from '@carbon/icons-react';

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
    <div className="home-container">
      <div className="chat-simple-container">
        <div className="chat-simple-content">
          <div className="chat-logo">
            <Chat size={24} />
          </div>
          
          <h1 className="chat-title">Anonim Chat</h1>
          
          <p className="chat-description">
            Hızlı ve kolay şekilde anonim sohbet odalarına katılın. 
            Kullanıcı adı otomatik oluşturulur, sadece bir oda ID ile bağlanın!
          </p>
          
          <div className="chat-actions">
            <Button 
              onClick={handleCreateRoom} 
              className="chat-button"
            >
              Oda Oluştur
            </Button>
            
            <Button 
              onClick={() => setIsModalOpen(true)}
              kind="secondary"
              className="chat-button"
            >
              Odaya Katıl
            </Button>
          </div>
        </div>
      </div>
      
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