import React from 'react';

const LCLBackground = () => {
  return (
    <div className="thematic-bg-container lcl-bg">
      <div className="lcl-fluid"></div>
      <div className="lcl-bubbles">
        {[...Array(10)].map((_, i) => <div key={i} className="bubble"></div>)}
      </div>
      <div className="lcl-label">LCL_DENSITY: 100%</div>
    </div>
  );
};

export default LCLBackground;
