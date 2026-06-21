import React from 'react';

const GuestbookBackgroundThematic = () => {
  return (
    <div className="thematic-bg-container guestbook-bg">
      <div className="data-grid-small"></div>
      <div className="scrolling-names font-mono">
        LOG_SESSION_01 // SECURE_LINK_CONNECTED // USER_LOGS // DATABASE_STBY // NODE_019 // ADDR_0x4F92 // ACCESS_GRANTED
      </div>
      
      {/* HUD Framing Overlay */}
      <div className="guestbook-bg-overlay font-mono">
        <div className="gb-header-panel">
          <div className="gb-title">NERV_LOG // PREVIEW</div>
          <div className="gb-net-status blink-slow">STBY</div>
        </div>
        
        {/* Framing brackets */}
        <div className="tactical-bracket top-left-bracket"></div>
        <div className="tactical-bracket top-right-bracket"></div>
        <div className="tactical-bracket bottom-left-bracket"></div>
        <div className="tactical-bracket bottom-right-bracket"></div>
      </div>
    </div>
  );
};

export default GuestbookBackgroundThematic;
