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
};
const nervStructure = {
    command: { title: "Command Staff", members: ['gendo', 'fuyutsuki'], description: "The central nervous system of NERV, responsible for all high-level strategic decisions and the secret execution of Project Instrumentality." },
    tactical: { title: "Tactical Dept.", members: ['misato'], description: "Directs all combat scenarios involving the Evangelion units. This department lives and dies by seconds and centimeters." },
    technological: { title: "Science & Tech", members: ['ritsuko', 'maya'], description: "The brains of the operation. Manages Evangelion maintenance, MAGI system operations, and Angel autopsies. Ethical boundaries are frequently tested." },
    intelligence: { title: "Intelligence", members: ['kaji'], description: "NERV's eyes and ears, and its secrets' keeper. Operates in the shadows, dealing with espionage, internal threats, and SEELE's meddling." },
    bridge: { title: "Bridge Operations", members: ['makoto', 'shigeru'], description: "The frontline of data warfare. These operators process vast amounts of combat data in real-time from the safety of the Central Dogma." },
};

// --- 컴포넌트 ---

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
            {members.map(personKey => <button key={personKey} onClick={() => onSelect(personKey)}>{personnelData[personKey].name}</button>)}
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
    // ✨ [수정] 열린 프로필과 순서를 배열 하나로 관리
    const [openProfiles, setOpenProfiles] = useState([]);
    const [activeSubMenu, setActiveSubMenu] = useState(null);
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
    
    // ✨ [수정] 프로필을 열거나, 이미 열려있으면 맨 위로 가져오는 함수
    const handleOpenOrFocusProfile = (personKey, deptKey) => {
        setActiveSubMenu(null);

        setOpenProfiles(prevProfiles => {
            const existingProfileIndex = prevProfiles.findIndex(p => p.personKey === personKey);

            // 이미 창이 열려있는 경우
            if (existingProfileIndex > -1) {
                // 해당 창을 배열의 맨 뒤로 보내서 z-index를 가장 높게 만듦
                const profileToFocus = prevProfiles[existingProfileIndex];
                const otherProfiles = prevProfiles.filter(p => p.personKey !== personKey);
                return [...otherProfiles, profileToFocus];
            } 
            // 새 창을 여는 경우
            else {
                const offset = prevProfiles.length * 40;
                const newPosition = {
                    x: (window.innerWidth / 2 - 250) + offset,
                    y: (window.innerHeight / 2 - 300) + offset,
                };
                const newProfile = {
                    personKey,
                    deptKey,
                    initialPos: newPosition,
                };
                return [...prevProfiles, newProfile];
            }
        });
    };

    // ✨ [수정] 프로필 창 닫기 핸들러
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
                    {/* ✨ [수정] 배열을 순회하며 프로필 창 렌더링 */}
                    {openProfiles.map((profile, index) => (
                        <ProfileWindow
                            key={profile.personKey}
                            personKey={profile.personKey}
                            deptDescription={nervStructure[profile.deptKey].description}
                            initialPos={profile.initialPos}
                            onClose={handleCloseProfile}
                            onFocus={() => handleOpenOrFocusProfile(profile.personKey, profile.deptKey)}
                            zIndex={100 + index} // 배열 순서에 따라 z-index 계산
                            isMobile={isMobile}
                        />
                    ))}
                    {activeSubMenu && <SubMenu {...activeSubMenu} onSelect={(personKey) => handleOpenOrFocusProfile(personKey, activeSubMenu.deptKey)} onClose={() => setActiveSubMenu(null)} isMobile={isMobile} />}
                </>,
                document.body
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
