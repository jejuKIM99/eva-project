import React from 'react';

const NervBackground = () => {
  return (
    <div className="thematic-bg-container nerv-bg">
      <div className="nerv-map-grid"></div>
      <div className="nerv-logo-faint"></div>
      <div className="vertical-data left">DATA_SYNC_01 // ACTIVE</div>
      <div className="vertical-data right">GEOGRAPHY_SCAN // ON</div>
      <div className="map-labels">
        <span className="label geo">GEO_FRONT</span>
        <span className="label dogma">CENTRAL_DOGMA</span>
      </div>
    </div>
  );
};

export default NervBackground;
