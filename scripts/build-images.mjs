import sharp from 'sharp';
import fs from 'node:fs/promises';

const DIR = './public/images';

/** target: [width, height] after a centre-weighted cover crop */
const jobs = [
  { name: 'hero-refueling',      w: 1600, h: 1200, pos: 'attention' },
  { name: 'construction-site',   w: 1200, h: 900,  pos: 'attention' },
  { name: 'industrial-facility', w: 1200, h: 900,  pos: 'centre' },
  { name: 'backup-generator',    w: 1200, h: 900,  pos: 'left' },
  { name: 'commercial-fleet',    w: 1200, h: 900,  pos: 'centre' },
  // crop the right edge (distant flagpole) before the cover crop
  { name: 'fuel-operations',     w: 1200, h: 1400, pos: 'left', preCropRight: 0.16 },
];

for (const job of jobs) {
  const src = `${DIR}/${job.name}.raw.jpg`;
  let img = sharp(src);
  const meta = await img.metadata();

  if (job.preCropRight) {
    const keep = Math.round(meta.width * (1 - job.preCropRight));
    img = sharp(await img.extract({ left: 0, top: 0, width: keep, height: meta.height }).toBuffer());
  }

  await img
    .resize(job.w, job.h, {
      fit: 'cover',
      position: job.pos === 'attention' ? sharp.strategy.attention : job.pos,
    })
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(`${DIR}/${job.name}.jpg`);

  const out = await sharp(`${DIR}/${job.name}.jpg`).metadata();
  const size = (await fs.stat(`${DIR}/${job.name}.jpg`)).size;
  console.log(job.name.padEnd(22), out.width + 'x' + out.height, Math.round(size / 1024) + 'KB');
  await fs.unlink(src);
}
