import React, { useState, useEffect, useRef } from 'react';

// 이미지 동적 import를 위한 헬퍼 함수
function importAll(r) {
    let images = {};
    r.keys().forEach((item) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const angelImages = importAll(require.context('../img/angel', false, /\.(png|jpe?g|svg)$/));

// --- 사도 데이터 확장 ---
const angelData = {
    adam: {
        id: 1, name: "ADAM", image: angelImages['angel-1.png'], classification: "The First Angel",
        description: "The first of the Angels, the progenitor of the Third through Seventeenth Angels. Discovered in Antarctica, its awakening led to the Second Impact.",
        stats: { power: 99, defense: 99, speed: 99, 'A.T. Field': 99 },
        abilities: ["S² Engine", "Anti A.T. Field", "Progenitor"]
    },
    lilith: {
        id: 2, name: "LILITH", image: angelImages['angel-2.png'], classification: "The Second Angel",
        description: "The second of the Angels, and the progenitor of humanity (the 'Lilin'). It is crucified in the deepest level of NERV headquarters, Terminal Dogma.",
        stats: { power: 99, defense: 99, speed: 20, 'A.T. Field': 99 },
        abilities: ["LCL Source", "Anti A.T. Field", "Progenitor of Lilin"]
    },
    sachiel: {
        id: 3, name: "SACHIEL", image: angelImages['angel-3.png'], classification: "The Third Angel",
        description: "The first Angel to appear in Tokyo-3. It possesses a lean, humanoid form and a formidable A.T. Field, capable of self-destruction.",
        stats: { power: 65, defense: 60, speed: 50, 'A.T. Field': 70 },
        abilities: ["Lance of Light", "Self-Destruction", "Regeneration"]
    },
    shamshel: {
        id: 4, name: "SHAMSHEL", image: angelImages['angel-4.png'], classification: "The Fourth Angel",
        description: "A large, arthropod-like Angel with a cylindrical body and whip-like arms that can slice through an Evangelion's armor.",
        stats: { power: 68, defense: 55, speed: 65, 'A.T. Field': 60 },
        abilities: ["Energy Whips", "Flight", "Core Shielding"]
    },
    ramiel: {
        id: 5, name: "RAMIEL", image: angelImages['angel-5.png'], classification: "The Fifth Angel",
        description: "A floating, crystalline octahedron. It possesses a powerful particle beam and one of the strongest A.T. Fields.",
        stats: { power: 90, defense: 95, speed: 30, 'A.T. Field': 92 },
        abilities: ["High-Energy Particle Beam", "Drill Armature", "Absolute Terror Field"]
    },
    gaghiel: {
        id: 6, name: "GAGHIEL", image: angelImages['angel-6.png'], classification: "The Sixth Angel",
        description: "A massive, aquatic Angel resembling a prehistoric fish. It attacked the UN Pacific Fleet to get at Evangelion Unit-02.",
        stats: { power: 75, defense: 70, speed: 85, 'A.T. Field': 68 },
        abilities: ["Aquatic Combat", "Crushing Jaws", "Massive Size"]
    },
    israfel: {
        id: 7, name: "ISRAFEL", image: angelImages['angel-7.png'], classification: "The Seventh Angel",
        description: "A humanoid Angel with the unique ability to split itself into two identical, independent twins which can act in perfect coordination.",
        stats: { power: 70, defense: 65, speed: 75, 'A.T. Field': 80 },
        abilities: ["Fission/Fusion", "Synchronized Attack", "Dual Cores"]
    },
    sandalphon: {
        id: 8, name: "SANDALPHON", image: angelImages['angel-8.png'], classification: "The Eighth Angel",
        description: "Found in an embryonic state within a volcano. It can withstand extreme temperatures and pressure.",
        stats: { power: 60, defense: 80, speed: 50, 'A.T. Field': 65 },
        abilities: ["Magma Resistance", "Rapid Growth", "Clawed Limbs"]
    },
    matarael: {
        id: 9, name: "MATARAEL", image: angelImages['angel-9.png'], classification: "The Ninth Angel",
        description: "A spider-like Angel that secretes a powerful acid from its central eye, which can dissolve concrete and NERV's armor.",
        stats: { power: 62, defense: 50, speed: 60, 'A.T. Field': 55 },
        abilities: ["Acid Secretion", "Multiple Legs", "Pattern Analysis"]
    },
    sahaquiel: {
        id: 10, name: "SAHAQUIEL", image: angelImages['angel-10.png'], classification: "The Tenth Angel",
        description: "An enormous Angel that appeared in orbit. It attempted to destroy Tokyo-3 by using its body as a massive bomb.",
        stats: { power: 88, defense: 75, speed: 95, 'A.T. Field': 85 },
        abilities: ["Orbital Drop", "Jamming", "Kinetic Energy Weapon"]
    },
    ireul: {
        id: 11, name: "IREUL", image: angelImages['angel-11.png'], classification: "The Eleventh Angel",
        description: "A nano-scale Angel, appearing as corrosion. It is a colony of microorganisms that can rapidly evolve and hack computer systems.",
        stats: { power: 40, defense: 90, speed: 20, 'A.T. Field': 50 },
        abilities: ["Hacking", "Rapid Evolution", "Digital Intrusion"]
    },
    leliel: {
        id: 12, name: "LELIEL", image: angelImages['angel-12.png'], classification: "The Twelfth Angel",
        description: "An Angel with a spherical body in the air, but its true body is a massive, ultra-thin shadow on the ground, a pocket dimension.",
        stats: { power: 50, defense: 98, speed: 10, 'A.T. Field': 96 },
        abilities: ["Dirac Sea", "Pocket Dimension", "Shadow Body"]
    },
    bardiel: {
        id: 14, name: "BARDIEL", image: angelImages['angel-14.png'], classification: "The Thirteenth Angel",
        description: "A parasitic Angel that infected and took control of Evangelion Unit-03 during its transport to Japan.",
        stats: { power: 78, defense: 70, speed: 80, 'A.T. Field': 82 },
        abilities: ["Parasitism", "Entry Plug Contamination", "Stretchable Arms"]
    },
    zeruel: {
        id: 15, name: "ZERUEL", image: angelImages['angel-15.png'], classification: "The Fourteenth Angel",
        description: "One of the most powerful Angels. Its arms are ribbon-like weapons that can slice through anything with ease and it has a direct-fire beam.",
        stats: { power: 96, defense: 88, speed: 70, 'A.T. Field': 94 },
        abilities: ["Folding Arms (Blades)", "Eye Beam", "Core Shield"]
    },
    arael: {
        id: 16, name: "ARAEL", image: angelImages['angel-16.png'], classification: "The Fifteenth Angel",
        description: "A bird-like Angel of light that appeared in orbit. It uses a psychological attack in the form of a focused beam of light.",
        stats: { power: 70, defense: 75, speed: 90, 'A.T. Field': 88 },
        abilities: ["Psychological Wave", "Orbital Presence", "Light Form"]
    },
    tabris: {
        id: 17, name: "TABRIS", image: angelImages['angel-17.png'], classification: "The Seventeenth Angel",
        description: "The final Angel, appearing as a human boy, Kaworu Nagisa. It possesses the highest recorded level of A.T. Field.",
        stats: { power: 85, defense: 80, speed: 85, 'A.T. Field': 100 },
        abilities: ["Human Form", "EVA Synchronization", "Levitation"]
    }
};
const angels = Object.keys(angelData);

// --- StatBar 컴포넌트 (능력치 바) ---
const StatBar = ({ label, value }) => {
    const barRef = useRef(null);
    const gsap = window.gsap;

    useEffect(() => {
        if (barRef.current) {
            gsap.fromTo(barRef.current,
                { width: '0%' },
                { width: `${value}%`, duration: 1, delay: 0.5, ease: 'power3.out' }
            );
        }
    }, [value, gsap]);

    return (
        <div className="stat-item">
            <div className="stat-label">{label}</div>
            <div className="stat-bar-container">
                <div className="stat-bar-fill" ref={barRef} style={{width: `${value}%`}}></div>
            </div>
            <div className="stat-value">{value}</div>
        </div>
    );
};

// AngelsPage 컴포넌트
const AngelsPage = ({ onBack }) => {
    const [selectedAngel, setSelectedAngel] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바 상태
    const pageRef = useRef(null);
    const infoBoxRef = useRef(null);
    const gsap = window.gsap;

    // 페이지 진입 애니메이션
    useEffect(() => {
        gsap.fromTo(pageRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 });
        gsap.fromTo(".gui-element", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.15, delay: 0.3, ease: 'power2.out' });
    }, [gsap]);

    // 사도 선택 시 정보창 애니메이션
    useEffect(() => {
        if (selectedAngel && infoBoxRef.current) {
            gsap.fromTo(infoBoxRef.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' });
        }
    }, [selectedAngel, gsap]);

    // 사이드바 토글 핸들러
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // 사도 선택 핸들러
    const handleSelectAngel = (angelKey) => {
        const newAngel = angelData[angelKey];
        if (selectedAngel && selectedAngel.name === newAngel.name) {
            // 이미 선택된 사도를 다시 클릭해도 아무것도 하지 않음 (또는 선택 해제)
        } else {
            setSelectedAngel(newAngel);
        }
        // 모바일 환경에서 사도를 선택하면 사이드바를 닫음
        setIsSidebarOpen(false);
    };

    return (
        <div className="angels-page-layout" ref={pageRef}>
            {/* 반응형 사이드바를 위한 토글 버튼 */}
            <button className="sidebar-toggle-button" onClick={toggleSidebar}>
                ☰ ANGEL LIST
            </button>

            {/* 사이드바가 열렸을 때 표시될 백드롭 */}
            {isSidebarOpen && <div className="sidebar-backdrop" onClick={toggleSidebar}></div>}

            <button className="back-button" onClick={onBack}>← MENU</button>

            <div className="angels-content-grid">
                
                {/* 사도 선택 목록 (사이드바) */}
                <div className={`angel-selector-list gui-element ${isSidebarOpen ? 'sidebar-open' : ''}`}>
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

                {/* 사도 정보 패널 */}
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
                                    <p>{selectedAngel.description}</p>
                                    
                                    <div className="angel-stats-container">
                                        <div className="stats-header">COMBAT_DATA</div>
                                        {Object.entries(selectedAngel.stats).map(([key, value]) => (
                                            <StatBar key={key} label={key.toUpperCase()} value={value} />
                                        ))}
                                    </div>

                                    <div className="abilities-container">
                                        <div className="abilities-header">SPECIAL_ABILITIES</div>
                                        <div className="abilities-list">
                                            {selectedAngel.abilities.map(ability => (
                                                <span key={ability} className="ability-tag">{ability}</span>
                                            ))}
                                        </div>
                                    </div>
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
