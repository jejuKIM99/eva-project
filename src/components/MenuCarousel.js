// src/components/MenuCarousel.js

import React, { useEffect, useRef } from 'react';

// --- 메뉴 데이터 수정 ---
const menuItemsData = [
    { id: 1, title: 'PILOTS' },
    { id: 2, title: 'EVANGELION' },
    { id: 3, title: 'ANGELS' },
    { id: 4, title: 'NERV' },
    { id: 5, title: 'SEELE' },
    { id: 6, title: '2nd IMPACT' },
    { id: 7, title: 'LCL' },
    { id: 8, title: 'S² ENGINE' },
    { id: 9, title: 'CREDITS' },
    { id: 10, title: 'GUESTBOOK' }, // 방명록 추가
];

const MenuCarousel = ({ onActiveItemClick, initialDelay, isMobile, activeIndex, setActiveIndex }) => {
    const containerRef = useRef(null);
    const gsap = window.gsap;

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current, 
                { autoAlpha: 0, y: 20 }, 
                { autoAlpha: 1, y: 0, duration: 0.8, delay: initialDelay || 0.5, ease: 'power2.out' }
            );
        }
    }, [initialDelay, gsap]);

    const handleNavigation = (direction) => {
        const newIndex = (activeIndex + direction + menuItemsData.length) % menuItemsData.length;
        setActiveIndex(newIndex);
    };
    
    // 활성화된 메뉴 아이템 클릭 시 페이지 전환
    const handleItemClick = (index) => {
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
                    <span className="active-text">{menuItemsData[activeIndex].title}</span>
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
                    <span className="active-text">{menuItemsData[activeIndex].title}</span>
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