// src/components/MenuCarousel.js

import React, { useEffect, useRef, useMemo } from 'react';
import clickSound from '../video/click.wav';

// --- 메뉴 데이터 수정 ---
const menuItemsData = [
    { id: 1, title: 'PILOTS', tooltip: 'Data on Evangelion pilots' },
    { id: 2, title: 'EVANGELION', tooltip: 'Specifications of EVA units' },
    { id: 3, title: 'ANGELS', tooltip: 'Information on identified Angels' },
    { id: 4, title: 'NERV', tooltip: 'Confidential NERV organization data' },
    { id: 5, title: 'SEELE', tooltip: 'The mysterious committee behind NERV' },
    { id: 6, title: '2nd IMPACT', tooltip: 'Historical records of the cataclysm' },
    { id: 7, title: 'LCL', tooltip: 'The primordial soup of life' },
    { id: 8, title: 'S² ENGINE', tooltip: 'The infinite power source' },
    { id: 9, title: 'CREDITS', tooltip: 'Creators of this terminal' },
    { id: 10, title: 'GUESTBOOK', tooltip: 'Leave your mark on history' },
];

const MenuCarousel = ({ onActiveItemClick, initialDelay, isMobile, activeIndex, setActiveIndex }) => {
    const containerRef = useRef(null);
    const gsap = window.gsap;
    const audio = useMemo(() => new Audio(clickSound), []);

    const playSound = () => {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Sound play prevented:', e));
    };

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current, 
                { autoAlpha: 0, y: 20 }, 
                { autoAlpha: 1, y: 0, duration: 0.8, delay: initialDelay || 0.5, ease: 'power2.out' }
            );
        }
    }, [initialDelay, gsap]);

    const handleNavigation = (direction) => {
        playSound();
        const newIndex = (activeIndex + direction + menuItemsData.length) % menuItemsData.length;
        setActiveIndex(newIndex);
    };
    
    // 활성화된 메뉴 아이템 클릭 시 페이지 전환
    const handleItemClick = (index) => {
        playSound();
        if (index === activeIndex) {
            onActiveItemClick(menuItemsData[index]);
        } else {
            setActiveIndex(index);
        }
    };

    const prevIndex = (activeIndex - 1 + menuItemsData.length) % menuItemsData.length;
    const nextIndex = (activeIndex + 1) % menuItemsData.length;

    const renderDesktop = () => (
        <>
            <div className="carousel-nav-classic left">
                <button className="nav-button-classic" onClick={() => handleNavigation(-1)}>ᐊ</button>
            </div>
            <div className="carousel-display-classic">
                <div className="menu-item-classic side-item" onClick={() => handleNavigation(-1)}>
                    <span>{menuItemsData[prevIndex].title}</span>
                </div>
                <div className="menu-item-classic active-item" onClick={() => handleItemClick(activeIndex)}>
                    <span className="active-bracket left">[</span>
                    <div className="active-text-wrapper">
                        <span className="active-text glitch-effect" data-text={menuItemsData[activeIndex].title}>
                            {menuItemsData[activeIndex].title}
                        </span>
                        <div className="menu-tooltip">{menuItemsData[activeIndex].tooltip}</div>
                    </div>
                    <span className="active-bracket right">]</span>
                </div>
                <div className="menu-item-classic side-item" onClick={() => handleNavigation(1)}>
                    <span>{menuItemsData[nextIndex].title}</span>
                </div>
            </div>
            <div className="carousel-nav-classic right">
                <button className="nav-button-classic" onClick={() => handleNavigation(1)}>ᐅ</button>
            </div>
        </>
    );
    
    const renderMobile = () => (
        <>
            <div className="carousel-display-classic">
                <div className="menu-item-classic active-item" onClick={() => handleItemClick(activeIndex)}>
                    <span className="active-bracket left">[</span>
                    <div className="active-text-wrapper">
                        <span className="active-text">{menuItemsData[activeIndex].title}</span>
                        <div className="menu-tooltip">{menuItemsData[activeIndex].tooltip}</div>
                    </div>
                    <span className="active-bracket right">]</span>
                </div>
            </div>
            <div className="carousel-nav-wrapper-mobile">
                <button className="nav-button-classic" onClick={() => handleNavigation(-1)}>ᐊ</button>
                <button className="nav-button-classic" onClick={() => handleNavigation(1)}>ᐅ</button>
            </div>
        </>
    );

    return (
        <div className="carousel-container-classic" ref={containerRef}>
            {isMobile ? renderMobile() : renderDesktop()}
        </div>
    );
};

export default MenuCarousel;