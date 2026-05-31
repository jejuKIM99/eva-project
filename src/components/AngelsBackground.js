import React, { useEffect, useRef } from 'react';

const AngelsBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let angle = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Radar Rings
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.15)';
      ctx.lineWidth = 1;
      for (let r = 100; r < 1000; r += 200) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Rotating Sweep
      angle += 0.01;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 1000);
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0)');
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0.1)');
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 1000, 0, Math.PI / 4);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();

      // Hexagon Overlay Pattern
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.05)';
      const size = 60;
      const h = size * Math.sqrt(3);
      for (let y = 0; y < canvas.height + h; y += h) {
        for (let x = 0; x < canvas.width + size * 3; x += size * 3) {
          drawHexagon(ctx, x, y, size);
          drawHexagon(ctx, x + size * 1.5, y + h / 2, size);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const drawHexagon = (ctx, x, y, r) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(x + r * Math.cos(i * Math.PI / 3), y + r * Math.sin(i * Math.PI / 3));
      }
      ctx.closePath();
      ctx.stroke();
    };

    draw();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="thematic-bg-container angels-bg">
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      <div className="blood-overlay"></div>
    </div>
  );
};

export default AngelsBackground;
