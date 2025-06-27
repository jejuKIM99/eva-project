import React, { useState, useEffect, useRef } from 'react';
import MenuCarousel from './MenuCarousel';
import PilotsPage from './PilotsPage';
import EvangelionPage from './EvangelionPage';
import AngelsPage from './AngelsPage';
import NervPage from './NervPage';
import SeelePage from './SeelePage';
import mainImageEva from '../img/mainimg.png';

const MainContent = () => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [page, setPage] = useState('main'); // 'main', 'pilots', 'evangelion', 'angels', 'nerv', 'seele'
  
  const mainContentRef = useRef(null);
  const mainLayoutRef = useRef(null);
  const gsap = window.gsap;

  const handleMenuSelect = (menuItem) => {
    setSelectedContent(menuItem);
  };
  
  // 페이지 전환 로직
  const handleActiveMenuClick = (menuItem) => {
    // title 매핑을 통해 targetPage 결정
    const pageMapping = {
        'PILOTS': 'pilots',
        'EVANGELION': 'evangelion',
        'ANGELS': 'angels',
        'NERV': 'nerv',
        'SEELE': 'seele',
        // 추가된 메뉴는 상세 페이지가 없으므로 전환하지 않음
    };
    const targetPage = pageMapping[menuItem.title];

    if (targetPage) {
      gsap.to(mainLayoutRef.current, {
        autoAlpha: 0,
        x: '-100%', // y에서 x로 변경: 왼쪽으로 사라지는 효과
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => setPage(targetPage)
      });
    }
  };

  const handleBack = () => {
    setPage('main');
    // x축으로 다시 나타나는 애니메이션으로 변경
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
        // 테마는 'eva'로 고정
        data-theme='eva' 
      >
        <div className="main-layout" ref={mainLayoutRef}>
          {/* 중앙 이미지 */}
          <div className="main-image-container">
            <img src={mainImageEva} alt="Main Visual" className="main-image" />
          </div>

          {/* 하단 메뉴 섹션 */}
          <div className="bottom-menu-section">
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
      {/* 각 상세 페이지 컴포넌트 */}
      {page === 'pilots' && <PilotsPage onBack={handleBack} />}
      {page === 'evangelion' && <EvangelionPage onBack={handleBack} />}
      {page === 'angels' && <AngelsPage onBack={handleBack} />}
      {page === 'nerv' && <NervPage onBack={handleBack} />}
      {page === 'seele' && <SeelePage onBack={handleBack} />}
    </div>
  );
};

export default MainContent;