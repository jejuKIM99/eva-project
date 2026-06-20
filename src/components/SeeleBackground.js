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
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 120, 380);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const composer = initCrtComposer(THREE, renderer, scene, camera);

    const textureLoader = new THREE.TextureLoader();
    const rockTex = textureLoader.load(rockTextureImg);
    rockTex.wrapS = rockTex.wrapT = THREE.RepeatWrapping;
    rockTex.repeat.set(1, 2);

    // Function to create a soft light texture
    const createSoftLightTexture = (width, height, isLinear = true) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      const gradient = isLinear 
        ? ctx.createLinearGradient(0, 0, 0, height)
        : ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);

      if (isLinear) {
        gradient.addColorStop(0, 'rgba(255, 0, 0, 0)');
        gradient.addColorStop(0.5, 'rgba(255, 0, 0, 1)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      return new THREE.CanvasTexture(canvas);
    };

    const lightLineTex = createSoftLightTexture(256, 64, true);
    const upwardGlowTex = createSoftLightTexture(256, 256, false);

    const monolithGroup = new THREE.Group();
    const monolithCount = 7;
    const individualGroups = [];

    const createTextTexture = (number) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 15;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
      ctx.fillStyle = '#ff0000';
      ctx.font = 'bold 45px "Orbitron"';
      ctx.textAlign = 'center';
      ctx.fillText('SEELE', canvas.width / 2, 100);
      ctx.font = 'bold 130px "Orbitron"';
      ctx.fillText(number, canvas.width / 2, 260);
      ctx.font = 'bold 45px "Orbitron"';
      ctx.fillText('SOUND', canvas.width / 2, 400);
      ctx.fillText('ONLY', canvas.width / 2, 460);
      return new THREE.CanvasTexture(canvas);
    };

    const monolithGeo = new THREE.BoxGeometry(60, 150, 18);
    
    for (let i = 0; i < monolithCount; i++) {
      const angle = (i / monolithCount) * Math.PI * 2;
      const posX = Math.cos(angle) * 220;
      const posZ = Math.sin(angle) * 220;

      const group = new THREE.Group();
      group.position.set(posX, 25, posZ);
      group.lookAt(0, 25, 0);

      const textTex = createTextTexture(`0${i + 1}`);
      const frontMat = new THREE.MeshBasicMaterial({ map: textTex, transparent: true });
      const bodyMat = new THREE.MeshStandardMaterial({ 
        map: rockTex, 
        color: 0x444444, 
        roughness: 0.7,
        metalness: 0.3,
        bumpMap: rockTex,
        bumpScale: 0.5
      });
      
      const materials = [bodyMat, bodyMat, bodyMat, bodyMat, frontMat, bodyMat];
      const monolith = new THREE.Mesh(monolithGeo, materials);
      group.add(monolith);

      // 1. Soft Horizontal Linear Light (at the base only)
      const lightLineGeo = new THREE.PlaneGeometry(100, 20);
      const lightLineMat = new THREE.MeshBasicMaterial({
        map: lightLineTex,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });
      const lightLine = new THREE.Mesh(lightLineGeo, lightLineMat);
      lightLine.rotation.x = -Math.PI / 2;
      lightLine.position.set(0, -75.1, 10); // Position at the base relative to group center
      group.add(lightLine);

      monolithGroup.add(group);
      individualGroups.push({ group, lightLine });
    }
    
    scene.add(monolithGroup);

    // Lighting to show rock texture
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff0000, 1.5, 800);
    pointLight.position.set(0, 150, 0);
    scene.add(pointLight);

    const floorGrid = new THREE.GridHelper(1800, 60, 0x660000, 0x110000);
    floorGrid.position.y = -50;
    scene.add(floorGrid);

    const animate = () => {
      requestAnimationFrame(animate);
      monolithGroup.rotation.y += 0.0005;
      
      const time = Date.now() * 0.002;
      individualGroups.forEach((item, i) => {
        const pulse = 0.8 + Math.sin(time + i) * 0.2;
        item.lightLine.material.opacity = 0.7 * pulse;
      });

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
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      monolithGeo.dispose();
      floorGrid.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="thematic-bg-container seele-bg" ref={mountRef}>
    </div>
  );
};

export default SeeleBackground;
