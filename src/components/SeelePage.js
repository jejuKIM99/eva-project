import React, { useState, useEffect, useRef } from 'react';
import seeleLogoImage from '../img/seele.png';
import unitMassImage from '../img/unitMass.png';
import KeelLorenzProfile from '../img/KeelLorenz_profile.jpg';

const SeelePage = ({ onBack }) => {
    const [view, setView] = useState('monolith');
    const [activeGui, setActiveGui] = useState(null);
    const [isClosing, setIsClosing] = useState(false);

    const pageRef = useRef(null);
    const mainContentRef = useRef(null);
    const toggleButtonRef = useRef(null);
    const seeleLogoRef = useRef(null);
    const mainWrapperRef = useRef(null);
    const keelGuiRef = useRef(null);
    const mpEvaGuiRef = useRef(null);
    const keelProfileRef = useRef(null);

    const gsap = window.gsap;
    const monolithCount = 7;

    useEffect(() => {
        const monoliths = gsap.utils.toArray('.monolith');
        const monolithContents = gsap.utils.toArray('.monolith-content');
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.to(toggleButtonRef.current, { autoAlpha: 1, duration: 1 });
            }
        });

        tl.fromTo(pageRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 })
          .fromTo(seeleLogoRef.current, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.7, delay: 0.3 })
          .fromTo(monoliths, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out' }, "-=0.5")
          .to(monolithContents, { autoAlpha: 1, duration: 0.5, stagger: 0.15 }, "-=0.8");

    }, [gsap]);

    const toggleMainInfo = () => {
        setView(prev => prev === 'mainInfo' ? 'monolith' : 'mainInfo');
    };

    useEffect(() => {
        if (view === 'mainInfo') {
            gsap.fromTo(mainContentRef.current, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' });
        } else if (gsap.getProperty(mainContentRef.current, 'autoAlpha') > 0) {
            gsap.to(mainContentRef.current, { autoAlpha: 0, y: 30, duration: 0.5, ease: 'power3.in' });
        }
    }, [view, gsap]);

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
    
    useEffect(() => {
        const mainWrapper = mainWrapperRef.current;
        if (mainWrapper) {
            if (activeGui) {
                mainWrapper.classList.add('blurred');
            } else {
                mainWrapper.classList.remove('blurred');
            }
        }
    }, [activeGui]);

    useEffect(() => {
        let glitchInterval;
        if (activeGui === 'keel' && keelProfileRef.current) {
            const setRandomGlitch = () => {
                const isOn = Math.random() > 0.3;
                keelProfileRef.current.classList.toggle('glitching', isOn);
                
                const nextInterval = isOn 
                    ? Math.random() * 180 + 50 // 글리치가 켜져있는 시간
                    : Math.random() * 800 + 200; // 글리치가 꺼져있는 시간

                glitchInterval = setTimeout(setRandomGlitch, nextInterval);
            };
            setRandomGlitch();
        }

        return () => {
            clearTimeout(glitchInterval);
        };
    }, [activeGui]);


    return (
        <div className="seele-page-layout" ref={pageRef}>
            <div className="seele-content-wrapper" ref={mainWrapperRef}>
                <button className="back-button" onClick={onBack}>← MENU</button>

                <div className="seele-logo" ref={seeleLogoRef}>
                    <img src={seeleLogoImage} alt="Seele Logo" />
                </div>

                <div className="seele-container">
                    <div className="monolith-circle">
                        {[...Array(monolithCount)].map((_, i) => {
                            const angle = (360 / monolithCount) * i;
                            const style = { transform: `rotateY(${angle}deg) translateZ(350px)` };
                            return (
                                <div key={i} className="monolith" style={style}>
                                    <div className="monolith-content">
                                        <div className="monolith-header">SEELE</div>
                                        <div className="monolith-number">{`0${i + 1}`}</div>
                                        <div className="monolith-footer">SOUND ONLY</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button
                    className="seele-toggle-info"
                    ref={toggleButtonRef}
                    onClick={toggleMainInfo}
                >
                    {view === 'mainInfo' ? 'CLOSE' : 'OPEN'} INFO
                </button>

                <div className="seele-main-content" ref={mainContentRef}>
                    <h2 className="seele-title">SEELE</h2>
                    <p className="seele-description">The secret and ancient organization manipulating global events from the shadows...</p>
                    <div className="seele-sub-menu">
                        <div className="seele-menu-item" onClick={() => openGui('keel')}>Keel Lorenz</div>
                        <div className="seele-menu-item" onClick={() => openGui('mpEva')}>Mass Production Evangelions</div>
                    </div>
                </div>
            </div>

            {/* --- 킬 로렌츠 정보 GUI --- */}
            {activeGui === 'keel' && (
                <div className={`seele-gui-overlay ${isClosing ? 'closing' : ''}`} >
                    <div className="keel-gui-container" ref={keelGuiRef}>
                        <div className="gui-header keel-header">
                            <span>MEMBER PROFILE: 01</span>
                            <button onClick={closeGui} className="gui-close-btn">×</button>
                        </div>
                        <div className="gui-content-grid">
                            <div className="gui-left-panel">
                                <div 
                                    className="profile-image-container" 
                                    ref={keelProfileRef}
                                    style={{ '--profile-image-url': `url(${KeelLorenzProfile})` }}
                                >
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
                                        Keel Lorenz is the enigmatic chairman of Seele and the main antagonist behind the Human Instrumentality Project. Often appearing only as a monolith labeled "SEELE 01," he orchestrates events from the shadows, his true motives and history shrouded in mystery.
                                    </p>
                                </div>
                                <div className="data-block">
                                    <div className="data-title">VOICE ANALYSIS</div>
                                    <div className="waveform-container">
                                        <div className="waveform"><div className="waveform-visual"></div></div>
                                        <div className="waveform"><div className="waveform-visual"></div></div>
                                        <div className="waveform"><div className="waveform-visual"></div></div>
                                    </div>
                                    <div className="analysis-footer">
                                        <span>{/* STATUS: SOUND ONLY */}</span>
                                        <span>{/* DECODING... */}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- 양산형 에반게리온 정보 GUI --- */}
            {activeGui === 'mpEva' && (
                <div className={`seele-gui-overlay ${isClosing ? 'closing' : ''}`} >
                    <div className="mpeva-gui-container" ref={mpEvaGuiRef}>
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
                                        The final series of Evangelions produced by Seele. These nine units are autonomous, equipped with S² Engines, and wield large, double-bladed weapons based on the Lance of Longinus. Their most unsettling feature is their vulture-like appearance and grinning visage.
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