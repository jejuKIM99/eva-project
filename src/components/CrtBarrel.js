// src/components/CrtBarrel.js
//
// 전체 화면 SVG feDisplacementMap 기반 배럴 왜곡 + 색수차 (Chromatic Aberration)
//
// 작동 원리:
//   1. 화면 크기에 맞는 displacement map을 Canvas API로 수학적으로 생성
//   2. DOM에 삽입된 SVG <filter>의 <feImage> href를 data URL로 업데이트
//   3. CSS filter: url(#crt-barrel)이 적용된 요소가 이 필터를 참조
//
// 배럴 왜곡 수학 (Brown-Conrady 역매핑):
//   각 화면 픽셀 (px, py)에서 어떤 소스를 샘플할지 결정:
//   - r  = 중심에서의 정규화 거리 [0, 1]
//   - factor = 1 / (1 + K * r²)   ← 역배럴 (소스를 중앙으로 당김)
//   - dx = (factor - 1) * cx      ← 음수: 엣지를 안으로 당기는 오프셋
//   - 결과: 화면 중앙이 볼록하게 튀어나온 것처럼 보임

import { useEffect } from 'react';

// ── 파라미터 ──────────────────────────────────────────────────────────────────
const K1        = 0.18;  // 왜곡 강도 (0.1=미세, 0.18=명확한 CRT, 0.3=fisheye)
const SVG_SCALE = 640;   // feDisplacementMap scale (CSS 픽셀 단위)
const MAP_RES   = 512;   // 변위 맵 해상도 (높을수록 부드러움)

// RGB 채널별 스케일 차이 → 색수차 (유리를 통해 보는 효과)
// 빨강이 가장 많이, 파랑이 가장 적게 왜곡 → 엣지에서 색 번짐
const SCALE_R = SVG_SCALE * 1.06;  // +6%
const SCALE_G = SVG_SCALE * 1.00;  // 기준
const SCALE_B = SVG_SCALE * 0.94;  // -6%

// ── 변위 맵 생성 ──────────────────────────────────────────────────────────────
function buildDisplacementMap(W, H) {
  const canvas = document.createElement('canvas');
  canvas.width  = MAP_RES;
  canvas.height = MAP_RES;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(MAP_RES, MAP_RES);
  const d   = img.data;

  const halfW = W / 2;
  const halfH = H / 2;
  // 대각선 거리로 정규화 → 코너에서 r = 1.0
  const rMax = Math.sqrt(halfW * halfW + halfH * halfH);

  for (let my = 0; my < MAP_RES; my++) {
    for (let mx = 0; mx < MAP_RES; mx++) {
      // 이 맵 텍셀에 해당하는 화면 픽셀 좌표
      const px = (mx / (MAP_RES - 1)) * W;
      const py = (my / (MAP_RES - 1)) * H;

      // 중심에서의 거리 (픽셀)
      const cx = px - halfW;
      const cy = py - halfH;

      // 정규화 반지름
      const r  = Math.sqrt(cx * cx + cy * cy) / rMax;
      const r2 = r * r;

      // 배럴 역매핑: 소스 픽셀 위치 = 현재 픽셀 / (1 + K * r²)
      // factor < 1.0 → 엣지를 중앙 방향으로 당김
      const factor = 1.0 / (1.0 + K1 * r2);

      // 변위 (픽셀): 음수 = 중앙 방향
      const dx = cx * (factor - 1.0);
      const dy = cy * (factor - 1.0);

      // feDisplacementMap 인코딩:
      //   실제변위(px) = SVG_SCALE × (color/255 - 0.5)
      //   color/255 = 변위/SVG_SCALE + 0.5
      const R = dx / SVG_SCALE + 0.5;
      const G = dy / SVG_SCALE + 0.5;

      const i = (my * MAP_RES + mx) * 4;
      d[i]     = Math.max(0, Math.min(255, Math.round(R * 255)));
      d[i + 1] = Math.max(0, Math.min(255, Math.round(G * 255)));
      d[i + 2] = 128; // 미사용 (파랑 채널 고정값)
      d[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL('image/png');
}

// ── React 컴포넌트 ────────────────────────────────────────────────────────────
// 실제 DOM 출력 없음 — SVG 필터 관리만 담당
const CrtBarrel = () => {
  useEffect(() => {
    const update = () => {
      const url = buildDisplacementMap(window.innerWidth, window.innerHeight);
      const el  = document.getElementById('crt-disp-map');
      if (el) el.setAttribute('href', url);
    };

    // 즉시 실행 + 리사이즈 대응
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return null;
};

export { SCALE_R, SCALE_G, SCALE_B };
export default CrtBarrel;
