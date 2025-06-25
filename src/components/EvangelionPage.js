import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

// 이미지 import (카드 배경 추가)
import unit01Image from '../img/unit01.png';
import unit02Image from '../img/unit02.png';
import unit01BackImage from '../img/unit01-back.png';
import unit02BackImage from '../img/unit02-back.png';
import unit01CardBackImage from '../img/unit01-cardback.png';
import unit02CardBackImage from '../img/unit02-cardback.png';


// 유닛 데이터 (카드 배경 이미지 속성 추가)
const evaData = {
    unit01: { name: "UNIT-01", image: unit01Image, backImage: unit01BackImage, cardBackImage: unit01CardBackImage, description: "Test Type. The first Evangelion not created by NERV, it was built in Japan and piloted by Shinji Ikari." },
    unit02: { name: "UNIT-02", image: unit02Image, backImage: unit02BackImage, cardBackImage: unit02CardBackImage, description: "Production Model. The first of the Production Model Evangelions, piloted by Asuka Langley Soryu." }
};
const evas = ['unit01', 'unit02'];

const EvangelionPage = ({ onBack }) => {
    const [selectedEva, setSelectedEva] = useState(null);
    const [showDescription, setShowDescription] = useState(false);
    const pageRef = useRef(null);
    const cardContainerRef = useRef(null);
    const fullscreenViewRef = useRef(null);
    const descriptionRef = useRef(null);
    const actionButtonsRef = useRef(null);
    const cardRefs = {
        unit01: useRef(null),
        unit02: useRef(null)
    };
    const gsap = window.gsap;
    const prevSelectedEva = useRef(null);

    // 3D 카드 호버 효과
    const handleMouseMove = (e, key) => {
        if (selectedEva) return;
        const card = cardRefs[key].current;
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = e.clientX - left - width / 2;
        const y = e.clientY - top - height / 2;
        const rotateY = (x / width) * 30;
        const rotateX = -(y / height) * 30;

        gsap.to(card, {
            rotationY: rotateY, rotationX: rotateX,
            ease: 'power1.out', duration: 0.8
        });
    };

    const handleMouseLeave = (key) => {
        if (selectedEva) return;
        gsap.to(cardRefs[key].current, {
            rotationY: 0, rotationX: 0,
            ease: 'power2.out', duration: 1
        });
    };

    const handleSelectEva = (key) => {
        if (selectedEva) return;
        setSelectedEva(key);
    };

    const handleCloseFullscreen = () => {
        if (showDescription) return;
        setSelectedEva(null);
    };

    const handleDownload = () => {
        if (!selectedEva) return;
        const link = document.createElement('a');
        link.href = evaData[selectedEva].backImage;
        link.download = `${selectedEva}-background.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    useLayoutEffect(() => {
        gsap.set(pageRef.current, { autoAlpha: 0 });
        gsap.set(cardContainerRef.current, { autoAlpha: 0, y: 50 });
        Object.values(cardRefs).forEach(ref => {
            gsap.set(ref.current, { 
                rotationX: 0, 
                rotationY: 0, 
                transformPerspective: 1000
            });
        });
    }, []);

    useEffect(() => {
        gsap.to(pageRef.current, { autoAlpha: 1, duration: 0.5 });
        gsap.to(cardContainerRef.current, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.3 });
    }, []);

    useEffect(() => {
        const wasSelected = prevSelectedEva.current;
        prevSelectedEva.current = selectedEva;

        if (selectedEva && !wasSelected) {
            gsap.timeline()
                .to(cardContainerRef.current, { autoAlpha: 0, scale: 0.9, duration: 0.5, ease: 'power2.in' })
                .fromTo(fullscreenViewRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, ease: 'power2.out' })
                .fromTo(actionButtonsRef.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.3");
        } else if (!selectedEva && wasSelected) {
            gsap.timeline()
                .to(fullscreenViewRef.current, { autoAlpha: 0, duration: 0.5, ease: 'power2.in' })
                .to(cardContainerRef.current, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power2.out' });
        }
    }, [selectedEva]);

    useEffect(() => {
        const descriptionEl = descriptionRef.current;
        const buttonsEl = actionButtonsRef.current;
        
        if (showDescription) {
            gsap.timeline()
                .to(buttonsEl, { autoAlpha: 0, y: 20, duration: 0.3 })
                .fromTo(descriptionEl, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 });
        } else {
            if (selectedEva) {
                gsap.timeline()
                    .to(descriptionEl, { autoAlpha: 0, y: 20, duration: 0.3 })
                    .fromTo(buttonsEl, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 });
            }
        }
    }, [showDescription, selectedEva]);

    return (
        <div className="evangelion-page-layout" ref={pageRef}>
            <button className="back-button" onClick={onBack}>← MENU</button>

            <div className="eva-card-container" ref={cardContainerRef}>
                {evas.map(key => (
                    <div
                        key={key}
                        ref={cardRefs[key]}
                        className="eva-card"
                        onMouseMove={(e) => handleMouseMove(e, key)}
                        onMouseLeave={() => handleMouseLeave(key)}
                        onClick={() => handleSelectEva(key)}
                    >
                        {/* 카드 배경 이미지 변경 */}
                        <div className="card-bg" style={{ backgroundImage: `url(${evaData[key].cardBackImage})` }}></div>
                        {/* 유닛 이미지에 개별 클래스 추가 */}
                        <img src={evaData[key].image} alt={evaData[key].name} className={`card-unit ${key}`} />
                        <h2 className="card-title">{evaData[key].name}</h2>
                    </div>
                ))}
            </div>

            <div className="eva-fullscreen-view" ref={fullscreenViewRef}>
                {selectedEva && (
                    <>
                        <div 
                            className="fullscreen-bg" 
                            style={{ backgroundImage: `url(${evaData[selectedEva].backImage})` }}
                            onClick={() => !showDescription && setShowDescription(true)}
                        ></div>
                        <div className="eva-description" ref={descriptionRef}>
                            <h3>{evaData[selectedEva].name}</h3>
                            <p>{evaData[selectedEva].description}</p>
                            <button className="close-desc-button" onClick={() => setShowDescription(false)}>CLOSE</button>
                        </div>
                        <div className="eva-action-buttons" ref={actionButtonsRef}>
                            <button onClick={handleCloseFullscreen}>CLOSE</button>
                            <button onClick={handleDownload}>DOWNLOAD</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EvangelionPage;
