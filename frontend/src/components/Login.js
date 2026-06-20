import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const { login } = useAuth();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({length: 120}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      r: Math.random() * 2.5 + 0.5,
      color: `hsl(${Math.random() * 60 + 220}, 100%, 70%)`
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(5,5,20,0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fill();

        particles.forEach((p2, j) => {
          if (j <= i) return;
          const dx = p.x - p2.x, dy = p.y - p2.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(100,120,255,${1 - dist/120})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isRegister
        ? 'https://chat-app-backend-owjq.onrender.com/api/auth/register'
        : 'https://chat-app-backend-owjq.onrender.com/api/auth/login';
      const { data } = await axios.post(url, form);
      login(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', background:'#05051a', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(50px)} to{opacity:1;transform:translateY(0)} }
        @keyframes neonPulse { 0%,100%{box-shadow:0 0 20px rgba(102,126,234,0.4),0 0 40px rgba(102,126,234,0.2)} 50%{box-shadow:0 0 40px rgba(102,126,234,0.8),0 0 80px rgba(102,126,234,0.4)} }
        @keyframes borderGlow { 0%,100%{border-color:rgba(102,126,234,0.3)} 50%{border-color:rgba(102,126,234,0.8)} }
        .login-card { animation: fadeInUp 0.8s ease forwards, borderGlow 3s infinite; }
        .neon-btn { animation: neonPulse 2s infinite; transition: all 0.3s !important; }
        .neon-btn:hover { transform: translateY(-4px) scale(1.02) !important; }
        .neon-input { transition: all 0.3s !important; }
        .neon-input:focus { border-color: #667eea !important; box-shadow: 0 0 25px rgba(102,126,234,0.4), inset 0 0 15px rgba(102,126,234,0.05) !important; }
        input::placeholder { color: rgba(255,255,255,0.2) !important; }
        .tab-active { animation: neonPulse 2s infinite; }
      `}</style>

      <canvas ref={canvasRef} style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', zIndex:0 }} />

      <div className="login-card" style={{
        background:'rgba(10,10,30,0.85)',
        backdropFilter:'blur(40px)',
        padding:'52px 48px',
        borderRadius:32,
        width:420,
        border:'1px solid rgba(102,126,234,0.3)',
        boxShadow:'0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
        position:'relative',
        zIndex:1
      }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ fontSize:56, display:'inline-block', animation:'float 3s infinite', filter:'drop-shadow(0 0 20px rgba(102,126,234,0.8))' }}>💬</div>
          <h1 style={{ color:'#fff', fontSize:30, fontWeight:900, margin:'12px 0 6px', letterSpacing:'-1px' }}>
            Chat<span style={{ background:'linear-gradient(135deg,#667eea,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>App</span>
          </h1>
          <p style={{ color:'rgba(102,126,234,0.7)', fontSize:11, letterSpacing:'3px', textTransform:'uppercase' }}>Real-Time • Secure • Roles</p>
        </div>

        <div style={{ display:'flex', background:'rgba(102,126,234,0.05)', borderRadius:16, padding:5, marginBottom:32, border:'1px solid rgba(102,126,234,0.15)' }}>
          {['Login','Register'].map((tab,i) => (
            <button key={tab} onClick={() => setIsRegister(i===1)}
              className={(i===1)===isRegister ? 'tab-active' : ''}
              style={{ flex:1, padding:'12px', border:'none', borderRadius:12, cursor:'pointer', fontWeight:800, fontSize:13, letterSpacing:'1px', transition:'all 0.3s',
                background:(i===1)===isRegister ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'transparent',
                color:(i===1)===isRegister ? '#fff' : 'rgba(255,255,255,0.3)' }}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div style={{ marginBottom:20 }}>
              <label style={{ color:'rgba(102,126,234,0.8)', fontSize:11, marginBottom:8, display:'block', letterSpacing:'2px' }}>USERNAME</label>
              <input className="neon-input" placeholder="Choose a username"
                onChange={e => setForm({...form, username:e.target.value})}
                style={{ width:'100%', padding:'15px 18px', borderRadius:14, border:'1.5px solid rgba(102,126,234,0.2)', background:'rgba(102,126,234,0.05)', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            </div>
          )}
          <div style={{ marginBottom:20 }}>
            <label style={{ color:'rgba(102,126,234,0.8)', fontSize:11, marginBottom:8, display:'block', letterSpacing:'2px' }}>EMAIL</label>
            <input className="neon-input" type="email" placeholder="Enter your email"
              onChange={e => setForm({...form, email:e.target.value})}
              style={{ width:'100%', padding:'15px 18px', borderRadius:14, border:'1.5px solid rgba(102,126,234,0.2)', background:'rgba(102,126,234,0.05)', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box' }} />
          </div>
          <div style={{ marginBottom:32 }}>
            <label style={{ color:'rgba(102,126,234,0.8)', fontSize:11, marginBottom:8, display:'block', letterSpacing:'2px' }}>PASSWORD</label>
            <input className="neon-input" type="password" placeholder="Enter your password"
              onChange={e => setForm({...form, password:e.target.value})}
              style={{ width:'100%', padding:'15px 18px', borderRadius:14, border:'1.5px solid rgba(102,126,234,0.2)', background:'rgba(102,126,234,0.05)', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box' }} />
          </div>
          <button className="neon-btn" type="submit"
            style={{ width:'100%', padding:'16px', background:'linear-gradient(135deg,#667eea,#764ba2)', color:'#fff', border:'none', borderRadius:16, fontSize:16, fontWeight:800, cursor:'pointer', letterSpacing:'1px', textTransform:'uppercase' }}>
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop:28, textAlign:'center', color:'rgba(102,126,234,0.4)', fontSize:11, letterSpacing:'2px' }}>
          SECURE ENCRYPTED REAL-TIME
        </div>
      </div>
    </div>
  );
};

export default Login;
