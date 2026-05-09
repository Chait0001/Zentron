import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';

type ChatMessageProps = {
  role: 'user' | 'assistant';
  content: string;
  userName?: string;
  isTyping?: boolean;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, userName, isTyping }) => {
  const isUser = role === 'user';
  
  const userInitials = userName 
    ? (userName.split(' ').length > 1 ? userName.charAt(0) + userName.split(' ')[1].charAt(0) : userName.charAt(0)).toUpperCase() 
    : 'U';

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      flexDirection: isUser ? 'row-reverse' : 'row',
      animation: 'slideUp 0.3s ease-out forwards',
      opacity: 0,
      transform: 'translateY(10px)'
    }}>
      <style>{`
        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceDelay {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        .typing-dot {
          width: 6px;
          height: 6px;
          background-color: #4af0ff;
          border-radius: 50%;
          animation: bounceDelay 1.4s infinite ease-in-out both;
        }
        .dot-1 { animation-delay: -0.32s; }
        .dot-2 { animation-delay: -0.16s; }
        .dot-3 { animation-delay: 0s; }

        .markdown-body pre { background: rgba(0,0,0,0.3) !important; border-radius: 8px; padding: 12px; }
        .markdown-body code { font-family: 'Space Grotesk', monospace; font-size: 13px; }
        .markdown-body p { margin: 0 0 10px 0; }
        .markdown-body p:last-child { margin: 0; }
      `}</style>

      {/* Avatar */}
      <div style={{
        width: '36px',
        height: '36px',
        flexShrink: 0,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
        background: isUser ? '#1e3a5f' : 'linear-gradient(135deg, #0088cc, #4af0ff)',
        color: '#fff',
        border: isUser ? '1px solid rgba(255,255,255,0.1)' : 'none',
        boxShadow: isUser ? 'none' : '0 0 10px rgba(74,240,255,0.3)',
      }}>
        {isUser ? userInitials : 'Z'}
      </div>

      {/* Message Bubble */}
      <div style={{
        maxWidth: '80%',
        padding: '12px 18px',
        borderRadius: '16px',
        borderTopRightRadius: isUser ? '4px' : '16px',
        borderTopLeftRadius: !isUser ? '4px' : '16px',
        background: isUser ? 'rgba(255,255,255,0.08)' : 'rgba(74,240,255,0.06)',
        border: isUser ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(74,240,255,0.2)',
        color: isUser ? '#fff' : '#e8f4ff',
        fontSize: '15px',
        lineHeight: '1.6',
        fontFamily: "'Nunito', sans-serif"
      }}>
        {isTyping ? (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '24px' }}>
            <div className="typing-dot dot-1" />
            <div className="typing-dot dot-2" />
            <div className="typing-dot dot-3" />
          </div>
        ) : (
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
