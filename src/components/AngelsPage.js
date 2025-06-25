import React, { useState, useEffect, useRef } from 'react';

// 이미지 동적 import를 위한 헬퍼 함수
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const angelImages = importAll(require.context('../img/angel', false, /\.(png|jpe?g|svg)$/));

// 사도 데이터 확장
const angelData = {
    adam: { id: 1, name: "ADAM", image: angelImages['angel-1.png'], classification: "The First Angel", description: "The first of the Angels, the progenitor of the Third through Seventeenth Angels. Discovered in Antarctica, its awakening led to the Second Impact." },
    lilith: { id: 2, name: "LILITH", image: angelImages['angel-2.png'], classification: "The Second Angel", description: "The second of the Angels, and the progenitor of humanity (the 'Lilin'). It is crucified in the deepest level of NERV headquarters, Terminal Dogma." },
    sachiel: { id: 3, name: "SACHIEL", image: angelImages['angel-3.png'], classification: "The Third Angel", description: "The first Angel to appear in Tokyo-3, fifteen years after the Second Impact. It possesses a lean, humanoid form and a formidable A.T. Field." },
    shamshel: { id: 4, name: "SHAMSHEL", image: angelImages['angel-4.png'], classification: "The Fourth Angel", description: "A large, arthropod-like Angel with a cylindrical body and whip-like arms. It can stand upright to attack and has a powerful energy beam." },
    ramiel: { id: 5, name: "RAMIEL", image: angelImages['angel-5.png'], classification: "The Fifth Angel", description: "A floating, crystalline octahedron. It possesses a powerful particle beam and one of the strongest A.T. Fields, making it a formidable fortress." },
    gaghiel: { id: 6, name: "GAGHIEL", image: angelImages['angel-6.png'], classification: "The Sixth Angel", description: "A massive, aquatic Angel resembling a prehistoric fish. It attacked the UN Pacific Fleet to get at Evangelion Unit-02." },
    israfel: { id: 7, name: "ISRAFEL", image: angelImages['angel-7.png'], classification: "The Seventh Angel", description: "A humanoid Angel with the unique ability to split itself into two identical, independent twins, which can act in perfect coordination." },
    sandalphon: { id: 8, name: "SANDALPHON", image: angelImages['angel-8.png'], classification: "The Eighth Angel", description: "Found in an embryonic state within a volcano. It resembles a human embryo but rapidly hatches into a form similar to an Anomalocaris." },
    matarael: { id: 9, name: "MATARAEL", image: angelImages['angel-9.png'], classification: "The Ninth Angel", description: "A spider-like Angel that secretes a powerful acid from its central eye, which can dissolve concrete and NERV's armor." },
    sahaquiel: { id: 10, name: "SAHAQUIEL", image: angelImages['angel-10.png'], classification: "The Tenth Angel", description: "An enormous Angel that appeared in Earth's orbit. It attempted to destroy Tokyo-3 by falling onto it, using its body and A.T. Field as a massive bomb." },
    ireul: { id: 11, name: "IREUL", image: angelImages['angel-11.png'], classification: "The Eleventh Angel", description: "A nano-scale Angel, appearing as a pattern of corrosion. It is a colony of microorganisms that can rapidly evolve and hack computer systems like the MAGI." },
    leliel: { id: 12, name: "LELIEL", image: angelImages['angel-12.png'], classification: "The Twelfth Angel", description: "An Angel with a spherical, black-and-white patterned body in the air, but its true body is a massive, ultra-thin shadow on the ground, a pocket dimension." },
    bardiel: { id: 14, name: "BARDIEL", image: angelImages['angel-14.png'], classification: "The Thirteenth Angel", description: "A parasitic Angel that infected and took control of Evangelion Unit-03 during its transport to Japan." },
    zeruel: { id: 15, name: "ZERUEL", image: angelImages['angel-15.png'], classification: "The Fourteenth Angel", description: "One of the most powerful Angels, with a robust, humanoid body. Its arms are ribbon-like weapons that can slice through anything with ease." },
    arael: { id: 16, name: "ARAEL", image: angelImages['angel-16.png'], classification: "The Fifteenth Angel", description: "A bird-like Angel of light that appeared in Earth's orbit. It does not attack physically, but uses a psychological attack in the form of a focused beam of light." },
    tabris: { id: 17, name: "TABRIS", image: angelImages['angel-17.png'], classification: "The Seventeenth Angel", description: "The final Angel, appearing in the form of a human boy, Kaworu Nagisa. It possesses the highest recorded level of A.T. Field and can freely synchronize with Evangelion units." }
};
const angels = Object.keys(angelData);

const AngelsPage = ({ onBack }) => {
    const [selectedAngel, setSelectedAngel] = useState(null);
    const pageRef = useRef(null);
    const infoBoxRef = useRef(null);
    const textContainerRef = useRef(null); // 타이핑 텍스트 컨테이너 ref
    const gsap = window.gsap;

    useEffect(() => {
        gsap.fromTo(pageRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 });
        gsap.fromTo(".gui-element", { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.5, stagger: 0.1, delay: 0.3, ease: 'power2.out' });
    }, [gsap]);

    useEffect(() => {
        if (selectedAngel) {
            gsap.fromTo(infoBoxRef.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' });
            
            // 타이핑 효과 로직 수정
            const chars = gsap.utils.toArray(textContainerRef.current.children);
            if (chars.length > 0) {
                gsap.set(chars, { autoAlpha: 0 }); // 먼저 모든 글자를 숨김
                gsap.to(chars, {
                    autoAlpha: 1,
                    duration: 0.05,
                    stagger: 0.02, // 글자별 나타나는 시간 간격
                    ease: 'none'
                });
            }
        }
    }, [selectedAngel, gsap]);
    
    const handleSelectAngel = (angelKey) => {
        const newAngel = angelData[angelKey];
        if(selectedAngel && selectedAngel.name === newAngel.name) {
            setSelectedAngel(null);
        } else {
            setSelectedAngel(newAngel);
        }
    };

    return (
        <div className="angels-page-layout" ref={pageRef}>
            <button className="back-button" onClick={onBack}>← MENU</button>
            <div className="angels-content-grid">
                
                <div className="angel-selector-list gui-element">
                    <div className="gui-header">ANGEL_LIST::SELECT</div>
                    <div className="selector-content">
                        {angels.map(key => (
                            <div 
                                key={key} 
                                className={`selector-item ${selectedAngel?.name === angelData[key].name ? 'active' : ''}`}
                                onClick={() => handleSelectAngel(key)}
                            >
                               <span className="item-id">_{angelData[key].id.toString().padStart(2, '0')}</span>
                               <span className="item-name">{angelData[key].name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="angel-display-panel gui-element">
                     <div className="gui-header">ANALYSIS_PANEL::PATTERN_{selectedAngel ? angelData[selectedAngel.name.toLowerCase()].classification.split(' ')[1].toUpperCase() : 'BLUE'}</div>
                     <div className="display-content">
                        {selectedAngel ? (
                            <div className="angel-info-box" ref={infoBoxRef}>
                                <div className="angel-image-container">
                                    <img src={selectedAngel.image} alt={selectedAngel.name} />
                                    <div className="scan-lines"></div>
                                </div>
                                <div className="angel-text-info">
                                    <h3>{selectedAngel.classification} : <span className="highlight">{selectedAngel.name}</span></h3>
                                    {/* 텍스트를 span으로 감싸서 렌더링 */}
                                    <p ref={textContainerRef}>
                                        {selectedAngel.description.split('').map((char, index) => (
                                            <span key={index}>{char}</span>
                                        ))}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="standby-text">Awaiting selection...</div>
                        )}
                     </div>
                </div>

            </div>
        </div>
    );
};

export default AngelsPage;