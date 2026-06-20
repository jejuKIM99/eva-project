import React, { useState } from 'react';
import './App.css';
import LoadingScreen from './components/LoadingScreen';
import MainContent from './components/MainContent';
import CrtEffectManager from './components/CrtEffectManager';
import CrtBarrel, { SCALE_R, SCALE_G, SCALE_B } from './components/CrtBarrel';

// ─────────────────────────────────────────────────────────────────────────────
// 구조 설명:
//
// <svg> (SVG filter 정의, DOM에 삽입, width/height=0으로 화면에 안 보임)
//   └── <filter id="crt-barrel">
//         ├── <feImage id="crt-disp-map"> ← CrtBarrel.js가 href를 주입
//         ├── RGB 채널 분리 (feColorMatrix)
//         ├── 채널별 다른 변위 (feDisplacementMap) ← 색수차
//         └── Screen 블렌드로 채널 재합성
//
// <body> 또는 #root에 filter: url(#crt-barrel) 적용
//   → DOM 전체 + WebGL 캔버스에 균일하게 배럴 왜곡 적용됨
//   → position: fixed 요소들도 body 기준이므로 정상 동작
//
// <CrtEffectManager>: 주사선, 비네팅, 인광 틴트 오버레이 (필터 바깥)
// <CrtBarrel>: displacement map 업데이트 (DOM 출력 없음)
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  const [loading, setLoading] = useState(true);

  const handleAnimationComplete = () => {
    setTimeout(() => setLoading(false), 300);
  };

  return (
    <>
      {/*
        SVG 필터 정의 블록.
        width="0" height="0" → 화면에 공간 차지 없음.
        이 SVG는 React가 #root에 마운트하므로 document 내에서 참조 가능.
        CSS filter: url(#crt-barrel) 로 어디서든 참조할 수 있음.
      */}
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute', top: 0, left: 0, overflow: 'hidden', pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id="crt-barrel"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
            colorInterpolationFilters="sRGB"
          >
            {/*
              변위 맵: CrtBarrel.js가 canvas로 생성한 data:image/png를
              이 feImage의 href에 주입함.
              preserveAspectRatio="none" → 화면 전체를 채우도록 늘림.
              같은 맵을 R/G/B 세 채널에서 공유 (1번만 디코드됨).
            */}
            <feImage
              id="crt-disp-map"
              preserveAspectRatio="none"
              result="dispMap"
              href=""
            />

            {/*
              RGB 채널 분리 (feColorMatrix):
              색수차(chromatic aberration) 구현을 위해
              각 채널을 별도 이미지로 추출.
              
              R 채널만 살리고 G,B = 0: values = "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              G 채널만: "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              B 채널만: "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            */}
            <feColorMatrix
              type="matrix"
              in="SourceGraphic"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="srcR"
            />
            <feColorMatrix
              type="matrix"
              in="SourceGraphic"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="srcG"
            />
            <feColorMatrix
              type="matrix"
              in="SourceGraphic"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="srcB"
            />

            {/*
              채널별 배럴 왜곡:
              R: 더 많이 왜곡 (빨강이 가장 바깥) → SCALE_R
              G: 기준                             → SCALE_G
              B: 덜 왜곡 (파랑이 가장 안쪽)       → SCALE_B
              
              엣지에서 R이 더 바깥으로 밀리고 B가 덜 밀려
              → R-B 색 번짐(실제 CRT 유리 굴절 색수차)
            */}
            <feDisplacementMap
              in="srcR"
              in2="dispMap"
              scale={SCALE_R}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispR"
            />
            <feDisplacementMap
              in="srcG"
              in2="dispMap"
              scale={SCALE_G}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispG"
            />
            <feDisplacementMap
              in="srcB"
              in2="dispMap"
              scale={SCALE_B}
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispB"
            />

            {/*
              채널 재합성: screen 블렌드
              screen(A, B) = 1 - (1-A)(1-B)
              R=(r,0,0) + G=(0,g,0) → (r,g,0)
              + B=(0,0,b) → (r,g,b) ✓
            */}
            <feBlend in="dispR" in2="dispG" mode="screen" result="rg" />
            <feBlend in="rg"    in2="dispB" mode="screen" />
          </filter>
        </defs>
      </svg>

      {/* 실제 앱 콘텐츠 */}
      <div className="crt-screen-wrapper">
        {loading
          ? <LoadingScreen onAnimationComplete={handleAnimationComplete} />
          : <MainContent />
        }
      </div>

      {/* CRT 텍스처 오버레이 (필터 밖에 위치 → 왜곡 안 됨) */}
      <CrtEffectManager />

      {/* 변위 맵 생성 & 주입 (DOM 출력 없음) */}
      <CrtBarrel />
    </>
  );
}

export default App;