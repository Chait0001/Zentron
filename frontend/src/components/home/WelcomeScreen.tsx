import React, { useEffect, useState } from 'react';
import { FiCode, FiBookOpen, FiEdit2 } from 'react-icons/fi';
import { FaLightbulb } from 'react-icons/fa';

type WelcomeScreenProps = {
  username: string;
  onChipClick: (text: string) => void;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ username, onChipClick }) => {
  const [showSpeech, setShowSpeech] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpeech(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Generate random stars and particles
  const stars = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    size: Math.random() * 2 + 1,
  }));

  const particles = Array.from({ length: 15 }).map((_, i) => {
    const colors = ['#4af0ff', '#e8f4ff', '#38bdf8'];
    return {
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 4}s`,
      animationDelay: `${Math.random() * 5}s`,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  });

  const chips = [
    { text: 'Write code', icon: <FiCode size={16} /> },
    { text: 'Brainstorm ideas', icon: <FaLightbulb size={16} /> },
    { text: 'Explain concepts', icon: <FiBookOpen size={16} /> },
    { text: 'Improve writing', icon: <FiEdit2 size={16} /> },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes blink {
          0%, 4%, 100% { transform: scaleY(1); }
          2% { transform: scaleY(0.04); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(16deg); }
        }
        @keyframes bob {
          0%, 100% { transform: rotate(5deg); }
          50% { transform: rotate(-7deg); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; filter: drop-shadow(0 0 8px #4af0ff); }
        }
        @keyframes bandshine {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.4); }
        }
        @keyframes shadow {
          0%, 100% { transform: scaleX(1); opacity: 0.3; }
          50% { transform: scaleX(0.6); opacity: 0.1; }
        }
        @keyframes stripe {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.65; }
        }
        @keyframes botblink {
          0%, 100% { fill: #0088cc; }
          50% { fill: #4af0ff; filter: drop-shadow(0 0 5px #4af0ff); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.8; }
        }
        @keyframes floatUp {
          0% { transform: translateY(100vh) scale(0.8); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-10vh) scale(1.2); opacity: 0; }
        }
        .robot-body { animation: float 3.2s infinite ease-in-out; transform-origin: center; }
        .robot-eyes { animation: blink 4.5s infinite; transform-origin: center; }
        .robot-arm-l { animation: wave 2.8s infinite ease-in-out; transform-origin: 80px 100px; }
        .robot-arm-r { animation: bob 2.8s infinite ease-in-out; transform-origin: 120px 100px; }
        .robot-bulb { animation: glow 1.8s infinite ease-in-out; }
        .robot-band { animation: bandshine 2s infinite ease-in-out; }
        .robot-stripe { animation: stripe 3s infinite ease-in-out; }
        .robot-dome-light { animation: botblink 1.6s infinite ease-in-out; }
        .robot-shadow { animation: shadow 3.2s infinite ease-in-out; transform-origin: center; }
        
        .chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid rgba(74,240,255,0.25);
          background: rgba(255,255,255,0.04);
          color: #e8f4ff;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .chip:hover {
          background: rgba(74,240,255,0.1);
          border-color: rgba(74,240,255,0.6);
          box-shadow: 0 0 12px rgba(74,240,255,0.2);
          transform: translateY(-2px);
        }
        .speech-bubble {
          position: absolute;
          top: -60px;
          background: #e8f4ff;
          color: #07101f;
          padding: 10px 16px;
          border-radius: 20px;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 14px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          opacity: 1;
          transform: translateY(0) scale(1);
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 10;
        }
        .speech-bubble.hidden {
          opacity: 0;
          transform: translateY(10px) scale(0.9);
          pointer-events: none;
        }
        .speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 8px 8px 0;
          border-style: solid;
          border-color: #e8f4ff transparent transparent transparent;
        }
      `}</style>

      {/* Stars Background */}
      {stars.map((star) => (
        <div key={`star-${star.id}`} style={{
          position: 'absolute',
          left: star.left,
          top: star.top,
          width: star.size,
          height: star.size,
          backgroundColor: '#fff',
          borderRadius: '50%',
          animation: `twinkle 2s infinite alternate`,
          animationDelay: star.animationDelay,
          opacity: 0.1
        }} />
      ))}

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div key={`particle-${particle.id}`} style={{
          position: 'absolute',
          left: particle.left,
          bottom: '-20px',
          width: particle.size,
          height: particle.size,
          backgroundColor: particle.color,
          borderRadius: '50%',
          animation: `floatUp ${particle.animationDuration} infinite linear`,
          animationDelay: particle.animationDelay,
          opacity: 0,
          boxShadow: `0 0 6px ${particle.color}`
        }} />
      ))}

      {/* Robot Container */}
      <div style={{ position: 'relative', width: 200, height: 220, display: 'flex', justifyContent: 'center' }}>
        
        <div className={`speech-bubble ${!showSpeech ? 'hidden' : ''}`}>
          Hi! I'm Zentron 👋
        </div>

        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible', zIndex: 2 }}>
          {/* Shadow */}
          <ellipse cx="100" cy="180" rx="40" ry="10" fill="rgba(0,0,0,0.5)" className="robot-shadow" />
          
          {/* Group for the entire floating robot */}
          <g className="robot-body">
            {/* Left Arm (with lightbulb) */}
            <g className="robot-arm-l">
              <path d="M 70 110 Q 40 120 50 140" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" />
              <path d="M 70 110 Q 40 120 50 140" fill="none" stroke="#0088cc" strokeWidth="6" strokeLinecap="round" />
              {/* Hand/Claw */}
              <circle cx="50" cy="140" r="8" fill="#4af0ff" />
              {/* Lightbulb */}
              <g className="robot-bulb">
                <path d="M 50 135 L 50 125" stroke="#fff" strokeWidth="2" />
                <ellipse cx="50" cy="115" rx="12" ry="16" fill="rgba(74,240,255,0.8)" stroke="#fff" strokeWidth="1" />
                <path d="M 45 115 Q 50 105 55 115" fill="none" stroke="#fff" strokeWidth="1" />
              </g>
            </g>

            {/* Right Arm */}
            <g className="robot-arm-r">
              <path d="M 130 110 Q 160 120 150 150" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" />
              <path d="M 130 110 Q 160 120 150 150" fill="none" stroke="#0088cc" strokeWidth="6" strokeLinecap="round" />
              {/* Claw */}
              <path d="M 145 150 A 8 8 0 0 0 155 150" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
            </g>

            {/* Bottom Dome / Jets */}
            <path d="M 80 150 Q 100 170 120 150 Z" fill="#0d1a2e" stroke="#4af0ff" strokeWidth="2" />
            <circle cx="100" cy="158" r="4" className="robot-dome-light" />

            {/* Main Body */}
            <rect x="65" y="90" width="70" height="60" rx="20" fill="#e8f4ff" />
            {/* Chest Stripe */}
            <rect x="75" y="115" width="50" height="8" rx="4" fill="#0088cc" className="robot-stripe" />
            <circle cx="100" cy="135" r="5" fill="#4af0ff" />

            {/* Head */}
            <rect x="60" y="40" width="80" height="55" rx="25" fill="#fff" />
            
            {/* Headband / Visor top */}
            <path d="M 60 65 Q 100 55 140 65 L 138 55 Q 100 45 62 55 Z" fill="#0088cc" className="robot-band" />

            {/* Ear Pieces */}
            <rect x="52" y="60" width="8" height="20" rx="4" fill="#fff" stroke="#0088cc" strokeWidth="2" />
            <rect x="140" y="60" width="8" height="20" rx="4" fill="#fff" stroke="#0088cc" strokeWidth="2" />

            {/* Face Screen */}
            <rect x="68" y="52" width="64" height="35" rx="12" fill="#07101f" />
            
            {/* Eyes */}
            <g className="robot-eyes">
              {/* Left Eye */}
              <path d="M 82 72 Q 88 65 94 72" fill="none" stroke="#4af0ff" strokeWidth="4" strokeLinecap="round" />
              {/* Right Eye */}
              <path d="M 106 72 Q 112 65 118 72" fill="none" stroke="#4af0ff" strokeWidth="4" strokeLinecap="round" />
            </g>
          </g>
        </svg>
      </div>

      {/* Welcome Text */}
      <div style={{ textAlign: 'center', marginTop: 10, zIndex: 2 }}>
        <h2 style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 24, color: '#fff', margin: '0 0 8px 0' }}>
          Welcome back, {username}!
        </h2>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: '#4af0ff', margin: 0, opacity: 0.8 }}>
          What shall we build today?
        </p>
      </div>

      {/* Suggestion Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 30, maxWidth: 500, zIndex: 2 }}>
        {chips.map((chip, i) => (
          <button key={i} className="chip" onClick={() => onChipClick(chip.text)}>
            {chip.icon}
            {chip.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;
