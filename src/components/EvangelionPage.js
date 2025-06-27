import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

// 이미지 import
import unit01Image from '../img/unit01.png';
import unit02Image from '../img/unit02.png';
import unit01BackImage from '../img/unit01-back.png';
import unit02BackImage from '../img/unit02-back.png';
import unit01CardBackImage from '../img/unit01-cardback.png';
import unit02CardBackImage from '../img/unit02-cardback.png';
import unit01FullImage from '../img/unit01_full.png'; // 분석 GUI용 이미지
import unit02FullImage from '../img/unit02_full.png'; // 분석 GUI용 이미지


// --- 유닛 데이터 확장 ---
// 그래프로 시각화할 performance 데이터 추가
const evaData = {
    unit01: { 
        name: "UNIT-01", 
        id: "unit01",
        image: unit01Image, 
        backImage: unit01BackImage, 
        cardBackImage: unit01CardBackImage, 
        fullImage: unit01FullImage,
        specs: {
            "Model Type": "Test Type",
            "Pilot": "Shinji Ikari",
            "Height": "75m",
            "Weight": "700t",
            "Power Source": "External Umbilical Cable, Internal Battery (5 min)",
            "Core Unit": "Yui Ikari",
            "Primary Armaments": "Progressive Knife, Pallet Rifle",
            "Special Abilities": "Berserk Mode, A.T. Field Generation, Regeneration",
            "Operational History": "First operational EVA unit. Extensive combat record against multiple Angel threats. Known for unpredictable, autonomous actions under extreme duress."
        },
        performance: {
            "Power": 95,
            "Defense": 88,
            "Mobility": 85,
            "Accuracy": 82,
            "A.T. Field": 98
        }
    },
    unit02: { 
        name: "UNIT-02", 
        id: "unit02",
        image: unit02Image, 
        backImage: unit02BackImage, 
        cardBackImage: unit02CardBackImage, 
        fullImage: unit02FullImage,
        specs: {
            "Model Type": "Production Model",
            "Pilot": "Asuka Langley Soryu",
            "Height": "75m",
            "Weight": "650t",
            "Power Source": "External Umbilical Cable, Internal Battery (5 min)",
            "Core Unit": "Kyoko Zeppelin Soryu",
            "Primary Armaments": "Progressive Knife, Pallet Rifle, Sonic Glaive",
            "Special Abilities": "First production-model with stable operational capabilities. Designed for specialized combat roles.",
            "Operational History": "First deployed in aquatic combat against Gaghiel. Showcased high performance under its designated pilot but exhibited synchronization issues later on."
        },
        performance: {
            "Power": 90,
            "Defense": 92,
            "Mobility": 94,
            "Accuracy": 96,
            "A.T. Field": 91
        }
    }
};
const evas = ['unit01', 'unit02'];

// --- 성능 그래프 컴포넌트 ---
const PerformanceGraph = ({ label, value }) => {
    const barRef = useRef(null);
    const gsap = window.gsap;
    useEffect(() => {
        if(barRef.current) {
            gsap.fromTo(barRef.current, { width: 0 }, { width: `${value}%`, duration: 1.5, ease: 'power3.out', delay: 0.5 });
        }
    }, [value, gsap]);

    return (
        <div className="performance-item">
            <span className="performance-label">{label}</span>
            <div className="performance-bar-bg">
                <div className="performance-bar-fill" ref={barRef}></div>
            </div>
            <span className="performance-value">{value}%</span>
        </div>
    );
};

// --- 생체 신호 그래프 컴포넌트 (Sync Graph) ---
const SyncGraph = ({ color }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let x = 0;
        let lastY = canvas.height / 2;
        let t = 0;

        const draw = () => {
            t += 0.1;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;

            ctx.beginPath();
            ctx.moveTo(0, lastY);

            for (let i = 0; i < canvas.width; i++) {
                const randomPeak = Math.random() < 0.01 ? (Math.random() - 0.5) * 40 : 0;
                const y = canvas.height / 2 + Math.sin(i * 0.1 + t) * (canvas.height / 10) + Math.random() * 4 - 2 + randomPeak;
                ctx.lineTo(i, y);
            }
            ctx.stroke();
            
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [color]);

    return (
        <div className="sync-graph-container">
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};


// --- 분석 GUI 컴포넌트 ---
const EvaAnalysisGUI = ({ eva, onClose }) => {
    const guiRef = useRef(null);
    const gsap = window.gsap;

    useEffect(() => {
        gsap.fromTo(guiRef.current, 
            { autoAlpha: 0, scale: 1.1 }, 
            { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power3.out' }
        );
    }, [gsap]);

    return (
        <div className={`eva-analysis-gui ${eva.id}`} ref={guiRef}>
            <div className="analysis-header">
                <span className="header-title">EVANGELION {eva.name} // ANALYSIS</span>
                <button className="analysis-close-btn" onClick={onClose}>[X]</button>
            </div>
            <div className="analysis-content">
                <div className="analysis-left-panel">
                    <div className="data-block">
                        <h4 className="data-title">COMBAT PERFORMANCE</h4>
                        <div className="performance-graphs">
                            {Object.entries(eva.performance).map(([key, value]) => (
                                <PerformanceGraph key={key} label={key} value={value} />
                            ))}
                        </div>
                    </div>
                     <div className="data-block">
                        <h4 className="data-title">BIOLOGICAL FEEDBACK</h4>
                        <SyncGraph color={eva.id === 'unit01' ? '#32cd32' : '#ffcc00'} />
                    </div>
                     <div className="data-block">
                        <h4 className="data-title">SYSTEM LOG</h4>
                        <p className="log-text">
                            [LOG] BOOT SEQUENCE INITIATED...<br/>
                            [LOG] LCL DENSITY NORMAL...<br/>
                            [LOG] SYNC RATIO STABLE...<br/>
                            [LOG] UMBILICAL CABLE CONNECTED...<br/>
                            [LOG] ALL SYSTEMS NOMINAL.
                        </p>
                    </div>
                </div>
                <div className="analysis-center-panel">
                    <img src={eva.fullImage} alt={eva.name} className="analysis-eva-image" />
                    <div className="scan-lines-vertical"></div>
                </div>
                <div className="analysis-right-panel">
                    {Object.entries(eva.specs).map(([key, value]) => (
                        <div className="spec-item" key={key}>
                            <span className="spec-key">{key.toUpperCase()}</span>
                            <span className="spec-value">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const EvangelionPage = ({ onBack }) => {
    const [selectedEva, setSelectedEva] = useState(null);
    const [showDescription, setShowDescription] = useState(false);
    const pageRef = useRef(null);
    const cardContainerRef = useRef(null);
    const fullscreenViewRef = useRef(null);
    const actionButtonsRef = useRef(null);
    const cardRefs = {
        unit01: useRef(null),
        unit02: useRef(null)
    };
    const gsap = window.gsap;
    const prevSelectedEva = useRef(null);

    // 3D 카드 호버 효과
    const handleMouseMove = (e, key) => {
        if (selectedEva) return;
        const card = cardRefs[key].current;
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = e.clientX - left - width / 2;
        const y = e.clientY - top - height / 2;
        const rotateY = (x / width) * 30;
        const rotateX = -(y / height) * 30;

        gsap.to(card, {
            rotationY: rotateY, rotationX: rotateX,
            ease: 'power1.out', duration: 0.8
        });
    };

    const handleMouseLeave = (key) => {
        if (selectedEva) return;
        gsap.to(cardRefs[key].current, {
            rotationY: 0, rotationX: 0,
            ease: 'power2.out', duration: 1
        });
    };

    const handleSelectEva = (key) => {
        if (selectedEva) return;
        setSelectedEva(key);
    };

    const handleCloseFullscreen = () => {
        if (showDescription) return;
        setSelectedEva(null);
    };

    const handleDownload = () => {
        if (!selectedEva) return;
        const link = document.createElement('a');
        link.href = evaData[selectedEva].backImage;
        link.download = `${selectedEva}-background.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    useLayoutEffect(() => {
        gsap.set(pageRef.current, { autoAlpha: 0 });
        gsap.set(cardContainerRef.current, { autoAlpha: 0, y: 50 });
        Object.values(cardRefs).forEach(ref => {
            if(ref.current) {
                gsap.set(ref.current, { 
                    rotationX: 0, 
                    rotationY: 0, 
                    transformPerspective: 1000
                });
            }
        });
    }, [gsap]);

    useEffect(() => {
        gsap.to(pageRef.current, { autoAlpha: 1, duration: 0.5 });
        gsap.to(cardContainerRef.current, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.3 });
    }, [gsap]);

    useEffect(() => {
        const wasSelected = prevSelectedEva.current;
        prevSelectedEva.current = selectedEva;

        if (selectedEva && !wasSelected) {
            gsap.timeline()
                .to(cardContainerRef.current, { autoAlpha: 0, scale: 0.9, duration: 0.5, ease: 'power2.in' })
                .fromTo(fullscreenViewRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, ease: 'power2.out' })
                .fromTo(actionButtonsRef.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.3");
        } else if (!selectedEva && wasSelected) {
            gsap.timeline()
                .to(fullscreenViewRef.current, { autoAlpha: 0, duration: 0.5, ease: 'power2.in' })
                .to(cardContainerRef.current, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power2.out' });
        }
    }, [selectedEva, gsap]);

    return (
        <div className="evangelion-page-layout" ref={pageRef}>
            <button className="back-button" onClick={onBack}>← MENU</button>

            <div className="eva-card-container" ref={cardContainerRef}>
                {evas.map(key => (
                    <div
                        key={key}
                        ref={cardRefs[key]}
                        className="eva-card"
                        onMouseMove={(e) => handleMouseMove(e, key)}
                        onMouseLeave={() => handleMouseLeave(key)}
                        onClick={() => handleSelectEva(key)}
                    >
                        <div className="card-bg" style={{ backgroundImage: `url(${evaData[key].cardBackImage})` }}></div>
                        <img src={evaData[key].image} alt={evaData[key].name} className={`card-unit ${key}`} />
                        <h2 className="card-title">{evaData[key].name}</h2>
                    </div>
                ))}
            </div>

            <div className="eva-fullscreen-view" ref={fullscreenViewRef}>
                {selectedEva && (
                    <>
                        <div 
                            className="fullscreen-bg" 
                            style={{ backgroundImage: `url(${evaData[selectedEva].backImage})` }}
                            onClick={() => !showDescription && setShowDescription(true)}
                        ></div>
                        
                        {showDescription && (
                           <EvaAnalysisGUI eva={evaData[selectedEva]} onClose={() => setShowDescription(false)} />
                        )}

                        <div className="eva-action-buttons" ref={actionButtonsRef} style={{opacity: showDescription ? 0 : 1}}>
                            <button onClick={handleCloseFullscreen}>CLOSE</button>
                            <button onClick={handleDownload}>DOWNLOAD</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EvangelionPage;
