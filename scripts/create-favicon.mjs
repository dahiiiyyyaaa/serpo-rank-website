import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Package the existing official Serpo Rank symbol as a root-level PNG and ICO.
const source = fileURLToPath(new URL('../public/images/serpo-rank-icon.png', import.meta.url));
const png = readFileSync(source);
const signature = Buffer.from('89504e470d0a1a0a', 'hex');
if (!png.subarray(0, 8).equals(signature)) throw new Error('Official icon is not a PNG');
const width = png.readUInt32BE(16);
const height = png.readUInt32BE(20);
if (width !== 192 || height !== 192) throw new Error('Expected the existing 192×192 square official icon');

const iconHeader = Buffer.alloc(22);
iconHeader.writeUInt16LE(1, 2); // ICO type: image
iconHeader.writeUInt16LE(1, 4); // one image
iconHeader.writeUInt8(width, 6);
iconHeader.writeUInt8(height, 7);
iconHeader.writeUInt16LE(1, 10); // planes
iconHeader.writeUInt16LE(32, 12); // bit depth
iconHeader.writeUInt32LE(png.length, 14);
iconHeader.writeUInt32LE(iconHeader.length, 18);

writeFileSync(fileURLToPath(new URL('../public/favicon.png', import.meta.url)), png);
writeFileSync(fileURLToPath(new URL('../public/favicon.ico', import.meta.url)), Buffer.concat([iconHeader, png]));
