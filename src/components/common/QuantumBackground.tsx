'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface QuantumBackgroundProps {
  id?: string;
  intensity?: 'light' | 'medium' | 'heavy';
  interactive?: boolean;
}

const QuantumBackground: React.FC<QuantumBackgroundProps> = ({ 
  id = 'particles-js',
  intensity = 'medium',
  interactive = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth || window.innerWidth;
    let height = canvas.offsetHeight || window.innerHeight;

    const resizeCanvas = () => {
      width = canvas.offsetWidth || window.innerWidth;
      height = canvas.offsetHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 金色系颜色
    const colors = ['#FFD700', '#FFC125', '#FFAA00', '#FF8C00', '#DAA520', '#ffffff'];

    // 根据强度设置粒子数量
    const particleCount = { light: 40, medium: 80, heavy: 120 }[intensity];

    interface ParticleData {
      x: number; y: number; size: number;
      speedX: number; speedY: number;
      color: string; opacity: number;
    }

    const createParticle = (): ParticleData => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.3,
    });

    const particles: ParticleData[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    const updateParticle = (p: ParticleData) => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x > width) p.x = 0;
      if (p.x < 0) p.x = width;
      if (p.y > height) p.y = 0;
      if (p.y < 0) p.y = height;
    };

    const drawParticle = (p: ParticleData) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = '#FFD700';
            ctx.globalAlpha = 0.3 * (1 - distance / 150);
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    };

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { updateParticle(p); drawParticle(p); });
      drawLines();
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: interactive ? 'auto' : 'none' }}
    />
  );
};

export default QuantumBackground;
