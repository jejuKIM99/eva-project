import React, { useEffect, useRef } from 'react';

// 이미지 import
import gendoImage from '../img/gendo.png';
import nervLogo from '../img/nervLogo.png';

const NervPage = ({ onBack }) => {
    const pageRef = useRef(null);
    const gsap = window.gsap;

    // 페이지 등장 애니메이션
    useEffect(() => {
        gsap.fromTo(pageRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: 'power2.out' });
        gsap.fromTo(".nerv-content-box", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.2, duration: 0.7, delay: 0.5 });
    }, [gsap]);

    return (
        <div className="nerv-page-layout" ref={pageRef}>
            <button className="back-button" onClick={onBack}>← MENU</button>
            
            <div className="nerv-main-content">
                <div className="nerv-image-container nerv-content-box">
                    <img src={nervLogo} alt="NERV Logo" className="nerv-logo-background" />
                    <img src={gendoImage} alt="Gendo Ikari" className="gendo-image" />
                </div>
                <div className="nerv-description-box nerv-content-box">
                    <div className="nerv-header">
                        TOP SECRET // FOR YOUR EYES ONLY
                    </div>
                    <h2 className="nerv-title">ORGANIZATION: NERV</h2>
                    <p className="nerv-text">
                        NERV is a special paramilitary agency under the command of the United Nations, led by Gendo Ikari. Its official purpose is to lead the defense of mankind against the Angels. However, its secret, true objective is to complete the Human Instrumentality Project in accordance with the scenarios outlined by Seele.
                    </p>
                    <p className="nerv-text">
                        Headquartered in the GeoFront beneath Tokyo-3, NERV possesses the Evangelion units, the only weapons capable of defeating the Angels. The organization holds immense power and operates with a high degree of autonomy, often clashing with the governments that fund it.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NervPage;
