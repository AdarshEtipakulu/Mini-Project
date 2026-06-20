import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [room, setRoom] = useState('general');
  const [typing, setTyping] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const getRoleColor = (role) => {
    if (role === 'admin') return '#E24B4A';
    if (role === 'moderator') return '#EF9F27';
    return '#4CAF50';
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  useEffect(() => {
    socketRef.current = io('https://chat-app-backend-owjq.onrender.com', {
      auth: { token: user.token }
    });
    const socket = socketRef.current;
    socket.emit('join_room', room);
    socket.on('message_history', (msgs) => setMessages(msgs));
    socket.on('receive_message', (msg) => setMessages(prev => [...prev, msg]));
    socket.on('message_deleted', ({ messageId }) => setMessages(prev => prev.filter(m => m._id !== messageId)));
    socket.on('user_typing', ({ username }) => {
      setTyping(`${username} is typing...`);
      setTimeout(() => setTyping(''), 2000);
    });
    socket.on('online_users', (users) => setOnlineUsers(users));
    return () => socket.disconnect();
  }, [room, user.token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    socketRef.current.emit('send_message', { content: newMsg, room });
    setNewMsg('');
  };

  const deleteMessage = (messageId) => {
    socketRef.current.emit('delete_message', messageId);
  };

  const handleTyping = (e) => {
    setNewMsg(e.target.value);
    socketRef.current.emit('typing', room);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Left Sidebar */}
      <div style={{ width: 220, background: 'rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', padding: 16 }}>
        
        {/* User Info */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: getRoleColor(user.role), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 8 }}>
            {user.username?.[0]?.toUpperCase()}
          </div>
          <div style={{ color: '#fff', fontWeight: 'bold' }}>{user.username}</div>
          <span style={{ padding: '2px 8px', borderRadius: 10, background: getRoleColor(user.role), color: '#fff', fontSize: 11 }}>
            {user.role?.toUpperCase()}
          </span>
        </div>

        {/* Rooms */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 8, textTransform: 'uppercase' }}>Channels</div>
          {['general', 'tech', 'random'].map(r => (
            <div key={r} onClick={() => setRoom(r)}
              style={{ padding: '8px 12px', borderRadius: 8, marginBottom: 4, cursor: 'pointer', background: room === r ? 'rgba(255,255,255,0.2)' : 'transparent', color: room === r ? '#fff' : 'rgba(255,255,255,0.6)' }}>
              # {r}
            </div>
          ))}
        </div>

        {/* Online Users */}
        <div style={{ flex: 1 }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 8, textTransform: 'uppercase' }}>
            Online ({onlineUsers.length})
          </div>
          {onlineUsers.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>• {user.username}</div>
          ) : (
            onlineUsers.map((u, i) => (
              <div key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: '#4CAF50' }}>• </span>{u}
              </div>
            ))
          )}
        </div>

        {/* Admin/Moderator Panel Button */}
        {(user.role === 'admin' || user.role === 'moderator') && (
          <button onClick={() => setShowAdmin(!showAdmin)}
            style={{ padding: '8px', background: getRoleColor(user.role), color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', marginBottom: 8 }}>
            {user.role === 'admin' ? '⚙️ Admin Panel' : '🛡️ Mod Panel'}
          </button>
        )}

        <button onClick={logout}
          style={{ padding: '8px', background: 'rgba(226,75,74,0.3)', color: '#E24B4A', border: '1px solid #E24B4A', borderRadius: 8, cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {/* Main Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
          <strong># {room}</strong>
          <span style={{ marginLeft: 12, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Real-Time Chat</span>
        </div>

        {/* Admin/Moderator Dashboard */}
        {showAdmin && (
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: 8 }}>
              {user.role === 'admin' ? '⚙️ Admin Dashboard' : '🛡️ Moderator Dashboard'}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {user.role === 'admin' && (
                <>
                  <div style={{ background: 'rgba(226,75,74,0.2)', border: '1px solid #E24B4A', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 12 }}>
                    🗑️ Delete Messages
                  </div>
                  <div style={{ background: 'rgba(226,75,74,0.2)', border: '1px solid #E24B4A', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 12 }}>
                    👥 Manage Users
                  </div>
                  <div style={{ background: 'rgba(226,75,74,0.2)', border: '1px solid #E24B4A', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 12 }}>
                    🚫 Ban Users
                  </div>
                </>
              )}
              {(user.role === 'admin' || user.role === 'moderator') && (
                <div style={{ background: 'rgba(239,159,39,0.2)', border: '1px solid #EF9F27', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 12 }}>
                  🧹 Remove Spam
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {messages.map((msg) => {
            const isMe = msg.sender?.username === user.username;
            return (
              <div key={msg._id} style={{ marginBottom: 16, display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8 }}>
                
                {/* Avatar */}
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: getRoleColor(msg.sender?.role), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: 14, flexShrink: 0 }}>
                  {msg.sender?.username?.[0]?.toUpperCase()}
                </div>

                <div style={{ maxWidth: '60%' }}>
                  {/* Name + Role */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexDirection: isMe ? 'row-reverse' : 'row' }}>
                    <span style={{ color: getRoleColor(msg.sender?.role), fontSize: 12, fontWeight: 'bold' }}>
                      {msg.sender?.username}
                    </span>
                    <span style={{ padding: '1px 6px', borderRadius: 8, background: getRoleColor(msg.sender?.role), color: '#fff', fontSize: 10 }}>
                      {msg.sender?.role}
                    </span>
                  </div>

                  {/* Bubble */}
                  <div style={{ background: isMe ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', color: '#fff', fontSize: 14, lineHeight: 1.5 }}>
                    {msg.content}
                  </div>

                  {/* Time + Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexDirection: isMe ? 'row-reverse' : 'row' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>
                      {formatTime(msg.createdAt)}
                    </span>
                    {(user.role === 'admin' || user.role === 'moderator') && (
                      <button onClick={() => deleteMessage(msg._id)}
                        style={{ padding: '2px 6px', background: 'rgba(226,75,74,0.3)', color: '#E24B4A', border: '1px solid #E24B4A', borderRadius: 4, cursor: 'pointer', fontSize: 10 }}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {typing && <div style={{ padding: '0 20px 8px', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{typing}</div>}

        {/* Input */}
        <div style={{ padding: 16, background: 'rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 10 }}>
          <input value={newMsg} onChange={handleTyping}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder={`Message #${room}...`}
            style={{ flex: 1, padding: '12px 16px', borderRadius: 25, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none' }}
          />
          <button onClick={sendMessage}
            style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: 25, cursor: 'pointer', fontWeight: 'bold' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;