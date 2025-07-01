import React, { useEffect, useRef } from 'react';
import secondImpactImage from '../img/second_impact.png';

const SecondImpactPage = ({ onBack }) => {
    const pageRef = useRef(null);
    const textRef = useRef(null);
    const folderWrapperRef = useRef(null);
    const reportRef = useRef(null);
    const gsap = window.gsap;
    const { SplitText } = window;

    useEffect(() => {
        // GSAP 및 SplitText 플러그인 존재 여부 확인
        if (!gsap || !SplitText) {
            console.error("GSAP or SplitText is not loaded.");
            if(pageRef.current) {
                pageRef.current.style.opacity = 1;
            }
            return;
        }

        // --- 페이지 등장 애니메이션 ---
        const tl = gsap.timeline({
            onComplete: () => {
                // --- 텍스트 타이핑 애니메이션 ---
                const reportText = textRef.current;
                if (reportText) {
                    // 텍스트를 글자 단위로 분할
                    const split = new SplitText(reportText, { type: "chars" });
                    const chars = split.chars;
                    
                    // 글자들이 보이지 않도록 초기 설정
                    gsap.set(chars, { autoAlpha: 0 });

                    // 각 글자가 순차적으로 나타나는 애니메이션
                    gsap.to(chars, {
                        autoAlpha: 1,
                        duration: 0.02,
                        stagger: 0.02, // 글자 사이의 시간 간격
                        ease: 'none',
                    });
                }
            }
        });

        // 애니메이션을 위한 초기 상태 설정
        gsap.set(pageRef.current, { autoAlpha: 1 }); // 페이지 전체 컨테이너를 보이게 함
        gsap.set(folderWrapperRef.current, { autoAlpha: 0 }); // 폴더 래퍼는 초기에 숨김
        gsap.set(reportRef.current, { transformOrigin: 'top center', rotationX: 70 }); // 문서를 '닫힌' 상태로 설정

        // 애니메이션 시퀀스
        tl.to(folderWrapperRef.current, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out'
        }, "+=0.2") // 폴더 등장
        .to(reportRef.current, {
            rotationX: 0, // 문서를 '펼침'
            duration: 1.2,
            ease: 'power4.out'
        }, "-=0.3"); // 문서 펼치기

    }, [gsap, SplitText]);

    // 영어 및 일본어 텍스트 콘텐츠
    const textContent = `A.D. 2000.09.13 — An unprecedented catastrophe, later designated the "Second Impact."
The event, originating in Antarctica, caused the melting of polar ice caps, a subsequent rise in sea levels, and a significant tilt in the Earth's axis. The resulting climatic and geopolitical turmoil triggered global conflicts, ultimately halving the world's population.

西暦2000年9月13日 — 後に「セカンドインパクト」と呼称される未曾有の大災害が発生。
南極大陸で発生したこの事件は、極地の氷解による海水位の上昇と、地球の自転軸の傾斜を引き起こした。その結果生じた気候変動と地政学的混乱は世界規模の紛争を誘発し、最終的に世界人口の半数が失われた。

[OFFICIAL STATEMENT]
Cause attributed to a high-mass, low-velocity meteorite impact.

[CLASSIFIED TRUTH]
The incident was the result of a contact experiment with the First Angel, "Adam," conducted by the Katsuragi Expedition in Antarctica. This information is designated Top Secret, accessible only to the highest echelons of SEELE and NERV.`;

    return (
        <div className="second-impact-page-layout" ref={pageRef}>
            {/* 뒤로가기 버튼 */}
            <button className="back-button" onClick={onBack}>
                ← MENU
            </button>

            {/* 폴더/문서 애니메이션을 위한 래퍼 */}
            <div className="folder-wrapper" ref={folderWrapperRef}>
                {/* 메인 리포트 컨테이너 */}
                <div className="report-container" ref={reportRef}>
                    {/* 리포트 헤더 */}
                    <div className="report-header">
                        <div className="header-left">
                            <span className="header-tag red">TOP SECRET</span>
                            <span className="header-tag">CLASSIFIED</span>
                        </div>
                        <div className="header-title">
                            INTERIM REPORT / 第1次中間報告
                        </div>
                        <div className="header-right">
                            <span className="header-tag">CODE: SI-09132000</span>
                        </div>
                    </div>

                    {/* 리포트 본문 */}
                    <div className="report-body">
                        {/* 왼쪽 패널 (이미지) */}
                        <div className="report-left-panel">
                            <div className="image-frame">
                                <img src={secondImpactImage} alt="Satellite Photo of Second Impact" />
                                <div className="image-overlay-grid"></div>
                                <div className="scanline-effect"></div>
                                <div className="image-caption">
                                    <p>SATELLITE PHOTO</p>
                                    <p>A.D. 2000.09.13</p>
                                    <p>FROM: JSSDF-INFO</p>
                                </div>
                                <div className="corner-bracket top-left"></div>
                                <div className="corner-bracket top-right"></div>
                                <div className="corner-bracket bottom-left"></div>
                                <div className="corner-bracket bottom-right"></div>
                            </div>
                        </div>

                        {/* 오른쪽 패널 (텍스트) */}
                        <div className="report-right-panel">
                            <div className="text-content-area">
                                <h2 className="report-title">[ SECOND IMPACT ]</h2>
                                <div className="report-text-wrapper">
                                    <p className="report-text" ref={textRef} style={{ whiteSpace: 'pre-wrap' }}>
                                        {textContent}
                                    </p>
                                    <span className="typing-cursor">|</span>
                                </div>
                            </div>
                            <div className="report-footer">
                                <span>// END OF REPORT</span>
                                <span>CONFIDENTIAL</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecondImpactPage;
