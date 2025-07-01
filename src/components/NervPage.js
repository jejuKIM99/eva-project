import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

// 이미지 import
import gendoImage from '../img/gendo.png';
import nervLogo from '../img/nervLogo.png';
import gendoProfile from '../img/gendo_profile.jpg';
import fuyutsukiProfile from '../img/fuyutsuki.jpg';
import misatoProfile from '../img/misato_profile.jpg';
import ritsukoProfile from '../img/ritsuko_profile.jpg';
import mayaProfile from '../img/maya_profile.jpg';
import kajiProfile from '../img/kaji_profile.jpg';
import makotoProfile from '../img/makoto_profile.jpg';
import shigeruProfile from '../img/shigeru_profile.jpg';
import hipImage from '../img/Human_Instrumentality_Project.jpg'; // 인류보완계획 이미지
import worldMapImage from '../img/world_map_eva.jpg'; // 월드맵 이미지

// --- 화면 크기 감지 커스텀 훅 ---
const useWindowSize = () => {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return width;
};

// --- 데이터 ---
const personnelData = {
    gendo: { name: "Gendo Ikari", title: "Commander", image: gendoProfile, stats: { 'Loyalty (SEELE)': 25, 'Decision Making': 98, 'Ruthlessness': 99, 'Paternal Instinct': 5 } },
    fuyutsuki: { name: "Kozo Fuyutsuki", title: "Sub-Commander", image: fuyutsukiProfile, stats: { 'Loyalty (Gendo)': 95, 'Caution': 90, 'Stress Level': 75, 'Regret': 85 } },
    misato: { name: "Misato Katsuragi", title: "Operations Director", image: misatoProfile, stats: { 'Tactical Ability': 92, 'Emotional Stability': 35, 'Alcohol Intake': 88, 'Responsibility': 95 } },
    ritsuko: { name: "Dr. Ritsuko Akagi", title: "Chief Scientist", image: ritsukoProfile, stats: { 'Intellect': 99, 'Ethical Concerns': 15, 'Cat Affinity': 95, 'Emotional Scars': 90 } },
    maya: { name: "Maya Ibuki", title: "Technician", image: mayaProfile, stats: { 'Technical Skill': 85, 'Moral Fortitude': 80, 'Purity': 97, 'Respect (Ritsuko)': 100 } },
    kaji: { name: "Ryoji Kaji", title: "Special Inspector", image: kajiProfile, stats: { 'Espionage': 94, 'Charisma': 96, 'Allegiance': 10, 'Melon Farming': 80 } },
    makoto: { name: "Makoto Hyuga", title: "1st Lieutenant", image: makotoProfile, stats: { 'Data Analysis': 88, 'Discretion': 70, 'Unrequited Love': 99, 'Overtime Hours': 92 } },
    shigeru: { name: "Shigeru Aoba", title: "1st Lieutenant", image: shigeruProfile, stats: { 'Communication': 85, 'Cynicism': 90, 'Guitar Skill': 78, 'Existential Dread': 85 } },
    top_secret: { name: "TOP SECRET", title: "PROJECT", image: null }, // TOP SECRET 메뉴 항목 추가
};
const nervStructure = {
    command: { title: "Command Staff", members: ['gendo', 'fuyutsuki', 'top_secret'], description: "The central nervous system of NERV, responsible for all high-level strategic decisions and the secret execution of Project Instrumentality." },
    tactical: { title: "Tactical Dept.", members: ['misato'], description: "Directs all combat scenarios involving the Evangelion units. This department lives and dies by seconds and centimeters." },
    technological: { title: "Science & Tech", members: ['ritsuko', 'maya'], description: "The brains of the operation. Manages Evangelion maintenance, MAGI system operations, and Angel autopsies. Ethical boundaries are frequently tested." },
    intelligence: { title: "Intelligence", members: ['kaji'], description: "NERV's eyes and ears, and its secrets' keeper. Operates in the shadows, dealing with espionage, internal threats, and SEELE's meddling." },
    bridge: { title: "Bridge Operations", members: ['makoto', 'shigeru'], description: "The frontline of data warfare. These operators process vast amounts of combat data in real-time from the safety of the Central Dogma." },
};

// --- 컴포넌트 ---

/**
 * [수정] TOP SECRET 문서 열람 창 컴포넌트
 */
const TopSecretWindow = ({ onClose, isMobile }) => {
    const [accessStep, setAccessStep] = useState('warning'); // 'warning', 'authenticating', 'granted'
    const [authInfo, setAuthInfo] = useState({ id: '', pw: '' });
    const [showMapView, setShowMapView] = useState(false);
    const windowRef = useRef(null);
    const gsap = window.gsap;

    const mapContainerRef = useRef(null);
    const mapPanWrapperRef = useRef(null); // [수정] 이미지와 타겟을 감싸는 래퍼의 ref
    const isDragging = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });
    const mapStartPos = useRef({ x: 0, y: 0 });
    const [mapPosition, setMapPosition] = useState({ x: -200, y: -100 }); // 초기 위치 조정

    const authCredentials = [
        { id: 'IKARI_GEND', pw: 'YUI_SOUL_01' }, { id: 'FUYUTSUKI_KZ', pw: 'ADAM_EMBRYO' },
        { id: 'AKAGI_RIT', pw: 'MAGI_CASPER_3' }, { id: 'SEELE_01_KEEL', pw: 'DEAD_SEA_SCROLLS' }
    ];

    useEffect(() => {
        gsap.fromTo(windowRef.current, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
    }, [gsap]);

    const handlePanStart = (e) => {
        e.preventDefault();
        isDragging.current = true;
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        startPos.current = { x: clientX, y: clientY };
        mapStartPos.current = { ...mapPosition };
        if (mapContainerRef.current) mapContainerRef.current.style.cursor = 'grabbing';

        window.addEventListener('mousemove', handlePanMove);
        window.addEventListener('touchmove', handlePanMove);
        window.addEventListener('mouseup', handlePanEnd);
        window.addEventListener('touchend', handlePanEnd);
    };

    const handlePanMove = (e) => {
        if (!isDragging.current) return;
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

        const deltaX = clientX - startPos.current.x;
        const deltaY = clientY - startPos.current.y;
        
        let newX = mapStartPos.current.x + deltaX;
        let newY = mapStartPos.current.y + deltaY;

        if (mapContainerRef.current && mapPanWrapperRef.current) {
            const containerRect = mapContainerRef.current.getBoundingClientRect();
            const wrapperRect = mapPanWrapperRef.current.getBoundingClientRect();
            
            const minX = containerRect.width - wrapperRect.width;
            const minY = containerRect.height - wrapperRect.height;
            
            newX = Math.max(minX, Math.min(0, newX));
            newY = Math.max(minY, Math.min(0, newY));
        }

        setMapPosition({ x: newX, y: newY });
    };

    const handlePanEnd = () => {
        isDragging.current = false;
        if(mapContainerRef.current) mapContainerRef.current.style.cursor = 'grab';

        window.removeEventListener('mousemove', handlePanMove);
        window.removeEventListener('touchmove', handlePanMove);
        window.removeEventListener('mouseup', handlePanEnd);
        window.removeEventListener('touchend', handlePanEnd);
    };


    const handleFingerprintScan = () => {
        setAccessStep('authenticating');
        const randomCredentials = authCredentials[Math.floor(Math.random() * authCredentials.length)];
        
        let idIndex = 0;
        const idInterval = setInterval(() => {
            setAuthInfo(prev => ({ ...prev, id: randomCredentials.id.substring(0, idIndex + 1) }));
            idIndex++;
            if (idIndex > randomCredentials.id.length) clearInterval(idInterval);
        }, 100);

        setTimeout(() => {
            let pwIndex = 0;
            const pwInterval = setInterval(() => {
                setAuthInfo(prev => ({ ...prev, pw: '*'.repeat(pwIndex + 1) }));
                pwIndex++;
                if (pwIndex >= randomCredentials.pw.length) clearInterval(pwInterval);
            }, 100);
        }, 1500);

        setTimeout(() => {
            setAccessStep('granted');
        }, 3500);
    };

    const handleClose = () => {
        gsap.to(windowRef.current, { autoAlpha: 0, scale: 0.8, duration: 0.4, ease: 'power3.in', onComplete: onClose });
    };
    
    const FingerprintIcon = () => (
        <svg className="fingerprint-scanner" width="100px" height="100px" viewBox="-1.5 -1.5 18.00 18.00" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleFingerprintScan}>
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.03"></g>
            <g id="SVGRepo_iconCarrier">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.1797 1.73509C9.35062 1.25279 8.41027 0.999347 7.45339 1C6.49652 1.00066 5.55651 1.25539 4.72803 1.73881C3.89953 2.22226 3.21168 2.91745 2.73415 3.7547C2.25662 4.59198 2.00641 5.54156 2.00903 6.50773L2.00903 6.50908L2.00903 7.25817C2.00903 7.26367 2.00894 7.26917 2.00876 7.27466C1.95203 8.99406 2.17119 10.7114 2.65775 12.3603L2.79925 12.8399L1.84013 13.1229L1.69863 12.6433C1.1826 10.8945 0.94976 9.07336 1.00903 7.24999V6.50975C1.00606 5.36949 1.30138 4.24837 1.86551 3.25927C2.42976 2.26995 3.24314 1.44748 4.22404 0.875103C5.20498 0.302714 6.31862 0.000776715 7.45271 1.49654e-06C8.5868 -0.000773721 9.70085 0.299641 10.6826 0.87069L11.1148 1.1221L10.6119 1.98649L10.1797 1.73509ZM12.7598 2.82697L13.0165 3.25609C13.7402 4.46631 14.0519 5.88075 13.9052 7.28474V8.00781C13.9044 8.70949 14.0869 9.39881 14.4341 10.0065L14.6822 10.4406L13.8139 10.9367L13.5659 10.5026C13.132 9.74319 12.9042 8.88243 12.9052 8.00671V7.25817C12.9052 7.24011 12.9062 7.22206 12.9081 7.2041C13.0383 6.00704 12.7747 4.80025 12.1582 3.76933L11.9016 3.3402L12.7598 2.82697ZM7.45711 4.01271C6.80216 4.01271 6.17328 4.2748 5.70902 4.74255C5.24463 5.21043 4.98307 5.8458 4.98307 6.50908V7.00908H3.98307V6.50908C3.98307 5.58298 4.34818 4.69407 4.99927 4.03809C5.65049 3.38199 6.53452 3.01271 7.45711 3.01271C8.37969 3.01271 9.26373 3.38199 9.91495 4.03809C10.566 4.69407 10.9311 5.58298 10.9311 6.50908V7.25817C10.9311 8.77172 11.4184 10.244 12.3192 11.4542L12.6178 11.8552L11.8157 12.4524L11.5171 12.0513C10.4874 10.6681 9.93115 8.98624 9.93115 7.25817V6.50908C9.93115 5.8458 9.66959 5.21043 9.2052 4.74255C8.74093 4.2748 8.11205 4.01271 7.45711 4.01271ZM7.9571 8.00782C7.95484 10.0485 8.57287 12.0406 9.72759 13.7163L10.0113 14.128L9.18789 14.6954L8.90417 14.2837C7.63402 12.4406 6.95471 10.2502 6.9571 8.00715M4.922 8.95107L4.97973 9.44773C5.15497 10.9556 5.59125 12.4207 6.26867 13.7765L6.49214 14.2238L5.59758 14.6708L5.37411 14.2235C4.64469 12.7636 4.17505 11.1863 3.98641 9.56317L3.92869 9.06651L4.922 8.95107Z" fill="#ffb300"></path>
            </g>
        </svg>
    );

    return (
        <div className={`top-secret-window ${isMobile ? 'mobile' : ''}`} ref={windowRef}>
             <div className="secret-window-header">
                <span>CLASSIFIED // PROJECT: INSTRUMENTALITY</span>
                <button onClick={handleClose} className="secret-close-btn">[X]</button>
            </div>

            {accessStep !== 'granted' && (
                 <div className="secret-access-panel">
                    <div className="warning-container-eva">
                        <div className="warning-header-box">
                            <span>B-USR-PK</span>
                            <span>XD-HGP</span>
                        </div>
                        <div className="warning-main-title">CAUTION</div>
                        <div className="warning-separator-line"></div>
                        <div className="warning-sub-title">EMERGENCY STATUS</div>
                        <div className="warning-separator-line"></div>
                        <div className="warning-footer-box">
                            <p>LIMITED CAPABILITIES</p>
                            <p>RESTRICTED ACCESS</p>
                        </div>
                    </div>
                    {accessStep === 'warning' && (
                        <div className="fingerprint-section">
                             <FingerprintIcon />
                            <div className="scan-prompt">BIOMETRIC AUTHENTICATION REQUIRED</div>
                        </div>
                    )}
                    {accessStep === 'authenticating' && (
                        <div className="auth-form-section">
                            <div className="auth-field">
                                <label>ID:</label>
                                <div className="auth-value">{authInfo.id}<span className="typing-cursor-auth">_</span></div>
                            </div>
                             <div className="auth-field">
                                <label>PW:</label>
                                <div className="auth-value">{authInfo.pw}{authInfo.pw.length < authCredentials.find(c=>c.id === authInfo.id.slice(0,c.id.length))?.pw.length ? <span className="typing-cursor-auth">_</span> : ''}</div>
                            </div>
                            <div className="auth-status">ANALYZING... ACCESSING MAGI...</div>
                        </div>
                    )}
                </div>
            )}

            {accessStep === 'granted' && (
                <div className="secret-document-content">
                    {!showMapView ? (
                        <div className="document-grid">
                            <div className="document-cover-panel clickable" onClick={() => setShowMapView(true)}>
                                <img src={hipImage} alt="Human Instrumentality Project" />
                                <div className="cover-title">PROJECT: HUMAN INSTRUMENTALITY</div>
                                <div className="cover-subtitle">FINAL REPORT - SEELE SCENARIO</div>
                                <div className="cover-prompt">CLICK TO VIEW SCENARIO MAP</div>
                            </div>
                            <div className="document-details-panel">
                                <h3>Core Concept: Forced Artificial Evolution</h3>
                                <p>The dissolution of the individual ego and the physical self. Humanity's inherent flaw is the existential loneliness derived from the A.T. Fields that define each person as a separate entity. The project seeks to 'correct' this flaw by merging all souls into a single, gestalt consciousness.</p>
                                <h3>Methodology: Third Impact</h3>
                                <p>A controlled cataclysm triggered via the union of Adam (the first Angel) and Lilith (the second Angel). An Evangelion unit, derived from Adam, acts as the nexus for this event. The Lance of Longinus is required to suppress the target's (Lilith or Adam-based life) regenerative abilities and control the resulting Anti-A.T. Field expansion.</p>
                                <h3>Process & Outcome:</h3>
                                <p>Upon initiation, a global Anti-A.T. Field will neutralize the barriers separating individuals. All human life will revert to its primordial state—LCL—while their souls are gathered into the 'Egg of Lilith' (the Black Moon). Within this crucible, a new form of existence will be born, a singular being free from pain, misunderstanding, and the confines of individuality. This is the ultimate apotheosis of humankind.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="map-scenario-layout">
                           <div 
                                className="map-display-panel"
                                ref={mapContainerRef}
                                onMouseDown={handlePanStart}
                                onTouchStart={handlePanStart}
                           >
                                <div 
                                    className="map-panning-wrapper"
                                    ref={mapPanWrapperRef}
                                    style={{ transform: `translate(${mapPosition.x}px, ${mapPosition.y}px)` }}
                                >
                                    <img 
                                        src={worldMapImage} 
                                        alt="World Map" 
                                        className="map-image-bg"
                                        draggable="false"
                                    />
                                    <div className="map-target-lockon">
                                        <div className="target-ring target-ring1"></div>
                                        <div className="target-ring target-ring2"></div>
                                        <div className="target-crosshair"></div>
                                    </div>
                                </div>
                                <div className="map-grid-overlay"></div>
                                <div className="map-scanline-overlay"></div>
                                <div className="map-vignette-overlay"></div>
                           </div>
                           <div className="scenario-details-panel">
                                <div className="scenario-header">
                                    <h4>OPERATIONAL SCENARIO: THIRD IMPACT</h4>
                                    <button className="map-return-button" onClick={() => setShowMapView(false)}>RETURN TO REPORT</button>
                                </div>
                                <div className="scenario-content">
                                    <p><span className='phase'>PRE-REQUISITES:</span><br/>
                                    1. ADAM [embryo state] retrieved and fused with Commander Ikari.<br/>
                                    2. LILITH [crucified] secured in Terminal Dogma.<br/>
                                    3. All Angels as per the Dead Sea Scrolls defeated.<br/>
                                    4. EVA-01 confirmed as LILITH's true scion, S2 Engine absorbed.
                                    </p>
                                    <p><span className='phase'>EXECUTION PHASES:</span><br/>
                                    <span className='highlight'>PHASE 1:</span> GeoFront Central Dogma unsealed. EVA-01 deployed to LILITH's position.<br/>
                                    <span className='highlight'>PHASE 2:</span> Mass Production Evangelion series (Unit-05 to 13) to form Tree of Life sephirot, using EVA-01 as nexus.<br/>
                                    <span className='highlight'>PHASE 3:</span> Lance of Longinus (true) to merge with EVA-01, initiating global Anti-A.T. Field from origin point <span className='highlight-strong'>[ANTARCTICA // FORMER ADAM LABORATORY]</span>.<br/>
                                    <span className='highlight'>PHASE 4:</span> Global reversion to LCL. Souls collected in Chamber of Guf (Black Moon). Instrumentality commences.
                                    </p>
                                    <p><span className='phase'>CONTINGENCIES:</span><br/>
                                    - If LANCE OF LONGINUS is unavailable, use of replica lances by MP-EVAs is authorized.<br/>
                                    - Failure of pilot synchronization will be overridden by DUMMY PLUG SYSTEM.
                                    </p>
                                    <p className="status-line">// ALL IS FOR THE UNIFICATION OF MANKIND</p>
                                </div>
                           </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/**
 * 개별 프로필 정보 창 컴포넌트
 */
const ProfileWindow = ({ personKey, deptDescription, onClose, onFocus, zIndex, isMobile, initialPos }) => {
    const person = personnelData[personKey];
    const [position, setPosition] = useState(initialPos);
    const windowRef = useRef(null);
    const gsap = window.gsap;

    useEffect(() => {
        if (isMobile) {
            gsap.fromTo(windowRef.current, { autoAlpha: 0, y: '100vh' }, { autoAlpha: 1, y: '0%', duration: 0.5, ease: 'power3.out' });
        } else {
            gsap.fromTo(windowRef.current, { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'power2.out' });
        }
    }, [gsap, isMobile]);

    const handleMouseDown = (e) => {
        if (isMobile || !e.target.className.includes('profile-header')) return;
        onFocus();
        const dragStartPos = { x: e.clientX - position.x, y: e.clientY - position.y };
        const handleMouseMove = (moveE) => setPosition({ x: moveE.clientX - dragStartPos.x, y: moveE.clientY - dragStartPos.y });
        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleClose = () => {
        const closeAction = () => onClose(personKey);
        if (isMobile) {
            gsap.to(windowRef.current, { y: '100vh', autoAlpha: 0, duration: 0.5, ease: 'power3.in', onComplete: closeAction });
        } else {
            gsap.to(windowRef.current, { scale: 0.5, autoAlpha: 0, duration: 0.3, ease: 'power2.in', onComplete: closeAction });
        }
    };
    
    const windowStyle = isMobile ? {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1100,
    } : {
        top: `${position.y}px`, left: `${position.x}px`, zIndex,
    };

    return (
        <div className={`personnel-profile-window ${isMobile ? 'mobile' : ''}`} ref={windowRef} style={windowStyle} onMouseDown={handleMouseDown}>
            <div className="profile-header">
                <span>PERSONNEL FILE: {person.name}</span>
                <button onClick={handleClose} className="profile-close-btn">[X]</button>
            </div>
            <div className="profile-content">
                <div className="profile-main-info">
                    <img src={person.image} alt={person.name} className="profile-image" />
                    <div className="profile-title-section">
                        <div className="profile-name">{person.name}</div>
                        <div className="profile-title">{person.title}</div>
                    </div>
                </div>
                <div className="profile-details">
                    <div className="profile-section"><h4>Department Briefing</h4><p>{deptDescription}</p></div>
                    <div className="profile-section"><h4>Psychological Analysis</h4>
                        <div className="profile-stats">
                            {Object.entries(person.stats).map(([key, value]) => (
                                <div className="stat-graph-item" key={key}>
                                    <div className="stat-graph-label">{key}</div>
                                    <div className="stat-graph-bar-bg"><div className="stat-graph-bar-fill" style={{ width: `${value}%` }}></div></div>
                                    <div className="stat-graph-value">{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SubMenu = ({ members, position, onSelect, onClose, isMobile }) => {
    const menuRef = useRef(null);
    useEffect(() => {
        window.gsap.fromTo(menuRef.current, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.2 });
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) onClose();
        };
        const timerId = setTimeout(() => document.addEventListener("mousedown", handleClickOutside), 0);
        return () => { clearTimeout(timerId); document.removeEventListener("mousedown", handleClickOutside); };
    }, [onClose]);

    const style = !isMobile && position ? { top: position.y, left: position.x } : {};
    return (
        <div className={`personnel-submenu ${isMobile ? 'mobile-bottom' : ''}`} ref={menuRef} style={style}>
            {members.map(personKey => (
                <button 
                    key={personKey} 
                    onClick={() => onSelect(personKey)}
                    className={personKey === 'top_secret' ? 'top-secret-menu-item' : ''}
                >
                    {personnelData[personKey].name}
                </button>
            ))}
        </div>
    );
};

const DigitalClock = ({ isMobile }) => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);
    const formatTime = (date) => `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    return (
        <div className="nerv-digital-clock">
            <div className="clock-info-panel">
                <div className="info-line-1">INTERNAL</div>
                <div className="info-line-2">MAIN ENERGY SUPPLY SYSTEM</div>
            </div>
            <div className="clock-time-display">{formatTime(time)}</div>
        </div>
    );
};

const NervOrganizationGUI = ({ onExit }) => {
    const [openProfiles, setOpenProfiles] = useState([]);
    const [activeSubMenu, setActiveSubMenu] = useState(null);
    const [showTopSecret, setShowTopSecret] = useState(false); // [신규] TOP SECRET 창 상태
    const guiRef = useRef(null);
    const gsap = window.gsap;
    const width = useWindowSize();
    const isMobile = width <= 918;

    const hexLayout = [
        { top: '20%', left: '25%', label: nervStructure.command.title, deptKey: 'command', isActive: true }, { top: '35%', left: '15%', label: nervStructure.tactical.title, deptKey: 'tactical', isActive: true },
        { top: '50%', left: '25%', label: nervStructure.technological.title, deptKey: 'technological', isActive: true }, { top: '65%', left: '15%', label: nervStructure.intelligence.title, deptKey: 'intelligence', isActive: true },
        { top: '80%', left: '25%', label: "Bridge Ops", deptKey: 'bridge', isActive: true }, { top: '10%', left: '10%', label: 'SYSTEM SCAN', isActive: false },
        { top: '15%', left: '40%', label: 'TERMINAL', isActive: false }, { top: '30%', left: '35%', label: 'EMERGENCY', isActive: false }, { top: '45%', left: '55%', label: 'CPU: 89%', isActive: false },
        { top: '60%', left: '60%', label: 'RAM: 76%', isActive: false }, { top: '75%', left: '52%', label: 'LOCK', isActive: false }, { top: '85%', left: '10%', label: 'EXTERNAL', isActive: false },
        { top: '5%', left: '28%', label: 'PANEL', isActive: false }, { top: '22%', left: '70%', label: 'TEMP', isActive: false }, { top: '38%', left: '78%', label: 'STATUS', isActive: false },
        { top: '55%', left: '80%', label: 'ACCESS', isActive: false }, { top: '70%', left: '75%', label: 'SECURITY', isActive: false }, { top: '85%', left: '65%', label: 'DATA', isActive: false },
    ];
    
    useEffect(() => { gsap.fromTo(guiRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }); }, [gsap]);

    const handleHexClick = (deptKey, e) => {
        const members = nervStructure[deptKey].members;
        if (members.length === 1) {
            handleOpenOrFocusProfile(members[0], deptKey);
        } else {
            if (isMobile) {
                setActiveSubMenu({ members, deptKey });
            } else {
                const rect = e.currentTarget.getBoundingClientRect();
                setActiveSubMenu({ members, deptKey, position: { y: rect.top, x: rect.right + 10 } });
            }
        }
    };
    
    const mobileHexLayout = hexLayout.filter(hex => hex.isActive);
    
    const handleOpenOrFocusProfile = (personKey, deptKey) => {
        setActiveSubMenu(null);
        
        if (personKey === 'top_secret') {
            setShowTopSecret(true);
            return;
        }

        setOpenProfiles(prevProfiles => {
            const existingProfileIndex = prevProfiles.findIndex(p => p.personKey === personKey);
            if (existingProfileIndex > -1) {
                const profileToFocus = prevProfiles[existingProfileIndex];
                const otherProfiles = prevProfiles.filter(p => p.personKey !== personKey);
                return [...otherProfiles, profileToFocus];
            } 
            else {
                const offset = prevProfiles.length * 40;
                const newPosition = {
                    x: (window.innerWidth / 2 - 250) + offset,
                    y: (window.innerHeight / 2 - 300) + offset,
                };
                const newProfile = { personKey, deptKey, initialPos: newPosition };
                return [...prevProfiles, newProfile];
            }
        });
    };

    const handleCloseProfile = (personKey) => {
        setOpenProfiles(prevProfiles => prevProfiles.filter(p => p.personKey !== personKey));
    };

    return (
        <div className={`nerv-gui-container ${isMobile ? 'mobile' : ''}`} ref={guiRef}>
            <DigitalClock isMobile={isMobile} />
            <button className="nerv-gui-exit" onClick={onExit}>[ EXIT ]</button>
            <div className="nerv-gui-hex-background"></div>
            <img src={nervLogo} alt="NERV Logo" className="nerv-gui-logo" />
            <div className={isMobile ? "hex-list-container-mobile" : "hex-grid-container"}>
                {isMobile ? (
                    mobileHexLayout.map((hex) => (
                        <div key={hex.deptKey} className="hex-button-mobile active" onClick={(e) => handleHexClick(hex.deptKey, e)}>
                            <div className="hex-content"><span className="hex-label">{hex.label}</span><span className="hex-sublabel">OPEN</span></div>
                        </div>
                    ))
                ) : (
                    hexLayout.map((hex, index) => <div key={index} className={`hex-button ${hex.isActive ? 'active' : 'inactive'}`} style={{ top: hex.top, left: hex.left }} onClick={hex.isActive ? (e) => handleHexClick(hex.deptKey, e) : null}><div className="hex-inner"></div><div className="hex-content"><span className="hex-label">{hex.label}</span>{hex.isActive && <span className="hex-sublabel">OPEN</span>}</div></div>)
                )}
            </div>
            
            {ReactDOM.createPortal(
                <>
                    {openProfiles.map((profile, index) => (
                        <ProfileWindow
                            key={profile.personKey}
                            personKey={profile.personKey}
                            deptDescription={nervStructure[profile.deptKey].description}
                            initialPos={profile.initialPos}
                            onClose={handleCloseProfile}
                            onFocus={() => handleOpenOrFocusProfile(profile.personKey, profile.deptKey)}
                            zIndex={100 + index}
                            isMobile={isMobile}
                        />
                    ))}
                    {activeSubMenu && <SubMenu {...activeSubMenu} onSelect={(personKey) => handleOpenOrFocusProfile(personKey, activeSubMenu.deptKey)} onClose={() => setActiveSubMenu(null)} isMobile={isMobile} />}
                    {showTopSecret && <TopSecretWindow onClose={() => setShowTopSecret(false)} isMobile={isMobile} />}
                </>
                , document.body
            )}
        </div>
    );
};

const NervPage = ({ onBack }) => {
    const [showGui, setShowGui] = useState(false);
    const pageRef = useRef(null);
    const gsap = window.gsap;

    useEffect(() => {
        gsap.fromTo(pageRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: 'power2.out' });
        if (!showGui) { gsap.fromTo(".nerv-content-box", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.2, duration: 0.7, delay: 0.5 }); }
    }, [gsap, showGui]);

    const handleEnterNerv = () => { gsap.to(".nerv-main-content", { autoAlpha: 0, duration: 0.5, ease: 'power2.in', onComplete: () => setShowGui(true) }); };
    const handleExitGui = () => { setShowGui(false); };

    return (
        <div className={`nerv-page-layout ${showGui ? 'gui-active' : ''}`} ref={pageRef}>
            <button className="back-button" onClick={onBack}>← MENU</button>
            {!showGui ? (
                <div className="nerv-main-content">
                    <div className="nerv-image-container nerv-content-box"><img src={nervLogo} alt="NERV Logo" className="nerv-logo-background" /><img src={gendoImage} alt="Gendo Ikari" className="gendo-image" /></div>
                    <div className="nerv-description-box nerv-content-box">
                        <div className="nerv-header">TOP SECRET // FOR YOUR EYES ONLY</div>
                        <h2 className="nerv-title">ORGANIZATION: NERV</h2>
                        <p className="nerv-text">NERV is a special paramilitary agency under the command of the United Nations, led by Gendo Ikari. Its official purpose is to lead the defense of mankind against the Angels. However, its secret, true objective is to complete the Human Instrumentality Project in accordance with the scenarios outlined by Seele.</p>
                        <p className="nerv-text">Headquartered in the GeoFront beneath Tokyo-3, NERV possesses the Evangelion units, the only weapons capable of defeating the Angels. The organization holds immense power and operates with a high degree of autonomy, often clashing with the governments that fund it.</p>
                        <button className="enter-nerv-button" onClick={handleEnterNerv}>ENTER NERV</button>
                    </div>
                </div>
            ) : <NervOrganizationGUI onExit={handleExitGui} />}
        </div>
    );
};

export default NervPage;