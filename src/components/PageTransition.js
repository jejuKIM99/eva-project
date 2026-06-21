import React, { useEffect, useRef, useState, useMemo } from 'react';
import './PageTransition.css';

const PageTransition = ({ onComplete, onPageChange, targetPage }) => {
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);
  const gsap = window.gsap;

  const getPageTitle = (id) => {
    switch (id) {
      case 'pilots': return { main: '第壱種警戒態勢', sub: 'PILOT_IDENTIFICATION', en: 'EPISODE:01 PILOTS' };
      case 'evangelion': return { main: '汎用人型決戦兵器', sub: 'EVANGELION_DATA', en: 'EPISODE:02 UNIT_DATA' };
      case 'angels': return { main: '使徒、襲来', sub: 'ANGEL_ANALYSIS', en: 'EPISODE:03 TARGET' };
      case 'nerv': return { main: '特務機関', sub: 'ORGANIZATION: NERV', en: 'EPISODE:04 HEADQUARTERS' };
      case 'seele': return { main: '秘密結社', sub: 'COMMITTEE: SEELE', en: 'EPISODE:05 ARCHIVE' };
      case 'secondimpact': return { main: 'セカンドインパクト', sub: 'GLOBAL_CATACLYSM', en: 'EPISODE:06 HISTORY' };
      case 'lcl': return { main: '生命の起源', sub: 'LCL_COMPONENT', en: 'EPISODE:07 PRIMORDIAL' };
      case 's2engine': return { main: 'S²機関', sub: 'INFINITE_ENERGY', en: 'EPISODE:08 POWER_SOURCE' };
      case 'credits': return { main: '終劇', sub: 'TERMINAL_SESSION', en: 'EPISODE:26 CREDITS' };
      case 'guestbook': return { main: '機密記録', sub: 'GUEST_LOG', en: 'EPISODE:00 LOGBOOK' };
      default: return { main: '中央作戦司令部', sub: 'NERV_CENTRAL_DOGMA', en: 'EPISODE:99 MAIN_MENU' };
    }
  };

  const title = getPageTitle(targetPage);

  const randomHexCodes = useMemo(() => {
    return Array.from({ length: 30 }, () => 
      `0x${Math.random().toString(16).substr(2, 6).toUpperCase()}`
    );
  }, []);

  useEffect(() => {
    if (!gsap) {
      onPageChange();
      onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 50);
      }
    });

    gsap.set(containerRef.current, { opacity: 1 });
    
    tl.fromTo(".eva-ep-main", 
        { scale: 1.5, opacity: 0, filter: 'blur(20px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: "power4.out" }
      )
      .to(".eva-ep-subtext", { 
        opacity: 1, 
        x: 0, 
        duration: 0.5, 
        ease: "power2.out",
        onStart: () => {
          onPageChange();
        }
      }, "-=0.2")
      .to(".eva-ep-subtext-en", { opacity: 1, duration: 0.8 }, "-=0.2")
      .to({}, { duration: 1.8 })
      .to(containerRef.current, { 
        opacity: 0, 
        duration: 0.8, 
        ease: "power2.inOut" 
      });

    return () => {
      tl.kill();
    };
  }, [gsap, onComplete, onPageChange]);

  return (
    <div className="page-transition-overlay ep-style intensive-gui vhs-effect" ref={containerRef}>
      <div className="ep-background-noise"></div>
      <div className="nerv-hex-grid animated"></div>
      <div className="vhs-tracking-line"></div>

      {/* ... rest of data streams ... */}

      <div className="bg-data-column left-far">
        {randomHexCodes.map((code, i) => (
          <div key={i} className="bg-data-bit">{code} // DATA_BLOCK_{i}</div>
        ))}
      </div>
      <div className="bg-data-column right-far">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="bg-data-bit">NEURAL_SYNC_MODE_{i}</div>
        ))}
      </div>

      <div className="magi-status-group">
        <div className="magi-box">MELCHIOR-1: YES</div>
        <div className="magi-box">BALTHASAR-2: YES</div>
        <div className="magi-box">CASPER-3: YES</div>
      </div>

      <div className="top-secret-seal">TOP SECRET</div>

      <div className="ep-text-layout" ref={textContainerRef}>
        <div className="ep-main-title">
          <span className="eva-ep-main">{title.main}</span>
        </div>
        
        <div className="ep-sub-title">
          <div className="eva-ep-subtext">{title.sub}</div>
          <div className="eva-ep-subtext-en">{title.en}</div>
        </div>
      </div>

      <div className="ep-loading-footer">
        <div className="scanline-wide"></div>
        <div className="access-warning-bar">
          <div className="warning-scroll-fast">
            RESTRICTED ACCESS - HUMAN INSTRUMENTALITY PROJECT - SECURITY LEVEL AAAA - DO NOT TERMINATE SESSION - 
          </div>
        </div>
        <div className="ep-loading-indicator">
          <span className="blink-text">LOADING_CLASSIFIED_DATABASE_STREAM...</span>
        </div>
      </div>
    </div>
  );
};

export default PageTransition;
