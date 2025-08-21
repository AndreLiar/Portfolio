"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };

    const createParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 15000));
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.3 + 0.1,
          hue: 180 + Math.random() * 60, // Teal to cyan range
        });
      }
      
      particlesRef.current = particles;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isMoving: true,
      };

      // Reset mouse movement after a delay
      setTimeout(() => {
        mouseRef.current.isMoving = false;
      }, 150);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      
      particles.forEach((particle, index) => {
        // Natural floating movement
        particle.baseX += particle.vx;
        particle.baseY += particle.vy;
        
        // Boundary wrapping
        if (particle.baseX < 0) particle.baseX = canvas.width;
        if (particle.baseX > canvas.width) particle.baseX = 0;
        if (particle.baseY < 0) particle.baseY = canvas.height;
        if (particle.baseY > canvas.height) particle.baseY = 0;
        
        // Mouse interaction
        let targetX = particle.baseX;
        let targetY = particle.baseY;
        
        if (mouse.isMoving) {
          const dx = mouse.x - particle.baseX;
          const dy = mouse.y - particle.baseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;
          
          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            targetX = particle.baseX + dx * force * 0.1;
            targetY = particle.baseY + dy * force * 0.1;
          }
        }
        
        // Smooth movement towards target
        particle.x += (targetX - particle.x) * 0.05;
        particle.y += (targetY - particle.y) * 0.05;
        
        // Pulsing opacity
        particle.opacity = 0.1 + 0.2 * Math.sin(Date.now() * 0.001 + index * 0.5);
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
        ctx.fill();
        
        // Draw connections between nearby particles
        particles.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const opacity = (1 - distance / 100) * 0.1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    updateCanvasSize();
    createParticles();
    
    // Event listeners
    window.addEventListener("resize", () => {
      updateCanvasSize();
      createParticles();
    });
    
    canvas.addEventListener("mousemove", handleMouseMove);
    
    // Start animation
    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", updateCanvasSize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ 
        background: "transparent",
        zIndex: 0,
      }}
    />
  );
}