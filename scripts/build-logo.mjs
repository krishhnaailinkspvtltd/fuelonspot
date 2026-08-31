import sharp from 'sharp';
import fs from 'node:fs/promises';

const SRC = './logo-source.jpeg';
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: CH } = info;

const LO = 212, HI = 236;
const rgba = Buffer.alloc(W * H * 4);
for (let p = 0, q = 0; p < data.length; p += CH, q += 4) {
  const r = data[p], g = data[p + 1], b = data[p + 2];
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  let a = 255;
  if (lum >= HI) a = 0;
  else if (lum > LO) a = Math.round(255 * (1 - (lum - LO) / (HI - LO)));
  rgba[q] = r; rgba[q + 1] = g; rgba[q + 2] = b; rgba[q + 3] = a;
}

const colHits = new Array(W).fill(0);
const rowHits = new Array(H).fill(0);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (rgba[(y * W + x) * 4 + 3] > 60) { colHits[x]++; rowHits[y]++; }
}
const first = (a, m) => a.findIndex(v => v > m);
const last = (a, m) => a.length - 1 - [...a].reverse().findIndex(v => v > m);
const x0 = first(colHits, 2), x1 = last(colHits, 2), y0 = first(rowHits, 2), y1 = last(rowHits, 2);

// gutter = longest run of near-empty columns in the middle third
const NOISE = Math.max(2, Math.round(H * 0.006));
let best = { start: -1, len: 0 }, run = 0, start = -1;
for (let x = Math.round(W * 0.20); x < Math.round(W * 0.50); x++) {
  if (colHits[x] <= NOISE) { if (run === 0) start = x; run++; if (run > best.len) best = { start, len: run }; }
  else run = 0;
}
console.log('TRIM', { x0, x1, y0, y1 }, 'GUTTER', best, 'noise<=', NOISE);

const markRight = best.len >= 8 ? best.start + Math.round(best.len / 2) : Math.round(x0 + (x1 - x0) * 0.36);
const lockW = x1 - x0 + 1, lockH = y1 - y0 + 1, markW = markRight - x0;
const base = () => sharp(rgba, { raw: { width: W, height: H, channels: 4 } });

const OUTW = 900;
await base().extract({ left: x0, top: y0, width: lockW, height: lockH })
  .resize({ width: OUTW, kernel: 'lanczos3' })
  .png({ compressionLevel: 9, palette: true, quality: 92, effort: 10 })
  .toFile('./public/fuelonspot-logo.png');

const markBuf = await base().extract({ left: x0, top: y0, width: markW, height: lockH }).png().toBuffer();
await sharp(markBuf).trim({ threshold: 1 }).resize({ width: 420, kernel: 'lanczos3' })
  .png({ compressionLevel: 9, palette: true, quality: 92, effort: 10 })
  .toFile('./public/fuelonspot-mark.png');

const tight = await sharp(markBuf).trim({ threshold: 1 }).png().toBuffer();
for (const [size, dest, opaque] of [[64, './src/app/icon.png', false], [180, './src/app/apple-icon.png', true], [512, './public/icon-512.png', true]]) {
  const inner = Math.round(size * 0.84);
  const scaled = await sharp(tight).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: opaque ? { r: 255, g: 255, b: 255, alpha: 1 } : { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: scaled, gravity: 'center' }]).png({ compressionLevel: 9 }).toFile(dest);
}
const s = async f => Math.round((await fs.stat(f)).size / 1024) + 'KB';
console.log('logo', await s('./public/fuelonspot-logo.png'), '| mark', await s('./public/fuelonspot-mark.png'));
const lm = await sharp('./public/fuelonspot-logo.png').metadata();
const mm = await sharp('./public/fuelonspot-mark.png').metadata();
console.log('logo dims', lm.width, lm.height, '| mark dims', mm.width, mm.height);
