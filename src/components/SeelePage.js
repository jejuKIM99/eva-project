import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import seeleLogoImage from '../img/seele.png';
import unitMassImage from '../img/unitMass.png';
import KeelLorenzProfile from '../img/KeelLorenz_profile.jpg';
import clickSound from '../video/click.wav';

// Individual Member dialogs for manual clicks
const MEMBER_DATA = {
  1: { name: "SEELE 01", role: "Keel Lorenz (Chairman)", text: "Humanity must be unified into a single soul. The Human Instrumentality Project is the ultimate correction of our flawed existence." },
  2: { name: "SEELE 02", role: "Representative (Germany)", text: "Commander Gendo Ikari's actions are highly suspect. He operates under the guise of our orders, yet builds his own temple." },
  3: { name: "SEELE 03", role: "Representative (France)", text: "The Spear of Longinus is lost in lunar orbit. However, replica units are ready to enforce our wills." },
  4: { name: "SEELE 04", role: "Representative (USA)", text: "The budget and resources expended on the defensive grids are irrelevant. All must return to the primordial soup." },
  5: { name: "SEELE 05", role: "Representative (UK)", text: "Lilith remains crucified in the Terminal Dogma. Gendo is preparing the Lilith-scion for his own ambitions." },
  6: { name: "SEELE 06", role: "Representative (Russia)", text: "We must proceed with the backup plan. Shinji Ikari is too unstable to hold the key to the future." },
  7: { name: "SEELE 07", role: "Representative (China)", text: "The dummy plug installation on the Mass Production units is complete. They require no human will to launch." },
  8: { name: "SEELE 08", role: "Representative (Japan)", text: "The Dead Sea Scrolls are the absolute blueprint. Not a single deviation can be tolerated." },
  9: { name: "SEELE 09", role: "Representative (Geneva)", text: "The destruction of the remaining Angels is merely a formality before our true genesis." },
  10: { name: "SEELE 10", role: "Representative (Canada)", text: "Our physical vessels are brittle and temporary. The gestalt consciousness is the only salvation." },
  11: { name: "SEELE 11", role: "Representative (Australia)", text: "Unit-01 has absorbed the S² Engine. It is now a god. Gendo must not take control of it." },
  12: { name: "SEELE 12", role: "Representative (Italy)", text: "God is in his heaven, and all is right with the world. Let the Instrumentality begin." }
};

// Staggered debate script simulating a secret meeting
const DEBATE_SCRIPT = [
  { memberId: 1, text: "The covenant has been broken. Gendo Ikari is pursuing his own agenda." },
  { memberId: 2, text: "He uses Unit-01 as his personal tool. Gendo is attempting deification." },
  { memberId: 6, text: "Germany and the regional bases report complete synchronization on dummy plug calibrations." },
  { memberId: 3, text: "The Spear of Longinus has been lost to the lunar orbit. A minor inconvenience." },
  { memberId: 5, text: "Lilith's resurrection is delayed, but we have the Mass Production scions." },
  { memberId: 7, text: "Nine Mass Production units equipped with S² Engines are fully operational." },
  { memberId: 11, text: "They will form the Tree of Life and initiate the global Anti-A.T. Field." },
  { memberId: 12, text: "Humanity will return to its origin, dissolving all walls between minds." },
  { memberId: 1, text: "All is proceeding in accordance with the Dead Sea Scrolls. Prepare the chamber." }
];

// Custom component to render animated sound waveform bars
const MemberWaveform = ({ isActive }) => {
  const [bars, setBars] = useState(Array(15).fill(4));

  useEffect(() => {
    if (!isActive) {
      setBars(Array(15).fill(4));
      return;
    }
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.floor(5 + Math.random() * 45)));
    }, 70);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="seele-waveform">
      {bars.map((height, idx) => (
        <div 
          key={idx} 
          className="seele-wave-bar" 
          style={{ 
            height: `${height}px`,
            transition: 'height 0.08s ease-in-out'
          }}
        />
      ))}
    </div>
  );
};

// Typewriter script effect with keyboard tick click sounds
const Typewriter = ({ text, onComplete, playBeep }) => {
  const [displayedText, setDisplayedText] = useState('');
  const playBeepRef = useRef(playBeep);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    playBeepRef.current = playBeep;
  }, [playBeep]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayedText('');
    if (!text) return;
    
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, index + 1));
      if (index % 3 === 0 && playBeepRef.current) {
        playBeepRef.current();
      }
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, 25);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

const SeelePage = ({ onBack, triggerEntrance }) => {
  const [activeMember, setActiveMember] = useState(null);
  const [isDebating, setIsDebating] = useState(false);
  const [debateIndex, setDebateIndex] = useState(0);
  const [debateText, setDebateText] = useState('');
  
  const [activeGui, setActiveGui] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const pageRef = useRef(null);
  const mainWrapperRef = useRef(null);
  const clickAudio = useMemo(() => new Audio(clickSound), []);

  const playBeep = useCallback(() => {
    clickAudio.currentTime = 0;
    clickAudio.volume = 0.25;
    clickAudio.play().catch(() => {});
  }, [clickAudio]);

  useEffect(() => {
    const gsap = window.gsap;
    if (triggerEntrance && pageRef.current) {
      gsap.fromTo(pageRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 });
    } else if (pageRef.current) {
      gsap.set(pageRef.current, { autoAlpha: 0 });
    }
  }, [triggerEntrance]);

  // Handle manual monolith selection
  const handleMonolithClick = (id) => {
    if (isDebating) return;
    playBeep();
    setActiveMember(id);
  };

  // Trigger automated assembly debate sequence
  const startDebate = () => {
    if (isDebating) return;
    playBeep();
    setIsDebating(true);
    setDebateIndex(0);
    setActiveMember(null);
  };

  useEffect(() => {
    if (!isDebating) return;
    if (debateIndex >= DEBATE_SCRIPT.length) {
      setTimeout(() => {
        setIsDebating(false);
        setDebateText('');
        setActiveMember(null);
      }, 2000);
      return;
    }

    const currentLine = DEBATE_SCRIPT[debateIndex];
    setActiveMember(currentLine.memberId);
    setDebateText(currentLine.text);
  }, [isDebating, debateIndex]);

  const handleLineComplete = useCallback(() => {
    setTimeout(() => {
      setDebateIndex(prev => prev + 1);
    }, 1500);
  }, []);

  const openGui = (guiType) => {
    setIsClosing(false);
    setActiveGui(guiType);
  };

  const closeGui = () => {
    setIsClosing(true);
    setTimeout(() => {
      setActiveGui(null);
      setIsClosing(false);
    }, 500);
  };

  // Monolith card rendering helper
  const renderMonolithCard = (id) => {
    const isSpeaking = activeMember === id;
    const isActive = activeMember === id || (!isDebating && activeMember === null);
    
    return (
      <div 
        key={id}
        className={`seele-monolith-card ${isActive ? 'active' : ''} ${isSpeaking ? 'speaking' : ''}`}
        onClick={() => handleMonolithClick(id)}
      >
        <div className="card-header">SEELE</div>
        <div className="card-number">{id < 10 ? `0${id}` : id}</div>
        <div className={`card-status ${isSpeaking ? 'speaking' : ''}`}>
          SOUND ONLY
        </div>
      </div>
    );
  };

  return (
    <div className="seele-page-layout" ref={pageRef}>
      <div ref={mainWrapperRef} className={`seele-content-wrapper ${activeGui ? 'blurred' : ''}`}>
        <button className="back-button" onClick={onBack}>← MENU</button>
        
        <img src={seeleLogoImage} alt="Seele Logo" className="seele-logo-small" />
        
        <div className="seele-assembly-container">
          {/* Left Column Monoliths 01 - 06 */}
          <div className="seele-monoliths-column">
            {[1, 2, 3, 4, 5, 6].map(renderMonolithCard)}
          </div>
          
          {/* Central Console Terminal */}
          <div className="seele-center-console border-decor">
            <div className="seele-console-header">
              <span className="seele-console-title">// COUNCIL_COMMUNICATION_UNIT</span>
              <span className="seele-console-status">
                {isDebating ? "DEBATE_MODE: ACTIVE" : activeMember ? `LINE_${activeMember}_CONNECTED` : "STANDBY"}
              </span>
            </div>
            
            <div className="seele-console-main">
              {activeMember === null && !isDebating ? (
                <div className="seele-console-standby">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" strokeDasharray="4,4" />
                    <polygon points="12 8 12 12 14 14" />
                  </svg>
                  <div>SEELE CONFERENCE CHAMBER</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '8px' }}>
                    SELECT MONOLITH TO BEGIN TRANSMISSION OR ACTIVATE ASSEMBLY DEBATE
                  </div>
                </div>
              ) : (
                <div className="seele-console-active">
                  <div>
                    <div className="seele-member-title">
                      {isDebating ? `SEELE 0${activeMember}` : MEMBER_DATA[activeMember]?.name}
                    </div>
                    <div className="seele-member-role">
                      {isDebating ? "Council Member" : MEMBER_DATA[activeMember]?.role}
                    </div>
                  </div>
                  
                  <div className="seele-waveform-wrapper">
                    <MemberWaveform isActive={true} />
                  </div>
                  
                  <div className="seele-transmission-text">
                    {isDebating ? (
                      <Typewriter 
                        text={debateText} 
                        key={debateText} 
                        onComplete={handleLineComplete} 
                        playBeep={playBeep}
                      />
                    ) : (
                      <Typewriter 
                        text={MEMBER_DATA[activeMember]?.text} 
                        key={activeMember} 
                        playBeep={playBeep}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="seele-action-panel">
              {activeMember === 1 && !isDebating ? (
                <button className="seele-dossier-btn" onClick={() => openGui('keel')}>
                  ACCESS CHAIRMAN DOSSIER
                </button>
              ) : !isDebating ? (
                <button className="seele-dossier-btn" onClick={() => openGui('mpEva')}>
                  SPECIFICATIONS: MP-EVA
                </button>
              ) : <div />}
              
              <button 
                className="seele-debate-btn" 
                onClick={startDebate} 
                disabled={isDebating}
              >
                {isDebating ? "DEBATING..." : "COMMENCE ASSEMBLY"}
              </button>
            </div>
            
            <div className="seele-tactical-bracket-mini top-left-bracket"></div>
            <div className="seele-tactical-bracket-mini top-right-bracket"></div>
            <div className="seele-tactical-bracket-mini bottom-left-bracket"></div>
            <div className="seele-tactical-bracket-mini bottom-right-bracket"></div>
          </div>
          
          {/* Right Column Monoliths 07 - 12 */}
          <div className="seele-monoliths-column">
            {[7, 8, 9, 10, 11, 12].map(renderMonolithCard)}
          </div>
        </div>
      </div>

      {/* --- Keel Lorenz dossier modal overlay --- */}
      {activeGui === 'keel' && (
        <div className={`seele-gui-overlay ${isClosing ? 'closing' : ''}`}>
          <div className="keel-gui-container">
            <div className="gui-header keel-header">
              <span>MEMBER PROFILE: 01</span>
              <button onClick={closeGui} className="gui-close-btn">×</button>
            </div>
            <div className="gui-content-grid">
              <div className="gui-left-panel">
                <div className="profile-image-container" style={{ '--profile-image-url': `url(${KeelLorenzProfile})` }}>
                  <img src={KeelLorenzProfile} alt="Keel Lorenz" />
                  <div className="scan-line"></div>
                </div>
                <div className="data-block">
                  <div className="data-title">IDENTIFICATION</div>
                  <p><strong>NAME:</strong> LORENZ, KEEL</p>
                  <p><strong>AFFILIATION:</strong> SEELE (CHAIRMAN)</p>
                  <p><strong>STATUS:</strong> <span className="text-red">ACTIVE</span></p>
                </div>
              </div>
              <div className="gui-right-panel">
                <div className="data-block">
                  <div className="data-title">BIOGRAPHICAL DATA</div>
                  <p className="description-text">
                    Keel Lorenz is the enigmatic chairman of Seele and the main orchestrator behind the Human Instrumentality Project. Often appearing only as a monolith labeled "SEELE 01," he manipulates global events from the shadows, seeking to guide mankind into artificial evolution.
                  </p>
                </div>
                <div className="data-block">
                  <div className="data-title">VOICE ANALYSIS</div>
                  <div className="waveform-container">
                    <div className="waveform"><div className="waveform-visual"></div></div>
                    <div className="waveform"><div className="waveform-visual"></div></div>
                    <div className="waveform"><div className="waveform-visual"></div></div>
                  </div>
                  <div className="analysis-footer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Mass Production Eva Specifications modal overlay --- */}
      {activeGui === 'mpEva' && (
        <div className={`seele-gui-overlay ${isClosing ? 'closing' : ''}`}>
          <div className="mpeva-gui-container">
            <div className="gui-header mpeva-header">
              <span>UNIT ANALYSIS: MP-EVA SERIES</span>
              <button onClick={closeGui} className="gui-close-btn">×</button>
            </div>
            <div className="gui-content-grid mpeva-grid">
              <div className="gui-left-panel">
                <div className="unit-image-container">
                  <img src={unitMassImage} alt="Mass Production Evangelion"/>
                </div>
                <div className="data-block status-grid">
                  <div><span className="data-label">S² ENGINE:</span> <span className="text-green">ACTIVE</span></div>
                  <div><span className="data-label">DUMMY PLUG:</span> <span className="text-green">SYNCHED</span></div>
                  <div><span className="data-label">A.T. FIELD:</span> <span className="text-orange">FLUCTUATING</span></div>
                  <div><span className="data-label">POWER:</span> <span className="text-green">INTERNAL</span></div>
                </div>
              </div>
              <div className="gui-right-panel">
                <div className="data-block">
                  <div className="data-title">WEAPONRY & FEATURES</div>
                  <p className="description-text">
                    The final series of Evangelions produced by Seele. Equipped with S² Engines that provide limitless power, they wield giant double-edged wings and weapons modeled after the Lance of Longinus. Controlled by the Dummy Plug system (Kaoru Nagisa template), they operate in complete unison.
                  </p>
                </div>
                <div className="data-block">
                  <div className="data-title">BIOMETRIC DATA</div>
                  <div className="biograph-container">
                    <div className="bioline"></div>
                    <span className="graph-label top">SYNC RATIO</span>
                    <span className="graph-label bottom">BEAST MODE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeelePage;