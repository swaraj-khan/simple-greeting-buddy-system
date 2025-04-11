
import React, { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AudioWaveformProps {
  isRecording: boolean;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ isRecording }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isRecording || !waveformRef.current) return;

    // Adjust number of bars for mobile (fewer bars) vs desktop
    const barsCount = isMobile ? 10 : 20;
    
    const bars = Array.from({ length: barsCount }, (_, i) => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      return bar;
    });

    const waveform = waveformRef.current;
    waveform.innerHTML = '';
    bars.forEach(bar => waveform.appendChild(bar));

    let animationId: number;
    
    const animate = () => {
      bars.forEach(bar => {
        const height = Math.random() * 70 + 30;
        bar.style.height = `${height}%`;
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      if (waveformRef.current) {
        waveformRef.current.innerHTML = '';
      }
    };
  }, [isRecording, isMobile]);

  if (!isRecording) return null;

  return (
    <div 
      ref={waveformRef} 
      className={`flex items-center justify-center gap-1 h-5 w-full ${isMobile ? 'max-w-[120px] mx-auto' : 'max-w-[240px] mx-auto'}`}
    >
      <style>
        {`
          .bar {
            background: currentColor;
            width: 2px;
            border-radius: 2px;
            transition: height 0.2s ease;
          }
        `}
      </style>
    </div>
  );
};

export default AudioWaveform;
