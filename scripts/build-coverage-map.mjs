/**
 * Generates src/lib/coverage-map.ts — the real district geometry behind the
 * coverage map.
 *
 * Input (not committed; ~8 MB):
 *   .cache/geoBoundaries-IND-ADM2_simplified.geojson
 *
 * Fetch it once with:
 *   curl -sSL -o adm2.zip https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/IND/ADM2/geoBoundaries-IND-ADM2-all.zip
 *   unzip -j adm2.zip 'geoBoundaries-IND-ADM2_simplified.geojson' -d .cache
 *
 * Licence: geoBoundaries derivative works are CC BY 4.0 and the underlying
 * boundaries are ODbL, so the map MUST keep its visible credit. See
 * https://www.geoboundaries.org.
 *
 * Run with: node scripts/build-coverage-map.mjs
 */
import fs from 'node:fs/promises';

const SRC = './.cache/geoBoundaries-IND-ADM2_simplified.geojson';
const OUT = './src/lib/coverage-map.ts';

/** The three districts the operator actually delivers in, keyed as in site.ts. */
const SERVED = [
  ['panchmahal', 'Panch Mahals'],
  ['vadodara', 'Vadodara'],
  ['chotaUdepur', 'Chhota Udaipur'],
];

/** Neighbours, drawn faintly. Anything that misses the frame is dropped below. */
const CONTEXT = [
  'Anand', 'Kheda', 'Mahisagar', 'Dohad', 'Bharuch', 'Narmada', 'Ahmadabad',
  'Aravali', 'Sabar Kantha', 'Gandhinagar', 'Alirajpur', 'Jhabua', 'Surat',
  'Tapi', 'Dhar', 'Banswara', 'Dungarpur', 'Nandurbar',
];

const LAT0 = 22.5;
const K = Math.cos((LAT0 * Math.PI) / 180);
const proj = (lon, lat) => [lon * K, -lat];

/** ~350 m at this latitude for the served districts; the faint layer takes 5×. */
const EPS = 0.0032;
const MIN_AREA = 0.0004;

const polys = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);

/** Ramer–Douglas–Peucker over an OPEN polyline. */
function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  const [x1, y1] = pts[0];
  const [x2, y2] = pts[pts.length - 1];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const norm = Math.hypot(dx, dy);
  let dmax = -1;
  let idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    // When the two anchors coincide the perpendicular formula collapses to
    // zero for every point, so fall back to radial distance.
    const d = norm === 0
      ? Math.hypot(x0 - x1, y0 - y1)
      : Math.abs(dy * x0 - dx * y0 + x2 * y1 - y2 * x1) / norm;
    if (d > dmax) { dmax = d; idx = i; }
  }
  if (dmax > eps && idx > 0) {
    return rdp(pts.slice(0, idx + 1), eps).slice(0, -1).concat(rdp(pts.slice(idx), eps));
  }
  return [pts[0], pts[pts.length - 1]];
}

/**
 * RDP over a CLOSED ring. Split into two arcs at the point farthest from the
 * start before simplifying: run straight down a closed ring, RDP collapses it
 * to two points, because its two anchors are the same point and every
 * perpendicular distance therefore measures zero.
 */
function simplifyRing(ring, eps) {
  const pts = ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]
    ? ring.slice(0, -1)
    : ring.slice();
  if (pts.length < 4) return [];
  const [x0, y0] = pts[0];
  let far = 0;
  let fd = -1;
  for (let i = 0; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - x0, pts[i][1] - y0);
    if (d > fd) { fd = d; far = i; }
  }
  const a = rdp(pts.slice(0, far + 1), eps);
  const b = rdp(pts.slice(far).concat([pts[0]]), eps);
  const out = a.slice(0, -1).concat(b.slice(0, -1));
  return out.length >= 3 ? out : [];
}

const f4 = (n) => n.toFixed(4);

function toPath(geom, eps, minArea) {
  const out = [];
  for (const poly of polys(geom)) {
    for (const ring of poly) {
      const pr = ring.map(([lon, lat]) => proj(lon, lat));
      const xs = pr.map((p) => p[0]);
      const ys = pr.map((p) => p[1]);
      const area = (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
      if (area < minArea) continue;               // drop slivers and islands
      const s = simplifyRing(pr, eps);
      if (!s.length) continue;
      out.push(`M${s.map(([x, y]) => `${f4(x)} ${f4(y)}`).join(' L')}Z`);
    }
  }
  return out.join('');
}

function bbox(geom) {
  const xs = [];
  const ys = [];
  for (const poly of polys(geom)) {
    for (const ring of poly) {
      for (const [lon, lat] of ring) {
        const [x, y] = proj(lon, lat);
        xs.push(x); ys.push(y);
      }
    }
  }
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

const gj = JSON.parse(await fs.readFile(SRC, 'utf8'));
const feats = new Map(gj.features.map((f) => [f.properties.shapeName, f]));
for (const [, name] of SERVED) {
  if (!feats.has(name)) throw new Error(`district not found in source: ${name}`);
}

const served = Object.fromEntries(
  SERVED.map(([key, name]) => [key, toPath(feats.get(name).geometry, EPS, MIN_AREA)]),
);

/* Frame: the served districts' bbox, padded, then widened to 4:3 about its own
   centre so the rendered SVG never letterboxes inside the card. */
let [minX, minY, maxX, maxY] = SERVED.reduce(
  (acc, [, name]) => {
    const b = bbox(feats.get(name).geometry);
    return [Math.min(acc[0], b[0]), Math.min(acc[1], b[1]), Math.max(acc[2], b[2]), Math.max(acc[3], b[3])];
  },
  [Infinity, Infinity, -Infinity, -Infinity],
);
const padX = (maxX - minX) * 0.05;
const padY = (maxY - minY) * 0.05;
minX -= padX; maxX += padX; minY -= padY; maxY += padY;
let w = maxX - minX;
let h = maxY - minY;
const TARGET = 4 / 3;
if (w / h < TARGET) { const nw = h * TARGET; minX -= (nw - w) / 2; w = nw; }
else { const nh = w / TARGET; minY -= (nh - h) / 2; h = nh; }

const keep = CONTEXT.filter((name) => {
  const f = feats.get(name);
  if (!f) return false;
  const [bx0, by0, bx1, by1] = bbox(f.geometry);
  return bx1 >= minX && bx0 <= minX + w && by1 >= minY && by0 <= minY + h;
});
const context = keep.map((n) => toPath(feats.get(n).geometry, EPS * 5, MIN_AREA * 10)).join('');

const ts = `/**
 * Real geographic geometry for the coverage map.
 *
 * These are actual administrative boundaries, not an illustration: geoBoundaries
 * IND ADM2 (2023 build), simplified with Ramer-Douglas-Peucker at ~350 m and
 * re-projected. Source data (c) geoBoundaries, https://www.geoboundaries.org,
 * CC BY 4.0; the underlying boundaries are ODbL. The credit rendered under the
 * map satisfies both licences - do not remove it.
 *
 * GENERATED FILE - rebuild with \`node scripts/build-coverage-map.mjs\` rather
 * than editing these path strings by hand.
 *
 * Projection: local equirectangular, x = lon * cos(${LAT0}), y = -lat. Faithful
 * to shape at this latitude, and cheap enough to run inline for the markers -
 * so the polygons and the markers can never fall out of register.
 */

/** cos(lat0) - the longitude correction baked into every coordinate below. */
const LON_SCALE = ${K.toFixed(10)};

const MIN_X = ${f4(minX)};
const MIN_Y = ${f4(minY)};
const WIDTH = ${f4(w)};
const HEIGHT = ${f4(h)};

export const MAP_VIEWBOX = \`\${MIN_X} \${MIN_Y} \${WIDTH} \${HEIGHT}\`;

/** Hairline widths in projected units, so strokes hold at any rendered size. */
export const MAP_HAIRLINE = ${(w / 620).toFixed(6)};
export const MAP_BORDER = ${(w / 340).toFixed(6)};

/**
 * A real lon/lat as a percentage of the frame — the markers are positioned as
 * HTML so they can carry the site's own type and hover styles, and this is what
 * keeps them registered against the SVG underneath.
 */
export function toFrame(lon: number, lat: number) {
  return {
    left: ((lon * LON_SCALE - MIN_X) / WIDTH) * 100,
    top: ((-lat - MIN_Y) / HEIGHT) * 100,
  };
}

/** Neighbouring districts, drawn faintly so the served area sits in a real map. */
export const CONTEXT_PATH =
  "${context}";

/** The three districts the service actually covers, keyed as in \`serviceAreas\`. */
export const DISTRICT_PATHS: Record<string, string> = {
${Object.entries(served).map(([k, v]) => `  ${k}:\n    "${v}",`).join('\n')}
};
`;

await fs.writeFile(OUT, ts, 'utf8');
console.log(`${OUT}  ${(ts.length / 1024).toFixed(1)}KB`);
console.log(`  viewBox    ${f4(minX)} ${f4(minY)} ${f4(w)} ${f4(h)}`);
console.log(`  served     ${Object.entries(served).map(([k, v]) => `${k}=${v.split('L').length - 1}pts`).join('  ')}`);
console.log(`  context    ${keep.length} districts, ${context.split('L').length - 1} pts`);
