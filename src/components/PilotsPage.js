import React, { useState, useEffect, useRef } from 'react';

// 이미지 import (nervLogo 추가)
import groupImage from '../img/group1.png';
import shinjiImage from '../img/sinji1.png';
import reiImage from '../img/lay1.png';
import asukaImage from '../img/aska1.png';
import nervLogo from '../img/nervLogo.png';

// 캐릭터 데이터
const characterData = {
    shinji: { name: "Shinji Ikari", image: shinjiImage, description: "The Third Child and the designated pilot of Evangelion Unit-01. He is a withdrawn and introspective boy who struggles with the burden of his role and his relationship with his estranged father, Gendo." },
    rei: { name: "Rei Ayanami", image: reiImage, description: "The First Child and pilot of Evangelion Unit-00. She is enigmatic, quiet, and seemingly emotionless, with a mysterious past connected to the very core of NERV's secrets." },
    asuka: { name: "Asuka Langley Soryu", image: asukaImage, description: "The Second Child and the proud, fiery pilot of Evangelion Unit-02. Raised to be an Eva pilot from a young age, she is highly skilled but conceals deep-seated insecurities behind a facade of arrogance." }
};
const characters = ['rei', 'shinji', 'asuka'];

const PilotsPage = ({ onBack }) => {
    const [hoveredChar, setHoveredChar] = useState(null);
    const [selectedChar, setSelectedChar] = useState(null);
    const [content, setContent] = useState(null);
    const pageRef = useRef(null);
    const imageGroupRef = useRef(null);
    const descriptionRef = useRef(null);
    const gsap = window.gsap;

    const highlightedChar = selectedChar || hoveredChar;

    useEffect(() => {
        gsap.fromTo(pageRef.current, { autoAlpha: 0, x: '100%' }, { autoAlpha: 1, x: '0%', duration: 0.8, ease: 'power3.out' });
    }, [gsap]);

    useEffect(() => {
        const tl = gsap.timeline();
        if (selectedChar) {
            tl.to(descriptionRef.current, { autoAlpha: 1, duration: 0.5 })
              .call(() => setContent(characterData[selectedChar]));
            gsap.to(imageGroupRef.current, { x: '-25%', scale: 0.9, duration: 0.8, ease: 'power3.inOut' });
        } else {
            tl.to(descriptionRef.current, { autoAlpha: 0, duration: 0.4 })
              .call(() => setContent(null));
            gsap.to(imageGroupRef.current, { x: '0%', scale: 1, duration: 0.8, ease: 'power3.inOut' });
        }
    }, [selectedChar, gsap]);


    return (
        <div className="pilots-page-layout" ref={pageRef}>
            <button className="back-button" onClick={onBack}>← BACK</button>
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
                
                <div className="character-description" ref={descriptionRef}>
                    {content && (
                        <>
                            <h3>{content.name}</h3>
                            <p>{content.description}</p>
                            <button className="close-desc-button" onClick={() => setSelectedChar(null)}>CLOSE</button>
                        </>
                    )}
                </div>
            </div>

            <div className="pilots-nav-bar">
                {characters.map(charKey => (
                    <div 
                        key={charKey}
                        className={`nav-item ${selectedChar === charKey ? 'selected' : ''}`}
                        onMouseEnter={() => setHoveredChar(charKey)}
                        onMouseLeave={() => setHoveredChar(null)}
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
