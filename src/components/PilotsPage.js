import React, { useState, useEffect, useRef } from 'react';

// [수정] 'gsap' import 문을 삭제합니다.
// import { gsap } from 'gsap'; 

// 이미지 import
import groupImage from '../img/group1.png';
import shinjiImage from '../img/sinji1.png';
import reiImage from '../img/lay1.png';
import asukaImage from '../img/aska1.png';
import nervLogo from '../img/nervLogo.png';
import shinjiProfileImage from '../img/shinji_profile.jpg';
import reiProfileImage from '../img/Rei_profile.jpg';
import asukaProfileImage from '../img/asuka_profile.jpg';


// --- 캐릭터 데이터 ---
const characterData = {
    shinji: { 
        name: "Shinji Ikari", 
        image: shinjiImage,
        profileImage: shinjiProfileImage, 
        jp_name: "碇 シンジ",
        id: "025703",
        designation: "Third Child",
        birth: "2001.06.06",
        bloodType: "A",
        nationality: "Japanese",
        syncRate: "41.3%",
        description: "The Third Child and the designated pilot of Evangelion Unit-01. He is a withdrawn and introspective boy who struggles with the burden of his role and his relationship with his estranged father, Gendo. His initial reluctance gives way to a complex journey of self-discovery and pain." 
    },
    rei: { 
        name: "Rei Ayanami", 
        image: reiImage, 
        profileImage: reiProfileImage,
        jp_name: "綾波 レイ",
        id: "025701",
        designation: "First Child",
        birth: "Unknown",
        bloodType: "Unknown",
        nationality: "Unknown",
        syncRate: "N/A",
        description: "The First Child and pilot of Evangelion Unit-00. She is enigmatic, quiet, and seemingly emotionless, with a mysterious past connected to the very core of NERV's secrets and the Human Instrumentality Project. Her existence raises fundamental questions about identity and humanity." 
    },
    asuka: { 
        name: "Asuka Langley Soryu", 
        image: asukaImage, 
        profileImage: asukaProfileImage,
        jp_name: "惣流・アスカ・ラングレー",
        id: "025702",
        designation: "Second Child",
        birth: "2001.12.04",
        bloodType: "A",
        nationality: "American/German",
        syncRate: "92.0%",
        description: "The Second Child and the proud, fiery pilot of Evangelion Unit-02. Raised to be an Eva pilot from a young age, she is highly skilled but conceals deep-seated insecurities and a desperate need for validation behind a facade of arrogance." 
    }
};
const characters = ['rei', 'shinji', 'asuka'];

// --- 타이핑 효과를 위한 커스텀 훅 ---
const useTypingEffect = (text, speed = 50) => {
    const [typedText, setTypedText] = useState('');
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        setTypedText('');
        setIsDone(false);
        if (!text) return;

        const timer = setTimeout(() => {
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    setTypedText(prev => prev + text.charAt(i));
                    i++;
                } else {
                    clearInterval(typingInterval);
                    setIsDone(true);
                }
            }, speed);
            return () => clearInterval(typingInterval);
        }, 500);

        return () => clearTimeout(timer);
    }, [text, speed]);

    return { typedText, isDone };
};


const PilotsPage = ({ onBack }) => {
    // [수정] CDN으로 불러온 gsap를 window 객체에서 직접 참조합니다.
    const gsap = window.gsap;

    const [hoveredChar, setHoveredChar] = useState(null);
    const [selectedChar, setSelectedChar] = useState(null);
    const pageRef = useRef(null);
    const imageGroupRef = useRef(null);
    const descriptionRef = useRef(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const content = selectedChar ? characterData[selectedChar] : null;
    const { typedText, isDone } = useTypingEffect(content?.description, 25);

    const highlightedChar = selectedChar || hoveredChar;

    useEffect(() => {
        gsap.fromTo(pageRef.current, { autoAlpha: 0, x: '100%' }, { autoAlpha: 1, x: '0%', duration: 0.8, ease: 'power3.out' });
    }, [gsap]);

    useEffect(() => {
        gsap.set(descriptionRef.current, { clearProps: 'transform,opacity,visibility' });

        if (selectedChar) {
            gsap.set(descriptionRef.current, { pointerEvents: 'auto' });
            if (isMobile) {
                gsap.to(descriptionRef.current, {
                    y: '-50%',
                    autoAlpha: 1,
                    duration: 0.6,
                    ease: 'power3.out'
                });
            } else {
                gsap.to(descriptionRef.current, { autoAlpha: 1, duration: 0.5, delay: 0.2 });
                gsap.to(imageGroupRef.current, { x: '-25%', scale: 0.9, duration: 0.8, ease: 'power3.inOut' });
            }
        } else {
            const onHideComplete = () => gsap.set(descriptionRef.current, { pointerEvents: 'none' });
            if (isMobile) {
                gsap.to(descriptionRef.current, {
                    y: '100vh',
                    autoAlpha: 0,
                    duration: 0.5,
                    ease: 'power3.in',
                    onComplete: onHideComplete
                });
            } else {
                gsap.to(descriptionRef.current, { autoAlpha: 0, duration: 0.4, onComplete: onHideComplete });
                gsap.to(imageGroupRef.current, { x: '0%', scale: 1, duration: 0.8, ease: 'power3.inOut' });
            }
        }
    }, [selectedChar, isMobile, gsap]);

    const handleBackClick = () => {
        gsap.to(pageRef.current, {
            autoAlpha: 0,
            x: '100%',
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: onBack
        });
    };

    return (
        <div className="pilots-page-layout" ref={pageRef}>
            <button className="back-button" onClick={handleBackClick}>← BACK</button>
            <div className="pilots-content">
                <div 
                    className={`pilots-image-group ${highlightedChar ? `highlight-${highlightedChar}` : ''}`}
                    ref={imageGroupRef}
                >
                    <img src={nervLogo} alt="NERV Logo" className="pilot-image nerv-logo" />
                    <img src={groupImage} alt="Group" className="pilot-image group" />
                    {Object.keys(characterData).map(key => (
                         <img key={key} src={characterData[key].image} alt={characterData[key].name} className={`pilot-image character ${key}`} />
                    ))}
                </div>
            </div>

            <div className="pilot-id-card" ref={descriptionRef}>
                {content && (
                    <>
                        <div className="id-card-header">
                            NERV PERSONNEL ID CARD
                        </div>
                        <div className="id-card-body">
                            <div className="id-photo-section">
                                <img src={content.profileImage} alt={content.name} className="id-photo" />
                            </div>
                            <div className="id-info-section">
                                <div className="info-field name">
                                    <span className="field-label">NAME</span>
                                    <span className="field-value">{content.name}</span>
                                </div>
                                <div className="info-field jp-name">
                                    <span className="field-label">JP_NAME</span>
                                    <span className="field-value">{content.jp_name}</span>
                                </div>
                                <div className="info-grid">
                                    <div className="info-field">
                                        <span className="field-label">ID</span>
                                        <span className="field-value">{content.id}</span>
                                    </div>
                                    <div className="info-field">
                                        <span className="field-label">DESIGNATION</span>
                                        <span className="field-value">{content.designation}</span>
                                    </div>
                                    <div className="info-field">
                                        <span className="field-label">D.O.B</span>
                                        <span className="field-value">{content.birth}</span>
                                    </div>
                                    <div className="info-field">
                                        <span className="field-label">BLOOD TYPE</span>
                                        <span className="field-value">{content.bloodType}</span>
                                    </div>
                                </div>
                                 <div className="info-field sync">
                                    <span className="field-label">SYNC. RATE</span>
                                    <span className="field-value">{content.syncRate}</span>
                                </div>
                            </div>
                        </div>
                        <div className="id-card-footer">
                            <div className="description-header">SEARCH RESULTS: PERSONAL DATA</div>
                            <p className="description-text">
                                {typedText}
                                {!isDone && <span className="typing-cursor">|</span>}
                            </p>
                        </div>
                        <button className="close-desc-button" onClick={() => setSelectedChar(null)}>CLOSE</button>
                    </>
                )}
            </div>
            
            <div className="pilots-nav-bar">
                {characters.map(charKey => (
                    <div 
                        key={charKey}
                        className={`nav-item ${selectedChar === charKey ? 'selected' : ''}`}
                        onMouseEnter={() => !isMobile && setHoveredChar(charKey)}
                        onMouseLeave={() => !isMobile && setHoveredChar(null)}
                        onClick={() => setSelectedChar(charKey)}
                    >
                        {characterData[charKey].name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PilotsPage;