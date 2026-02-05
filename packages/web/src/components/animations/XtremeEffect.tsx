import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FINISH_SCORES } from '@beybladex/shared';

interface XtremeEffectProps {
  points?: number;
  onComplete: () => void;
}

export function XtremeEffect({ points = FINISH_SCORES.xtreme, onComplete }: XtremeEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current || !flashRef.current || !particlesRef.current) return;

    const tl = gsap.timeline({
      onComplete,
    });

    // Create particles
    const particleElements: HTMLDivElement[] = [];
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-2 h-2 rounded-full';
      particle.style.backgroundColor = '#f59e0b';
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.style.transform = 'translate(-50%, -50%)';
      particle.style.opacity = '0';
      particlesRef.current.appendChild(particle);
      particleElements.push(particle);
    }

    // 1. Flash bianco iniziale (0.1s)
    tl.fromTo(flashRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.05 }
    )
    .to(flashRef.current, { opacity: 0, duration: 0.05 });

    // 2. Testo appare con scale da 0 a 1.5
    tl.fromTo(textRef.current,
      { scale: 0, opacity: 1 },
      { scale: 1.5, opacity: 1, duration: 0.15, ease: 'back.out(2)' },
      '+=0'
    );

    // 3. Shake intenso (8 ripetizioni, 0.05s ciascuna)
    for (let i = 0; i < 8; i++) {
      const xOffset = (i % 2 === 0 ? 15 : -15) * (1 - i * 0.1);
      tl.to(textRef.current, {
        x: xOffset,
        duration: 0.05,
        ease: 'none'
      });
    }
    tl.to(textRef.current, { x: 0, duration: 0.05 });

    // 4. Glow dorato pulsante
    tl.to(textRef.current, {
      textShadow: '0 0 20px #f59e0b, 0 0 40px #f59e0b, 0 0 60px #f59e0b',
      duration: 0.15,
      ease: 'power2.inOut',
    })
    .to(textRef.current, {
      textShadow: '0 0 10px #f59e0b, 0 0 20px #f59e0b',
      duration: 0.15,
      ease: 'power2.inOut',
    })
    .to(textRef.current, {
      textShadow: '0 0 30px #f59e0b, 0 0 50px #f59e0b, 0 0 70px #f59e0b',
      duration: 0.15,
      ease: 'power2.inOut',
    });

    // 5. Particelle dorate esplosive
    particleElements.forEach((particle, i) => {
      const angle = (i / particleElements.length) * Math.PI * 2;
      const distance = 150 + Math.random() * 100;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      tl.fromTo(particle,
        { opacity: 1, scale: 1, x: 0, y: 0 },
        {
          opacity: 0,
          scale: 0,
          x,
          y,
          duration: 0.3,
          ease: 'power2.out',
        },
        '-=0.3'
      );
    });

    // 6. Fade out
    tl.to(textRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.2,
      ease: 'power2.in',
    });

    return () => {
      tl.kill();
      particleElements.forEach(p => p.remove());
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="relative">
      {/* Flash bianco */}
      <div
        ref={flashRef}
        className="fixed inset-0 bg-white opacity-0 pointer-events-none"
        style={{ zIndex: 100 }}
      />

      {/* Container particelle */}
      <div ref={particlesRef} className="absolute inset-0" />

      {/* Testo principale */}
      <div
        ref={textRef}
        className="text-6xl font-black tracking-wider"
        style={{
          color: '#f59e0b',
          textShadow: '0 0 10px #f59e0b',
        }}
      >
        +{points} XTREME
      </div>
    </div>
  );
}
