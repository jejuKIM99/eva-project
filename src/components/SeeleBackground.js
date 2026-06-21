import React, { useEffect, useRef } from 'react';
import { initCrtComposer } from '../utils/crtPostProcessing';
import rockTextureImg from '../img/texture/dark_rock.jpg'; 

const SeeleBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Eternal dark void

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 110, 360);
    camera.lookAt(0, 20, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const composer = initCrtComposer(THREE, renderer, scene, camera);

    const textureLoader = new THREE.TextureLoader();
    const rockTex = textureLoader.load(rockTextureImg);
    rockTex.wrapS = rockTex.wrapT = THREE.RepeatWrapping;
    rockTex.repeat.set(1, 2);

    // Canvas texture generator for horizontal base lights
    const createSoftLightTexture = (width, height) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0)');
      gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.45)');
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      return new THREE.CanvasTexture(canvas);
    };

    const lightLineTex = createSoftLightTexture(256, 64);

    // Seele Monolith Canvas textures
    const createTextTexture = (number) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Monolith core body color
      ctx.fillStyle = '#010000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Outer red glow frame
      ctx.strokeStyle = '#880000';
      ctx.lineWidth = 14;
      ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);
      
      // Text drawing
      ctx.fillStyle = '#ff1100';
      ctx.font = 'bold 45px "Orbitron"';
      ctx.textAlign = 'center';
      ctx.fillText('SEELE', canvas.width / 2, 95);
      
      ctx.font = 'bold 130px "Orbitron"';
      ctx.fillStyle = '#ff2200';
      ctx.fillText(number, canvas.width / 2, 255);
      
      ctx.font = 'bold 45px "Orbitron"';
      ctx.fillStyle = '#ff1100';
      ctx.fillText('SOUND', canvas.width / 2, 395);
      ctx.fillText('ONLY', canvas.width / 2, 455);
      
      return new THREE.CanvasTexture(canvas);
    };

    const monolithGroup = new THREE.Group();
    const monolithCount = 12;
    const individualMonoliths = [];
    const monolithGeo = new THREE.BoxGeometry(60, 150, 18);

    for (let i = 0; i < monolithCount; i++) {
      const angle = (i / monolithCount) * Math.PI * 2;
      const posX = Math.cos(angle) * 230;
      const posZ = Math.sin(angle) * 230;

      const group = new THREE.Group();
      group.position.set(posX, 30, posZ);
      group.lookAt(0, 30, 0);

      const textTex = createTextTexture(i + 1 < 10 ? `0${i + 1}` : `${i + 1}`);
      const frontMat = new THREE.MeshBasicMaterial({ map: textTex, transparent: true });
      const bodyMat = new THREE.MeshStandardMaterial({ 
        map: rockTex, 
        color: 0x181818, 
        roughness: 0.85,
        metalness: 0.15,
        bumpMap: rockTex,
        bumpScale: 0.5
      });
      
      const materials = [bodyMat, bodyMat, bodyMat, bodyMat, frontMat, bodyMat];
      const monolith = new THREE.Mesh(monolithGeo, materials);
      group.add(monolith);

      // Soft Horizontal base indicator light
      const lightLineGeo = new THREE.PlaneGeometry(100, 20);
      const lightLineMat = new THREE.MeshBasicMaterial({
        map: lightLineTex,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const lightLine = new THREE.Mesh(lightLineGeo, lightLineMat);
      lightLine.rotation.x = -Math.PI / 2;
      lightLine.position.set(0, -75.1, 10);
      group.add(lightLine);

      monolithGroup.add(group);
      individualMonoliths.push({
        group,
        monolith,
        lightLine,
        initialY: 30,
        seed: Math.random() * 10
      });
    }
    
    scene.add(monolithGroup);

    // Floor Grid system (with concentric hazard rings)
    const floorGrid = new THREE.GridHelper(1800, 60, 0x550000, 0x070000);
    floorGrid.position.y = -50;
    scene.add(floorGrid);

    // Concentric glowing grid rings in the center floor
    const floorRingGroup = new THREE.Group();
    floorRingGroup.position.y = -49.8;
    for (let r = 0; r < 4; r++) {
      const ringGeo = new THREE.RingGeometry(r * 45 + 10, r * 45 + 11.5, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.35 - r * 0.08,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      floorRingGroup.add(ring);
    }
    scene.add(floorRingGroup);

    // Pulse points (drifting data columns rising in the center of Seele chamber)
    const dataStreamCount = 180;
    const dataStreamGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(dataStreamCount * 3);
    const riseSpeeds = new Float32Array(dataStreamCount);

    for (let i = 0; i < dataStreamCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = Math.random() * 90; // concentrated in the center void
      const y = Math.random() * 200 - 50;
      
      posArr[i * 3] = Math.cos(theta) * r;
      posArr[i * 3 + 1] = y;
      posArr[i * 3 + 2] = Math.sin(theta) * r;
      
      riseSpeeds[i] = 0.5 + Math.random() * 1.5;
    }
    dataStreamGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const dataStreamMat = new THREE.PointsMaterial({
      color: 0xff3c00,
      size: 1.8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const dataStreams = new THREE.Points(dataStreamGeo, dataStreamMat);
    scene.add(dataStreams);

    // Holographic A.T. Field in the Center Void (rotating wireframe octagon layers)
    const atFieldGroup = new THREE.Group();
    atFieldGroup.position.set(0, 30, 0);
    const atFieldRings = [];

    for (let i = 0; i < 4; i++) {
      // Octagon shape geometry
      const rGeo = new THREE.RingGeometry(25 + i * 15, 26 + i * 15, 8);
      const rMat = new THREE.MeshBasicMaterial({
        color: 0xff3b00,
        transparent: true,
        opacity: 0.45 - i * 0.1,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        wireframe: true
      });
      const ring = new THREE.Mesh(rGeo, rMat);
      
      atFieldGroup.add(ring);
      atFieldRings.push(ring);
    }
    scene.add(atFieldGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    const centerLight = new THREE.PointLight(0xff0000, 2.5, 600);
    centerLight.position.set(0, 50, 0);
    scene.add(centerLight);

    // Mouse Tracking for Parallax Effect
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.15;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.15;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth camera interpolation based on cursor coordinates
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY + 110 - camera.position.y) * 0.05;
      camera.lookAt(0, 20, 0);

      // Rotate monolith arena very slowly
      monolithGroup.rotation.y = time * 0.015;

      // Bob individual monolith cards and pulse glow
      individualMonoliths.forEach((item, i) => {
        // Monolith bobbing up and down
        item.group.position.y = item.initialY + Math.sin(time * 0.8 + item.seed) * 3;
        
        // Base light lines pulse
        const pulse = 0.75 + Math.sin(time * 2.5 + i) * 0.25;
        item.lightLine.material.opacity = 0.5 * pulse;
      });

      // Animate rising data streams
      const streamPos = dataStreamGeo.getAttribute('position');
      const sArr = streamPos.array;
      for (let i = 0; i < dataStreamCount; i++) {
        sArr[i * 3 + 1] += riseSpeeds[i];
        
        if (sArr[i * 3 + 1] > 180) {
          sArr[i * 3 + 1] = -50;
        }
      }
      streamPos.needsUpdate = true;

      // Rotate holographic AT field octagon layers
      atFieldGroup.rotation.y = time * 0.1;
      atFieldRings.forEach((ring, idx) => {
        ring.rotation.z = -time * (0.05 + idx * 0.05);
        const scaleVal = 1 + Math.sin(time * 3 + idx) * 0.05;
        ring.scale.set(scaleVal, scaleVal, scaleVal);
      });

      // Pulse central chamber lighting
      centerLight.intensity = 2.0 + Math.sin(time * 3.5) * 0.8;

      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (composer) {
        composer.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Cleanup assets
      monolithGeo.dispose();
      floorGrid.geometry.dispose();
      floorGrid.material.dispose();
      lightLineTex.dispose();
      rockTex.dispose();

      floorRingGroup.children.forEach(c => {
        c.geometry.dispose();
        c.material.dispose();
      });

      dataStreamGeo.dispose();
      dataStreamMat.dispose();

      atFieldRings.forEach(ring => {
        ring.geometry.dispose();
        ring.material.dispose();
      });

      individualMonoliths.forEach(item => {
        item.group.children.forEach(child => {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        });
      });

      renderer.dispose();
    };
  }, []);

  return (
    <div className="thematic-bg-container seele-bg" ref={mountRef}>
    </div>
  );
};

export default SeeleBackground;
