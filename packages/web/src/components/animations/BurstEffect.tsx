import { motion } from 'framer-motion';
import { FINISH_SCORES } from '@beybladex/shared';

interface BurstEffectProps {
  points?: number;
  onComplete: () => void;
}

export function BurstEffect({ points = FINISH_SCORES.burst, onComplete }: BurstEffectProps) {
  const text = `+${points} BURST`;
  const letters = text.split('');

  // Generate random directions for each letter
  const getRandomDirection = () => ({
    x: (Math.random() - 0.5) * 400,
    y: (Math.random() - 0.5) * 400,
    rotate: (Math.random() - 0.5) * 720,
  });

  // Generate particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 300,
    y: (Math.random() - 0.5) * 300,
    scale: Math.random() * 0.5 + 0.5,
  }));

  return (
    <div className="relative">
      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: '#ef4444',
            left: '50%',
            top: '50%',
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: [1, 1, 0],
            scale: [0, particle.scale, 0],
          }}
          transition={{
            duration: 1.6,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Letters */}
      <div className="flex text-6xl font-black tracking-wider">
        {letters.map((letter, index) => {
          const direction = getRandomDirection();
          return (
            <motion.span
              key={index}
              style={{ color: '#ef4444' }}
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{
                x: [0, 0, direction.x],
                y: [0, 0, direction.y],
                rotate: [0, 0, direction.rotate],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1.6,
                times: [0, 0.2, 1],
                ease: 'easeOut',
              }}
              onAnimationComplete={index === letters.length - 1 ? onComplete : undefined}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
