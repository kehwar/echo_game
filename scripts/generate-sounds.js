#!/usr/bin/env node
/**
 * Generate simple sound files for the game
 * This creates basic sine wave tones for game feedback
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate beep with envelope for better sound
function generateBeep(frequency, duration, filename, volume = 0.3) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(44 + numSamples * 2);
  
  // WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);
  
  // Generate tone with ADSR envelope
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const progress = i / numSamples;
    
    // ADSR envelope
    let envelope;
    if (progress < 0.1) {
      // Attack
      envelope = progress / 0.1;
    } else if (progress < 0.3) {
      // Decay
      envelope = 1 - (progress - 0.1) / 0.2 * 0.2;
    } else if (progress < 0.7) {
      // Sustain
      envelope = 0.8;
    } else {
      // Release
      envelope = 0.8 * (1 - (progress - 0.7) / 0.3);
    }
    
    const amplitude = volume * envelope;
    const sample = Math.sin(2 * Math.PI * frequency * t) * amplitude;
    const value = Math.floor(sample * 32767);
    buffer.writeInt16LE(value, 44 + i * 2);
  }
  
  fs.writeFileSync(filename, buffer);
  console.log(`Generated ${filename}`);
}

// Create output directory
const soundsDir = path.join(__dirname, '../public/sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// Generate sound files
console.log('Generating sound files...');

// Tick sound - short high-pitched beep
generateBeep(1200, 0.08, path.join(soundsDir, 'tick.wav'), 0.25);

// Finish sound - descending tone
const finishPath = path.join(soundsDir, 'finish.wav');
const sampleRate = 44100;
const duration = 0.8;
const numSamples = Math.floor(sampleRate * duration);
const buffer = Buffer.alloc(44 + numSamples * 2);

// WAV header for finish sound
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + numSamples * 2, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(1, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 2, 28);
buffer.writeUInt16LE(2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(numSamples * 2, 40);

// Descending tone
for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;
  const progress = i / numSamples;
  const frequency = 800 - 400 * progress; // Descend from 800Hz to 400Hz
  const envelope = Math.max(0, 1 - progress * 1.2);
  const amplitude = 0.3 * envelope;
  const sample = Math.sin(2 * Math.PI * frequency * t) * amplitude;
  const value = Math.floor(sample * 32767);
  buffer.writeInt16LE(value, 44 + i * 2);
}
fs.writeFileSync(finishPath, buffer);
console.log(`Generated ${finishPath}`);

// Correct sound - rising tone (positive feedback)
generateBeep(800, 0.15, path.join(soundsDir, 'correct.wav'), 0.3);

// Pass sound - lower tone (neutral feedback)
generateBeep(400, 0.12, path.join(soundsDir, 'pass.wav'), 0.25);

console.log('All sound files generated successfully!');
