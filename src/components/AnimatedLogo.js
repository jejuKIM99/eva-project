import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const AnimatedLogo = () => {
    const logoRef = useRef(null);
    const textRef = useRef(null);
    const decoRef = useRef(null);
    const glitchRef = useRef(null);

    useEffect(() => {
        if (!logoRef.current) return;

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });

        // 초기 상태 설정
        if (textRef.current && decoRef.current) {
            gsap.set([textRef.current, decoRef.current], { autoAlpha: 0, scale: 0.8 });
        }
        if (glitchRef.current) {
            gsap.set(glitchRef.current, { autoAlpha: 0 });
        }

        tl.to(decoRef.current, { 
            autoAlpha: 1, 
            scale: 1, 
            duration: 1.5, 
            ease: "expo.out" 
        })
        .to(textRef.current, { 
            autoAlpha: 1, 
            scale: 1, 
            duration: 1, 
            ease: "back.out(1.7)" 
        }, "-=1")
        .add(() => {
            runGlitch();
        }, "-=0.5");

        const runGlitch = () => {
            if (!textRef.current || !glitchRef.current) return;
            const glitchTl = gsap.timeline();
            glitchTl.to(glitchRef.current, { autoAlpha: 0.3, duration: 0.05, repeat: 5, yoyo: true })
                    .to(textRef.current, { x: 5, skewX: 10, duration: 0.05, repeat: 3, yoyo: true })
                    .set([textRef.current, glitchRef.current], { x: 0, skewX: 0, autoAlpha: 0 });
        };

        const timer = setInterval(() => {
            if (Math.random() > 0.8) runGlitch();
        }, 2000);

        return () => {
            tl.kill();
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="animated-logo-wrapper" ref={logoRef}>
            <svg viewBox="0 0 800 200" className="eva-logo-svg">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                <g ref={decoRef} className="logo-deco">
                    <rect x="100" y="85" width="600" height="2" fill="rgba(255, 69, 0, 0.5)" />
                    <rect x="100" y="113" width="600" height="2" fill="rgba(255, 69, 0, 0.5)" />
                    <path d="M 80 70 L 80 130 M 720 70 L 720 130" stroke="rgba(255, 69, 0, 0.8)" strokeWidth="2" />
                    <text x="400" y="65" textAnchor="middle" className="logo-subtext">NEON GENESIS</text>
                    <text x="400" y="150" textAnchor="middle" className="logo-subtext">THE END OF EVANGELION</text>
                </g>

                <g ref={textRef} filter="url(#glow)">
                    <text x="400" y="110" textAnchor="middle" className="logo-main-text">EVANGELION</text>
                </g>

                <g ref={glitchRef} className="logo-glitch">
                    <text x="405" y="112" textAnchor="middle" className="logo-main-text glitch-red">EVANGELION</text>
                    <text x="395" y="108" textAnchor="middle" className="logo-main-text glitch-blue">EVANGELION</text>
                </g>
            </svg>
        </div>
    );
};

export default AnimatedLogo;
