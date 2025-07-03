import React, { useEffect, useRef, useState } from 'react';

// --- 이미지 Asset Import ---
import seaTexturePath from '../img/texture/sea.jpg';
import dispossessionAlbumArt from '../img/Dispossession.jpg'; // MUSIC 탭용 앨범아트

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

// 사도 이미지
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
            nameLabel: "NAME",
            nameValue: "Hyunsoo Kim",
            contactLabel: "CONTACT",
            contactEmail: "E-Mail",
            contactGithub: "Github",
            roleLabel: "ROLE",
            roleValue: "Solo Developer",
            githubLinkLabel: "GITHUB"
        },
        jp: {
            title: "制作者",
            nameLabel: "名前",
            nameValue: "キム・ヒョンス",
            contactLabel: "連絡先",
            contactEmail: "Eメール",
            contactGithub: "Github",
            roleLabel: "役割",
            roleValue: "一人開発",
            githubLinkLabel: "ギットハブリンク"
        },
        ko: {
            title: "제작자",
            nameLabel: "이름",
            nameValue: "김현수",
            contactLabel: "연락처",
            contactEmail: "이메일",
            contactGithub: "깃허브",
            roleLabel: "역할",
            roleValue: "1인개발",
            githubLinkLabel: "깃허브 링크"
        }
    },
    review: {
        en: {
            title: "REVIEW",
            content: (
                <>
                    <p>With a love for <span className="highlight-eva">'Neon Genesis Evangelion'</span>, I utilized my web development skills to create a fan page for many fellow fans to enjoy. I strove to incorporate everything I experienced while watching the animation, from <span className="highlight-eva">'Neon Genesis Evangelion'</span> to <span className="highlight-eoe">'The End of Evangelion'</span>. In every aspect, including colors, fonts, UI, and interactions, I configured elements seen in the <span className="highlight-series">'Evangelion series'</span> to provide the best <span className="highlight-concept">'User Experience (UX)'</span>. For this, I used <span className="highlight-tech">'GSAP'</span>, <span className="highlight-tech">'Three.js'</span>, and <span className="highlight-tech">'SimplexNoise.js'</span> within a <span className="highlight-tech">'React.js'</span> framework development environment.</p>
                    <p>This was quite a challenging project for me. I repeated the process of planning the UI style for each menu, designing the interactions, developing, and testing countless times. It would have been easier if I had given up on some details, but my affection for the <span className="highlight-series">'Evangelion series'</span> drove me to perfect them. Finally, completing this credits page and seeing the implemented Sea of LCL, the rush of emptiness and relief felt like the end of <span className="highlight-eoe">'The End of Evangelion'</span>. Seeing that, I believe I, as a developer, was also <span className="highlight-concept">'immersed'</span> in this site as a user.</p>
                    <p>I hope that not only myself but all users of this fan site can have their affection for the work reawakened here.</p>
                    <p className="highlight-annotation">*) All image sources used in this project can be downloaded from the IMAGES tab.</p>
                    <p className="highlight-annotation">**) This is a non-commercial project.</p>
                </>
            )
        },
        jp: {
            title: "レビュー",
            content: (
                <>
                    <p><span className="highlight-eva">「新世紀エヴァンゲリオン」</span>を愛する心を込めて、私のウェブ開発技術を活かし、多くの<span className="highlight-eva">「新世紀エヴァンゲリオン」</span>ファンの皆様に楽しんでいただけるファンページを制作しました。<span className="highlight-eva">「新世紀エヴァンゲリオン」</span>から<span className="highlight-eoe">「The End of Evangelion」</span>まで、私がアニメを観ながら経験したすべてを盛り込もうと努めました。色、フォント、UI、インタラクション（動作）など、あらゆる面で<span className="highlight-series">「エヴァンゲリオンシリーズ」</span>で見られた要素で構成し、ユーザーの皆様に最高の<span className="highlight-concept">「ユーザーエクスペリエンス（UX）」</span>を提供しようとしました。そのために、<span className="highlight-tech">「React.js」</span>フレームワークの開発環境で<span className="highlight-tech">「GSAP」</span>、<span className="highlight-tech">「Three.js」</span>、<span className="highlight-tech">「SimplexNoise.js」</span>を活用しました。</p>
                    <p>私にとってはかなり難しいプロジェクトでした。各メニューに合ったUIスタイルを企画することから、インタラクションを企画し、開発し、テストするまでの過程を数え切れないほど繰り返しました。少しのディテールを諦めれば楽になりましたが、<span className="highlight-series">「エヴァンゲリオンシリーズ」</span>への愛情から諦めずにディテールを追求しました。最終的にこのクレジットページを完成させ、実装されたLCLの海を見ると、押し寄せる空虚さと安堵感は<span className="highlight-eoe">「The End of Evangelion」</span>の結末のように感じられました。そう考えると、私も開発者でありながら、一人のユーザーとしてこのサイトに<span className="highlight-concept">「没入」</span>していたのだと思います。</p>
                    <p>私だけでなく、このファンサイトを利用するすべてのユーザーの皆様が、ここで作品への愛情を再燃させられることを願っています。</p>
                    <p className="highlight-annotation">*) IMAGESタブにて、このプロジェクトで使用されたすべての画像ソースをダウンロードできます。</p>
                    <p className="highlight-annotation">**) このプロジェクトは非商業用プロジェクトです。</p>
                </>
            )
        },
        ko: {
            title: "후기",
            content: (
                <>
                    <p><span className="highlight-eva">'신세기 에반게리온'</span>을 좋아하는 마음을 담아 제가 할 수 있는 웹 개발 기술을 활용하여 많은 <span className="highlight-eva">'신세기 에반게리온'</span>의 팬분들이 즐길 수 있는 팬 페이지를 만들었습니다. <span className="highlight-eva">'신세기 에반게리온'</span> 부터 <span className="highlight-eoe">'엔드 오브 에반게리온'</span>까지 제가 애니메이션을 보며 경험한 모든것들을 담고자 노력했습니다. 색상,폰트,UI,인터렉션(동작)등 모든면에서 <span className="highlight-series">'에반게리온 시리즈'</span>에서 볼 수 있었던 요소들로 구성하여 사용자분들로 하여금 최상의 <span className="highlight-concept">'사용자 경험(UX)'</span>을 제공하고자 했습니다. 이를 위해 <span className="highlight-tech">'React.js'</span> 프레임워크 개발 환경에서 <span className="highlight-tech">'GSAP'</span>,<span className="highlight-tech">'Three.js'</span>,<span className="highlight-tech">'SimplexNoise.js'</span>를 활용하였습니다.</p>
                    <p>제게는 꽤나 어려운 프로젝트였습니다. 각 메뉴에 맞는 UI스타일을 기획하는 것 부터 인터렉션을 기획하고 개발하고 테스트까지의 과정을 수도없이 반복했습니다. 조금의 디테일만 포기한다면 편해졌겠지만 <span className="highlight-series">'에반게리온 시리즈'</span>를 향한 애정으로 포기하지 않고 디테일을 잡았습니다. 최종적으로 이 크래딧 페이지를 완성하고 구현된 LCL바다를 보니 밀려오는 공허함과 후련함은 <span className="highlight-eoe">'엔드 오브 에반게리온'</span>의 마지막처럼 느껴졌습니다. 그런걸보니 나름 저 또한 개발자이지만 사용자로서 이 사이트에 <span className="highlight-concept">'몰입'</span>했다 봅니다.</p>
                    <p>저뿐만 아니라 이 팬 사이트를 이용하시는 모든 사용자분들이 이곳으로 하여금 작품에 대한 애정을 다시 한번 일깨울 수 있기를 바랍니다.</p>
                    <p className="highlight-annotation">*) IMAGES 탭에서 이 프로젝트에서 사용된 모든 이미지 소스를 다운받을 수 있습니다.</p>
                    <p className="highlight-annotation">**) 이 프로젝트는 비상업용 프로젝트입니다.</p>
                </>
            )
        }
    },
    music: {
        en: {
            title: "MUSIC USED",
            bgmTitle: "Main BGM: Dispossession / Pluck Ver. - MONACA (NieR-Automata OST)",
            description: <>This is the BGM used on the main page. I chose it because I felt the atmospheres of the <span className="highlight-series">'Evangelion series'</span> and <span className="highlight-nier">'NieR:Automata'</span> align well. Exploring the site while listening to the BGM on the main page will provide a more immersive experience.</>,
            notice: "*) All music rights belong to their original creators."
        },
        jp: {
            title: "使用音源",
            bgmTitle: "メインBGM: Dispossession / Pluck Ver. - MONACA (NieR-Automata OST)",
            description: <>メインページで使用されているBGMです。<span className="highlight-series">「エヴァンゲリオンシリーズ」</span>の雰囲気と<span className="highlight-nier">「NieR:Automata」</span>の雰囲気がよく合うと判断し、使用しました。メインページでBGMを聴きながらサイトを探索すると、より高い没入感が得られます。</>,
            notice: "*) すべての音源の権利は原作者に帰属します。"
        },
        ko: {
            title: "사용 음원",
            bgmTitle: "Main BGM: Dispossession / Pluck Ver. - MONACA (NieR-Automata OST)",
            description: <>메인 페이지에 사용된 BGM입니다. <span className="highlight-series">'에반게리온 시리즈'</span> 분위기와 <span className="highlight-nier">'NieR:Automata'</span>의 분위기가 잘 맞는다 판단하여 사용했습니다. 메인 페이지에서 BGM을 들으며 사이트를 탐방하시면 더욱 높은 몰입감을 선사합니다.</>,
            notice: "*) 모든 음원의 권리는 원작자에게 있습니다."
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
    const [linkPreview, setLinkPreview] = useState({ visible: false, text: '', x: 0, y: 0 });
    
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
    const handleImageMouseMove = (e) => {
        setImagePreview(prev => ({ ...prev, x: e.clientX + 15, y: e.clientY + 15 }));
    };
    const handleImageMouseEnter = (src) => {
        setImagePreview(prev => ({ ...prev, visible: true, src }));
    };
    const handleImageMouseLeave = () => {
        setImagePreview(prev => ({ ...prev, visible: false, src: '' }));
    };

    // --- 링크 미리보기 이벤트 핸들러 ---
    const handleLinkMouseMove = (e) => {
        setLinkPreview(prev => ({ ...prev, x: e.clientX + 15, y: e.clientY - 30 }));
    };
    const handleLinkMouseEnter = (text) => {
        const modalText = language === 'jp' ? 
            (text === 'Send E-Mail' ? 'Eメールを送る' : 'Githubへ移動') : 
            (language === 'ko' ?
            (text === 'Send E-Mail' ? '이메일 보내기' : 'Github으로 이동') :
            text);
        setLinkPreview(prev => ({ ...prev, visible: true, text: modalText }));
    };
    const handleLinkMouseLeave = () => {
        setLinkPreview(prev => ({ ...prev, visible: false, text: '' }));
    };


    // --- 탭 콘텐츠 렌더링 함수 ---
    const renderContent = () => {
        const langContent = contentData[activeTab]?.[language];

        switch (activeTab) {
            case 'creator':
                const GITHUB_URL = 'https://github.com/jejuKIM99/eva-project';
                const EMAIL_ADDRESS = 'khs990120@gmail.com';

                const openLink = (url) => window.open(url, '_blank', 'noopener,noreferrer');
                const openEmail = () => window.location.href = `mailto:${EMAIL_ADDRESS}`;

                return (
                    <div>
                        <h3>{langContent.title}</h3>
                        <p><strong>{langContent.nameLabel}:</strong> {langContent.nameValue}</p>
                        <p>
                            <strong>{langContent.contactLabel}:</strong>{' '}
                            <span
                                className="interactive-link"
                                onMouseMove={handleLinkMouseMove}
                                onMouseEnter={() => handleLinkMouseEnter('Send E-Mail')}
                                onMouseLeave={handleLinkMouseLeave}
                                onClick={openEmail}
                            >
                                {langContent.contactEmail}
                            </span>,{' '}
                            <span
                                className="interactive-link"
                                onMouseMove={handleLinkMouseMove}
                                onMouseEnter={() => handleLinkMouseEnter('Go to Github')}
                                onMouseLeave={handleLinkMouseLeave}
                                onClick={() => openLink('https://github.com/jejuKIM99')}
                            >
                                {langContent.contactGithub}
                            </span>
                        </p>
                        <p><strong>{langContent.roleLabel}:</strong> {langContent.roleValue}</p>
                        <p>
                            <strong>{langContent.githubLinkLabel}:</strong>{' '}
                            <span
                                className="interactive-link"
                                onMouseMove={handleLinkMouseMove}
                                onMouseEnter={() => handleLinkMouseEnter('Go to Github')}
                                onMouseLeave={handleLinkMouseLeave}
                                onClick={() => openLink(GITHUB_URL)}
                            >
                                {GITHUB_URL}
                            </span>
                        </p>
                    </div>
                );
            case 'review':
                return (
                    <div>
                        <h3>{langContent.title}</h3>
                        <div>{langContent.content}</div>
                    </div>
                );
            case 'music':
                const YOUTUBE_MUSIC_URL = 'https://music.youtube.com/watch?v=mqpxRpjqAv8&si=lOu61y4HMxz2EwQI';
                return (
                    <div>
                        <h3>{langContent.title}</h3>
                        <div
                            className="interactive-bgm"
                            onMouseMove={handleImageMouseMove}
                            onMouseEnter={() => handleImageMouseEnter(dispossessionAlbumArt)}
                            onMouseLeave={handleImageMouseLeave}
                            onClick={() => window.open(YOUTUBE_MUSIC_URL, '_blank')}
                        >
                            <p><strong>{langContent.bgmTitle}</strong></p>
                        </div>
                        <p>{langContent.description}</p>
                        <p className="highlight-annotation">{langContent.notice}</p>
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
                                            onMouseMove={handleImageMouseMove}
                                            onMouseEnter={() => handleImageMouseEnter(item.src)}
                                            onMouseLeave={handleImageMouseLeave}
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

            {linkPreview.visible && (
                <div className="link-preview-modal" style={{ top: `${linkPreview.y}px`, left: `${linkPreview.x}px` }}>
                    {linkPreview.text}
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