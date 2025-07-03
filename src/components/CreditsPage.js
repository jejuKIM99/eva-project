import React, { useEffect, useRef, useState } from 'react';

// --- 이미지 Asset Import (파일 최상단으로 이동 및 경로 수정) ---
import seaTexturePath from '../img/texture/sea.jpg';

// 캐릭터 이미지
import asukaProfile from '../img/asuka_profile.jpg';
import reiProfile from '../img/Rei_profile.jpg';
import shinjiProfile from '../img/shinji_profile.jpg';
import group1 from '../img/group1.png';
import gendoProfile from '../img/gendo_profile.jpg';
import fuyutsukiProfile from '../img/fuyutsuki.jpg';
import kajiProfile from '../img/kaji_profile.jpg';
import keelLorenzProfile from '../img/KeelLorenz_profile.jpg';
import makotoProfile from '../img/makoto_profile.jpg';
import mayaProfile from '../img/maya_profile.jpg';
import misatoProfile from '../img/misato_profile.jpg';
import ritsukoProfile from '../img/ritsuko_profile.jpg';
import shigeruProfile from '../img/shigeru_profile.jpg';

// 에반게리온 이미지
import unit01Wallpaper from '../img/unit01-back.png';
import unit02Wallpaper from '../img/unit02-back.png';
import unit01Full from '../img/unit01_full.png';
import unit01Berserk from '../img/unit01_berserk.png';
import unit02Full from '../img/unit02_full.png';
import unitMass from '../img/unitMass.png';

// [수정] 사도 이미지 static import
import angel1 from '../img/angel/angel-1.png';
import angel2 from '../img/angel/angel-2.png';
import angel3 from '../img/angel/angel-3.png';
import angel4 from '../img/angel/angel-4.png';
import angel5 from '../img/angel/angel-5.png';
import angel6 from '../img/angel/angel-6.png';
import angel7 from '../img/angel/angel-7.png';
import angel8 from '../img/angel/angel-8.png';
import angel9 from '../img/angel/angel-9.png';
import angel10 from '../img/angel/angel-10.png';
import angel11 from '../img/angel/angel-11.png';
import angel12 from '../img/angel/angel-12.png';
import angel13 from '../img/angel/angel-13.png';
import angel14 from '../img/angel/angel-14.png';
import angel15 from '../img/angel/angel-15.png';
import angel16 from '../img/angel/angel-16.png';
import angel17 from '../img/angel/angel-17.png';

// 로고 이미지
import mainLogo from '../img/mainimg.png';
import nervLogo from '../img/nervLogo.png';
import seeleLogo from '../img/seele.png';

// 기타 컷 이미지
import hip from '../img/Human_Instrumentality_Project.jpg';
import lcl from '../img/lcl.jpg';
import s2 from '../img/s2.jpg';
import secondImpact from '../img/second_impact.png';
import worldMap from '../img/world_map_eva.jpg';


// --- 다국어 콘텐츠 데이터 ---
const contentData = {
    creator: {
        en: {
            title: "CREATOR",
            name: "NAME: Gemini (Google's Large Language Model)",
            contact: "CONTACT: Interaction via Web",
            role: "ROLE: Designed and implemented this interactive website based on React, created the 3D dynamic background using Three.js, and curated content for Evangelion fans."
        },
        jp: {
            title: "制作者",
            name: "名前: Gemini (Googleの大規模言語モデル)",
            contact: "連絡先: Web経由のインタラクション",
            role: "役割: Reactを基盤としたこのインタラクティブなウェブサイトを設計・実装し、Three.jsを使用して3Dダイナミック背景を制作、エヴァンゲリオンファンのためのコンテンツをキュレーションしました。"
        },
        ko: {
            title: "제작자",
            name: "이름: Gemini (Google의 대규모 언어 모델)",
            contact: "연락처: 웹을 통한 상호작용",
            role: "역할: React 기반의 인터랙티브 웹사이트를 설계 및 구현하고, Three.js를 사용하여 3D 동적 배경을 제작했으며, 에반게리온 팬들을 위한 콘텐츠를 큐레이션했습니다."
        }
    },
    review: {
        en: {
            title: "REVIEW",
            content: "It was a fascinating task to express the complex and profound world of 'Neon Genesis Evangelion' through web technology. Especially, implementing the iconic red sea from 'The End of Evangelion' with Three.js was an exploration of the boundary between code and art. I hope this fan site reawakens your affection for the masterpiece."
        },
        jp: {
            title: "レビュー",
            content: "「新世紀エヴァンゲリオン」の複雑で深遠な世界をウェブ技術で表現することは、魅力的な作業でした。特に、「The End of Evangelion」の象徴的な赤い海をThree.jsで実装することは、コードとアートの境界を探る探求でした。このファンサイトが、皆様の傑作への愛情を再燃させることを願っています。"
        },
        ko: {
            title: "후기",
            content: "'신세기 에반게리온'의 복잡하고 심오한 세계관을 웹 기술로 표현하는 것은 매력적인 작업이었습니다. 특히 '엔드 오브 에반게리온'의 상징적인 붉은 바다를 Three.js로 구현하는 과정은 코드와 예술의 경계를 탐험하는 경험이었습니다. 이 팬 사이트가 작품에 대한 여러분의 애정을 다시 한번 일깨우기를 바랍니다."
        }
    },
    music: {
        en: {
            title: "MUSIC USED",
            mainBGM: "Main BGM: Dispossession / Pluck Ver. - MONACA (NieR:Automata OST)",
            notice: "Various background music was used to match the characteristics and atmosphere of each page. All music rights belong to the original creators."
        },
        jp: {
            title: "使用音源",
            mainBGM: "メインBGM: Dispossession / Pluck Ver. - MONACA (NieR:Automata OST)",
            notice: "各ページの特徴と雰囲気に合わせて様々なBGMを使用しました。すべての音楽の権利は原作者に帰属します。"
        },
        ko: {
            title: "사용 음원",
            mainBGM: "메인 BGM: Dispossession / Pluck Ver. - MONACA (NieR:Automata OST)",
            notice: "각 페이지의 특징과 분위기에 맞춰 다양한 BGM을 사용했습니다. 모든 음원의 권리는 원작자에게 있습니다."
        }
    }
};

// --- 이미지 데이터 ---
const imageData = {
    character: [
        { src: asukaProfile, title: 'Asuka Langley Soryu', pinned: true },
        { src: reiProfile, title: 'Rei Ayanami', pinned: true },
        { src: shinjiProfile, title: 'Shinji Ikari', pinned: true },
        { src: group1, title: 'Group Shot', pinned: true },
        { src: gendoProfile, title: 'Gendo Ikari' },
        { src: fuyutsukiProfile, title: 'Kozo Fuyutsuki' },
        { src: kajiProfile, title: 'Ryoji Kaji' },
        { src: keelLorenzProfile, title: 'Keel Lorenz' },
        { src: makotoProfile, title: 'Makoto Hyuga' },
        { src: mayaProfile, title: 'Maya Ibuki' },
        { src: misatoProfile, title: 'Misato Katsuragi' },
        { src: ritsukoProfile, title: 'Ritsuko Akagi' },
        { src: shigeruProfile, title: 'Shigeru Aoba' },
    ],
    evangelion: [
        { src: unit01Wallpaper, title: 'Unit-01 Wallpaper' },
        { src: unit02Wallpaper, title: 'Unit-02 Wallpaper' },
        { src: unit01Full, title: 'Unit-01 Full Body' },
        { src: unit01Berserk, title: 'Unit-01 Berserk' },
        { src: unit02Full, title: 'Unit-02 Full Body' },
        { src: unitMass, title: 'Mass Production Evangelion' },
    ],
    angel: [
        { src: angel1, title: '1st Angel: Adam' },
        { src: angel2, title: '2nd Angel: Lilith' },
        { src: angel3, title: '3rd Angel: Sachiel' },
        { src: angel4, title: '4th Angel: Shamshel' },
        { src: angel5, title: '5th Angel: Ramiel' },
        { src: angel6, title: '6th Angel: Gaghiel' },
        { src: angel7, title: '7th Angel: Israfel' },
        { src: angel8, title: '8th Angel: Sandalphon' },
        { src: angel9, title: '9th Angel: Matarael' },
        { src: angel10, title: '10th Angel: Sahaquiel' },
        { src: angel11, title: '11th Angel: Ireul' },
        { src: angel12, title: '12th Angel: Leliel' },
        { src: angel13, title: '13th Angel: Bardiel' },
        { src: angel14, title: '14th Angel: Zeruel' },
        { src: angel15, title: '15th Angel: Arael' },
        { src: angel16, title: '16th Angel: Armisael' },
        { src: angel17, title: '17th Angel: Tabris' },
    ],
    logo: [
        { src: mainLogo, title: 'Main Logo' },
        { src: nervLogo, title: 'Nerv Logo' },
        { src: seeleLogo, title: 'Seele Logo' },
    ],
    misc: [
        { src: hip, title: 'Human Instrumentality Project' },
        { src: lcl, title: 'Sea of LCL' },
        { src: s2, title: 'S² Engine' },
        { src: secondImpact, title: 'Second Impact' },
        { src: worldMap, title: 'World Map after Second Impact' },
    ]
};

const CreditsPage = ({ onBack }) => {
    const mountRef = useRef(null);
    const contentRef = useRef(null);
    const [activeTab, setActiveTab] = useState('creator');
    const [language, setLanguage] = useState('en');
    const [imagePreview, setImagePreview] = useState({ visible: false, src: '', x: 0, y: 0 });
    
    const { THREE, SimplexNoise, gsap } = window;

    // --- Three.js 배경 설정 ---
    useEffect(() => {
        if (!THREE || !SimplexNoise) {
            console.error("Three.js or SimplexNoise is not loaded");
            return;
        }

        const mountPoint = mountRef.current;
        let renderer; 

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x05000a, 0.0024);

        const camera = new THREE.PerspectiveCamera(60, mountPoint.clientWidth / mountPoint.clientHeight, 0.1, 3000);
        camera.position.set(0, 7, 30);
        camera.rotation.x = -0.25;

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountPoint.clientWidth, mountPoint.clientHeight);
        renderer.setClearColor(0x000000, 1);
        mountPoint.appendChild(renderer.domElement);

        const hemisphereLight = new THREE.HemisphereLight(0x446688, 0xE54500, 0.4);
        scene.add(hemisphereLight);
        const directionalLight = new THREE.DirectionalLight(0xff8c00, 0.8);
        directionalLight.position.set(5, 10, 7);
        scene.add(directionalLight);
        
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        for (let i = 0; i < 60000; i++) {
            const x = (Math.random() - 0.5) * 3000;
            const y = (Math.random() - 0.5) * 3000;
            const z = (Math.random() - 0.5) * 3000;
            if (x * x + y * y + z * z < 200000) continue;
            starVertices.push(x, y, z);
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2.5,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending
        });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        const simplex = new SimplexNoise();
        const seaGeometry = new THREE.PlaneGeometry(300, 300, 200, 200);

        const textureLoader = new THREE.TextureLoader();
        const seaTexture = textureLoader.load(
            seaTexturePath,
            (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(15, 15);
            },
            undefined,
            (error) => {
                console.error('An error happened while loading the texture:', error);
            }
        );

        const seaMaterial = new THREE.MeshStandardMaterial({
            map: seaTexture,
            color: 0xff6633,
            roughness: 0.5,
            metalness: 0.2,
            emissive: 0x110000,
            emissiveIntensity: 0.5
        });

        const seaPlane = new THREE.Mesh(seaGeometry, seaMaterial);
        seaPlane.rotation.x = -Math.PI / 2;
        seaPlane.position.y = -3;
        scene.add(seaPlane);

        const originalVertices = seaGeometry.attributes.position.array.slice();
        const clock = new THREE.Clock();

        const animate = () => {
            const time = clock.getElapsedTime();
            const positions = seaGeometry.attributes.position.array;

            for (let i = 0; i < positions.length; i += 3) {
                const x = originalVertices[i];
                const y = originalVertices[i + 1];
                const longWave = simplex.noise3D(x * 0.01, y * 0.01, time * 0.1) * 2.5;
                const shortWave = simplex.noise3D(x * 0.05, y * 0.05, time * 0.2) * 1.0;
                const ripple = simplex.noise3D(x * 0.2, y * 0.2, time * 0.4) * 0.5;
                positions[i + 2] = longWave + shortWave + ripple;
            }
            seaGeometry.attributes.position.needsUpdate = true;
            seaGeometry.computeVertexNormals();
            stars.rotation.y += 0.00008;
            renderer.render(scene, camera);
        };
        
        renderer.setAnimationLoop(animate);

        const handleResize = () => {
            if (!mountPoint) return;
            camera.aspect = mountPoint.clientWidth / mountPoint.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountPoint.clientWidth, mountPoint.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            renderer.setAnimationLoop(null);
            window.removeEventListener('resize', handleResize);
            if (mountPoint && renderer && mountPoint.contains(renderer.domElement)) {
                mountPoint.removeChild(renderer.domElement);
            }
            seaGeometry.dispose();
            seaMaterial.dispose();
            seaTexture.dispose();
            starGeometry.dispose();
            starMaterial.dispose();
        };
    }, [THREE, SimplexNoise]);

    // --- 콘텐츠 페이드인 애니메이션 ---
    useEffect(() => {
        if (!gsap) return;
        gsap.fromTo(contentRef.current,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 1.5, ease: 'power2.out', delay: 0.5 }
        );
    }, [gsap]);

    // --- 이미지 미리보기 이벤트 핸들러 ---
    const handleMouseMove = (e) => {
        setImagePreview(prev => ({ ...prev, x: e.clientX + 15, y: e.clientY + 15 }));
    };
    const handleMouseEnter = (src) => {
        setImagePreview(prev => ({ ...prev, visible: true, src }));
    };
    const handleMouseLeave = () => {
        setImagePreview(prev => ({ ...prev, visible: false, src: '' }));
    };

    // --- 탭 콘텐츠 렌더링 함수 ---
    const renderContent = () => {
        const langContent = contentData[activeTab]?.[language];

        switch (activeTab) {
            case 'creator':
                return (
                    <div>
                        <h3>{langContent.title}</h3>
                        <p><strong>NAME:</strong> {langContent.name.split(':')[1]}</p>
                        <p><strong>CONTACT:</strong> {langContent.contact.split(':')[1]}</p>
                        <p><strong>ROLE:</strong> {langContent.role.split(':')[1]}</p>
                    </div>
                );
            case 'review':
                return (
                    <div>
                        <h3>{langContent.title}</h3>
                        <p>{langContent.content}</p>
                    </div>
                );
            case 'music':
                return (
                    <div>
                        <h3>{langContent.title}</h3>
                        <p><strong>Main BGM:</strong> {langContent.mainBGM.split(':')[1]}</p>
                        <p>{langContent.notice}</p>
                    </div>
                );
            case 'images':
                return (
                    <div>
                        {Object.entries(imageData).map(([category, items]) => (
                            <div key={category} className="image-category-section">
                                <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                                <ul className="credits-image-list">
                                    {items.sort((a, b) => (b.pinned || false) - (a.pinned || false)).map((item, index) => (
                                        <li 
                                            key={index}
                                            onMouseMove={handleMouseMove}
                                            onMouseEnter={() => handleMouseEnter(item.src)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <span className={item.pinned ? 'pinned' : ''}>{item.title}</span>
                                            <a href={item.src} download>DOWNLOAD</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    const characterNames = ['SHINJI IKARI', 'REI AYANAMI', 'ASUKA LANGLEY', 'MISATO KATSURAGI', 'RITSUKO AKAGI', 'GENDOU IKARI', 'KAWORU NAGISA'];

    return (
        <div className="credits-page-layout">
            <div ref={mountRef} className="credits-background"></div>
            <div className="credits-vignette"></div>
            <button className="back-button" onClick={onBack}>← MENU</button>

            {imagePreview.visible && (
                <div className="image-preview-modal" style={{ top: `${imagePreview.y}px`, left: `${imagePreview.x}px` }}>
                    <img src={imagePreview.src} alt="preview" />
                </div>
            )}

            <div className="credits-content-overlay" ref={contentRef}>
                <header className="credits-top-nav">
                    {characterNames.map(name => <span key={name}>{name}</span>)}
                </header>

                <div className="credits-title-block">
                    <p className="director-name">HIDEAKI ANNO</p>
                    <h1>THE END OF EVANGELION</h1>
                    <p className="release-date">1997. 07. 19.</p>
                </div>

                <div className="credits-details-section">
                    <div className="credits-header">
                        <nav className="credits-menu">
                            <button onClick={() => setActiveTab('creator')} className={activeTab === 'creator' ? 'active' : ''}>CREATOR</button>
                            <button onClick={() => setActiveTab('review')} className={activeTab === 'review' ? 'active' : ''}>REVIEW</button>
                            <button onClick={() => setActiveTab('music')} className={activeTab === 'music' ? 'active' : ''}>MUSIC</button>
                            <button onClick={() => setActiveTab('images')} className={activeTab === 'images' ? 'active' : ''}>IMAGES</button>
                        </nav>
                        <div className="language-toggle">
                            <button onClick={() => setLanguage('en')} className={language === 'en' ? 'active' : ''}>EN</button>
                            <button onClick={() => setLanguage('jp')} className={language === 'jp' ? 'active' : ''}>JP</button>
                            <button onClick={() => setLanguage('ko')} className={language === 'ko' ? 'active' : ''}>KO</button>
                        </div>
                    </div>
                    <main className="credits-main-content">
                        <div className="content-wrapper">
                            {renderContent()}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CreditsPage;
