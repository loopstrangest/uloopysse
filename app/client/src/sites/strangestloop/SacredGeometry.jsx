import { useEffect, useRef, useState } from 'react';
import './SacredGeometry.css';

// Easing functions
const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);
const easeInQuad = (t) => t * t;
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
const easeOutElastic = (t) => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
const easeOutBack = (t) => { const c1 = 1.70158; const c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

function SacredGeometry() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const speedRef = useRef(1);
  const elapsedRef = useRef(0);
  const lastTimestampRef = useRef(null);
  const [speed, setSpeed] = useState(1);

  const speeds = [1, 5, 25];
  const speedArrows = ['>', '>>', '>>>'];

  const cycleSpeed = () => {
    const currentIndex = speeds.indexOf(speed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setSpeed(nextSpeed);
    speedRef.current = nextSpeed;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 15 minutes total = 900,000ms (3 acts × 5 min each)
    const phases = [
      // === ACT 1: SACRED GEOMETRY (5 min = 300,000ms) ===
      { name: 'void', duration: 20000 },
      { name: 'firstLight', duration: 15000 },
      { name: 'birth', duration: 20000 },
      { name: 'seedOfLife', duration: 30000 },
      { name: 'flowerOfLife', duration: 40000 },
      { name: 'metatronsCube', duration: 35000 },
      { name: 'mandala', duration: 50000 },
      { name: 'sacredPeak', duration: 50000 },
      { name: 'sacredTransition', duration: 40000 },

      // === ACT 2: GEOMETRIC FRACTALS + ORGANIC (5 min = 300,000ms) ===
      { name: 'fractalBirth', duration: 30000 },
      { name: 'triangleRecursion', duration: 40000 },
      { name: 'squareFractals', duration: 40000 },
      { name: 'organicEmergence', duration: 45000 },
      { name: 'blobMerging', duration: 50000 },
      { name: 'flowingForms', duration: 50000 },
      { name: 'geometricOrganic', duration: 45000 },

      // === ACT 3: PARTICLES + GRAND CLIMAX (5 min = 300,000ms) ===
      { name: 'particleBirth', duration: 30000 },
      { name: 'swarmFormation', duration: 40000 },
      { name: 'particleShapes', duration: 45000 },
      { name: 'particleExplosion', duration: 35000 },
      { name: 'cosmicBlend', duration: 50000 },
      { name: 'grandClimax', duration: 60000 },
      { name: 'dissolution', duration: 40000 },
    ];

    const totalDuration = phases.reduce((sum, p) => sum + p.duration, 0);

    const getPhaseInfo = (elapsed) => {
      const cycleTime = elapsed % totalDuration;
      let accumulated = 0;

      for (let i = 0; i < phases.length; i++) {
        if (cycleTime < accumulated + phases[i].duration) {
          return {
            phase: phases[i].name,
            progress: (cycleTime - accumulated) / phases[i].duration,
            phaseIndex: i,
            cycleTime
          };
        }
        accumulated += phases[i].duration;
      }
      return { phase: phases[0].name, progress: 0, phaseIndex: 0, cycleTime: 0 };
    };

    // ==================== DRAWING HELPERS ====================

    const drawCircle = (cx, cy, radius, alpha = 1, lineWidth = 2) => {
      if (radius <= 0 || alpha <= 0) return;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, alpha)})`;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    const drawFilledCircle = (cx, cy, radius, alpha = 0.1) => {
      if (radius <= 0 || alpha <= 0) return;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha)})`;
      ctx.fill();
    };

    const drawLine = (x1, y1, x2, y2, alpha = 1, lineWidth = 1) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, alpha)})`;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    const drawPolygon = (cx, cy, radius, sides, rotation = 0, alpha = 1, lineWidth = 2) => {
      if (radius <= 0 || alpha <= 0) return;
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const angle = (i * 2 * Math.PI / sides) + rotation - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, alpha)})`;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    // ==================== SACRED GEOMETRY ====================

    const drawSeedOfLife = (cx, cy, radius, alpha = 1, rotation = 0) => {
      drawCircle(cx, cy, radius, alpha);
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) + rotation;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        drawCircle(x, y, radius, alpha);
      }
    };

    const drawFlowerOfLife = (cx, cy, radius, alpha = 1, rotation = 0) => {
      drawSeedOfLife(cx, cy, radius, alpha, rotation);
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) + rotation;
        drawCircle(cx + radius * 2 * Math.cos(angle), cy + radius * 2 * Math.sin(angle), radius, alpha * 0.8);
      }
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) + (Math.PI / 6) + rotation;
        const dist = radius * Math.sqrt(3);
        drawCircle(cx + dist * Math.cos(angle), cy + dist * Math.sin(angle), radius, alpha * 0.7);
      }
    };

    const drawMetatronsCube = (cx, cy, radius, alpha = 1, rotation = 0) => {
      const points = [{ x: cx, y: cy }];
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) + rotation;
        points.push({ x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) });
      }
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) + rotation;
        points.push({ x: cx + radius * 2 * Math.cos(angle), y: cy + radius * 2 * Math.sin(angle) });
      }
      points.forEach(p => drawCircle(p.x, p.y, radius * 0.25, alpha * 0.5));
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          drawLine(points[i].x, points[i].y, points[j].x, points[j].y, alpha * 0.25, 1);
        }
      }
    };

    const drawMandala = (cx, cy, baseRadius, layerCount, rotation, alpha) => {
      for (let layer = 0; layer < layerCount; layer++) {
        const radius = baseRadius * (0.4 + layer * 0.25);
        const petals = 6 + layer * 3;
        const layerRotation = rotation + (layer * Math.PI / 8);
        const layerAlpha = alpha * (1 - layer * 0.08);
        for (let i = 0; i < petals; i++) {
          const angle = (i * 2 * Math.PI / petals) + layerRotation;
          drawCircle(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle), radius * 0.3, layerAlpha);
        }
        if (layer % 2 === 0) {
          drawPolygon(cx, cy, radius * 0.85, petals, layerRotation, layerAlpha * 0.4);
        }
      }
    };

    // ==================== FRACTALS ====================

    const drawTriangleFractal = (cx, cy, size, depth, rotation, alpha) => {
      if (depth <= 0 || size < 3 || alpha < 0.05) return;

      drawPolygon(cx, cy, size, 3, rotation, alpha);

      if (depth > 1) {
        const newSize = size * 0.5;
        for (let i = 0; i < 3; i++) {
          const angle = (i * 2 * Math.PI / 3) + rotation - Math.PI / 2;
          const nx = cx + size * 0.5 * Math.cos(angle);
          const ny = cy + size * 0.5 * Math.sin(angle);
          drawTriangleFractal(nx, ny, newSize, depth - 1, rotation + Math.PI / 6, alpha * 0.8);
        }
      }
    };

    const drawSquareFractal = (cx, cy, size, depth, rotation, alpha) => {
      if (depth <= 0 || size < 3 || alpha < 0.05) return;

      drawPolygon(cx, cy, size, 4, rotation, alpha);

      if (depth > 1) {
        const newSize = size * 0.45;
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI / 2) + rotation + Math.PI / 4;
          const dist = size * 0.7;
          const nx = cx + dist * Math.cos(angle);
          const ny = cy + dist * Math.sin(angle);
          drawSquareFractal(nx, ny, newSize, depth - 1, rotation + Math.PI / 8, alpha * 0.75);
        }
      }
    };

    const drawHexagonFractal = (cx, cy, size, depth, rotation, alpha) => {
      if (depth <= 0 || size < 3 || alpha < 0.05) return;

      drawPolygon(cx, cy, size, 6, rotation, alpha);

      if (depth > 1) {
        const newSize = size * 0.4;
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI / 3) + rotation;
          const dist = size * 0.85;
          const nx = cx + dist * Math.cos(angle);
          const ny = cy + dist * Math.sin(angle);
          drawHexagonFractal(nx, ny, newSize, depth - 1, rotation + Math.PI / 12, alpha * 0.7);
        }
      }
    };

    // ==================== ORGANIC SHAPES ====================

    class Blob {
      constructor(x, y, baseRadius, noiseOffset) {
        this.x = x;
        this.y = y;
        this.baseRadius = baseRadius;
        this.noiseOffset = noiseOffset;
        this.points = 8;
      }

      draw(time, alpha, scale = 1) {
        ctx.beginPath();
        for (let i = 0; i <= this.points * 4; i++) {
          const angle = (i / (this.points * 4)) * Math.PI * 2;
          const noiseVal = Math.sin(angle * 3 + time * 0.001 + this.noiseOffset) * 0.3 +
                          Math.sin(angle * 5 + time * 0.0015 + this.noiseOffset * 2) * 0.2;
          const r = this.baseRadius * scale * (1 + noiseVal);
          const x = this.x + r * Math.cos(angle);
          const y = this.y + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    const blobs = [
      new Blob(0, 0, 80, 0),
      new Blob(0, 0, 60, Math.PI),
      new Blob(0, 0, 100, Math.PI / 2),
      new Blob(0, 0, 70, Math.PI * 1.5),
      new Blob(0, 0, 90, Math.PI / 4),
    ];

    const drawOrganicShape = (cx, cy, radius, time, alpha, wobble = 1) => {
      ctx.beginPath();
      const points = 60;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const noise = Math.sin(angle * 4 + time * 0.002) * 0.15 * wobble +
                     Math.sin(angle * 7 + time * 0.003) * 0.1 * wobble +
                     Math.sin(angle * 2 + time * 0.001) * 0.2 * wobble;
        const r = radius * (1 + noise);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    // ==================== PARTICLES ====================

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random();
        this.y = Math.random();
        this.vx = (Math.random() - 0.5) * 0.001;
        this.vy = (Math.random() - 0.5) * 0.001;
        this.size = Math.random() * 3 + 1;
        this.life = 1;
        this.decay = Math.random() * 0.0005 + 0.0002;
      }

      update(target = null, attraction = 0) {
        if (target) {
          const dx = target.x - this.x;
          const dy = target.y - this.y;
          this.vx += dx * attraction;
          this.vy += dy * attraction;
        }
        this.vx *= 0.99;
        this.vy *= 0.99;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > 1) this.vx *= -1;
        if (this.y < 0 || this.y > 1) this.vy *= -1;
      }
    }

    const particles = Array.from({ length: 500 }, () => new Particle());

    const drawParticles = (canvasW, canvasH, alpha, sizeMultiplier = 1) => {
      particles.forEach(p => {
        const size = p.size * sizeMultiplier;
        drawFilledCircle(p.x * canvasW, p.y * canvasH, size, alpha * p.life);
      });
    };

    const updateParticles = (target = null, attraction = 0) => {
      particles.forEach(p => p.update(target, attraction));
    };

    // Background stars
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2 + 0.5,
      twinkleSpeed: Math.random() * 0.002 + 0.001,
      twinkleOffset: Math.random() * Math.PI * 2
    }));

    const drawStars = (alpha, time) => {
      stars.forEach(star => {
        const twinkle = (Math.sin(time * star.twinkleSpeed + star.twinkleOffset) + 1) / 2;
        drawFilledCircle(star.x * canvas.width, star.y * canvas.height, star.size, alpha * (0.3 + twinkle * 0.7));
      });
    };

    // ==================== MAIN ANIMATION ====================

    const animate = (timestamp) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const deltaTime = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      elapsedRef.current += deltaTime * speedRef.current;
      const elapsed = elapsedRef.current;

      const { phase, progress } = getPhaseInfo(elapsed);

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.06;
      const globalRotation = elapsed * 0.00004;
      const breathe = (Math.sin(elapsed * 0.001) + 1) / 2;

      // ==================== ACT 1: SACRED GEOMETRY ====================

      switch (phase) {
        case 'void': {
          const starAlpha = easeInOutSine(Math.min(1, progress * 2));
          drawStars(starAlpha * 0.3, elapsed);
          break;
        }

        case 'firstLight': {
          drawStars(0.25, elapsed);
          const pointAlpha = easeInOutCubic(progress);
          drawFilledCircle(cx, cy, 4 + Math.sin(elapsed * 0.005) * 2, pointAlpha * 0.8);
          if (progress > 0.4) {
            drawFilledCircle(cx, cy, 25 * (progress - 0.4) / 0.6, 0.1 * (progress - 0.4) / 0.6);
          }
          break;
        }

        case 'birth': {
          drawStars(0.2, elapsed);
          drawFilledCircle(cx, cy, 5, 0.6);
          const easedProgress = easeOutQuad(progress);
          if (progress > 0.2) {
            drawCircle(cx, cy, baseRadius * easedProgress, (progress - 0.2) / 0.8);
          }
          break;
        }

        case 'seedOfLife': {
          drawStars(0.15, elapsed);
          drawCircle(cx, cy, baseRadius, 1);
          for (let i = 0; i < 6; i++) {
            const circleProgress = Math.max(0, Math.min(1, (progress * 1.5) - (i * 0.12)));
            if (circleProgress > 0) {
              const angle = (i * Math.PI / 3) + globalRotation;
              const dist = baseRadius * easeOutElastic(circleProgress);
              drawCircle(cx + dist * Math.cos(angle), cy + dist * Math.sin(angle), baseRadius * easeOutQuad(circleProgress), circleProgress);
            }
          }
          break;
        }

        case 'flowerOfLife': {
          drawStars(0.1, elapsed);
          drawSeedOfLife(cx, cy, baseRadius, 1, globalRotation);
          if (progress > 0.2) {
            const flowerAlpha = easeOutQuad((progress - 0.2) / 0.8);
            drawFlowerOfLife(cx, cy, baseRadius, flowerAlpha, globalRotation);
          }
          break;
        }

        case 'metatronsCube': {
          drawStars(0.08, elapsed);
          const flowerAlpha = 1 - easeInQuad(Math.min(1, progress * 2));
          if (flowerAlpha > 0) drawFlowerOfLife(cx, cy, baseRadius, flowerAlpha, globalRotation);
          const cubeAlpha = easeInOutCubic(progress);
          drawMetatronsCube(cx, cy, baseRadius * 1.5, cubeAlpha, globalRotation);
          if (progress > 0.5) {
            drawPolygon(cx, cy, baseRadius * 3.5, 6, globalRotation, (progress - 0.5) * 0.6);
          }
          break;
        }

        case 'mandala': {
          drawStars(0.05, elapsed);
          const layers = Math.floor(progress * 8) + 2;
          const scale = 1 + breathe * 0.1;
          drawMandala(cx, cy, baseRadius * 2.5 * scale, layers, globalRotation * 2, easeOutQuad(progress));
          if (progress > 0.5) {
            drawCircle(cx, cy, baseRadius * 5 * scale, (progress - 0.5) * 0.4);
          }
          break;
        }

        case 'sacredPeak': {
          drawStars(0.05, elapsed);
          const scale = 1 + breathe * 0.15;
          const rotSpeed = globalRotation * 3;
          drawMandala(cx, cy, baseRadius * 3 * scale, 10, rotSpeed, 1);
          drawFlowerOfLife(cx, cy, baseRadius * 0.7 * scale, 0.5, rotSpeed);
          drawMetatronsCube(cx, cy, baseRadius * 3.5 * scale, 0.3, rotSpeed);
          drawCircle(cx, cy, baseRadius * 6 * scale, 0.25 + breathe * 0.1);
          break;
        }

        case 'sacredTransition': {
          const fadeOut = easeInQuad(progress);
          drawStars(0.05 * (1 - fadeOut * 0.5), elapsed);
          const scale = 1 - fadeOut * 0.3;
          const alpha = 1 - fadeOut * 0.7;
          drawMandala(cx, cy, baseRadius * 3 * scale, 8, globalRotation * 2, alpha);
          // Hint of what's coming - triangles
          if (progress > 0.5) {
            const hintAlpha = (progress - 0.5) * 0.4;
            drawPolygon(cx, cy, baseRadius * 2, 3, globalRotation, hintAlpha);
          }
          break;
        }

        // ==================== ACT 2: FRACTALS + ORGANIC ====================

        case 'fractalBirth': {
          drawStars(0.03, elapsed);
          const triAlpha = easeInOutCubic(progress);
          drawPolygon(cx, cy, baseRadius * 2, 3, globalRotation, triAlpha);
          if (progress > 0.3) {
            drawPolygon(cx, cy, baseRadius * 3, 3, globalRotation + Math.PI, (progress - 0.3) / 0.7 * 0.7);
          }
          if (progress > 0.6) {
            drawPolygon(cx, cy, baseRadius * 4, 3, globalRotation, (progress - 0.6) / 0.4 * 0.5);
          }
          break;
        }

        case 'triangleRecursion': {
          drawStars(0.03, elapsed);
          const depth = Math.floor(progress * 4) + 2;
          const scale = 1 + breathe * 0.1;
          drawTriangleFractal(cx, cy, baseRadius * 4 * scale, depth, globalRotation * 2, 0.9);
          break;
        }

        case 'squareFractals': {
          drawStars(0.03, elapsed);
          // Transition from triangles to squares
          const triAlpha = 1 - easeInQuad(Math.min(1, progress * 2));
          if (triAlpha > 0) {
            drawTriangleFractal(cx, cy, baseRadius * 3, 3, globalRotation * 2, triAlpha * 0.5);
          }
          const sqDepth = Math.floor(progress * 4) + 2;
          const sqAlpha = easeOutQuad(progress);
          drawSquareFractal(cx, cy, baseRadius * 3.5, sqDepth, globalRotation * 1.5 + Math.PI / 4, sqAlpha);
          break;
        }

        case 'organicEmergence': {
          drawStars(0.02, elapsed);
          // Fractals fade, organic emerges
          const fractalAlpha = 1 - easeInQuad(progress);
          if (fractalAlpha > 0.1) {
            drawSquareFractal(cx, cy, baseRadius * 3, 3, globalRotation, fractalAlpha * 0.5);
          }
          const organicAlpha = easeOutQuad(progress);
          drawOrganicShape(cx, cy, baseRadius * 2.5, elapsed, organicAlpha * 0.8, progress);
          if (progress > 0.4) {
            drawOrganicShape(cx, cy, baseRadius * 3.5, elapsed + 1000, (progress - 0.4) / 0.6 * 0.6, progress);
          }
          break;
        }

        case 'blobMerging': {
          drawStars(0.02, elapsed);
          const wobble = 1 + breathe * 0.3;
          // Multiple organic blobs
          for (let i = 0; i < 5; i++) {
            const blobProgress = Math.max(0, Math.min(1, (progress * 1.5) - (i * 0.1)));
            if (blobProgress > 0) {
              const angle = (i * Math.PI * 2 / 5) + globalRotation;
              const dist = baseRadius * 2 * (1 - progress * 0.5);
              const bx = cx + dist * Math.cos(angle);
              const by = cy + dist * Math.sin(angle);
              drawOrganicShape(bx, by, baseRadius * (1 + i * 0.2), elapsed + i * 500, blobProgress * 0.7, wobble);
            }
          }
          // Central merging blob
          if (progress > 0.4) {
            const mergeSize = baseRadius * 2 * ((progress - 0.4) / 0.6);
            drawOrganicShape(cx, cy, mergeSize, elapsed, 0.5, wobble);
          }
          break;
        }

        case 'flowingForms': {
          drawStars(0.02, elapsed);
          const wobble = 1 + Math.sin(elapsed * 0.002) * 0.4;
          // Layered organic forms
          for (let i = 0; i < 4; i++) {
            const layerPhase = (progress + i * 0.25) % 1;
            const radius = baseRadius * (2 + i * 1.2);
            const alpha = 0.6 - i * 0.12;
            drawOrganicShape(cx, cy, radius * (0.8 + layerPhase * 0.4), elapsed + i * 700, alpha, wobble);
          }
          break;
        }

        case 'geometricOrganic': {
          drawStars(0.02, elapsed);
          // Blend fractals with organic
          const scale = 1 + breathe * 0.15;

          // Organic base
          drawOrganicShape(cx, cy, baseRadius * 3 * scale, elapsed, 0.4, 1);

          // Hexagon fractals emerging from organic
          const hexAlpha = 0.3 + progress * 0.4;
          drawHexagonFractal(cx, cy, baseRadius * 2.5 * scale, 3, globalRotation * 2, hexAlpha);

          // Transition hint to particles
          if (progress > 0.7) {
            const particleHint = (progress - 0.7) / 0.3;
            for (let i = 0; i < 20; i++) {
              const angle = (i / 20) * Math.PI * 2 + globalRotation;
              const dist = baseRadius * 4 * scale;
              drawFilledCircle(cx + dist * Math.cos(angle), cy + dist * Math.sin(angle), 2, particleHint * 0.5);
            }
          }
          break;
        }

        // ==================== ACT 3: PARTICLES + CLIMAX ====================

        case 'particleBirth': {
          drawStars(0.02, elapsed);
          // Initialize/reset particles near center
          if (progress < 0.1) {
            particles.forEach(p => {
              p.x = 0.5 + (Math.random() - 0.5) * 0.1;
              p.y = 0.5 + (Math.random() - 0.5) * 0.1;
              p.life = 1;
            });
          }
          updateParticles(null, 0);
          const particleAlpha = easeOutQuad(progress) * 0.6;
          drawParticles(canvas.width, canvas.height, particleAlpha, 1 + progress);
          break;
        }

        case 'swarmFormation': {
          drawStars(0.02, elapsed);
          // Particles swarm in circular pattern
          const targetAngle = elapsed * 0.001;
          const targetDist = 0.2 + breathe * 0.1;
          const target = {
            x: 0.5 + targetDist * Math.cos(targetAngle),
            y: 0.5 + targetDist * Math.sin(targetAngle)
          };
          updateParticles(target, 0.0001 + progress * 0.0002);
          drawParticles(canvas.width, canvas.height, 0.6, 1.5);

          // Draw target hint
          drawCircle(target.x * canvas.width, target.y * canvas.height, 20, 0.2);
          break;
        }

        case 'particleShapes': {
          drawStars(0.02, elapsed);
          // Particles form geometric shapes
          const shapePhase = Math.floor(progress * 3);
          const shapeProgress = (progress * 3) % 1;

          let targetPoints = [];
          const shapeRadius = 0.25;

          if (shapePhase === 0) {
            // Triangle
            for (let i = 0; i < 3; i++) {
              const angle = (i * 2 * Math.PI / 3) - Math.PI / 2 + globalRotation;
              targetPoints.push({ x: 0.5 + shapeRadius * Math.cos(angle), y: 0.5 + shapeRadius * Math.sin(angle) });
            }
          } else if (shapePhase === 1) {
            // Square
            for (let i = 0; i < 4; i++) {
              const angle = (i * Math.PI / 2) + Math.PI / 4 + globalRotation;
              targetPoints.push({ x: 0.5 + shapeRadius * Math.cos(angle), y: 0.5 + shapeRadius * Math.sin(angle) });
            }
          } else {
            // Circle points
            for (let i = 0; i < 12; i++) {
              const angle = (i * Math.PI / 6) + globalRotation;
              targetPoints.push({ x: 0.5 + shapeRadius * Math.cos(angle), y: 0.5 + shapeRadius * Math.sin(angle) });
            }
          }

          particles.forEach((p, i) => {
            const target = targetPoints[i % targetPoints.length];
            p.update(target, 0.0003);
          });

          drawParticles(canvas.width, canvas.height, 0.7, 1.5);

          // Draw shape outline
          const sides = shapePhase === 0 ? 3 : (shapePhase === 1 ? 4 : 12);
          drawPolygon(cx, cy, shapeRadius * Math.min(canvas.width, canvas.height), sides, globalRotation - Math.PI / 2, 0.15);
          break;
        }

        case 'particleExplosion': {
          drawStars(0.03, elapsed);
          // Explosion outward
          if (progress < 0.1) {
            particles.forEach(p => {
              const angle = Math.random() * Math.PI * 2;
              const speed = 0.01 + Math.random() * 0.02;
              p.vx = Math.cos(angle) * speed;
              p.vy = Math.sin(angle) * speed;
            });
          }

          particles.forEach(p => {
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.x += p.vx;
            p.y += p.vy;
          });

          const explosionAlpha = 0.8 - progress * 0.3;
          drawParticles(canvas.width, canvas.height, explosionAlpha, 2 - progress);

          // Central flash
          if (progress < 0.2) {
            drawFilledCircle(cx, cy, baseRadius * 3 * (1 - progress * 5), (0.2 - progress) * 2);
          }
          break;
        }

        case 'cosmicBlend': {
          drawStars(0.1 + progress * 0.3, elapsed);

          // Everything comes together
          const scale = 1 + breathe * 0.2;

          // Particles reform to center
          const centerTarget = { x: 0.5, y: 0.5 };
          updateParticles(centerTarget, 0.0002);
          drawParticles(canvas.width, canvas.height, 0.5, 1.5);

          // Organic forms
          drawOrganicShape(cx, cy, baseRadius * 2.5 * scale, elapsed, 0.3, 0.8);

          // Fractals
          if (progress > 0.3) {
            const fractalAlpha = (progress - 0.3) / 0.7 * 0.4;
            drawHexagonFractal(cx, cy, baseRadius * 3 * scale, 3, globalRotation * 2, fractalAlpha);
          }

          // Sacred geometry hints
          if (progress > 0.5) {
            const sacredAlpha = (progress - 0.5) * 0.5;
            drawFlowerOfLife(cx, cy, baseRadius * scale, sacredAlpha, globalRotation);
          }
          break;
        }

        case 'grandClimax': {
          const intensity = easeInOutCubic(progress);
          drawStars(0.4 + intensity * 0.4, elapsed);

          const scale = 1 + breathe * 0.25;
          const rotSpeed = globalRotation * (3 + progress * 3);

          // All elements combined
          // Particles
          updateParticles({ x: 0.5, y: 0.5 }, 0.0001);
          drawParticles(canvas.width, canvas.height, 0.4 * intensity, 2);

          // Sacred geometry core
          drawMandala(cx, cy, baseRadius * 2.5 * scale, 8, rotSpeed, intensity * 0.8);
          drawFlowerOfLife(cx, cy, baseRadius * 0.8 * scale, intensity * 0.5, rotSpeed);

          // Fractals
          drawTriangleFractal(cx, cy, baseRadius * 4 * scale, 3, rotSpeed, intensity * 0.3);
          drawHexagonFractal(cx, cy, baseRadius * 3.5 * scale, 2, -rotSpeed * 0.5, intensity * 0.25);

          // Organic overlay
          drawOrganicShape(cx, cy, baseRadius * 5 * scale, elapsed, intensity * 0.2, 0.5);

          // Outer rings
          for (let i = 0; i < 4; i++) {
            const ringPhase = (progress * 2 + i * 0.25) % 1;
            const ringRadius = baseRadius * (4 + i * 2 + ringPhase * 2) * scale;
            drawCircle(cx, cy, ringRadius, (1 - ringPhase) * 0.3 * intensity);
          }

          // Central glow
          drawFilledCircle(cx, cy, baseRadius * 2 * scale, 0.1 + breathe * 0.1);
          break;
        }

        case 'dissolution': {
          const fadeProgress = easeInQuad(progress);
          drawStars(0.3 * (1 - fadeProgress), elapsed);

          const scale = 1 - fadeProgress * 0.5;
          const alpha = 1 - fadeProgress;

          // Everything fades
          ctx.globalAlpha = alpha;
          drawMandala(cx, cy, baseRadius * 2 * scale, 6, globalRotation * 2, 1);
          drawOrganicShape(cx, cy, baseRadius * 3 * scale, elapsed, 0.3, 0.5);
          ctx.globalAlpha = 1;

          // Particles scatter
          particles.forEach(p => {
            p.vx += (Math.random() - 0.5) * 0.0005;
            p.vy += (Math.random() - 0.5) * 0.0005;
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.01;
          });
          drawParticles(canvas.width, canvas.height, 0.3 * alpha, 1);

          // Final point
          if (progress > 0.7) {
            const pointAlpha = ((progress - 0.7) / 0.3) * (1 - fadeProgress);
            drawFilledCircle(cx, cy, 5 * (1 - progress), 0.8 * pointAlpha);
          }
          break;
        }
      }

      ctx.globalCompositeOperation = 'source-over';
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="shapes-background" />
      <button className="speed-toggle" onClick={cycleSpeed}>
        {speedArrows[speeds.indexOf(speed)]}
      </button>
    </>
  );
}

export default SacredGeometry;
