// src/components/CrtEffectManager.js
//
// CRT 모니터 텍스처 오버레이.
// 역할: 화면 전체에 주사선, 비네팅, 인광 틴트, 미세 노이즈를 올림.
// 철학: 사용자가 의식하지 않는 수준으로 작동해야 함.
//       "뭔가 분위기 있는데?" → ✅  "CRT 효과가 있네!" → ❌

import React from 'react';
import './CrtEffect.css';

const CrtEffectManager = () => {
  return (
    <div className="crt-overlay" aria-hidden="true">
      {/* 수평 주사선 */}
      <div className="crt-scanlines" />
      {/* 코너 비네팅 */}
      <div className="crt-vignette" />
      {/* 인광 물질 색상 틴트 */}
      <div className="crt-phosphor-tint" />
      {/* 미세 정전기 노이즈 */}
      <div className="crt-noise" />
    </div>
  );
};

export default CrtEffectManager;
