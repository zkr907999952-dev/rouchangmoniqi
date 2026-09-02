import * as THREE from "three";
import type { SkinBinding } from "@/lib/softbody/soft-skeleton";

type NavelVert = {
  pos: Float32Array;
  i3: number;
  r: number;
  ux: number;
  uy: number;
  restx: number;
  resty: number;
  restz: number;
};

export type NavelMorph = {
  verts: NavelVert[];
  nx: number;
  ny: number;
  planeZ: number;
  origR: number;
};

export function buildNavelMorph(bindings: SkinBinding[], navel: THREE.Vector3): NavelMorph {
  const nx = navel.x;
  const ny = navel.y;
  const nz = navel.z;
  let ringZ = 0;
  let ringN = 0;
  for (const b of bindings) {
    const rest = b.rest;
    for (let i = 0; i < b.count; i++) {
      const dx = rest[i * 3]! - nx;
      const dy = rest[i * 3 + 1]! - ny;
      const rz = rest[i * 3 + 2]!;
      if (rz < nz - 0.04) continue;
      const r = Math.hypot(dx, dy);
      if (r > 0.012 && r < 0.028) {
        ringZ += rz;
        ringN++;
      }
    }
  }
  const planeZ = ringN > 6 ? ringZ / ringN : nz + 0.006;
  const verts: NavelVert[] = [];
  for (const b of bindings) {
    const rest = b.rest;
    for (let i = 0; i < b.count; i++) {
      const rx = rest[i * 3]!;
      const ry = rest[i * 3 + 1]!;
      const rz = rest[i * 3 + 2]!;
      if (rz < planeZ - 0.05) continue;
      const dx = rx - nx;
      const dy = ry - ny;
      const r = Math.hypot(dx, dy);
      if (r > 0.048) continue;
      const inv = r > 1e-6 ? 1 / r : 0;
      verts.push({
        pos: b.positions,
        i3: i * 3,
        r,
        ux: dx * inv,
        uy: dy * inv,
        restx: rx,
        resty: ry,
        restz: rz,
      });
    }
  }
  return { verts, nx, ny, planeZ, origR: 0.0078 };
}

export function applyNavelMorph(morph: NavelMorph, depth: number, diameter: number) {
  const d = THREE.MathUtils.clamp(depth, 0, 1);
  const dia = THREE.MathUtils.clamp(diameter, 0, 2.2);
  if (d < 0.008) return;
  const R = morph.origR + dia * 0.011;
  const D = d * 0.092;
  const cap = Math.min(R * 0.92, D * 0.38);
  const rim = R * 1.28;
  const split = 0.2;
  const { nx, ny, planeZ } = morph;

  for (const v of morph.verts) {
    if (v.r > rim) continue;
    let rad: number;
    let along: number;
    if (v.r <= R) {
      const s = v.r / R;
      if (s < split) {
        const b = s / split;
        const th = b * Math.PI * 0.5;
        rad = R * Math.sin(th);
        along = D - cap * (1 - Math.cos(th));
      } else {
        const w = (s - split) / (1 - split);
        rad = R;
        along = (D - cap) * (1 - w);
      }
    } else {
      const fade = 1 - (v.r - R) / (rim - R);
      const s = fade * fade * (3 - 2 * fade);
      rad = v.r;
      along = 0;
      const tx = nx + v.ux * rad;
      const ty = ny + v.uy * rad;
      const tz = planeZ - along;
      v.pos[v.i3] += (tx - v.restx) * s * 0.18;
      v.pos[v.i3 + 1] += (ty - v.resty) * s * 0.18;
      v.pos[v.i3 + 2] += (tz - v.restz) * s * 0.18;
      continue;
    }
    if (v.r < 1e-6) {
      rad = 0;
      along = D;
    }
    const tx = nx + v.ux * rad;
    const ty = ny + v.uy * rad;
    const tz = planeZ - along;
    v.pos[v.i3] += tx - v.restx;
    v.pos[v.i3 + 1] += ty - v.resty;
    v.pos[v.i3 + 2] += tz - v.restz;
  }
}
