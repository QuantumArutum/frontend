'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  alphaSpeed: number;
  pulse: number;
  pulseSpeed: number;
}

export default function EnhancedQuantumParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>(0);
  const mousePosition = useRef({ x: 0, y: 0 });
  const isMouseMoving = useRef(false);
  const mouseTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小为窗口大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 鼠标移动事件
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      isMouseMoving.current = true;
      
      // 重置定时器
      if (mouseTimer.current) {
        clearTimeout(mouseTimer.current);
      }
      
      // 设置新的定时器，2秒后认为鼠标停止移动
      mouseTimer.current = setTimeout(() => {
        isMouseMoving.current = false;
      }, 2000);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 创建粒子
    const createParticles = () => {
      particles.current = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 6), 200); // 保持原来的粒子数量

      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 4 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = (Math.random() - 0.5) * 0.6;
        const speedY = (Math.random() - 0.5) * 0.6;
        
        // 量子色彩范围: 蓝色、紫色、青色
        const colors = ['#01c4ff', '#8a2be2', '#00ffcc', '#7b68ee'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const alpha = Math.random() * 0.6 + 0.2;
        const alphaSpeed = Math.random() * 0.01 + 0.005;
        const pulse = Math.random() * 0.5 + 0.5;
        const pulseSpeed = (Math.random() - 0.5) * 0.02;

        particles.current.push({
          x,
          y,
          size,
          speedX,
          speedY,
          color,
          alpha,
          alphaSpeed,
          pulse,
          pulseSpeed
        });
      }
    };

    createParticles();

    // 更新和绘制粒子
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制背景渐变
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, 
        canvas.height / 2, 
        0, 
        canvas.width / 2, 
        canvas.height / 2, 
        canvas.width / 1.5
      );
      gradient.addColorStop(0, 'rgba(10, 10, 40, 1)');
      gradient.addColorStop(1, 'rgba(5, 5, 20, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle, index) => {
        // 更新位置
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // 更新透明度（闪烁效果）
        particle.alpha += particle.alphaSpeed;
        if (particle.alpha > 0.8 || particle.alpha < 0.2) {
          particle.alphaSpeed = -particle.alphaSpeed;
        }

        // 更新脉冲效果
        particle.pulse += particle.pulseSpeed;
        if (particle.pulse > 1.2 || particle.pulse < 0.8) {
          particle.pulseSpeed = -particle.pulseSpeed;
        }

        // 边界检查
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY;
        }

        // 鼠标交互
        if (isMouseMoving.current) {
          const dx = mousePosition.current.x - particle.x;
          const dy = mousePosition.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 200;
          
          if (distance < maxDistance) {
            // 计算鼠标影响力（距离越近影响越大）
            const force = (maxDistance - distance) / maxDistance;
            
            // 粒子远离鼠标
            particle.speedX -= dx * force * 0.02;
            particle.speedY -= dy * force * 0.02;
            
            // 限制最大速度
            const maxSpeed = 2;
            const currentSpeed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
            if (currentSpeed > maxSpeed) {
              particle.speedX = (particle.speedX / currentSpeed) * maxSpeed;
              particle.speedY = (particle.speedY / currentSpeed) * maxSpeed;
            }
          }
        }

        // 绘制粒子
        const currentSize = particle.size * particle.pulse;
        
        // 绘制发光效果
        const glow = ctx.createRadialGradient(
          particle.x, 
          particle.y, 
          0, 
          particle.x, 
          particle.y, 
          currentSize * 4
        );
        glow.addColorStop(0, particle.color);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.globalAlpha = particle.alpha * 0.3;
        ctx.fill();
        
        // 绘制粒子核心
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        // 绘制连接线
        connectParticles(particle, index);
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    // 连接附近的粒子
    const connectParticles = (particle: Particle, index: number) => {
      const connectionDistance = 200; // 增加连接距离
      
      for (let i = index + 1; i < particles.current.length; i++) {
        const otherParticle = particles.current[i];
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          // 根据距离计算线的透明度
          const alpha = 1 - (distance / connectionDistance);
          
          // 创建渐变线
          const gradient = ctx.createLinearGradient(
            particle.x, 
            particle.y, 
            otherParticle.x, 
            otherParticle.y
          );
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, otherParticle.color);
          
          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.globalAlpha = alpha * 0.3; // 增加线的透明度
          ctx.lineWidth = 0.6;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseTimer.current) {
        clearTimeout(mouseTimer.current);
      }
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}
