"use client";

import { useEffect, useRef, useCallback } from "react";

type RaysOrigin =
  | "top-center"
  | "top-left"
  | "top-right"
  | "center"
  | "bottom-center"
  | "bottom-left"
  | "bottom-right";

interface LightRaysProps {
  /** Where rays originate from */
  raysOrigin?: RaysOrigin;
  /** Base colour of the rays (hex / css colour string) */
  raysColor?: string;
  /** Animation speed multiplier */
  raysSpeed?: number;
  /** Spread angle of the ray fan (0–1) */
  lightSpread?: number;
  /** Relative length of each ray (1 = full viewport diagonal) */
  rayLength?: number;
  /** Whether rays follow the mouse cursor */
  followMouse?: boolean;
  /** How strongly the mouse displaces the origin (0–1) */
  mouseInfluence?: number;
  /** Amount of Perlin-like noise applied to ray edges */
  noiseAmount?: number;
  /** Distortion / wave effect on each ray */
  distortion?: number;
  /** Extra CSS class applied to the wrapper element */
  className?: string;
  /** Whether rays pulse in brightness */
  pulsating?: boolean;
  /** How far rays fade out (0 = no fade, 1 = full fade by end) */
  fadeDistance?: number;
  /** Colour saturation multiplier */
  saturation?: number;
}

// ---------------------------------------------------------------------------
// Tiny deterministic noise helper (no external dep required)
// ---------------------------------------------------------------------------
function pseudoNoise(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.3) * 43758.5453;
  return n - Math.floor(n);
}

// ---------------------------------------------------------------------------
// Parse a CSS colour string into [r, g, b] in 0-255 range
// ---------------------------------------------------------------------------
function parseColor(color: string): [number, number, number] {
  const div = document.createElement("div");
  div.style.color = color;
  document.body.appendChild(div);
  const computed = getComputedStyle(div).color;
  document.body.removeChild(div);
  const match = computed.match(/\d+/g);
  if (!match || match.length < 3) return [255, 255, 255];
  return [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])];
}

// ---------------------------------------------------------------------------
// Resolve origin to normalised [0-1, 0-1] coordinates
// ---------------------------------------------------------------------------
function resolveOrigin(
  origin: RaysOrigin,
  mouseNorm: { x: number; y: number } | null,
  influence: number,
  canvas: HTMLCanvasElement
): { x: number; y: number } {
  const origins: Record<RaysOrigin, { x: number; y: number }> = {
    "top-center": { x: 0.5, y: 0 },
    "top-left": { x: 0, y: 0 },
    "top-right": { x: 1, y: 0 },
    center: { x: 0.5, y: 0.5 },
    "bottom-center": { x: 0.5, y: 1 },
    "bottom-left": { x: 0, y: 1 },
    "bottom-right": { x: 1, y: 1 },
  };

  const base = origins[origin] ?? origins["top-center"];
  if (!mouseNorm) return { x: base.x * canvas.width, y: base.y * canvas.height };

  return {
    x: (base.x + (mouseNorm.x - base.x) * influence) * canvas.width,
    y: (base.y + (mouseNorm.y - base.y) * influence) * canvas.height,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function LightRays({
  raysOrigin = "top-center",
  raysColor = "#ffffff",
  raysSpeed = 1,
  lightSpread = 0.5,
  rayLength = 2,
  followMouse = false,
  mouseInfluence = 0.1,
  noiseAmount = 0,
  distortion = 0,
  className = "",
  pulsating = false,
  fadeDistance = 1,
  saturation = 1,
}: LightRaysProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(performance.now());
  const colorRef = useRef<[number, number, number]>([255, 255, 255]);

  // Resolve colour after mount
  useEffect(() => {
    colorRef.current = parseColor(raysColor);
  }, [raysColor]);

  // Mouse tracking
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || !followMouse) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    },
    [followMouse]
  );

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = null;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    if (!ctx || !parent) return;

    // -----------------------------------------------------------------------
    // Resize observer
    // -----------------------------------------------------------------------
    const ro = new ResizeObserver(() => {
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    });
    ro.observe(parent);
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;

    // -----------------------------------------------------------------------
    // Draw frame
    // -----------------------------------------------------------------------
    const NUM_RAYS = 28;

    function draw(timestamp: number) {
      if (!ctx || !canvas) return;
      const elapsed = (timestamp - startRef.current) * 0.001 * raysSpeed;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const [r, g, b] = colorRef.current;

      // Adjust saturation: lerp toward grey
      const grey = 0.299 * r + 0.587 * g + 0.114 * b;
      const sr = grey + (r - grey) * saturation;
      const sg = grey + (g - grey) * saturation;
      const sb = grey + (b - grey) * saturation;

      const origin = resolveOrigin(
        raysOrigin,
        followMouse ? mouseRef.current : null,
        mouseInfluence,
        canvas
      );

      const diagonal = Math.hypot(canvas.width, canvas.height);
      const maxLen = diagonal * rayLength;
      const halfSpread = Math.PI * lightSpread; // half-angle of fan in radians

      // Base angle: point "into" the canvas from the origin
      let baseAngle = Math.PI / 2; // pointing down for top-center
      if (raysOrigin === "top-left") baseAngle = Math.PI * 0.75;
      else if (raysOrigin === "top-right") baseAngle = Math.PI * 0.25;
      else if (raysOrigin === "bottom-center") baseAngle = -Math.PI / 2;
      else if (raysOrigin === "bottom-left") baseAngle = -Math.PI * 0.75;
      else if (raysOrigin === "bottom-right") baseAngle = -Math.PI * 0.25;
      else if (raysOrigin === "center") baseAngle = Math.PI / 2;

      const pulseAlpha = pulsating
        ? 0.55 + 0.45 * Math.sin(elapsed * Math.PI * 2)
        : 1;

      for (let i = 0; i < NUM_RAYS; i++) {
        const t = i / (NUM_RAYS - 1); // 0..1
        const spreadAngle = baseAngle + (t - 0.5) * 2 * halfSpread;

        // Per-ray time offset for gentle sway
        const sway = Math.sin(elapsed * 0.7 + i * 1.37) * 0.04 * raysSpeed;
        const angle = spreadAngle + sway;

        // Noise on ray width
        const noiseSeed = pseudoNoise(i, Math.floor(elapsed), 42) * noiseAmount * 0.15;

        // Ray width (centre rays slightly wider)
        const centerBias = 1 - Math.abs(t - 0.5) * 1.4;
        const rayWidth = Math.max(2, 40 * centerBias + noiseSeed * 30);

        // Distortion — wiggle the ray tip
        const distortX = Math.sin(elapsed * 2.1 + i) * distortion * 40;
        const distortY = Math.cos(elapsed * 1.7 + i) * distortion * 40;

        const endX = origin.x + Math.cos(angle) * maxLen + distortX;
        const endY = origin.y + Math.sin(angle) * maxLen + distortY;

        // Fade alpha from origin to tip
        const baseOpacity = (0.08 + 0.12 * centerBias) * pulseAlpha;
        const alphaOrigin = baseOpacity;
        const alphaEnd = baseOpacity * (1 - fadeDistance);

        const grad = ctx.createLinearGradient(origin.x, origin.y, endX, endY);
        grad.addColorStop(0, `rgba(${sr},${sg},${sb},${alphaOrigin})`);
        grad.addColorStop(1, `rgba(${sr},${sg},${sb},${alphaEnd < 0 ? 0 : alphaEnd})`);

        ctx.save();
        ctx.beginPath();
        // Draw a narrow trapezoid centred on the ray angle
        const perp = angle + Math.PI / 2;
        const hw = rayWidth / 2;
        ctx.moveTo(origin.x + Math.cos(perp) * 1, origin.y + Math.sin(perp) * 1);
        ctx.lineTo(endX + Math.cos(perp) * hw, endY + Math.sin(perp) * hw);
        ctx.lineTo(endX - Math.cos(perp) * hw, endY - Math.sin(perp) * hw);
        ctx.lineTo(origin.x - Math.cos(perp) * 1, origin.y - Math.sin(perp) * 1);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [
    raysOrigin,
    raysSpeed,
    lightSpread,
    rayLength,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
    pulsating,
    fadeDistance,
    saturation,
    handleMouseMove,
    handleMouseLeave,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
