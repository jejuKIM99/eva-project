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
import mainVideo from '../video/mainvideo.mp4';
import mainBgm from '../video/mainbgm.mp3';
import EvaLogo from './EvaLogo';
import PageTransition from './PageTransition';
import PilotsBackground from './PilotsBackground';
import EvangelionBackground from './EvangelionBackground';
import AngelsBackground from './AngelsBackground';
import NervBackground from './NervBackground';
import SeeleBackground from './SeeleBackground';
import SecondImpactBackground from './SecondImpactBackground';
import LCLBackground from './LCLBackground';
import S2EngineBackground from './S2EngineBackground';
import CreditsBackground from './CreditsBackground';
import GuestbookBackgroundThematic from './GuestbookBackgroundThematic';

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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingPage, setPendingPage] = useState(null);

  const classicGuiRef = useRef(null);
  const containerRef = useRef(null);
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

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  const toggleBgm = () => {
    if (isBgmPlaying) {
      bgmAudio.pause();
    } else {
      bgmAudio.play().catch(error => console.error("BGM 재생 오류:", error));
    }
    setIsBgmPlaying(!isBgmPlaying);
  };

  const handleActiveMenuClick = (menuItem, index) => {
    setActiveIndex(index);
    
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
    if (menuItem.title === 'GUESTBOOK') targetPage = 'guestbook';

    if (targetPage) {
      pendingPageRef.current = targetPage; // Update ref immediately
      setPendingPage(targetPage);
      setIsTransitioning(true);
    }
  };

  const handleTransitionComplete = React.useCallback(() => {
    setIsTransitioning(false);
  }, []);

  const pendingPageRef = useRef(null);

  const handlePageChange = React.useCallback(() => {
    if (pendingPageRef.current) {
      setPage(pendingPageRef.current);
      // Do not clear the ref here, clear it in complete or keep it for the transition's duration
    }
  }, []);

  const handleBack = React.useCallback(() => {
    pendingPageRef.current = 'main';
    setPendingPage('main');
    setIsTransitioning(true);
  }, []);

  // [복구/수정] 초기 로딩 후 메인 화면 진입 애니메이션 - 첫 마운트 시에만 실행되도록 ref 추가
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (page === 'main' && !isTransitioning) {
        if (isInitialMount.current) {
            gsap.set(classicGuiRef.current, { autoAlpha: 0 });
            gsap.to(classicGuiRef.current, 
              { autoAlpha: 1, duration: 1.2, delay: 0.5, ease: 'power2.out' }
            );
            isInitialMount.current = false;
        } else {
            // 이미 메인에 한번 들어온 적이 있다면 (BACK으로 돌아오는 경우 등) 즉시 표시하여 깜빡임 방지
            gsap.set(classicGuiRef.current, { autoAlpha: 1 });
        }
    }
  }, [page, gsap, isTransitioning]);

  return (
    <div className="page-container" onMouseMove={handleMouseMove} ref={containerRef}>
      {/* Thematic Sub-page Backgrounds */}
      {page === 'pilots' && <PilotsBackground />}
      {page === 'evangelion' && <EvangelionBackground />}
      {page === 'angels' && <AngelsBackground />}
      {page === 'nerv' && <NervBackground />}
      {page === 'seele' && <SeeleBackground />}
      {page === 'secondimpact' && <SecondImpactBackground />}
      {page === 'lcl' && <LCLBackground />}
      {page === 's2engine' && <S2EngineBackground />}
      {page === 'credits' && <CreditsBackground />}
      {page === 'guestbook' && <GuestbookBackgroundThematic />}

      {/* Background elements - hidden during transition or when on sub-pages */}
      <div 
        className="background-video-container" 
        style={{ 
          transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`,
          opacity: (isTransitioning || page !== 'main') ? 0 : 1,
          visibility: (isTransitioning || page !== 'main') ? 'hidden' : 'visible',
          transition: 'opacity 0.3s ease'
        }}
      >
        <video autoPlay loop muted playsInline src={mainVideo} />
        <div className="video-overlay"></div>
      </div>

      {isTransitioning && (
        <PageTransition 
          onComplete={handleTransitionComplete} 
          onPageChange={handlePageChange}
          targetPage={pendingPageRef.current}
        />
      )}

      {page === 'main' && (
        <div className={`classic-gui-container ${isMobile ? 'mobile-layout' : ''}`} ref={classicGuiRef}>
          <div className="classic-scanlines" style={{ transform: `translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)` }}></div>
          <div className="classic-grid-overlay" style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}></div>
          
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
                <EvaLogo className="main-image" />
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

      {page === 'pilots' && <PilotsPage onBack={handleBack} triggerEntrance={!isTransitioning} />}
      {page === 'evangelion' && <EvangelionPage onBack={handleBack} triggerEntrance={!isTransitioning} />}
      {page === 'angels' && <AngelsPage onBack={handleBack} triggerEntrance={!isTransitioning} />}
      {page === 'nerv' && <NervPage onBack={handleBack} triggerEntrance={!isTransitioning} />}
      {page === 'seele' && <SeelePage onBack={handleBack} triggerEntrance={!isTransitioning} />}
      {page === 'secondimpact' && <SecondImpactPage onBack={handleBack} triggerEntrance={!isTransitioning} />}
      {page === 'lcl' && <LCLPage onBack={handleBack} triggerEntrance={!isTransitioning} />}
      {page === 's2engine' && <S2EnginePage onBack={handleBack} triggerEntrance={!isTransitioning} />}
      {page === 'credits' && <CreditsPage onBack={handleBack} triggerEntrance={!isTransitioning} />}
      {page === 'guestbook' && <GuestbookPage onBack={handleBack} triggerEntrance={!isTransitioning} />}
    </div>
  );
};

export default MainContent;
