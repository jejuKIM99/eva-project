// src/components/GuestbookBackground.js
import React, { useEffect, useRef } from 'react';
import logo from '../img/mainimg.png'; // 로고 이미지 경로

// CDN으로 로드된 라이브러리를 window 객체에서 가져옵니다.
const THREE = window.THREE;
const SimplexNoise = window.SimplexNoise;

const GuestbookBackground = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        // THREE나 SimplexNoise가 로드되지 않았을 경우를 대비한 방어 코드
        if (!THREE || !SimplexNoise) {
            console.error("Three.js or SimplexNoise not found on window object. Check CDN links in index.html.");
            return;
        }

        const mount = mountRef.current;
        const simplex = new SimplexNoise();

        // Scene, Camera, Renderer 설정
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        camera.position.z = 1.5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mount.appendChild(renderer.domElement);

        // Plane Geometry 및 Texture 설정
        const loader = new THREE.TextureLoader();
        const texture = loader.load(logo);
        const geometry = new THREE.PlaneGeometry(3, 3, 128, 128);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false,
        });

        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        const clock = new THREE.Clock();

        // 애니메이션 루프
        const animate = () => {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();
            const position = plane.geometry.attributes.position;

            for (let i = 0; i < position.count; i++) {
                const x = position.getX(i);
                const y = position.getY(i);
                const z = simplex.noise3D(x * 0.5 + time * 0.1, y * 0.5 + time * 0.1, time * 0.1) * 0.15;
                position.setZ(i, z);
            }

            position.needsUpdate = true;
            renderer.render(scene, camera);
        };

        animate();

        // Resize 핸들러
        const handleResize = () => {
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // 클린업
        return () => {
            window.removeEventListener('resize', handleResize);
            // mount가 null이 아닐 때만 removeChild 실행
            if (mount && renderer.domElement) {
                mount.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            texture.dispose();
        };
    }, []); // 의존성 배열은 비워둡니다.

    return <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />;
};

export default GuestbookBackground;