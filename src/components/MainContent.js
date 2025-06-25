import React, { useState, useEffect, useRef } from 'react';
import MenuCarousel from './MenuCarousel';
import PilotsPage from './PilotsPage';
import EvangelionPage from './EvangelionPage';
import AngelsPage from './AngelsPage';
import NervPage from './NervPage'; // NervPage import
import mainImageEva from '../img/mainimg.png';
import mainImageDod from '../img/mainimg2.png';

const MainContent = () => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('eva');
  const [page, setPage] = useState('main'); // 'main', 'pilots', 'evangelion', 'angels', 'nerv'
  
  const mainContentRef = useRef(null);
  const mainLayoutRef = useRef(null);
  const imageRef = useRef(null);
  const gsap = window.gsap;

  useEffect(() => {
    if (page !== 'main') return;

    const newImage = currentTheme === 'eva' ? mainImageEva : mainImageDod;
    gsap.to(imageRef.current, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
            if(imageRef.current) imageRef.current.src = newImage;
            gsap.to(imageRef.current, { opacity: 1, duration: 0.4 });
        }
    });
  }, [currentTheme, page]);

  const handleMenuSelect = (menuItem) => {
    if (menuItem.theme !== currentTheme) {
        setCurrentTheme(menuItem.theme);
    }
    setSelectedContent(menuItem);
  };
  
  // 페이지 전환 로직 수정
  const handleActiveMenuClick = (menuItem) => {
    let targetPage = null;
    if (menuItem.title === 'PILOTS') targetPage = 'pilots';
    if (menuItem.title === 'EVANGELION') targetPage = 'evangelion';
    if (menuItem.title === 'ANGELS') targetPage = 'angels';
    if (menuItem.title === 'NERV') targetPage = 'nerv'; // NERV 페이지 추가

    if (targetPage) {
      gsap.to(mainLayoutRef.current, {
        autoAlpha: 0,
        x: '-100%',
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => setPage(targetPage)
      });
    }
  };

  const handleBack = () => {
    setPage('main');
    gsap.fromTo(mainLayoutRef.current, 
        { autoAlpha: 0, x: '-100%' }, 
        { autoAlpha: 1, x: '0%', duration: 0.8, ease: 'power3.out', delay: 0.5 }
    );
  };

  useEffect(() => {
    gsap.to(mainContentRef.current, { autoAlpha: 1, duration: 0.5 });
  }, []);

  return (
    <div className="page-container">
      <div 
        className="main-content" 
        ref={mainContentRef} 
        data-theme={currentTheme}
      >
        <div className="main-layout" ref={mainLayoutRef}>
          <div className="left-panel">
            <img ref={imageRef} src={mainImageEva} alt="Main Visual" className="main-image" />
          </div>
          <div className="right-panel">
            <div className="menu-section">
              <MenuCarousel 
                onMenuSelect={handleMenuSelect}
                onActiveItemClick={handleActiveMenuClick}
                initialDelay={0.5} 
              />
              <div className="content-display">
                {selectedContent && (
                  <>
                    <h2>{selectedContent.title}</h2>
                    <p>{selectedContent.content}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {page === 'pilots' && <PilotsPage onBack={handleBack} />}
      {page === 'evangelion' && <EvangelionPage onBack={handleBack} />}
      {page === 'angels' && <AngelsPage onBack={handleBack} />}
      {page === 'nerv' && <NervPage onBack={handleBack} />}
    </div>
  );
};

export default MainContent;