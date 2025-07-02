import React, { useState, useEffect, useRef, useCallback } from 'react';

// S² Engine 3D 모델 뷰 컴포넌트
const S2EngineModelView = () => {
    const mountRef = useRef(null);
    const animationFrameId = useRef(null);
    const isDragging = useRef(false);
    const previousMousePosition = useRef({ x: 0, y: 0 });
    
    const wireframeCoreRef = useRef(null);
    const texturedCoreRef = useRef(null);
    const rotationGroupRef = useRef(null);
    const shaderMaterialRef = useRef(null);

    const rotationVelocity = useRef({ x: 0, y: 0 });
    const dampingFactor = 0.95;

    const [isTextureOn, setIsTextureOn] = useState(false);

    const THREE = window.THREE;
    const gsap = window.gsap;

    const handleTextureToggle = useCallback(() => {
        setIsTextureOn(prev => !prev);
    }, []);

    const createCoreTexture = useCallback(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        const center = canvas.width / 2;
        const radius = canvas.width / 2;
        const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
        gradient.addColorStop(0, 'rgba(255, 100, 80, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 40, 20, 1)');
        gradient.addColorStop(0.9, 'rgba(200, 0, 0, 1)');
        gradient.addColorStop(1, 'rgba(50, 0, 0, 1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const alpha = Math.random() * 0.2;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillRect(x, y, 2, 2);
        }
        return new THREE.CanvasTexture(canvas);
    }, [THREE]);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount || !THREE) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        camera.position.z = 7;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mount.appendChild(renderer.domElement);

        const rotationGroup = new THREE.Group();
        rotationGroup.rotation.x = 0.2;
        rotationGroup.rotation.y = -0.4;
        scene.add(rotationGroup);
        rotationGroupRef.current = rotationGroup;
        
        const baseGeometry = new THREE.IcosahedronGeometry(2.5, 6);
        const positionAttribute = baseGeometry.getAttribute('position');
        const vertex = new THREE.Vector3();
        const noise = new (window.SimplexNoise)();
        for (let i = 0; i < positionAttribute.count; i++) {
            vertex.fromBufferAttribute(positionAttribute, i);
            const displacement = 0.2 * noise.noise3D(vertex.x * 1.5, vertex.y * 1.5, vertex.z * 1.5);
            vertex.normalize().multiplyScalar(2.5 + displacement);
            positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        baseGeometry.computeVertexNormals();

        const wireframeGeom = new THREE.EdgesGeometry(baseGeometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xff4500, transparent: true, opacity: 1 });
        const wireframeCore = new THREE.LineSegments(wireframeGeom, wireframeMaterial);
        wireframeCoreRef.current = wireframeCore;
        rotationGroup.add(wireframeCore);
        
        const texture = createCoreTexture();
        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                baseTexture: { value: texture },
                glowColor: { value: new THREE.Color(0xff0000) },
                opacity: { value: 0.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform sampler2D baseTexture;
                uniform vec3 glowColor;
                uniform float opacity;
                varying vec2 vUv;
                varying vec3 vNormal;

                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    vec2 distortedUv = vUv + vec2(0.0, sin(vUv.y * 50.0 + time * 2.0) * 0.01);
                    vec4 texColor = texture2D(baseTexture, distortedUv);
                    gl_FragColor = vec4(glowColor, intensity * 0.8) + texColor;
                    gl_FragColor.a *= opacity;
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
        });
        shaderMaterialRef.current = shaderMaterial;

        const texturedCore = new THREE.Mesh(baseGeometry, shaderMaterial);
        texturedCoreRef.current = texturedCore;
        rotationGroup.add(texturedCore);

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);
        scene.add(new THREE.AmbientLight(0xffffff, 0.2));

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

        const clock = new THREE.Clock();
        const animate = () => {
            animationFrameId.current = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            if (shaderMaterialRef.current) {
                shaderMaterialRef.current.uniforms.time.value = elapsedTime;
            }
            if (rotationGroupRef.current) {
                if (!isDragging.current) {
                    rotationVelocity.current.y += 0.0001;
                }
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
    }, [THREE, gsap, createCoreTexture]);

    useEffect(() => {
        const wireMesh = wireframeCoreRef.current;
        const shaderMat = shaderMaterialRef.current;
        if (!wireMesh || !shaderMat) return;
        if (isTextureOn) {
            gsap.to(wireMesh.material, { opacity: 0.2, duration: 0.5 });
            gsap.to(shaderMat.uniforms.opacity, { value: 1.0, duration: 0.5 });
        } else {
            gsap.to(wireMesh.material, { opacity: 1.0, duration: 0.5 });
            gsap.to(shaderMat.uniforms.opacity, { value: 0.0, duration: 0.5 });
        }
    }, [isTextureOn, gsap]);

    return (
        <div className="s2-panel s2-3d-panel">
            <div className="s2-panel-header">S² ENGINE CORE</div>
            <div className="s2-3d-container" ref={mountRef}></div>
            <button className="s2-texture-toggle" onClick={handleTextureToggle}>
                {isTextureOn ? 'WIREFRAME VIEW' : 'TEXTURE VIEW'}
            </button>
        </div>
    );
};

// --- [수정] 사이코그래프 컴포넌트 ---
const Psychograph = () => {
    const canvasRef = useRef(null);
    const noise = new (window.SimplexNoise)();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;
        const points = []; // 그래프 포인트를 저장할 배열

        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            // 배열 초기화
            points.length = 0;
            for (let i = 0; i < canvas.width; i++) {
                points.push(canvas.height / 2);
            }
        };
        
        resizeCanvas();
        
        const unstableThreshold = canvas.width * 0.65;

        const draw = () => {
            time += 0.02; 
            
            // 잔상 효과를 위한 희미한 배경
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 포인트를 왼쪽으로 한 칸씩 이동
            points.shift();

            // 마지막에 새로운 포인트 추가
            const lastX = canvas.width - 1;
            let newY;
            
            if (lastX > unstableThreshold) {
                const unstableProgress = (lastX - unstableThreshold) / (canvas.width - unstableThreshold);
                const amplitude = 15 + Math.pow(unstableProgress, 3) * (canvas.height / 2.5);
                const frequency = 0.1 + unstableProgress * 0.5;
                const spikeChance = 0.02 + unstableProgress * 0.1;
                
                newY = canvas.height / 2 + noise.noise2D(lastX * frequency, time * 3) * amplitude;
                
                if (Math.random() < spikeChance) {
                    newY += (Math.random() - 0.5) * 100;
                }
            } else {
                const noiseFactor = noise.noise2D(lastX * 0.05, time);
                newY = canvas.height / 2 + noiseFactor * 10;
            }
            points.push(newY);

            // 메인 노란색 그래프 라인
            ctx.beginPath();
            ctx.moveTo(0, points[0]);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(i, points[i]);
            }
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 1.5;
            ctx.shadowColor = '#ffff00';
            ctx.shadowBlur = 5;
            ctx.stroke();

            // 긴장감을 위한 붉은색 보조 라인
            ctx.beginPath();
            ctx.moveTo(0, points[0]);
            for (let i = 1; i < points.length; i++) {
                 if (i > unstableThreshold) {
                    const unstableProgress = (i - unstableThreshold) / (canvas.width - unstableThreshold);
                    const randomOffset = (Math.random() - 0.5) * unstableProgress * 20;
                    ctx.lineTo(i, points[i] + randomOffset);
                 } else {
                    ctx.lineTo(i, points[i]);
                 }
            }
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
            ctx.lineWidth = 1;
            ctx.shadowColor = 'rgba(255, 0, 0, 0.7)';
            ctx.shadowBlur = 10;
            ctx.stroke();

            // 다음 프레임을 위해 그림자 효과 리셋
            ctx.shadowBlur = 0;
            
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();
        
        window.addEventListener('resize', resizeCanvas);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [noise]);

    return (
        <div className="s2-panel">
            <div className="s2-panel-header">PSYCHOGRAPHIC DISPLAY <span className="flicker-anim">[UNSTABLE]</span></div>
            <div className="s2-canvas-wrapper">
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    );
};


// 메인 S² Engine 페이지 컴포넌트
const S2EnginePage = ({ onBack }) => {
    const pageRef = useRef(null);
    const timeRef = useRef(null);
    const [currentTime, setCurrentTime] = useState('');
    const gsap = window.gsap;

    useEffect(() => {
        gsap.fromTo(pageRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 });
        gsap.fromTo('.s2-panel', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out', delay: 0.3 });
        
        gsap.utils.toArray('.s2-level-bar-fill').forEach(bar => {
            gsap.to(bar, {
                width: () => `${60 + Math.random() * 40}%`,
                duration: 2,
                ease: 'power3.out',
                delay: 1,
                repeat: -1,
                repeatRefresh: true,
                yoyo: true,
                repeatDelay: 0.5
            });
        });
    }, [gsap]);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}:${seconds}`);
        };
        updateTime();
        const timerId = setInterval(updateTime, 1000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="s2-engine-page-layout" ref={pageRef}>
            <button className="back-button" onClick={onBack}>← MENU</button>
            <div className="s2-engine-gui-grid">
                
                <div className="s2-panel">
                    <div className="s2-panel-header">ACTIVE TIME DISPLAY</div>
                    <div className="s2-clock-display flicker-anim" ref={timeRef}>
                        {currentTime}
                    </div>
                    <div className="s2-status-grid">
                        <div className="s2-status-item">
                            <span className="s2-status-label">CODE:</span>
                            <span className="s2-status-value">808</span>
                        </div>
                        <div className="s2-status-item">
                            <span className="s2-status-label">EXTENSION:</span>
                            <span className="s2-status-value">S2</span>
                        </div>
                         <div className="s2-status-item">
                            <span className="s2-status-label">MODE:</span>
                            <span className="s2-status-value text-danger flicker-anim">UNLIMITED</span>
                        </div>
                         <div className="s2-status-item">
                            <span className="s2-status-label">PRIORITY:</span>
                            <span className="s2-status-value text-danger">ALPHA</span>
                        </div>
                    </div>
                </div>

                <S2EngineModelView />

                <Psychograph />

                <div className="s2-panel">
                    <div className="s2-panel-header">ENERGY TOXICITY LEVEL</div>
                    <div className="s2-levels-container">
                        <div className="s2-level-item">
                            <span className="s2-level-label">DIRAC SEA</span>
                            <div className="s2-level-bar-bg"><div className="s2-level-bar-fill danger-bar"></div></div>
                        </div>
                        <div className="s2-level-item">
                            <span className="s2-level-label">WAVE FUNCTION</span>
                            <div className="s2-level-bar-bg"><div className="s2-level-bar-fill danger-bar"></div></div>
                        </div>
                        <div className="s2-level-item">
                            <span className="s2-level-label">REALITY DECAY</span>
                            <div className="s2-level-bar-bg"><div className="s2-level-bar-fill critical-bar"></div></div>
                        </div>
                         <div className="s2-level-item">
                            <span className="s2-level-label">SOUL PURITY</span>
                            <div className="s2-level-bar-bg"><div className="s2-level-bar-fill warning-bar"></div></div>
                        </div>
                    </div>
                     <div className="s2-description">
                        <p>A perpetual power organ derived from the Fruit of Life. The S² Engine grants Angels a limitless supply of energy, making them nearly invincible.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default S2EnginePage;
