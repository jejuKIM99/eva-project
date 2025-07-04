import React, { useState, useEffect, useRef, useMemo } from 'react';
import MenuCarousel from './MenuCarousel';
import PilotsPage from './PilotsPage';
import EvangelionPage from './EvangelionPage';
import AngelsPage from './AngelsPage';
import NervPage from './NervPage';
import SeelePage from './SeelePage';
import SecondImpactPage from './SecondImpactPage';
import LCLPage from './LCLPage';
import S2EnginePage from './S2EnginePage';
import CreditsPage from './CreditsPage';
import GuestbookPage from './GuestbookPage'; // 방명록 페이지 import
import mainImageEva from '../img/mainimg.png';
import mainVideo from '../video/mainvideo.mp4';
import mainBgm from '../video/mainbgm.mp3';

const ClassicGuiPanel = ({ title, children, className = '' }) => (
  <div className={`classic-gui-panel ${className}`}>
    <div className="classic-panel-header">
      <span className="header-deco-box"></span>
      <span className="header-title">{title}</span>
    </div>
    <div className="classic-panel-content">{children}</div>
  </div>
);

const MainContent = () => {
  const [page, setPage] = useState('main');
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('21:15:45');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeIndex, setActiveIndex] = useState(0); // 메뉴 인덱스 상태 추가

  const classicGuiRef = useRef(null);
  const gsap = window.gsap;

  const bgmAudio = useMemo(() => new Audio(mainBgm), []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    bgmAudio.loop = true;
  }, [bgmAudio]);
  
  useEffect(() => {
    const timer = setInterval(() => {
        const now = new Date();
        setCurrentTime(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleBgm = () => {
    if (isBgmPlaying) {
      bgmAudio.pause();
    } else {
      bgmAudio.play().catch(error => console.error("BGM 재생 오류:", error));
    }
    setIsBgmPlaying(!isBgmPlaying);
  };

  const handleActiveMenuClick = (menuItem, index) => {
    setActiveIndex(index); // 메뉴 인덱스 상태 업데이트
    
    let targetPage = null;
    if (menuItem.title === 'PILOTS') targetPage = 'pilots';
    if (menuItem.title === 'EVANGELION') targetPage = 'evangelion';
    if (menuItem.title === 'ANGELS') targetPage = 'angels';
    if (menuItem.title === 'NERV') targetPage = 'nerv';
    if (menuItem.title === 'SEELE') targetPage = 'seele';
    if (menuItem.title === '2nd IMPACT') targetPage = 'secondimpact';
    if (menuItem.title === 'LCL') targetPage = 'lcl';
    if (menuItem.title === 'S² ENGINE') targetPage = 's2engine';
    if (menuItem.title === 'CREDITS') targetPage = 'credits';
    if (menuItem.title === 'GUESTBOOK') targetPage = 'guestbook'; // 방명록 페이지 라우팅 추가

    if (targetPage) {
      gsap.to(classicGuiRef.current, {
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power2.in',
        onComplete: () => setPage(targetPage)
      });
    }
  };

  const handleBack = () => {
    setPage('main');
    gsap.fromTo(classicGuiRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 1.0, ease: 'power2.out', delay: 0.5 }
    );
  };

  useEffect(() => {
    if (page === 'main') {
        gsap.fromTo(classicGuiRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, delay: 0.2 });
    }
  }, [page, gsap]);

  return (
    <div className="page-container">
      <div className="background-video-container">
        <video autoPlay loop muted playsInline src={mainVideo} />
        <div className="video-overlay"></div>
      </div>

      {page === 'main' && (
        <div className={`classic-gui-container ${isMobile ? 'mobile-layout' : ''}`} ref={classicGuiRef}>
          <div className="classic-scanlines"></div>
          <div className="classic-grid-overlay"></div>
          
          <div className="classic-top-bar">
            <span>NERV CENTRAL DOGMA - MAIN MONITOR</span>
            <span>{currentTime}</span>
          </div>

          <div className="classic-main-content">
            <div className="classic-left-sidebar">
              <ClassicGuiPanel title="MAGI_SYSTEM_STATUS">
                <p>CASPER-3: <span className="text-green">ONLINE</span></p>
                <p>BALTHASAR-2: <span className="text-green">ONLINE</span></p>
                <p>MELCHIOR-1: <span className="text-green">ONLINE</span></p>
                <p>DECISION: <span className="text-orange">IN_PROGRESS...</span></p>
              </ClassicGuiPanel>
              <ClassicGuiPanel title="SYSTEM_ALERT" className="alert-panel">
                <p className="flicker text-red large-text">PATTERN: BLUE</p>
                <p>CLASSIFICATION: ANGEL</p>
                <p>CODE: 4-A</p>
              </ClassicGuiPanel>
            </div>

            <div className="classic-center-area">
              <div className="main-visual-container">
                <img src={mainImageEva} alt="Main Visual" className="main-image" />
              </div>
              <MenuCarousel
                onActiveItemClick={(menuItem) => handleActiveMenuClick(menuItem, activeIndex)}
                initialDelay={0.5}
                isMobile={isMobile}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            </div>

            <div className="classic-right-sidebar">
               <ClassicGuiPanel title="TERMINAL_LOG" className="log-panel">
                 <p>&gt; Connection to Bridge... OK</p>
                 <p>&gt; Sync Rate Check... 41.3%</p>
                 <p>&gt; A.T. Field... NOMINAL</p>
                 <p>&gt; Umbilical Cable... CONNECTED</p>
                 <p>&gt; Internal Battery... 98%</p>
                 <p>&gt; Ready for launch.</p>
              </ClassicGuiPanel>
            </div>
          </div>

          <div className="classic-bottom-bar">
            <span>GOD'S IN HIS HEAVEN. ALL'S RIGHT WITH THE WORLD.</span>
          </div>
        </div>
      )}

      <div className={`bgm-player-container ${page !== 'main' ? 'hidden' : ''}`}>
        <button onClick={toggleBgm} className="bgm-toggle-button" aria-label="Toggle BGM">
          {isBgmPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.54 8.46C16.48 9.4 17 10.64 17 12C17 13.36 16.48 14.6 15.54 15.54" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="1" y1="1" x2="23" y2="23" stroke="#888" strokeWidth="2"/>
            </svg>
          )}
        </button>
        <div className={`music-info-wrapper ${isBgmPlaying ? 'playing' : ''}`}>
          <div className="music-info-text">
            Dispossession / Pluck Ver. - MONACA
          </div>
        </div>
        {isBgmPlaying && (
          <div className="sound-bar">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <rect className="bar" x="4" y="8" width="4" height="8"></rect>
              <rect className="bar" x="10" y="4" width="4" height="16"></rect>
              <rect className="bar" x="16" y="10" width="4" height="4"></rect>
            </svg>
          </div>
        )}
      </div>

      {page === 'pilots' && <PilotsPage onBack={handleBack} />}
      {page === 'evangelion' && <EvangelionPage onBack={handleBack} />}
      {page === 'angels' && <AngelsPage onBack={handleBack} />}
      {page === 'nerv' && <NervPage onBack={handleBack} />}
      {page === 'seele' && <SeelePage onBack={handleBack} />}
      {page === 'secondimpact' && <SecondImpactPage onBack={handleBack} />}
      {page === 'lcl' && <LCLPage onBack={handleBack} />}
      {page === 's2engine' && <S2EnginePage onBack={handleBack} />}
      {page === 'credits' && <CreditsPage onBack={handleBack} />}
      {page === 'guestbook' && <GuestbookPage onBack={handleBack} />}
    </div>
  );
};

export default MainContent;
