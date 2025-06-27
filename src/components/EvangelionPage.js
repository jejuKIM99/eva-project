import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

// 이미지 import
import unit01Image from '../img/unit01.png';
import unit02Image from '../img/unit02.png';
import unit01BackImage from '../img/unit01-back.png';
import unit02BackImage from '../img/unit02-back.png';
import unit01CardBackImage from '../img/unit01-cardback.png';
import unit02CardBackImage from '../img/unit02-cardback.png';
import unit01FullImage from '../img/unit01_full.png';
import unit02FullImage from '../img/unit02_full.png';
import unit01BerserkImage from '../img/unit01_berserk.png'; // 광폭화 이미지 추가

// --- 유닛 데이터 확장 ---
// 광폭 모드 데이터 추가
const evaData = {
    unit01: { 
        name: "UNIT-01", 
        id: "unit01",
        image: unit01Image, 
        backImage: unit01BackImage, 
        cardBackImage: unit01CardBackImage, 
        fullImage: unit01FullImage,
        specs: { "Model Type": "Test Type", "Pilot": "Shinji Ikari", "Height": "75m", "Weight": "700t", "Power Source": "External Umbilical Cable, Internal Battery (5 min)", "Core Unit": "Yui Ikari", "Primary Armaments": "Progressive Knife, Pallet Rifle", "Special Abilities": "Berserk Mode, A.T. Field Generation, Regeneration", "Operational History": "First operational EVA unit. Extensive combat record against multiple Angel threats. Known for unpredictable, autonomous actions under extreme duress." },
        performance: { "Power": 95, "Defense": 88, "Mobility": 85, "Accuracy": 82, "A.T. Field": 98 },
        berserk: {
            fullImage: unit01BerserkImage,
            specs: { "Model Type": "BEAST", "Pilot": "Shinji Ikari (Unconscious)", "Height": "UNKNOWN", "Weight": "UNKNOWN", "Power Source": "S² Engine (Theoretical)", "Core Unit": "Yui Ikari (Dominant)", "Primary Armaments": "Claws, Teeth, A.T. Field", "Special Abilities": "Self-Sustenance, Uncontrolled Violence, Armor Purge", "Operational History": "WARNING: BERSERK MODE ACTIVATED. PILOT SYNC RATE EXCEEDS 400%. ALL CONTROL IS LOST. THREAT LEVEL: MAXIMUM." },
            performance: { "Power": 500, "Defense": 300, "Mobility": 400, "Accuracy": 150, "A.T. Field": 500 }
        }
    },
    unit02: { 
        name: "UNIT-02", 
        id: "unit02",
        image: unit02Image, 
        backImage: unit02BackImage, 
        cardBackImage: unit02CardBackImage, 
        fullImage: unit02FullImage,
        specs: { "Model Type": "Production Model", "Pilot": "Asuka Langley Soryu", "Height": "75m", "Weight": "650t", "Power Source": "External Umbilical Cable, Internal Battery (5 min)", "Core Unit": "Kyoko Zeppelin Soryu", "Primary Armaments": "Progressive Knife, Pallet Rifle, Sonic Glaive", "Special Abilities": "First production-model with stable operational capabilities. Designed for specialized combat roles.", "Operational History": "First deployed in aquatic combat against Gaghiel. Showcased high performance under its designated pilot but exhibited synchronization issues later on." },
        performance: { "Power": 90, "Defense": 92, "Mobility": 94, "Accuracy": 96, "A.T. Field": 91 }
    }
};
const evas = ['unit01', 'unit02'];

// --- 성능 그래프 컴포넌트 ---
const PerformanceGraph = ({ label, value, isBerserk }) => {
    const barRef = useRef(null);
    const gsap = window.gsap;
    useEffect(() => {
        if(barRef.current) {
            const displayValue = Math.min(value, 100); // 시각적 표시는 100%를 최대로
            gsap.fromTo(barRef.current, { width: 0 }, { width: `${displayValue}%`, duration: 1.5, ease: 'power3.out', delay: 0.5 });
        }
    }, [value, gsap]);

    return (
        <div className="performance-item">
            <span className="performance-label">{label}</span>
            <div className="performance-bar-bg">
                <div className="performance-bar-fill" ref={barRef}></div>
            </div>
            <span className="performance-value">{isBerserk ? '???' : `${value}%`}</span>
        </div>
    );
};

// --- 생체 신호 그래프 컴포넌트 ---
const SyncGraph = ({ color, isBerserk }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        const resizeCanvas = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        let t = 0;
        const draw = () => {
            t += isBerserk ? 0.3 : 0.1; // 광폭화 시 더 빠르게
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            for (let i = 0; i < canvas.width; i++) {
                const amplitude = isBerserk ? canvas.height / 4 : canvas.height / 10;
                const noise = isBerserk ? (Math.random() - 0.5) * 20 : (Math.random() - 0.5) * 4;
                const y = canvas.height / 2 + Math.sin(i * 0.1 + t) * amplitude + noise;
                ctx.lineTo(i, y);
            }
            ctx.stroke();
            animationFrameId = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', resizeCanvas); };
    }, [color, isBerserk]);
    return <div className="sync-graph-container"><canvas ref={canvasRef}></canvas></div>;
};


// --- 분석 GUI 컴포넌트 ---
const EvaAnalysisGUI = ({ eva, onClose, isBerserk, onToggleBerserk }) => {
    const guiRef = useRef(null);
    const gsap = window.gsap;
    
    const currentData = isBerserk && eva.berserk ? eva.berserk : eva;
    const currentPerformance = isBerserk && eva.berserk ? eva.berserk.performance : eva.performance;

    useEffect(() => {
        gsap.fromTo(guiRef.current, { autoAlpha: 0, scale: 1.1 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power3.out' });
    }, [gsap]);

    return (
        <div className={`eva-analysis-gui ${eva.id} ${isBerserk ? 'berserk' : ''}`} ref={guiRef}>
            {isBerserk && <div className="berserk-overlay-glitch"></div>}
            <div className="analysis-header">
                <span className="header-title">
                    {isBerserk ? "WARNING: BERSERK MODE" : `EVANGELION ${eva.name} // ANALYSIS`}
                </span>
                <button className="analysis-close-btn" onClick={onClose}>[X]</button>
            </div>
            <div className="analysis-content">
                <div className="analysis-left-panel">
                    <div className="data-block">
                        <h4 className="data-title">COMBAT PERFORMANCE</h4>
                        <div className="performance-graphs">
                            {Object.entries(currentPerformance).map(([key, value]) => <PerformanceGraph key={key} label={key} value={value} isBerserk={isBerserk} />)}
                        </div>
                    </div>
                    <div className="data-block">
                        <h4 className="data-title">BIOLOGICAL FEEDBACK</h4>
                        <SyncGraph color={isBerserk ? '#ff0000' : (eva.id === 'unit01' ? '#32cd32' : '#ffcc00')} isBerserk={isBerserk} />
                    </div>
                    <div className="data-block">
                        <h4 className="data-title">SYSTEM LOG</h4>
                        <p className="log-text">
                            {isBerserk ? "[ERROR] SYNC RATE > 400%\n[ERROR] CONNECTION TO PILOT LOST\n[ERROR] MANUAL CONTROL OVERRIDDEN\n[WARNING] BEAST MODE DETECTED"
                                      : "[LOG] BOOT SEQUENCE INITIATED...\n[LOG] LCL DENSITY NORMAL...\n[LOG] SYNC RATIO STABLE...\n[LOG] UMBILICAL CABLE CONNECTED...\n[LOG] ALL SYSTEMS NOMINAL."}
                        </p>
                    </div>
                </div>
                <div className="analysis-center-panel">
                    <img src={currentData.fullImage} alt={currentData.name} className="analysis-eva-image" />
                    <div className="scan-lines-vertical"></div>
                </div>
                <div className="analysis-right-panel">
                    {Object.entries(currentData.specs).map(([key, value]) => (
                        <div className="spec-item" key={key}><span className="spec-key">{key.toUpperCase()}</span><span className="spec-value">{value}</span></div>
                    ))}
                </div>
            </div>
            {eva.id === 'unit01' && (
                <button className="berserk-mode-btn" onClick={onToggleBerserk}>
                    {isBerserk ? 'CEASE BERSERK' : 'ACTIVATE BERSERK'}
                </button>
            )}
        </div>
    );
};

const EvangelionPage = ({ onBack }) => {
    const [selectedEva, setSelectedEva] = useState(null);
    const [showDescription, setShowDescription] = useState(false);
    const [isBerserk, setIsBerserk] = useState(false); // 광폭 모드 상태 추가
    const pageRef = useRef(null);
    const cardContainerRef = useRef(null);
    const fullscreenViewRef = useRef(null);
    const actionButtonsRef = useRef(null);
    const cardRefs = { unit01: useRef(null), unit02: useRef(null) };
    const gsap = window.gsap;
    const prevSelectedEva = useRef(null);

    const handleMouseMove = (e, key) => { if (selectedEva) return; const card = cardRefs[key].current; const { left, top, width, height } = card.getBoundingClientRect(); const x = e.clientX - left - width / 2; const y = e.clientY - top - height / 2; const rotateY = (x / width) * 30; const rotateX = -(y / height) * 30; gsap.to(card, { rotationY: rotateY, rotationX: rotateX, ease: 'power1.out', duration: 0.8 }); };
    const handleMouseLeave = (key) => { if (selectedEva) return; gsap.to(cardRefs[key].current, { rotationY: 0, rotationX: 0, ease: 'power2.out', duration: 1 }); };
    const handleSelectEva = (key) => { if (selectedEva) return; setSelectedEva(key); };
    const handleCloseFullscreen = () => { if (showDescription) return; setSelectedEva(null); setIsBerserk(false); };
    const handleDownload = () => { if (!selectedEva) return; const link = document.createElement('a'); link.href = evaData[selectedEva].backImage; link.download = `${selectedEva}-background.png`; document.body.appendChild(link); link.click(); document.body.removeChild(link); };
    
    useLayoutEffect(() => {
        gsap.set(pageRef.current, { autoAlpha: 0 });
        gsap.set(cardContainerRef.current, { autoAlpha: 0, y: 50 });
        Object.values(cardRefs).forEach(ref => { if(ref.current) { gsap.set(ref.current, { rotationX: 0, rotationY: 0, transformPerspective: 1000 }); } });
    }, [gsap]);

    useEffect(() => {
        gsap.to(pageRef.current, { autoAlpha: 1, duration: 0.5 });
        gsap.to(cardContainerRef.current, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.3 });
    }, [gsap]);

    useEffect(() => {
        const wasSelected = prevSelectedEva.current;
        prevSelectedEva.current = selectedEva;
        if (!selectedEva) { setShowDescription(false); setIsBerserk(false); }
        if (selectedEva && !wasSelected) { gsap.timeline().to(cardContainerRef.current, { autoAlpha: 0, scale: 0.9, duration: 0.5, ease: 'power2.in' }).fromTo(fullscreenViewRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, ease: 'power2.out' }).fromTo(actionButtonsRef.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.3"); } 
        else if (!selectedEva && wasSelected) { gsap.timeline().to(fullscreenViewRef.current, { autoAlpha: 0, duration: 0.5, ease: 'power2.in' }).to(cardContainerRef.current, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power2.out' }); }
    }, [selectedEva, gsap]);

    return (
        <div className="evangelion-page-layout" ref={pageRef}>
            <button className="back-button" onClick={onBack}>← MENU</button>
            <div className="eva-card-container" ref={cardContainerRef}>
                {evas.map(key => <div key={key} ref={cardRefs[key]} className="eva-card" onMouseMove={(e) => handleMouseMove(e, key)} onMouseLeave={() => handleMouseLeave(key)} onClick={() => handleSelectEva(key)}>
                    <div className="card-bg" style={{ backgroundImage: `url(${evaData[key].cardBackImage})` }}></div><img src={evaData[key].image} alt={evaData[key].name} className={`card-unit ${key}`} /><h2 className="card-title">{evaData[key].name}</h2></div>)}
            </div>
            <div className="eva-fullscreen-view" ref={fullscreenViewRef}>
                {selectedEva && (<>
                    <div className="fullscreen-bg" style={{ backgroundImage: `url(${evaData[selectedEva].backImage})` }} onClick={() => !showDescription && setShowDescription(true)}></div>
                    {showDescription && <EvaAnalysisGUI eva={evaData[selectedEva]} onClose={() => setShowDescription(false)} isBerserk={isBerserk} onToggleBerserk={() => setIsBerserk(!isBerserk)}/>}
                    <div className="eva-action-buttons" ref={actionButtonsRef} style={{opacity: showDescription ? 0 : 1}}><button onClick={handleCloseFullscreen}>CLOSE</button><button onClick={handleDownload}>DOWNLOAD</button></div>
                </>)}
            </div>
        </div>
    );
};

export default EvangelionPage;
