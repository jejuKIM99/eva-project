import React, { useState } from 'react';
import './App.css';
import LoadingScreen from './components/LoadingScreen';
import MainContent from './components/MainContent';
import CrtEffectManager from './components/CrtEffectManager';

// ─────────────────────────────────────────────────────────────────────────────
// 구조 설명:
//
// <div class="crt-screen-wrapper">
//   └── 실제 앱 콘텐츠 (레이아웃 왜곡 없음)
//
// <CrtEffectManager>: 오버레이로만 CRT 느낌 부여
//   ├── 주사선 (scanlines)
//   ├── 비네팅 (vignette) — 볼록 유리 가장자리 광도 감쇄
//   ├── 인광 틴트 (phosphor tint)
//   ├── 정전기 노이즈 (static noise)
//   └── 유리 반사 (glass reflection) — 볼록면 스펙큘러
//
// 철학: 콘텐츠 레이아웃은 절대 왜곡하지 않음.
//       CRT 느낌은 오버레이 텍스처로만 달성.
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  const [loading, setLoading] = useState(true);

  const handleAnimationComplete = () => {
    setTimeout(() => setLoading(false), 300);
  };

  return (
    <>
      {/* 실제 앱 콘텐츠 — 왜곡 없음, 레이아웃 보존 */}
      <div className="crt-screen-wrapper">
        {loading
          ? <LoadingScreen onAnimationComplete={handleAnimationComplete} />
          : <MainContent />
        }
      </div>

      {/* CRT 텍스처 오버레이 (콘텐츠 위에 겹침, pointer-events: none) */}
      <CrtEffectManager />
    </>
  );
}

export default App;