// src/utils/crtPostProcessing.js
// ─────────────────────────────────────────────────────────────────────────────
// WebGL 배경의 배럴 왜곡은 전역 CSS SVG 필터로 통합하여 처리합니다.
// 이 파일은 각 배경 컴포넌트의 Three.js 렌더러를 그대로 pass-through합니다.
// (composer 없이 renderer.render()만 호출하도록 null 반환)
// ─────────────────────────────────────────────────────────────────────────────

export const initCrtComposer = (THREE, renderer, scene, camera, options = {}) => {
  // 각 배경은 일반 WebGL 렌더링만 수행합니다.
  // 배럴 왜곡은 App.css의 SVG 필터가 전체 화면에 균일하게 적용합니다.
  return null;
};
