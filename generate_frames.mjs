#!/usr/bin/env node
/**
 * Generates 40 placeholder gradient frames for the sequence scroll animation.
 * Each frame shows a dark-themed gradient with a "shimmer" that moves across
 * frames, simulating a clipper being revealed/assembled.
 *
 * Run: node generate_frames.mjs
 * Output: public/sequence/frame_001.jpg ... frame_040.jpg
 *
 * Requires: canvas npm package
 * npm install canvas (run once, dev-only)
 */

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, 'public', 'sequence');
const TOTAL = 40;
const W = 1920;
const H = 1080;

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log(`Generating ${TOTAL} frames to ${OUTPUT_DIR}...`);

for (let i = 0; i < TOTAL; i++) {
  const canvas = createCanvas(W, H);
  const ctx    = canvas.getContext('2d');
  const t      = i / (TOTAL - 1); // 0 → 1

  // Dark background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, W, H);

  // Animated radial copper glow (moves from bottom to center as t goes 0→1)
  const cx = W / 2;
  const cy = H * (0.85 - t * 0.35); // moves up
  const radius = 200 + t * 300;

  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grd.addColorStop(0,   `rgba(205, 127, 50, ${0.08 + t * 0.10})`);
  grd.addColorStop(0.5, `rgba(184, 115, 51, ${0.04 + t * 0.06})`);
  grd.addColorStop(1,   'rgba(10, 10, 10, 0)');

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  // Vertical beam (simulates the clipper body shape being revealed)
  const beamX   = cx;
  const beamW   = 80 + t * 60;
  const beamH   = 100 + t * 600;
  const beamY   = H / 2 - beamH / 2 + (1 - t) * 200;
  const beamAlpha = t * 0.15;

  const beamGrd = ctx.createLinearGradient(beamX - beamW / 2, 0, beamX + beamW / 2, 0);
  beamGrd.addColorStop(0, 'rgba(205,127,50,0)');
  beamGrd.addColorStop(0.3, `rgba(205,127,50,${beamAlpha})`);
  beamGrd.addColorStop(0.5, `rgba(232,168,124,${beamAlpha * 1.5})`);
  beamGrd.addColorStop(0.7, `rgba(205,127,50,${beamAlpha})`);
  beamGrd.addColorStop(1, 'rgba(205,127,50,0)');

  ctx.fillStyle = beamGrd;
  ctx.fillRect(beamX - beamW / 2, beamY, beamW, beamH);

  // Horizontal scan line (like clipper blade glinting)
  const scanY = H * (0.9 - t * 0.5);
  const scanGrd = ctx.createLinearGradient(0, scanY - 1, 0, scanY + 1);
  scanGrd.addColorStop(0, 'rgba(205,127,50,0)');
  scanGrd.addColorStop(0.5, `rgba(232,168,124,${t * 0.4})`);
  scanGrd.addColorStop(1, 'rgba(205,127,50,0)');
  ctx.fillStyle = scanGrd;
  ctx.fillRect(0, scanY - 2, W, 4);

  // Frame number watermark (for debugging — will be covered by real images)
  ctx.fillStyle = 'rgba(205,127,50,0.08)';
  ctx.font = `bold ${Math.floor(H * 0.25)}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(i + 1).padStart(2, '0'), W / 2, H / 2);

  // Vignette overlay
  const vgn = ctx.createRadialGradient(W/2, H/2, H * 0.2, W/2, H/2, H * 0.8);
  vgn.addColorStop(0,   'rgba(0,0,0,0)');
  vgn.addColorStop(1,   'rgba(0,0,0,0.6)');
  ctx.fillStyle = vgn;
  ctx.fillRect(0, 0, W, H);

  // Save as JPEG
  const buf      = canvas.toBuffer('image/jpeg', { quality: 0.88 });
  const filename = `frame_${String(i + 1).padStart(3, '0')}.jpg`;
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), buf);

  if ((i + 1) % 10 === 0) console.log(`  ✓ ${i + 1}/${TOTAL} frames done`);
}

console.log('✅ All frames generated successfully!');
console.log(`📁 Location: ${OUTPUT_DIR}`);
console.log('');
console.log('Replace these placeholder frames with your real clipper image sequence');
console.log('when ready. Naming convention: frame_001.jpg → frame_040.jpg');
