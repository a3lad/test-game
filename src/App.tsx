import { useEffect, useRef } from 'react';
import p5 from 'p5';
import { createSketch } from './game/main';

export default function App() {
  const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    if (!canvasRef.current) return;

    let p5Instance: p5 | undefined;
    try {
      p5Instance = new p5(createSketch, canvasRef.current);
    } catch (error) {
      console.error("Failed to initialize p5 sketch:", error);
    }

    return () => {
      p5Instance?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Fragmented Mind</h1>
        <p className="text-neutral-400 max-w-md">
          A game about the struggle of maintaining focus during social interactions.
        </p>
      </div>
      
      <div 
        ref={canvasRef} 
        className="rounded-xl overflow-hidden shadow-2xl border-4 border-neutral-800 bg-black"
        style={{ width: '800px', height: '600px' }}
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <div className="bg-neutral-800/50 p-4 rounded-lg border border-white/5">
          <h3 className="text-emerald-400 font-semibold mb-2">Objective</h3>
          <p className="text-sm text-neutral-300">Assemble the correct response by clicking words in order. Complete all levels to win.</p>
        </div>
        <div className="bg-neutral-800/50 p-4 rounded-lg border border-white/5">
          <h3 className="text-amber-400 font-semibold mb-2">Chaos</h3>
          <p className="text-sm text-neutral-300">Words will drift and fade. Intrusive thoughts will appear in red—click them to clear your mind.</p>
        </div>
        <div className="bg-neutral-800/50 p-4 rounded-lg border border-white/5">
          <h3 className="text-rose-400 font-semibold mb-2">Pressure</h3>
          <p className="text-sm text-neutral-300">The clock is ticking. Selecting the wrong word or letting time run out will end your attempt.</p>
        </div>
      </div>
    </div>
  );
}
