import { useRef, useEffect } from 'react';

interface Cube {
  x: number;
  y: number;
  size: number;
  phase: number;
}

export default function CubeBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const GRID_SIZE = 20;
    const BOX_SIZE = 0.6;

    let cubes: Cube[] = [];

    const generateCubes = () => {
      cubes = [];
      for (let x = 0; x < window.innerWidth; x += GRID_SIZE) {
        for (let y = 0; y < window.innerHeight; y += GRID_SIZE) {
          cubes.push({
            x,
            y,
            size: BOX_SIZE * Math.random(),
            phase: Math.random() * 10,
          });
        }
      }
    };
    generateCubes();
    window.addEventListener('resize', generateCubes);

    let animationFrameId: number;

    const draw = (time: DOMHighResTimeStamp) => {
      const t = time * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffffff';

      for (const cube of cubes) {
        const offsetX = Math.sin(t + cube.phase) * 2;
        const offsetY = Math.cos(t + cube.phase) * 2;
        const dynamicSize = Math.sin(t + cube.size) / 8 + Math.cos(t + cube.phase) / 8;
        ctx.fillRect(
          cube.x + offsetX,
          cube.y + offsetY,
          cube.size + dynamicSize,
          cube.size + dynamicSize
        );
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', generateCubes);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
