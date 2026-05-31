import React from 'react';

const PilotsBackground = () => {
  return (
    <div className="thematic-bg-container" style={{ backgroundColor: 'red', zIndex: -10 }}>
      {/* Debug: If this is red, the component is rendering */}
      <h1 style={{ color: 'white' }}>DEBUG: PILOTS BACKGROUND</h1>
    </div>
  );
};

export default PilotsBackground;
