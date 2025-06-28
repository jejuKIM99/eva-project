import React, { useState, useEffect, useRef } from 'react';
import MenuCarousel from './MenuCarousel';
import PilotsPage from './PilotsPage';
import EvangelionPage from './EvangelionPage';
import AngelsPage from './AngelsPage';
import NervPage from './NervPage';
import SeelePage from './SeelePage';
import mainImageEva from '../img/mainimg.png';

const MainContent = () => {
  const [page, setPage] = useState('main'); // 'main', 'pilots', 'evangelion', 'angels', 'nerv', 'seele'
  
  const mainContentRef = useRef(null);
  const mainLayoutRef = useRef(null);
  const gsap = window.gsap;
  
  const handleActiveMenuClick = (menuItem) => {
    let targetPage = null;
    // 페이지 전환이 필요한 메뉴 항목들
    if (menuItem.title === 'PILOTS') targetPage = 'pilots';
    if (menuItem.title === 'EVANGELION') targetPage = 'evangelion';
    if (menuItem.title === 'ANGELS') targetPage = 'angels';
    if (menuItem.title === 'NERV') targetPage = 'nerv';
    if (menuItem.title === 'SEELE') targetPage = 'seele';

    if (targetPage) {
      gsap.to(mainLayoutRef.current, {
        autoAlpha: 0,
        y: '-50%', // 수직 방향으로 사라지는 애니메이션
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => setPage(targetPage)
      });
    }
  };

  const handleBack = () => {
    setPage('main');
    gsap.fromTo(mainLayoutRef.current, 
        { autoAlpha: 0, y: '-50%' }, 
        { autoAlpha: 1, y: '0%', duration: 0.8, ease: 'power3.out', delay: 0.5 }
    );
  };

  useEffect(() => {
    // 컴포넌트 첫 로딩 시 나타나는 애니메이션
    gsap.to(mainContentRef.current, { autoAlpha: 1, duration: 0.5 });
  }, [page, gsap]);


  return (
    <div className="page-container">
      {/* data-theme 속성은 eva로 고정 */}
      <div 
        className="main-content" 
        ref={mainContentRef} 
        data-theme="eva"
      >
        {/* 새로운 수직 중앙 정렬 레이아웃 */}
        <div className="main-layout" ref={mainLayoutRef}>
          <div className="main-visual-container">
            <img src={mainImageEva} alt="Main Visual" className="main-image" />
          </div>
          
          <MenuCarousel 
            onActiveItemClick={handleActiveMenuClick}
            initialDelay={0.5} 
          />

          {/* content-display div 완전 제거 */}
        </div>
      </div>
      {/* 다른 페이지 컴포넌트들은 그대로 유지 */}
      {page === 'pilots' && <PilotsPage onBack={handleBack} />}
      {page === 'evangelion' && <EvangelionPage onBack={handleBack} />}
      {page === 'angels' && <AngelsPage onBack={handleBack} />}
      {page === 'nerv' && <NervPage onBack={handleBack} />}
      {page === 'seele' && <SeelePage onBack={handleBack} />}
    </div>
  );
};

export default MainContent;