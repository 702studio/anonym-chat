import React from 'react';
import { Tile, Tag, Layer } from '@carbon/react';
import { User, ChatBot } from '@carbon/icons-react';

interface ChatMessageProps {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
  isCurrentUser: boolean;
  getUserColor: (username: string) => string;
  getInitial: (username: string) => string;
  senderId?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  id,
  text,
  sender,
  timestamp,
  isCurrentUser,
  getUserColor,
  getInitial
}) => {
  return (
    <Layer>
      <Tile 
        className={`chat-message ${isCurrentUser ? 'chat-message-mine' : 'chat-message-others'}`}
        light
      >
        <div className="chat-message-header">
          {!isCurrentUser && (
            <div 
              className="chat-avatar" 
              style={{ backgroundColor: getUserColor(sender) }}
              aria-label={`${sender} avatarı`}
            >
              {getInitial(sender)}
            </div>
          )}
          <div className="chat-message-sender">
            {isCurrentUser ? (
              <Tag type="blue" size="sm">Siz</Tag>
            ) : (
              <Tag type="high-contrast" size="sm">{sender}</Tag>
            )}
          </div>
          <div className="chat-message-timestamp">
            {new Date(timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="chat-message-text">
          {text}
        </div>
      </Tile>
    </Layer>
  );
};

export default ChatMessage; 