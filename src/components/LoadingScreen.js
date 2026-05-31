import React, { useRef, useEffect } from 'react';

const LoadingScreen = ({ onAnimationComplete }) => {
  const containerRef = useRef(null);
  const crossPathRef = useRef(null);
  const textRef = useRef(null);
  
  // 엔드 오브 에반게리온(EoE)의 문구로 변경
  const text = "来たれ、甘き死よ";

  useEffect(() => {
    const gsap = window.gsap;
    const crossPath = crossPathRef.current;
    const textChars = textRef.current.children;

    const length = crossPath.getTotalLength();
    gsap.set(crossPath, { strokeDasharray: length, strokeDashoffset: length });
    
    // 텍스트 초기 상태: 더 거친 느낌을 위해 블러 대신 투명도와 위치만 제어
    gsap.set(textChars, { opacity: 0, y: 10 });
    
    const tl = gsap.timeline();

    tl
      // 화면 전체에 미세한 플리커 효과
      .to(containerRef.current, { 
        opacity: 0.9, 
        duration: 0.05, 
        repeat: -1, 
        yoyo: true, 
        ease: 'steps(1)' 
      })
      // 1. 십자가가 갑작스럽게 나타남
      .to(crossPath, { 
        strokeDashoffset: 0, 
        duration: 1.5, 
        ease: 'power1.in' // 더 기계적인 느낌
      }, 0.5)
      // 2. 텍스트가 깜빡이며 나타남
      .to(textChars, {
        opacity: 1,
        y: 0,
        duration: 0.05,
        stagger: {
          each: 0.1,
          from: "random" // 글자가 무작위 순서로 나타남
        },
        ease: 'steps(1)'
      }, "-=0.5")
      // 3. 3초 대기
      .to({}, { duration: 3 })
      // 4. 모든 요소가 한 번에 깜빡이며 사라짐
      .to([crossPath, textChars], {
        opacity: 0,
        duration: 0.1,
        ease: 'steps(1)',
        stagger: 0.03
      })
      // 5. 전체 컨테이너가 페이드 아웃되며 종료
      .to(containerRef.current, {
        opacity: 0,
        duration: 1,
        ease: 'power1.in',
        onComplete: () => {
          gsap.killTweensOf(containerRef.current);
          onAnimationComplete();
        }
      }, "+=0.5");

  }, [onAnimationComplete]);

  return (
    <div className="loading-screen" ref={containerRef}>
      <div className="noise-overlay"></div>
      {/* 스캔라인 효과 추가 */}
      <div className="scanline-overlay"></div>
      <svg className="cross-svg" viewBox="0 0 300 450">
        <path 
            ref={crossPathRef}
            d="M 120 0 L 180 0 L 180 300 L 280 300 L 280 360 L 180 360 L 180 450 L 120 450 L 120 360 L 20 360 L 20 300 L 120 300 Z"
        />
      </svg>
      <div className="loading-text" ref={textRef}>
        {text.split('').map((char, index) => (
          <span key={index}>{char}</span>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
