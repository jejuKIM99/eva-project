import React, { useState, useEffect, useRef } from 'react';
import seeleLogoImage from '../img/seele.png';
import unitMassImage from '../img/unitMass.png';

const SeelePage = ({ onBack }) => {
    const [view, setView] = useState('monolith'); // 'monolith', 'mainInfo', 'mpEva'
    const pageRef = useRef(null);
    const monolithContainerRef = useRef(null);
    const seeleLogoRef = useRef(null);
    const mainContentRef = useRef(null);
    const mpEvaContentRef = useRef(null);
    const toggleButtonRef = useRef(null);
    const gsap = window.gsap;

    const monolithCount = 7;

    // 초기 등장 애니메이션
    useEffect(() => {
        const monoliths = gsap.utils.toArray('.monolith');
        const monolithContents = gsap.utils.toArray('.monolith-content');
        const monolithLights = gsap.utils.toArray('.monolith::after');
        const tl = gsap.timeline({
            onComplete: () => {
                // 초기 애니메이션이 끝나면 버튼을 표시
                gsap.to(toggleButtonRef.current, { autoAlpha: 1, duration: 1 });
            }
        });

        tl.fromTo(pageRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 });
        tl.fromTo(seeleLogoRef.current, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.7, delay: 0.3 });
        tl.fromTo(monoliths, 
            { autoAlpha: 0, y: 50 }, 
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out' },
            "-=0.5"
        );
        tl.to([monolithContents, monolithLights], { autoAlpha: 1, duration: 0.5, stagger: 0.15 }, "-=0.8");

    }, [gsap]);

    // 뷰(view) 상태에 따른 애니메이션 처리
    const handleViewChange = (newView) => {
        const monoliths = gsap.utils.toArray('.monolith');

        if (newView === 'mpEva') {
            const tl = gsap.timeline({ onComplete: () => setView('mpEva') });
            tl.to(mainContentRef.current, { autoAlpha: 0, y: 30, duration: 0.5, ease: 'power3.in' })
              .to(toggleButtonRef.current, { autoAlpha: 0 }, "<")
              .to(seeleLogoRef.current, { autoAlpha: 0, scale: 0.8, duration: 0.5 }, "<")
              .to(monoliths, {
                  y: () => Math.random() * 800 - 400,
                  x: () => Math.random() * 800 - 400,
                  scale: 0,
                  opacity: 0,
                  duration: 1,
                  stagger: 0.1,
                  ease: 'power2.in'
              }, "-=0.3")
              .fromTo(mpEvaContentRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 });
        } else if (newView === 'initial') { // 양산형 에바에서 초기 상태로 복귀
            const tl = gsap.timeline({ onComplete: () => setView('monolith') });
            tl.to(mpEvaContentRef.current, { autoAlpha: 0, duration: 0.5 })
              .to(monoliths, {
                  y: 0, x: 0, scale: 1, opacity: 1,
                  duration: 1, stagger: 0.1, ease: 'power3.out'
              })
              .to([seeleLogoRef.current, toggleButtonRef.current], { autoAlpha: 1, scale: 1, duration: 0.7 }, "-=0.5");
        }
    };

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

    return (
        <div className="seele-page-layout" ref={pageRef}>
            <button className="back-button" onClick={onBack}>← MENU</button>
            
            <div className="seele-logo" ref={seeleLogoRef}>
                <img src={seeleLogoImage} alt="Seele Logo" />
            </div>

            <div className="seele-container">
                <div className="monolith-circle" ref={monolithContainerRef}>
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

            {/* 제레 기본 정보창 */}
            <div className="seele-main-content" ref={mainContentRef}>
                <h2 className="seele-title">SEELE</h2>
                <p className="seele-description">The secret and ancient organization manipulating global events from the shadows...</p>
                <div className="seele-sub-menu">
                    <div className="seele-menu-item">Keel Lorenz</div>
                    <div className="seele-menu-item" onClick={() => handleViewChange('mpEva')}>Mass Production Evangelions</div>
                </div>
            </div>

            {/* 양산형 에바 정보창 */}
            <div className="mp-eva-view" ref={mpEvaContentRef}>
                <img src={unitMassImage} alt="Mass Production Evangelion" className="mp-eva-image" />
                <div className="mp-eva-description">
                    <h2>Mass Production Evangelion</h2>
                    <p>The final series of Evangelions produced by Seele. These nine units are autonomous, equipped with S² Engines, and wield large, double-bladed weapons. Their most unsettling feature is their vulture-like appearance and grinning visage.</p>
                    <button onClick={() => handleViewChange('initial')}>CLOSE</button>
                </div>
            </div>
        </div>
    );
};

export default SeelePage;