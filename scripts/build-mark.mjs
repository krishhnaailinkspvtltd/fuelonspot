import sharp from 'sharp';
const SRC = './logo-source.jpeg';
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: CH } = info;
const LO = 212, HI = 236;
const rgba = Buffer.alloc(W * H * 4);
for (let p = 0, q = 0; p < data.length; p += CH, q += 4) {
  const r = data[p], g = data[p+1], b = data[p+2];
  const lum = 0.2126*r + 0.7152*g + 0.0722*b;
  let a = 255;
  if (lum >= HI) a = 0; else if (lum > LO) a = Math.round(255 * (1 - (lum - LO)/(HI - LO)));
  rgba[q]=r; rgba[q+1]=g; rgba[q+2]=b; rgba[q+3]=a;
}
const x0=161, x1=937, y0=118, y1=429;
const colHits = new Array(W).fill(0);
for (let y=y0; y<=y1; y++) for (let x=0; x<W; x++) if (rgba[(y*W+x)*4+3] > 60) colHits[x]++;
// print occupancy across the suspected gutter window so we cut in the true gap
const lo = x0 + Math.round((x1-x0)*0.35), hi = x0 + Math.round((x1-x0)*0.46);
let bestStart=-1, bestLen=0, run=0, st=-1;
for (let x=lo; x<=hi; x++) {
  if (colHits[x] <= 1) { if (run===0) st=x; run++; if (run>bestLen){bestLen=run;bestStart=st;} } else run=0;
}
console.log('gutter window', lo, hi, '-> run', {bestStart, bestLen});
const markRight = bestLen >= 4 ? bestStart + Math.round(bestLen/2) : 464;
console.log('markRight', markRight, 'fraction', ((markRight-x0)/(x1-x0)).toFixed(3));
const base = () => sharp(rgba, { raw: { width: W, height: H, channels: 4 } });
const markBuf = await base().extract({ left:x0, top:y0, width: markRight-x0, height: y1-y0+1 }).png().toBuffer();
const tight = await sharp(markBuf).trim({ threshold: 1 }).png().toBuffer();
const tm = await sharp(tight).metadata();
console.log('tight mark', tm.width, 'x', tm.height);
await sharp(tight).resize({ width: 440, kernel:'lanczos3' }).png({ compressionLevel:9, palette:true, quality:92, effort:10 }).toFile('./public/fuelonspot-mark.png');
for (const [size, dest, opaque] of [[64,'./src/app/icon.png',false],[180,'./src/app/apple-icon.png',true],[512,'./public/icon-512.png',true]]) {
  const inner = Math.round(size*0.86);
  const scaled = await sharp(tight).resize(inner, inner, { fit:'contain', background:{r:0,g:0,b:0,alpha:0} }).toBuffer();
  await sharp({ create:{ width:size, height:size, channels:4, background: opaque?{r:255,g:255,b:255,alpha:1}:{r:0,g:0,b:0,alpha:0} } })
    .composite([{ input: scaled, gravity:'center' }]).png({ compressionLevel:9 }).toFile(dest);
}
console.log('done');
