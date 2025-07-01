import React, { useState, useEffect, useRef, useMemo } from 'react';
import MenuCarousel from './MenuCarousel';
import PilotsPage from './PilotsPage';
import EvangelionPage from './EvangelionPage';
import AngelsPage from './AngelsPage';
import NervPage from './NervPage';
import SeelePage from './SeelePage';
// SecondImpactPage 컴포넌트 import 추가
import SecondImpactPage from './SecondImpactPage'; 
import mainImageEva from '../img/mainimg.png';
// 비디오 및 오디오 파일 import
import mainVideo from '../video/mainvideo.mp4';
import mainBgm from '../video/mainbgm.mp3';

const MainContent = () => {
  // 'secondimpact' 페이지 상태 추가
  const [page, setPage] = useState('main'); // 'main', 'pilots', 'evangelion', 'angels', 'nerv', 'seele', 'secondimpact'
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);

  const mainContentRef = useRef(null);
  const mainLayoutRef = useRef(null);
  const gsap = window.gsap;

  // useMemo를 사용하여 Audio 객체를 한 번만 생성하도록 최적화
  const bgmAudio = useMemo(() => new Audio(mainBgm), []);

  useEffect(() => {
    // BGM 오디오 설정
    bgmAudio.loop = true;
  }, [bgmAudio]);

  const toggleBgm = () => {
    if (isBgmPlaying) {
      bgmAudio.pause();
    } else {
      bgmAudio.play().catch(error => console.error("BGM 재생 오류:", error));
    }
    setIsBgmPlaying(!isBgmPlaying);
  };

  const handleActiveMenuClick = (menuItem) => {
    let targetPage = null;
    if (menuItem.title === 'PILOTS') targetPage = 'pilots';
    if (menuItem.title === 'EVANGELION') targetPage = 'evangelion';
    if (menuItem.title === 'ANGELS') targetPage = 'angels';
    if (menuItem.title === 'NERV') targetPage = 'nerv';
    if (menuItem.title === 'SEELE') targetPage = 'seele';
    // SECOND IMPACT 메뉴 클릭 시 'secondimpact' 페이지로 이동하는 로직 추가
    if (menuItem.title === 'SECOND IMPACT') targetPage = 'secondimpact';

    if (targetPage) {
      gsap.to(mainLayoutRef.current, {
        autoAlpha: 0,
        y: '-50%',
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
    gsap.to(mainContentRef.current, { autoAlpha: 1, duration: 0.5 });
  }, [page, gsap]);

  return (
    <div className="page-container">
      <div className="background-video-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          src={mainVideo}
        />
        <div className="video-overlay"></div>
      </div>

      <div
        className="main-content"
        ref={mainContentRef}
        data-theme="eva"
      >
        <div className="main-layout" ref={mainLayoutRef}>
          <div className="main-visual-container">
            <img src={mainImageEva} alt="Main Visual" className="main-image" />
          </div>
          <MenuCarousel
            onActiveItemClick={handleActiveMenuClick}
            initialDelay={0.5}
          />
        </div>
      </div>

      {/* --- BGM 플레이어 UI (기존과 동일) --- */}
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
      {/* SecondImpactPage 렌더링 로직 추가 */}
      {page === 'secondimpact' && <SecondImpactPage onBack={handleBack} />}
    </div>
  );
};

export default MainContent;
