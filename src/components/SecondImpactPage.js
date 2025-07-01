import React, { useEffect, useRef } from 'react';
import secondImpactImage from '../img/second_impact.png';

const SecondImpactPage = ({ onBack }) => {
    const pageRef = useRef(null);
    const reportContainerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        // 애니메이션을 실행하는 함수
        const runAnimations = () => {
            const gsap = window.gsap;
            const SplitText = window.SplitText;

            // GSAP 플러그인을 등록합니다.
            gsap.registerPlugin(SplitText);

            // --- 페이지 전체 페이드 인 ---
            gsap.to(pageRef.current, { autoAlpha: 1, duration: 0.5 });

            // --- 리포트 컨테이너 펼쳐지는 애니메이션 ---
            gsap.fromTo(reportContainerRef.current,
                { clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)', autoAlpha: 1 },
                { 
                    clipPath: 'polygon(0% 0, 100% 0, 100% 100%, 0% 100%)', 
                    duration: 1.2, 
                    ease: 'power3.inOut',
                    delay: 0.3
                }
            );

            // --- 텍스트 타이핑 애니메이션 ---
            const reportText = textRef.current;
            if (reportText) {
                const split = new SplitText(reportText, { type: "chars, words" });
                const chars = split.chars;
                
                gsap.set(chars, { autoAlpha: 0 });

                gsap.to(chars, {
                    autoAlpha: 1,
                    duration: 0.02,
                    stagger: 0.02,
                    ease: 'none',
                    delay: 1.5
                });
            }
        };

        // GSAP 라이브러리가 로드될 때까지 주기적으로 확인하는 함수
        const checkGSAP = () => {
            if (window.gsap && window.SplitText) {
                // 라이브러리가 로드되면 인터벌을 중지하고 애니메이션 실행
                clearInterval(gsapCheckInterval);
                runAnimations();
            }
        };

        // 100ms 마다 GSAP 라이브러리 로드 여부 확인
        const gsapCheckInterval = setInterval(checkGSAP, 100);

        // 컴포넌트가 언마운트될 때 인터벌 정리
        return () => {
            clearInterval(gsapCheckInterval);
        };
    }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행

    return (
        <div className="second-impact-page-layout" ref={pageRef}>
            <button className="back-button" onClick={onBack}>
                ← MENU
            </button>

            <div className="report-container" ref={reportContainerRef}>
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

                <div className="report-body">
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

                    <div className="report-right-panel">
                        <div className="text-content-area">
                            <h2 className="report-title">[ SECOND IMPACT ]</h2>
                            <div className="report-text-wrapper">
                                <p className="report-text" ref={textRef}>
                                    A cataclysm of unprecedented scale that occurred on September 13, 2000. The event, originating in Antarctica, caused the polar ice caps to melt, leading to a rise in sea levels and a shift in the Earth's axis. The resulting climate change and geopolitical turmoil led to the death of half the world's population. While officially attributed to a 'large-scale meteorite impact,' the true cause was an accident during a contact experiment with the First Angel, 'Adam,' discovered in Antarctica. This truth is a top-secret matter known only to the highest echelons of SEELE and NERV.
                                    <br/><br/>
                                    西暦2000年9月13日に発生した未曾有の大災害。南極で発生したこの事件により、氷河が融解し海面が上昇、地軸が捻じれて地球の自転周期が変わり、それに伴う気象変動で世界的な紛争が勃発した。これにより世界人口の半分が死亡した。公式には「大質量隕石の衝突」が原因と発表されたが、実際には南極で発見された第1使徒「アダム」との接触実験中に発生した事故であった。この真実はゼーレ(SEELE)とネルフ(NERV)の最高幹部のみが知る極秘事項である。
                                </p>
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
    );
};

export default SecondImpactPage;