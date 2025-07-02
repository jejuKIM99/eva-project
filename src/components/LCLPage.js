import React, { useState, useEffect, useRef, useCallback } from 'react';
import lclImage from '../img/lcl.jpg'; // 이미지 경로는 실제 프로젝트에 맞게 조정

// 타이핑 효과 커스텀 훅
const useTypingEffect = (text, duration) => {
    const [typedText, setTypedText] = useState('');

    useEffect(() => {
        setTypedText('');
        if (!text) return;

        const totalChars = text.length;
        const delay = duration / totalChars;
        let timeoutId;

        const typeChar = (index) => {
            if (index < totalChars) {
                setTypedText(prev => prev + text[index]);
                timeoutId = setTimeout(() => typeChar(index + 1), delay);
            }
        };

        typeChar(0);

        return () => clearTimeout(timeoutId);
    }, [text, duration]);

    return typedText;
};


// --- 엔트리 플러그 뷰 컴포넌트 ---
const EntryPlugView = ({ onBack }) => {
    const mountRef = useRef(null);
    const animationFrameId = useRef(null);
    const isDragging = useRef(false);
    const previousMousePosition = useRef({ x: 0, y: 0 });
    
    const wireframePlugRef = useRef(null);
    const texturedPlugRef = useRef(null); // 이제 Group을 참조합니다.
    const rotationGroupRef = useRef(null);

    // [수정] 텍스처 재질과 캡 재질을 별도로 참조합니다.
    const texturedMaterialRef = useRef(null);
    const capMaterialRef = useRef(null);

    const rotationVelocity = useRef({ x: 0, y: 0 });
    const dampingFactor = 0.95;

    const [isTextureOn, setIsTextureOn] = useState(false);

    const THREE = window.THREE;
    const gsap = window.gsap;

    const titleText = useTypingEffect("ENTRY PLUG: INTERNAL STATUS", 1500);
    const pilotData = useTypingEffect("IKARI SHINJI", 1000);
    const syncData = useTypingEffect("94.3%", 1000);
    const vitalData = useTypingEffect("STABLE", 1000);
    const lclData = useTypingEffect("99.8%", 1000);
    
    const handleTextureToggle = useCallback(() => {
        setIsTextureOn(prev => !prev);
    }, []);

    const generatePlugTexture = useCallback(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const canvasWidth = 2248; 
        const canvasHeight = 2048;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // 1. 베이스 색상 (밝은 회색)
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // 2. 중앙의 "EVA-01 TEST TYPE" 텍스트
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate(Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 90px "Eurostile", "Orbitron", sans-serif';
        ctx.fillText('EVA-01', 0, -20);
        ctx.font = '30px "Eurostile", "Orbitron", sans-serif';
        ctx.fillText('TEST TYPE', 0, 40);
        ctx.restore();

        // 3. 상단부 디테일 (EJECTION COVER)
        const topSectionY = 350;
        ctx.fillStyle = '#D0D0D0';
        ctx.fillRect(0, topSectionY - 60, canvasWidth, 60);
        ctx.strokeStyle = '#AEAEAE';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, topSectionY - 60, canvasWidth, 60);
        
        ctx.fillStyle = '#222';
        ctx.font = '24px "Orbitron", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('EJECTION COVER', canvasWidth / 2, topSectionY - 22);
        
        // 4. 탑승구 선 (Hatch Line)
        ctx.strokeStyle = '#A0A0A0';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(canvasWidth * 0.1, topSectionY);
        ctx.lineTo(canvasWidth * 0.9, topSectionY);
        ctx.stroke();

        // 5. 컬러 링 (빨강 -> 금색 순서)
        const redRingY = topSectionY + 20;
        const goldRingY = redRingY + 40;
        
        ctx.fillStyle = '#B12222'; // 빨간색
        ctx.fillRect(0, redRingY, canvasWidth, 250);
        
        ctx.fillStyle = '#C7A24A'; // 금색
        ctx.fillRect(0, goldRingY, canvasWidth, 135);

        // 6. 하단부 디테일 (CAUTION)
        const bottomSectionY = canvasHeight - 450;
        ctx.fillStyle = '#B12222';
        ctx.font = 'bold 22px "Orbitron", sans-serif';
        ctx.save();
        ctx.translate(canvasWidth / 2, bottomSectionY);
        ctx.rotate(Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText('CAUTION', 0, 0);
        ctx.restore();

        // 7. 전체적인 패널 라인 추가
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1.5;
        const drawPanelLine = (y) => {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
            ctx.stroke();
        };
        drawPanelLine(topSectionY);
        drawPanelLine(goldRingY + 25);
        drawPanelLine(canvasHeight - 600);
        drawPanelLine(canvasHeight - 300);

        const texture = new THREE.CanvasTexture(canvas);
        texture.encoding = THREE.sRGBEncoding;
        
        // [수정] 텍스처가 수직으로 반복되지 않도록 설정
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping; 
        texture.repeat.set(1, 1); 
        return texture;
    }, [THREE]);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount || !THREE) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        camera.position.z = 10;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mount.appendChild(renderer.domElement);

        const rotationGroup = new THREE.Group();
        rotationGroup.rotation.x = 0.5;
        rotationGroup.rotation.y = 0.5;
        scene.add(rotationGroup);
        rotationGroupRef.current = rotationGroup;

        // --- 지오메트리 생성 (몸통, 상단/하단 캡 분리) ---
        const radius = 2;
        const height = 8;
        const radialSegments = 64;
        const heightSegments = 32;
        const bodyGeom = new THREE.CylinderGeometry(radius, radius, height, radialSegments, heightSegments, false);
        const topCapGeom = new THREE.SphereGeometry(radius, radialSegments, heightSegments, 0, Math.PI * 2, 0, Math.PI / 2);
        topCapGeom.translate(0, height / 2, 0);
        const bottomCapGeom = new THREE.SphereGeometry(radius, radialSegments, heightSegments, 0, Math.PI * 2, 0, Math.PI / 2);
        bottomCapGeom.rotateX(Math.PI);
        bottomCapGeom.translate(0, -height / 2, 0);
        
        // --- 와이어프레임용 지오메트리 (기존과 동일하게 모두 합침) ---
        const internalGeometries = [];
        const seatGeom = new THREE.BoxGeometry(0.8, 1, 0.8);
        seatGeom.translate(0, 0.5, 0);
        internalGeometries.push(seatGeom);
        const headrestGeom = new THREE.BoxGeometry(0.8, 0.5, 0.2);
        headrestGeom.translate(0, 1.2, -0.3);
        internalGeometries.push(headrestGeom);
        const createWire = (points) => {
            const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
            return new THREE.TubeGeometry(curve, 20, 0.03, 8, false);
        };
        internalGeometries.push(createWire([[-0.7, -1, 0.5], [-0.5, 0, 0.6], [0, 1, 0.7], [0.5, 2, 0.5], [0.7, 3, 0]]));
        internalGeometries.push(createWire([[0.7, -1.5, -0.5], [0.4, -0.5, -0.6], [0, 0.5, -0.5], [-0.5, 1.5, -0.7], [-0.7, 2.5, -0.2]]));
        const combinedWireframeGeom = window.THREE.BufferGeometryUtils.mergeBufferGeometries([bodyGeom, topCapGeom, bottomCapGeom, ...internalGeometries]);
        const wireframeGeom = new THREE.EdgesGeometry(combinedWireframeGeom);
        const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xff6a00, transparent: true, opacity: 0.8 });
        const wireframePlug = new THREE.LineSegments(wireframeGeom, wireframeMaterial);
        wireframePlugRef.current = wireframePlug;
        rotationGroup.add(wireframePlug);

        // --- [수정] 텍스처용 모델 (메쉬 분리 및 그룹화) ---
        const plugTexture = generatePlugTexture();
        
        // 몸통 재질
        const texturedMaterial = new THREE.MeshStandardMaterial({ 
            map: plugTexture, 
            metalness: 0.2, 
            roughness: 0.6,
            transparent: true,
            opacity: 0
        });
        texturedMaterialRef.current = texturedMaterial;

        // 캡 재질 (단색)
        const capMaterial = new THREE.MeshStandardMaterial({
            color: '#fff',
            metalness: 0.2,
            roughness: 0.6,
            transparent: true,
            opacity: 0
        });
        capMaterialRef.current = capMaterial;

        // 각 파트별 메쉬 생성
        const bodyMesh = new THREE.Mesh(bodyGeom, texturedMaterial);
        const topCapMesh = new THREE.Mesh(topCapGeom, capMaterial);
        const bottomCapMesh = new THREE.Mesh(bottomCapGeom, capMaterial);

        // 메쉬들을 하나의 그룹으로 묶음
        const texturedPlug = new THREE.Group();
        texturedPlug.add(bodyMesh, topCapMesh, bottomCapMesh);
        texturedPlug.visible = false;
        texturedPlugRef.current = texturedPlug;
        rotationGroup.add(texturedPlug);

        // --- 조명 ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        // --- 애니메이션 및 이벤트 핸들러 (기존과 동일) ---
        const totalVertices = wireframeGeom.attributes.position.count;
        wireframeGeom.setDrawRange(0, 0);
        gsap.to(wireframeGeom.drawRange, { count: totalVertices, duration: 3, ease: "power2.inOut", delay: 0.5 });
        gsap.fromTo(".plug-graph-bar-fill", { width: '0%' }, { width: () => `${80 + Math.random() * 15}%`, duration: 2, ease: 'power3.out', stagger: 0.2, delay: 1.5 });

        const onPointerDown = (e) => {
            isDragging.current = true;
            previousMousePosition.current = { x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY };
        };
        const onPointerMove = (e) => {
            if (!isDragging.current || !rotationGroupRef.current) return;
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            const deltaX = clientX - previousMousePosition.current.x;
            const deltaY = clientY - previousMousePosition.current.y;
            rotationVelocity.current.y += deltaX * 0.0005;
            rotationVelocity.current.x += deltaY * 0.0005;
            previousMousePosition.current = { x: clientX, y: clientY };
        };
        const onPointerUp = () => { isDragging.current = false; };

        mount.addEventListener('mousedown', onPointerDown);
        mount.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);
        mount.addEventListener('touchstart', onPointerDown, { passive: true });
        mount.addEventListener('touchmove', onPointerMove, { passive: true });
        window.addEventListener('touchend', onPointerUp);

        const animate = () => {
            animationFrameId.current = requestAnimationFrame(animate);
            if (rotationGroupRef.current) {
                rotationGroupRef.current.rotation.y += rotationVelocity.current.y;
                rotationGroupRef.current.rotation.x += rotationVelocity.current.x;
                rotationVelocity.current.y *= dampingFactor;
                rotationVelocity.current.x *= dampingFactor;
            }
            renderer.render(scene, camera);
        };
        animate();
        
        const handleResize = () => {
            const { clientWidth, clientHeight } = mount;
            if(!clientWidth || !clientHeight) return;
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(clientWidth, clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId.current);
            window.removeEventListener('resize', handleResize);
            mount.removeEventListener('mousedown', onPointerDown);
            mount.removeEventListener('mousemove', onPointerMove);
            window.removeEventListener('mouseup', onPointerUp);
            mount.removeEventListener('touchstart', onPointerDown);
            mount.removeEventListener('touchmove', onPointerMove);
            window.removeEventListener('touchend', onPointerUp);
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, [THREE, gsap, generatePlugTexture]);

    // [수정] 텍스처/와이어프레임 전환 로직
    useEffect(() => {
        const wireMesh = wireframePlugRef.current;
        const texGroup = texturedPlugRef.current;
        const texMat = texturedMaterialRef.current;
        const capMat = capMaterialRef.current;

        if (!wireMesh || !texGroup || !texMat || !capMat) return;
        
        if (isTextureOn) {
            texGroup.visible = true;
            wireMesh.visible = false;
            gsap.to([texMat, capMat], { opacity: 1, duration: 0.5 });
        } else {
            wireMesh.visible = true;
            gsap.to([texMat, capMat], { 
                opacity: 0, 
                duration: 0.5,
                onComplete: () => {
                    if (!isTextureOn) {
                       texGroup.visible = false;
                    }
                }
            });
        }
    }, [isTextureOn, gsap]);
    
    const isTypingComplete = titleText === "ENTRY PLUG: INTERNAL STATUS";

    return (
        <div className="entry-plug-view">
            <div className="plug-gui-header">
                <h2 className="plug-gui-title">{titleText}{!isTypingComplete && <span className="typing-cursor">_</span>}</h2>
                <button className="plug-back-button" onClick={onBack}>← BACK</button>
            </div>
            <div className="plug-gui-content">
                <div className="plug-left-panel">
                    <div className="plug-data-block">
                        <h3 className="plug-data-title">// PILOT_DATA</h3>
                        <div className="plug-info-grid">
                            <span>DESIGNATION:</span><span className="plug-data-value">{pilotData}</span>
                            <span>A10 NERVE SYNC:</span><span className="plug-data-value">{syncData}</span>
                            <span>MENTAL STABILITY:</span><span className="plug-data-value warn">FLUCTUATING</span>
                            <span>HARMONICS:</span><span className="plug-data-value ok">NORMAL</span>
                        </div>
                    </div>
                     <div className="plug-data-block">
                        <h3 className="plug-data-title">// LIFE_SUPPORT</h3>
                        <div className="plug-info-grid">
                            <span>VITALS:</span><span className="plug-data-value ok">{vitalData}</span>
                            <span>LCL DENSITY:</span><span className="plug-data-value">{lclData}</span>
                            <span>BLOOD OXYGEN:</span><span className="plug-data-value ok">102%</span>
                            <span>INTERNAL PRES:</span><span className="plug-data-value ok">STABLE</span>
                        </div>
                    </div>
                    <div className="plug-data-block">
                        <h3 className="plug-data-title">// PERFORMANCE_GRAPH</h3>
                        <div className="plug-graph-container">
                            <div className="plug-graph-item">
                                <span className="plug-graph-label">NEURAL-LINK</span>
                                <div className="plug-graph-bar-bg"><div className="plug-graph-bar-fill"></div></div>
                            </div>
                             <div className="plug-graph-item">
                                <span className="plug-graph-label">PSYCHO-WAVE</span>
                                <div className="plug-graph-bar-bg"><div className="plug-graph-bar-fill"></div></div>
                            </div>
                             <div className="plug-graph-item">
                                <span className="plug-graph-label">ATF-OUTPUT</span>
                                <div className="plug-graph-bar-bg"><div className="plug-graph-bar-fill"></div></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="plug-center-panel-wrapper">
                    <div className="plug-center-panel" ref={mountRef}></div>
                    <div className="plug-controls-container">
                        <button className="texture-toggle-button" onClick={handleTextureToggle}>
                            {isTextureOn ? 'WIREFRAME VIEW' : 'TEXTURE VIEW'}
                        </button>
                    </div>
                </div>
            </div>
             <div className="plug-gui-footer">
                <span className="footer-text blinking">_COMMAND_LINK_ACTIVE_</span>
            </div>
        </div>
    );
};

// --- 메인 LCL 페이지 컴포넌트 ---
const LCLPage = ({ onBack }) => {
    const [isPlugView, setIsPlugView] = useState(false);
    const [plugViewKey, setPlugViewKey] = useState(0); 
    const mountRef = useRef(null);
    const pageRef = useRef(null);
    const guiRef = useRef(null);
    const animationFrameId = useRef(null);
    const gsap = window.gsap;
    const THREE = window.THREE;

    const handleViewChange = () => {
        gsap.to(guiRef.current, {
            autoAlpha: 0,
            duration: 0.5,
            onComplete: () => setIsPlugView(true)
        });
    };
    
    const handleBackToLCL = () => {
        setIsPlugView(false);
    };

    useEffect(() => {
        if (!isPlugView) return;

        const handleResizeForReload = () => {
            clearTimeout(window.resizeTimeout);
            window.resizeTimeout = setTimeout(() => {
                setPlugViewKey(prevKey => prevKey + 1);
            }, 250);
        };

        window.addEventListener('resize', handleResizeForReload);

        return () => {
            window.removeEventListener('resize', handleResizeForReload);
        };
    }, [isPlugView]);

    useEffect(() => {
        if (isPlugView) return; 

        const mount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mount.appendChild(renderer.domElement);
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 1.0 },
                color1: { value: new THREE.Color(0xff6a00) },
                color2: { value: new THREE.Color(0xffa500) }
            },
            vertexShader: `
                uniform float time;
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    float z = sin(pos.x * 5.0 + time) * 0.2 + sin(pos.y * 5.0 + time) * 0.2;
                    pos.z += z;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec2 vUv;
                void main() {
                    gl_FragColor = vec4(mix(color1, color2, vUv.y), 0.8);
                }
            `,
            transparent: true,
            wireframe: true
        });

        const geometry = new THREE.PlaneGeometry(20, 20, 100, 100);
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2.5;
        scene.add(plane);

        camera.position.z = 5;
        camera.position.y = 2;

        const clock = new THREE.Clock();

        const animate = () => {
            animationFrameId.current = requestAnimationFrame(animate);
            material.uniforms.time.value = clock.getElapsedTime();
            renderer.render(scene, camera);
        };

        const handleResize = () => {
            const { clientWidth, clientHeight } = mount;
            if(!clientWidth || !clientHeight) return;
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(clientWidth, clientHeight);
        };

        window.addEventListener('resize', handleResize);
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId.current);
            window.removeEventListener('resize', handleResize);
            if (mount && mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, [isPlugView, THREE]);
    
    useEffect(() => {
        const page = pageRef.current;
        gsap.fromTo(page, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 });

        if (!isPlugView && guiRef.current) {
            gsap.fromTo(guiRef.current, 
                { autoAlpha: 0, clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)' },
                { 
                    autoAlpha: 1, 
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                    duration: 1, 
                    ease: 'power3.out',
                    delay: 0.4 
                }
            );
        }
    }, [isPlugView, gsap]);

    return (
        <div className="lcl-page-layout" ref={pageRef}>
            <div ref={mountRef} className="lcl-3d-canvas"></div>
            {!isPlugView && 
                <button className="back-button" onClick={onBack}>
                    Back to Main
                </button>
            }
            
            {isPlugView ? (
                <EntryPlugView key={plugViewKey} onBack={handleBackToLCL} />
            ) : (
                <div className="lcl-gui-container" ref={guiRef}>
                    <div className="gui-header-bar">
                        <span className="header-text">// LCL ANALYSIS_</span>
                        <span className="header-deco"></span>
                    </div>
                    <div className="gui-main-content">
                        <div className="gui-left-panel">
                            <div className="data-block">
                                <h3 className="data-title">BIOLOGICAL COMPONENT</h3>
                                <p className="data-text">Primary substance is a complex protein solution derived from the First Angel, Adam. Possesses properties of primordial ooze.</p>
                            </div>
                            <div className="data-block">
                                <h3 className="data-title">PILOT INTERFACE</h3>
                                <p className="data-text">Acts as an electrochemical medium for neural synchronization between pilot and Evangelion. Facilitates thought-based control.</p>
                            </div>
                            <div className="data-block status-block">
                                <h3 className="data-title">SYSTEM STATUS</h3>
                                <div className="status-grid">
                                    <span>OXYGENATION:</span> <span className="status-value ok">STABLE</span>
                                    <span>PRESSURE:</span> <span className="status-value ok">NOMINAL</span>
                                    <span>PURITY:</span> <span className="status-value warn">98.9%</span>
                                    <span>SYNC-RATE:</span> <span className="status-value ok">OPTIMIZED</span>
                                </div>
                            </div>
                        </div>
                        <div className="gui-right-panel">
                            <div className="image-container">
                                <img src={lclImage} alt="LCL Fluid Sample" />
                                <div className="scanline-overlay"></div>
                                <div className="image-tag">#SAMPLE_707</div>
                            </div>
                            <div className="data-block description-block">
                                <h3 className="data-title">TACTICAL OVERVIEW</h3>
                                <p className="data-text">
                                    Link Connect Liquid (LCL) is the lifeblood of the Evangelion project. Its unique properties not only provide life support but are essential for the pilot's psychic link to the bio-mechanical giant.
                                </p>
                            </div>
                            <button className="view-plug-button" onClick={handleViewChange}>
                                &gt;&gt; VIEW PLUG STATUS
                            </button>
                        </div>
                    </div>
                    <div className="gui-footer-bar">
                        <span className="footer-text">_MAGI_SYSTEM_LINK_ESTABLISHED</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LCLPage;
