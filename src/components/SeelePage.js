import React, { useState, useEffect, useRef } from 'react';
import seeleLogoImage from '../img/seele.png';
import unitMassImage from '../img/unitMass.png';
import keelLorenzImage from '../img/KeelLorenz.png'; // 킬 로렌츠 이미지 import

const SeelePage = ({ onBack }) => {
    // 'mainInfo'는 하단 정보창, 'activeOverlay'는 현재 활성화된 오버레이를 관리합니다 ('mpEva', 'keel')
    const [view, setView] = useState('monolith');
    const [activeOverlay, setActiveOverlay] = useState(null);

    // DOM 요소에 접근하기 위한 Ref들
    const pageRef = useRef(null);
    const mainContentRef = useRef(null);
    const overlayRef = useRef(null); // 오버레이 컨테이너 Ref
    const toggleButtonRef = useRef(null);
    const seeleLogoRef = useRef(null);
    const mainWrapperRef = useRef(null); // 블러 효과를 적용할 메인 콘텐츠 래퍼

    const gsap = window.gsap;
    const monolithCount = 7;

    // 오버레이에 표시될 데이터
    const overlayData = {
        mpEva: {
            title: 'Mass Production Evangelion',
            image: unitMassImage,
            alt: 'Mass Production Evangelion',
            description: 'The final series of Evangelions produced by Seele. These nine units are autonomous, equipped with S² Engines, and wield large, double-bladed weapons. Their most unsettling feature is their vulture-like appearance and grinning visage.'
        },
        keel: {
            title: 'Keel Lorenz',
            image: keelLorenzImage,
            alt: 'Keel Lorenz',
            description: 'Keel Lorenz is the enigmatic chairman of Seele and the main antagonist behind the Human Instrumentality Project. Often appearing only as a monolith labeled "SEELE 01," he orchestrates events from the shadows, his true motives and history shrouded in mystery.'
        }
    };

    // 페이지 및 모노리스 초기 등장 애니메이션
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

    // 하단 INFO 창을 열고 닫는 함수
    const toggleMainInfo = () => {
        setView(prev => prev === 'mainInfo' ? 'monolith' : 'mainInfo');
    };

    // 'view' 상태에 따라 INFO 창 애니메이션 처리
    useEffect(() => {
        if (view === 'mainInfo') {
            gsap.fromTo(mainContentRef.current, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' });
        } else if (gsap.getProperty(mainContentRef.current, 'autoAlpha') > 0) {
            gsap.to(mainContentRef.current, { autoAlpha: 0, y: 30, duration: 0.5, ease: 'power3.in' });
        }
    }, [view, gsap]);

    // 'activeOverlay' 상태에 따라 배경 블러 및 오버레이 표시 처리
    useEffect(() => {
        const mainWrapper = mainWrapperRef.current;
        const overlay = overlayRef.current;
        
        if (mainWrapper && overlay) {
            if (activeOverlay) {
                mainWrapper.classList.add('blurred');
                overlay.classList.add('visible');
            } else {
                mainWrapper.classList.remove('blurred');
                overlay.classList.remove('visible');
            }
        }
    }, [activeOverlay]);

    const currentOverlayData = activeOverlay ? overlayData[activeOverlay] : null;

    return (
        <div className="seele-page-layout" ref={pageRef}>
            {/* --- 메인 콘텐츠 래퍼 (블러 효과 대상) --- */}
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

                {/* 제레 기본 정보창 */}
                <div className="seele-main-content" ref={mainContentRef}>
                    <h2 className="seele-title">SEELE</h2>
                    <p className="seele-description">The secret and ancient organization manipulating global events from the shadows...</p>
                    <div className="seele-sub-menu">
                        <div className="seele-menu-item" onClick={() => setActiveOverlay('keel')}>Keel Lorenz</div>
                        <div className="seele-menu-item" onClick={() => setActiveOverlay('mpEva')}>Mass Production Evangelions</div>
                    </div>
                </div>
            </div>

            {/* --- 정보 오버레이 (공용) --- */}
            <div className="seele-overlay-view" ref={overlayRef}>
                {currentOverlayData && (
                    <div className="overlay-content-box">
                        <img src={currentOverlayData.image} alt={currentOverlayData.alt} className="overlay-image" />
                        <div className="overlay-description">
                            <h2>{currentOverlayData.title}</h2>
                            <p>{currentOverlayData.description}</p>
                            <button onClick={() => setActiveOverlay(null)}>CLOSE</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeelePage;
