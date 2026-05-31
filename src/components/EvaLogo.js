import React from 'react';
import './EvaLogo.css';

const EvaLogo = ({ className = '' }) => {
  return (
    <div className={`eva-title-logo ${className}`}>
      <div className="eva-logo-wrapper">
        <div className="eva-logo-top">
          {/* <span className="eva-word">NEON</span> */}
          <span className="eva-word">NEON GENESIS</span>
        </div>
        <div className="eva-logo-bottom">
          <span className="eva-word-main">EVANGELION</span>
        </div>
        <div className="eva-logo-japanese">
          <span>新世紀エヴァンゲリオン</span>
        </div>
      </div>
    </div>
  );
};

export default EvaLogo;
