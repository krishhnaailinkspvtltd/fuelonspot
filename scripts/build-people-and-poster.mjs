/**
 * Builds the two leadership portraits and the supplied campaign poster.
 *
 * Inputs (same `.raw.*` convention as build-images.mjs — consumed, then removed).
 * A job whose input is missing is skipped, so the script stays re-runnable for
 * whichever asset is actually being rebuilt:
 *   public/images/leadership/vipul-p-shah.raw.png       1122x1402 studio portrait
 *   public/images/leadership/nirmit-d-shah.raw.png      1122x1402 studio portrait
 *   public/images/fuelonspot-7-lakh-delivered.raw.png   1122x1402 campaign poster
 *   public/images/fuelonspot-diesel-delivery.raw.png    1254x1005 hero poster
 *
 * The portraits are cropped and scaled ONLY. No retouching, no colour grading,
 * no face edits — both backdrops already measure a neutral 252/253, so the pair
 * matches without correction.
 *
 * Vipul's original is matted inside a ~4px black picture frame inset 15px from
 * the edge. The extract below clears that frame and re-crops to the same
 * composition as Nirmit's untouched original — head top at ~7.5% of the frame,
 * head width ~46% of the frame, subject centred at ~51% — so the two cards read
 * as one shoot. Derived from measuring both files; do not tweak by eye.
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';

const DIR = './public/images';

const jobs = [
  {
    src: `${DIR}/leadership/vipul-p-shah.raw.png`,
    out: `${DIR}/leadership/vipul-p-shah.webp`,
    // clears the black frame, then matches Nirmit's crop
    extract: { left: 122, top: 25, width: 896, height: 1120 },
    w: 900,
    h: 1125,
    quality: 88,
  },
  {
    src: `${DIR}/leadership/nirmit-d-shah.raw.png`,
    out: `${DIR}/leadership/nirmit-d-shah.webp`,
    extract: null,
    w: 900,
    h: 1125,
    quality: 88,
  },
  {
    src: `${DIR}/fuelonspot-7-lakh-delivered.raw.png`,
    out: `${DIR}/fuelonspot-7-lakh-delivered.webp`,
    extract: null,
    // kept at native size: the poster is dense display type and gets no
    // downscale here, only the one Next/Image applies per breakpoint.
    w: 1122,
    h: 1402,
    // higher than the portraits — flat gold-on-navy lettering shows banding
    // and edge mush long before a photograph does.
    quality: 92,
  },
  {
    src: `${DIR}/fuelonspot-diesel-delivery.raw.png`,
    out: `${DIR}/fuelonspot-diesel-delivery.webp`,
    extract: null,
    // native size, uncropped: this poster carries the Jio-bp lockup, the
    // FuelOnSpot mark, the 7 Lakh figure and a phone number, and none of it
    // may be trimmed away.
    w: 1254,
    h: 1005,
    quality: 92,
  },
];

for (const job of jobs) {
  // Skip rather than throw: the raw inputs are deleted after each run, so a
  // rebuild of one asset should not fail on the others being long gone.
  try {
    await fs.access(job.src);
  } catch {
    console.log(job.out.padEnd(48), 'skipped (no raw input)');
    continue;
  }

  let img = sharp(job.src);
  if (job.extract) img = sharp(await img.extract(job.extract).toBuffer());

  await img
    // `cover` + `top` is a no-op on an exact-ratio source; it is here so a
    // re-supplied file that is a few pixels off never stretches, and never
    // takes the crop out of the top of a head.
    .resize(job.w, job.h, { fit: 'cover', position: 'top' })
    .webp({ quality: job.quality, effort: 6 })
    .toFile(job.out);

  const meta = await sharp(job.out).metadata();
  const size = (await fs.stat(job.out)).size;
  console.log(
    job.out.padEnd(48),
    meta.width + 'x' + meta.height,
    Math.round(size / 1024) + 'KB',
  );
  await fs.unlink(job.src);
}
