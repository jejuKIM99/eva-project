import React, { useState, useEffect, useRef } from 'react';

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

// --- 인물 데이터 ---
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

// --- 조직도 데이터 (부서 설명 추가) ---
const nervStructure = {
    command: { title: "Command Staff", members: ['gendo', 'fuyutsuki'], description: "The central nervous system of NERV, responsible for all high-level strategic decisions and the secret execution of Project Instrumentality." },
    tactical: { title: "Tactical Dept.", members: ['misato'], description: "Directs all combat scenarios involving the Evangelion units. This department lives and dies by seconds and centimeters." },
    technological: { title: "Science & Tech", members: ['ritsuko', 'maya'], description: "The brains of the operation. Manages Evangelion maintenance, MAGI system operations, and Angel autopsies. Ethical boundaries are frequently tested." },
    intelligence: { title: "Intelligence", members: ['kaji'], description: "NERV's eyes and ears, and its secrets' keeper. Operates in the shadows, dealing with espionage, internal threats, and SEELE's meddling." },
    bridge: { title: "Bridge Operations", members: ['makoto', 'shigeru'], description: "The frontline of data warfare. These operators process vast amounts of combat data in real-time from the safety of the Central Dogma." },
};

// --- 프로필 윈도우 컴포넌트 ---
const ProfileWindow = ({ personKey, deptDescription, onClose, onFocus, zIndex }) => {
    const person = personnelData[personKey];
    const [position, setPosition] = useState({ x: window.innerWidth / 2 - 200 + Math.random() * 100, y: window.innerHeight / 2 - 250 + Math.random() * 100 });
    const windowRef = useRef(null);
    const gsap = window.gsap;

    useEffect(() => {
        gsap.fromTo(windowRef.current, {scale: 0.5, autoAlpha: 0}, {scale: 1, autoAlpha: 1, duration: 0.4, ease: 'power2.out'});
    }, [gsap]);

    const handleMouseDown = (e) => {
        if (e.target.className.includes('profile-header')) {
            onFocus();
            const dragStartPos = { x: e.clientX - position.x, y: e.clientY - position.y };
            const handleMouseMove = (moveE) => { setPosition({ x: moveE.clientX - dragStartPos.x, y: moveE.clientY - dragStartPos.y }); };
            const handleMouseUp = () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
    };

    return (
        <div className="personnel-profile-window" ref={windowRef} style={{ top: `${position.y}px`, left: `${position.x}px`, zIndex }} onMouseDown={handleMouseDown}>
            <div className="profile-header"><span>PERSONNEL FILE: {person.name}</span><button onClick={() => onClose(personKey)} className="profile-close-btn">[X]</button></div>
            <div className="profile-content">
                <div className="profile-main-info">
                    <img src={person.image} alt={person.name} className="profile-image" />
                    <div className="profile-title-section"><div className="profile-name">{person.name}</div><div className="profile-title">{person.title}</div></div>
                </div>
                <div className="profile-details">
                    <div className="profile-section"><h4>Department Briefing</h4><p>{deptDescription}</p></div>
                    <div className="profile-section"><h4>Psychological Analysis</h4>
                        <div className="profile-stats">
                            {Object.entries(person.stats).map(([key, value]) => (
                                <div className="stat-graph-item" key={key}>
                                    <div className="stat-graph-label">{key}</div>
                                    <div className="stat-graph-bar-bg"><div className="stat-graph-bar-fill" style={{width: `${value}%`}}></div></div>
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

// --- 서브 메뉴 컴포넌트 ---
const SubMenu = ({ members, position, onSelect, onClose }) => {
    const menuRef = useRef(null);
    useEffect(() => {
        window.gsap.fromTo(menuRef.current, {autoAlpha: 0, scale: 0.8}, {autoAlpha: 1, scale: 1, duration: 0.2});
        const handleClickOutside = (event) => { if (menuRef.current && !menuRef.current.contains(event.target)) { onClose(); } };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div className="personnel-submenu" ref={menuRef} style={{ top: position.y, left: position.x }}>
            {members.map(personKey => <button key={personKey} onClick={() => onSelect(personKey)}>{personnelData[personKey].name}</button>)}
        </div>
    );
};

// --- 디지털 시계 컴포넌트 ---
const DigitalClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);
    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };
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

// --- 조직도 GUI 컴포넌트 ---
const NervOrganizationGUI = ({ onExit }) => {
    const [openProfiles, setOpenProfiles] = useState({});
    const [profileFocusOrder, setProfileFocusOrder] = useState([]);
    const [activeSubMenu, setActiveSubMenu] = useState(null);
    const guiRef = useRef(null);
    const gsap = window.gsap;

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
        if (members.length === 1) { handleOpenProfile(members[0], deptKey); } 
        else { const rect = e.currentTarget.getBoundingClientRect(); setActiveSubMenu({ members, deptKey, position: { y: rect.top, x: rect.right + 10 } }); }
    };

    const handleOpenProfile = (personKey, deptKey) => { setOpenProfiles(prev => ({ ...prev, [personKey]: deptKey })); handleFocus(personKey); setActiveSubMenu(null); };
    const handleCloseProfile = (personKey) => { setOpenProfiles(prev => { const newProfiles = { ...prev }; delete newProfiles[personKey]; return newProfiles; }); setProfileFocusOrder(prev => prev.filter(p => p !== personKey)); };
    const handleFocus = (personKey) => { setProfileFocusOrder(prev => [personKey, ...prev.filter(p => p !== personKey)]); };

    return (
        <div className="nerv-gui-container" ref={guiRef}>
            <button className="nerv-gui-exit" onClick={onExit}>[ EXIT ]</button>
            <DigitalClock />
            <div className="nerv-gui-hex-background"></div>
            <img src={nervLogo} alt="NERV Logo" className="nerv-gui-logo" />
            <div className="hex-grid-container">
                 {hexLayout.map((hex, index) => <div key={index} className={`hex-button ${hex.isActive ? 'active' : 'inactive'}`} style={{ top: hex.top, left: hex.left }} onClick={hex.isActive ? (e) => handleHexClick(hex.deptKey, e) : null}>
                    <div className="hex-inner"></div><div className="hex-content"><span className="hex-label">{hex.label}</span>{hex.isActive && <span className="hex-sublabel">OPEN</span>}</div></div>)}
            </div>
            <div className="windows-area">
                {Object.entries(openProfiles).map(([key, deptKey]) => <ProfileWindow key={key} personKey={key} deptDescription={nervStructure[deptKey].description} onClose={handleCloseProfile} onFocus={() => handleFocus(key)} zIndex={profileFocusOrder.indexOf(key) * -1 + 100} />)}
                {activeSubMenu && <SubMenu {...activeSubMenu} onSelect={(personKey) => handleOpenProfile(personKey, activeSubMenu.deptKey)} onClose={() => setActiveSubMenu(null)} />}
            </div>
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
        <div className="nerv-page-layout" ref={pageRef}>
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
