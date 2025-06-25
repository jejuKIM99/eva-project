import React, { useRef, useEffect } from 'react';

const LoadingScreen = ({ onAnimationComplete }) => {
  const containerRef = useRef(null);
  const crossPathRef = useRef(null); // 단일 경로에 대한 ref
  const textRef = useRef(null);
  
  const text = "来たれ、甘き死よ";

  useEffect(() => {
    const gsap = window.gsap;
    const crossPath = crossPathRef.current;
    const textChars = textRef.current.children;

    // 경로의 총 길이를 계산하여 드로잉 애니메이션 준비
    const length = crossPath.getTotalLength();
    gsap.set(crossPath, { strokeDasharray: length, strokeDashoffset: length });
    
    gsap.set(textChars, { opacity: 0, y: 15 });

    // GSAP 타임라인 생성
    const tl = gsap.timeline();

    tl
      // 1. 십자가 외곽선 드로잉
      .to(crossPath, { 
        strokeDashoffset: 0, 
        duration: 3, 
        ease: 'power1.inOut' 
      })
      // 2. 텍스트가 한 글자씩 나타남 (십자가가 그려지는 중간부터 시작)
      .to(textChars, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: 'back.out(1.7)'
      }, "-=1.5")
      // 3. 2초 대기
      .to({}, { duration: 2 })
      // 4. 텍스트가 한 글자씩 사라짐
      .to(textChars, {
        opacity: 0,
        y: -15,
        duration: 0.3,
        stagger: 0.1,
        ease: 'power2.in'
      })
      // 5. 십자가가 그려지는 역방향으로 사라짐
      .to(crossPath, {
        strokeDashoffset: length,
        duration: 2,
        ease: 'power1.inOut'
      }, "-=0.2")
      // 6. 전체 컨테이너가 사라지며 콜백 함수 호출
      .to(containerRef.current, {
        opacity: 0,
        duration: 1,
        onComplete: onAnimationComplete
      });

  }, [onAnimationComplete]);

  return (
    <div className="loading-screen" ref={containerRef}>
      <svg className="cross-svg" viewBox="0 0 300 450">
        {/* 내부가 비어있는 각진 십자가 경로 (크기 수정) */}
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