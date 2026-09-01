import * as THREE from "three";
import type { TubeAlong } from "@/lib/softbody/peristalsis";
import type { GutHealth } from "@/lib/softbody/gut-health";

const _v = new THREE.Vector3();
const _n = new THREE.Vector3();
const _side = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _axisY = new THREE.Vector3(0, 1, 0);
const _look = new THREE.Vector3();
const _down = new THREE.Vector3(0, -1, 0);
const _xA = new THREE.Vector3();
const _zA = new THREE.Vector3();
const _mat = new THREE.Matrix4();

const BLADE_LEN = 0.248;
const HOVER = 0.075;
const SQUEEZE_MAX = 0.013;
const MAX_PEN = 0.185;
const BLADE_RAD = 0.016;
const HIT_EVERY = 0.2;
const MAX_CONE = THREE.MathUtils.degToRad(30);

export class BayonetPlay {
  readonly root = new THREE.Group();
  readonly wounds = new THREE.Group();
  hasEntry = false;
  punctured = false;
  enabled = false;
  squeeze = 0;
  penetration = 0;
  rawPen = 0;
  punctureEvent = false;
  bladeLen = BLADE_LEN;
  readonly entry = new THREE.Vector3();
  readonly entryNormal = new THREE.Vector3(0, 0, 1);
  readonly restAxis = new THREE.Vector3(0, 0, -1);
  readonly handle = new THREE.Vector3();
  readonly tip = new THREE.Vector3();
  readonly dir = new THREE.Vector3(0, 0, -1);
  readonly edgeWorld = new THREE.Vector3(0, -1, 0);
  private tubes: TubeAlong[] = [];
  private knife: THREE.Object3D | null = null;
  private marker: THREE.Mesh | null = null;
  private woundTex: THREE.CanvasTexture | null = null;
  private hitAcc = 0;
  private autoPhase: "idle" | "in" | "hold" | "out" = "idle";
  private holdT = 0;
  private pumpT = 0;
  autoReleased = false;

  attach(src: THREE.Object3D, tubes: TubeAlong[]) {
    this.root.clear();
    this.wounds.clear();
    this.tubes = tubes;
    const prepared = prepareBayonet(src);
    this.bladeLen = prepared.len;
    this.knife = prepared.root;
    this.knife.visible = true;
    this.root.add(prepared.root);

    const markerGeo = new THREE.RingGeometry(0.012, 0.02, 28);
    const markerMat = new THREE.MeshBasicMaterial({
      color: "#c45a4a",
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: false,
    });
    this.marker = new THREE.Mesh(markerGeo, markerMat);
    this.marker.frustumCulled = false;
    this.marker.renderOrder = 14;
    this.marker.raycast = () => {};
    this.marker.visible = false;
    this.root.add(this.marker);

    this.root.visible = false;
    this.loadWoundAtlas();
    this.reset();
  }

  private loadWoundAtlas() {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, c.width, c.height);
      const p = data.data;
      for (let i = 0; i < p.length; i += 4) {
        const m = Math.max(p[i]!, p[i + 1]!, p[i + 2]!);
        p[i + 3] = m < 10 ? 0 : m < 36 ? ((m - 10) / 26) * 255 : 255;
      }
      ctx.putImageData(data, 0, 0);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.needsUpdate = true;
      this.woundTex = tex;
    };
    img.src = "/textures/wounds.png";
  }

  pick(point: THREE.Vector3, normal: THREE.Vector3) {
    this.hasEntry = true;
    this.punctured = false;
    this.punctureEvent = false;
    this.squeeze = 0;
    this.penetration = 0;
    this.rawPen = -HOVER;
    this.hitAcc = 0;
    this.autoPhase = "idle";
    this.holdT = 0;
    this.pumpT = 0;
    this.autoReleased = false;
    this.entry.copy(point);
    this.entryNormal.copy(normal).normalize();
    if (this.entryNormal.lengthSq() < 1e-6) this.entryNormal.set(0, 0, 1);
    this.restAxis.copy(this.entryNormal).multiplyScalar(-1);
    this.dir.copy(this.restAxis);
    const dist = this.bladeLen - this.rawPen;
    this.handle.copy(this.entry).addScaledVector(this.dir, -dist);
    this.layout();
    this.updateContact();
    this.root.visible = this.enabled;
  }

  beginAuto() {
    if (!this.hasEntry) return;
    this.autoPhase = "in";
    this.holdT = 0;
    this.autoReleased = false;
  }

  releaseEntry() {
    this.hasEntry = false;
    this.punctured = false;
    this.punctureEvent = false;
    this.squeeze = 0;
    this.penetration = 0;
    this.rawPen = -HOVER;
    this.hitAcc = 0;
    this.autoPhase = "idle";
    this.root.visible = false;
    if (this.marker) this.marker.visible = false;
  }

  get isAuto() {
    return this.autoPhase !== "idle";
  }

  dragTo(to: THREE.Vector3) {
    if (!this.enabled || !this.hasEntry) return;
    this.autoPhase = "idle";
    _v.copy(this.entry).sub(to);
    const len = _v.length();
    if (len < 1e-5) return;
    _v.normalize();
    clampDirToCone(_v, this.restAxis, MAX_CONE);
    this.dir.copy(_v);
    const intended = this.bladeLen - len;
    if (!this.punctured && intended >= SQUEEZE_MAX * 0.92) {
      this.punctured = true;
      this.punctureEvent = true;
      this.spawnWound();
    }
    const maxPen = this.punctured ? MAX_PEN : SQUEEZE_MAX;
    const minDist = Math.max(0.04, this.bladeLen - maxPen);
    const maxDist = this.bladeLen + HOVER + 0.08;
    const d = THREE.MathUtils.clamp(len, minDist, maxDist);
    this.handle.copy(this.entry).addScaledVector(this.dir, -d);
    this.layout();
    this.updateContact();
  }

  pen01() {
    return THREE.MathUtils.clamp((this.rawPen + HOVER) / (MAX_PEN + HOVER), 0, 1);
  }

  setPen01(t: number) {
    if (!this.hasEntry) return;
    const u = THREE.MathUtils.clamp(t, 0, 1);
    this.rawPen = -HOVER + u * (MAX_PEN + HOVER);
    const dist = this.bladeLen - this.rawPen;
    this.handle.copy(this.entry).addScaledVector(this.dir, -dist);
    this.layout();
    this.updateContact();
  }

  setRawPen(pen: number) {
    this.setPen01((THREE.MathUtils.clamp(pen, -HOVER, MAX_PEN) + HOVER) / (MAX_PEN + HOVER));
  }

  adjustDepth(delta01: number) {
    this.setPen01(this.pen01() + delta01);
    return this.pen01();
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    this.root.visible = on && this.hasEntry;
    if (!on) {
      this.hitAcc = 0;
    }
  }

  reset() {
    this.releaseEntry();
    this.autoReleased = false;
    this.pumpT = 0;
    while (this.wounds.children.length) {
      const ch = this.wounds.children[0]!;
      this.wounds.remove(ch);
      const mesh = ch as THREE.Mesh;
      mesh.geometry?.dispose();
      const mat = mesh.material;
      if (mat && !Array.isArray(mat)) {
        (mat as THREE.Material).dispose();
      }
    }
  }

  consumeAutoReleased() {
    if (!this.autoReleased) return false;
    this.autoReleased = false;
    return true;
  }

  consumePunctureEvent() {
    if (!this.punctureEvent) return false;
    this.punctureEvent = false;
    return true;
  }

  squeezeTarget() {
    if (!this.enabled || !this.hasEntry || this.rawPen <= 0.0008) return null;
    const depth = this.punctured
      ? Math.min(0.018, 0.008 + this.penetration * 0.04)
      : Math.min(SQUEEZE_MAX, this.rawPen);
    _n.copy(this.entry).addScaledVector(this.dir, depth);
    return {
      gx: this.entry.x,
      gy: this.entry.y,
      gz: this.entry.z,
      tx: _n.x,
      ty: _n.y,
      tz: _n.z,
      radius: this.punctured ? 0.055 : 0.07,
    };
  }

  apply(dt: number, gut: number, health: GutHealth, opts?: { auto?: boolean; pump?: boolean; grabbing?: boolean }) {
    if (!this.enabled) return;
    const grabbing = opts?.grabbing ?? false;
    const pump = opts?.pump ?? false;
    if (this.hasEntry && !grabbing) {
      if (pump) {
        this.autoPhase = "idle";
        this.pumpT += dt * 2.35;
        const u = 0.5 - 0.5 * Math.cos(this.pumpT);
        this.setPen01(0.16 + 0.8 * u);
      } else if (this.autoPhase === "in") {
        const t = Math.min(1, this.pen01() + dt * 1.7);
        this.setPen01(t);
        if (t >= 0.94) {
          this.autoPhase = "hold";
          this.holdT = 0;
        }
      } else if (this.autoPhase === "hold") {
        this.holdT += dt;
        if (this.holdT > 0.16) this.autoPhase = "out";
      } else if (this.autoPhase === "out") {
        const t = Math.max(0, this.pen01() - dt * 1.5);
        this.setPen01(t);
        if (t <= 0.02) {
          this.releaseEntry();
          this.autoReleased = true;
        }
      }
    }
    if (!this.hasEntry) return;
    this.updateContact();
    this.layout();
    if (this.punctured && this.penetration > 0.012) {
      this.deformGuts(gut);
      this.hitAcc += dt;
      if (this.hitAcc >= HIT_EVERY) {
        this.hitAcc = 0;
        this.cutGuts(health);
      }
    }
  }

  private updateContact() {
    const dist = this.handle.distanceTo(this.entry);
    this.rawPen = this.bladeLen - dist;
    this.squeeze = THREE.MathUtils.clamp(this.rawPen / SQUEEZE_MAX, 0, 1);
    if (!this.punctured && this.rawPen >= SQUEEZE_MAX * 0.92) {
      this.punctured = true;
      this.punctureEvent = true;
      this.spawnWound();
    }
    this.penetration = this.punctured ? Math.max(0, this.rawPen) : 0;
  }

  private layout() {
    this.tip.copy(this.handle).addScaledVector(this.dir, this.bladeLen);
    if (this.knife) {
      this.knife.position.copy(this.handle);
      this.orientBladeDown();
    }
    if (this.marker) {
      this.marker.visible = this.hasEntry && !this.punctured;
      this.marker.position.copy(this.entry).addScaledVector(this.entryNormal, 0.002);
      _look.copy(this.entry).add(this.entryNormal);
      this.marker.lookAt(_look);
    }
    this.layoutWounds();
  }

  private orientBladeDown() {
    if (!this.knife) return;
    _xA.crossVectors(this.dir, _down);
    if (_xA.lengthSq() < 1e-8) _xA.set(1, 0, 0);
    else _xA.normalize();
    _zA.crossVectors(_xA, this.dir).normalize();
    if (_zA.y > 0) {
      _xA.negate();
      _zA.negate();
    }
    this.edgeWorld.copy(_zA);
    _mat.makeBasis(_xA, this.dir, _zA);
    this.knife.quaternion.setFromRotationMatrix(_mat);
  }

  private layoutWounds() {
    for (const obj of this.wounds.children) {
      const mesh = obj as THREE.Mesh;
      const entry = mesh.userData.entry as THREE.Vector3 | undefined;
      const normal = mesh.userData.normal as THREE.Vector3 | undefined;
      if (!entry || !normal) continue;
      mesh.position.copy(entry).addScaledVector(normal, 0.0016);
      _look.copy(mesh.position).add(normal);
      mesh.lookAt(_look);
      mesh.rotateZ((mesh.userData.twist as number) ?? 0);
    }
  }

  private spawnWound() {
    const tile = (Math.random() * 4) | 0;
    const col = tile & 1;
    const row = tile >> 1;
    const u0 = col * 0.5 + 0.018;
    const v0 = (1 - row) * 0.5 + 0.018;
    const uSpan = 0.464;
    const vSpan = 0.464;
    const geo = new THREE.PlaneGeometry(0.05, 0.082);
    const uv = geo.getAttribute("uv") as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, u0 + uv.getX(i) * uSpan, v0 + uv.getY(i) * vSpan);
    }
    uv.needsUpdate = true;
    const mat = new THREE.MeshBasicMaterial({
      map: this.woundTex,
      color: this.woundTex ? "#ffd8d0" : "#b42318",
      transparent: true,
      opacity: 1,
      depthWrite: false,
      depthTest: true,
      polygonOffset: true,
      polygonOffsetFactor: -6,
      polygonOffsetUnits: -6,
      toneMapped: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData.twist = (Math.random() - 0.5) * 0.55;
    mesh.userData.entry = this.entry.clone();
    mesh.userData.normal = this.entryNormal.clone();
    mesh.userData.dir = this.dir.clone();
    mesh.frustumCulled = false;
    mesh.renderOrder = 18;
    mesh.raycast = () => {};
    this.wounds.add(mesh);
    this.layoutWounds();
  }

  private deformGuts(gut = 1) {
    const reach = this.penetration + 0.012;
    if (reach < 0.01) return;
    const ax = this.entry.x;
    const ay = this.entry.y;
    const az = this.entry.z;
    const dx = this.dir.x;
    const dy = this.dir.y;
    const dz = this.dir.z;
    const rad = BLADE_RAD * (0.7 + gut * 0.55);
    const mix = 0.88 * THREE.MathUtils.clamp(gut, 0.2, 2);
    for (const tube of this.tubes) {
      const { positions, count } = tube;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const px = positions[i3]!;
        const py = positions[i3 + 1]!;
        const pz = positions[i3 + 2]!;
        const vx = px - ax;
        const vy = py - ay;
        const vz = pz - az;
        const s = THREE.MathUtils.clamp(vx * dx + vy * dy + vz * dz, -0.012, reach);
        const w = 1 - THREE.MathUtils.smoothstep(reach - 0.008, reach + 0.04, s);
        if (w < 0.02) continue;
        const cx = ax + dx * s;
        const cy = ay + dy * s;
        const cz = az + dz * s;
        let ox = px - cx;
        let oy = py - cy;
        let oz = pz - cz;
        const len = Math.hypot(ox, oy, oz);
        const want = rad + 0.006 * w;
        if (len > 1e-5) {
          if (len >= want) continue;
          const k = want / len;
          ox *= k;
          oy *= k;
          oz *= k;
        } else {
          ox = want;
          oy = 0;
          oz = 0;
        }
        const m = w * mix;
        positions[i3] = px + (cx + ox - px) * m;
        positions[i3 + 1] = py + (cy + oy - py) * m;
        positions[i3 + 2] = pz + (cz + oz - pz) * m;
      }
    }
  }

  private cutGuts(health: GutHealth) {
    const n = 3;
    for (let i = 1; i <= n; i++) {
      const t = (this.penetration * i) / (n + 0.2);
      _v.copy(this.entry).addScaledVector(this.dir, t);
      health.hit(_v.x, _v.y, _v.z, 0.22 + this.penetration * 0.4, 0.22);
    }
  }
}

function clampDirToCone(dir: THREE.Vector3, axis: THREE.Vector3, maxAng: number) {
  _side.copy(axis).normalize();
  dir.normalize();
  const dot = THREE.MathUtils.clamp(_side.dot(dir), -1, 1);
  const ang = Math.acos(dot);
  if (ang <= maxAng || ang < 1e-6) return dir;
  _n.copy(_side).cross(dir);
  if (_n.lengthSq() < 1e-10) {
    dir.copy(_side);
    return dir;
  }
  _n.normalize();
  _q.setFromAxisAngle(_n, maxAng);
  dir.copy(_side).applyQuaternion(_q);
  return dir;
}

function prepareBayonet(src: THREE.Object3D) {
  const holder = new THREE.Group();
  const clone = src.clone(true);
  clone.updateMatrixWorld(true);
  let srcMesh: THREE.Mesh | null = null;
  clone.traverse((obj) => {
    const m = obj as THREE.Mesh;
    if (m.isMesh && m.geometry && !srcMesh) srcMesh = m;
  });
  if (!srcMesh) {
    return { root: holder, len: BLADE_LEN };
  }
  const srcM = srcMesh as THREE.Mesh;
  srcM.updateWorldMatrix(true, false);
  const geo = srcM.geometry.clone();
  geo.applyMatrix4(srcM.matrixWorld);
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const arr = pos.array as Float32Array;
  const count = pos.count;

  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;
  for (let i = 0; i < count; i++) {
    const x = arr[i * 3]!;
    const y = arr[i * 3 + 1]!;
    const z = arr[i * 3 + 2]!;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (z < minZ) minZ = z;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (z > maxZ) maxZ = z;
  }
  const sx = maxX - minX;
  const sy = maxY - minY;
  const sz = maxZ - minZ;
  const axis = sy >= sx && sy >= sz ? 1 : sz >= sx ? 2 : 0;
  const minA = axis === 0 ? minX : axis === 1 ? minY : minZ;
  const maxA = axis === 0 ? maxX : axis === 1 ? maxY : maxZ;
  const span = Math.max(1e-4, maxA - minA);

  const thick = (end: "lo" | "hi") => {
    const lo = end === "lo" ? minA : maxA - span * 0.12;
    const hi = end === "lo" ? minA + span * 0.12 : maxA;
    let r = 0;
    let n = 0;
    const cx = (minX + maxX) * 0.5;
    const cy = (minY + maxY) * 0.5;
    const cz = (minZ + maxZ) * 0.5;
    for (let i = 0; i < count; i++) {
      const x = arr[i * 3]!;
      const y = arr[i * 3 + 1]!;
      const z = arr[i * 3 + 2]!;
      const a = axis === 0 ? x : axis === 1 ? y : z;
      if (a < lo || a > hi) continue;
      const d =
        axis === 0
          ? Math.hypot(y - cy, z - cz)
          : axis === 1
            ? Math.hypot(x - cx, z - cz)
            : Math.hypot(x - cx, y - cy);
      r += d;
      n++;
    }
    return n > 0 ? r / n : 1;
  };
  // Thinner end is the blade tip; grip/pommel is thicker.
  const tipAtMax = thick("hi") <= thick("lo");
  const tipA = tipAtMax ? maxA : minA;
  const hdlA = tipAtMax ? minA : maxA;
  const mid = (t: number) => {
    let x = 0,
      y = 0,
      z = 0,
      n = 0;
    const lo = t - span * 0.06;
    const hi = t + span * 0.06;
    for (let i = 0; i < count; i++) {
      const px = arr[i * 3]!;
      const py = arr[i * 3 + 1]!;
      const pz = arr[i * 3 + 2]!;
      const a = axis === 0 ? px : axis === 1 ? py : pz;
      if (a < lo || a > hi) continue;
      x += px;
      y += py;
      z += pz;
      n++;
    }
    if (n < 1) {
      if (axis === 0) return new THREE.Vector3(t, (minY + maxY) * 0.5, (minZ + maxZ) * 0.5);
      if (axis === 1) return new THREE.Vector3((minX + maxX) * 0.5, t, (minZ + maxZ) * 0.5);
      return new THREE.Vector3((minX + maxX) * 0.5, (minY + maxY) * 0.5, t);
    }
    return new THREE.Vector3(x / n, y / n, z / n);
  };
  const tip = mid(tipA);
  const hdl = mid(hdlA);
  _v.copy(tip).sub(hdl);
  if (_v.lengthSq() < 1e-10) _v.set(0, 1, 0);
  _q.setFromUnitVectors(_v.normalize(), _axisY);
  const rawLen = tip.distanceTo(hdl) || span;
  const scl = BLADE_LEN / rawLen;
  for (let i = 0; i < count; i++) {
    _v.set(arr[i * 3]! - hdl.x, arr[i * 3 + 1]! - hdl.y, arr[i * 3 + 2]! - hdl.z);
    _v.applyQuaternion(_q).multiplyScalar(scl);
    arr[i * 3] = _v.x;
    arr[i * 3 + 1] = BLADE_LEN - _v.y;
    arr[i * 3 + 2] = _v.z;
  }
  const nrm = geo.getAttribute("normal") as THREE.BufferAttribute | undefined;
  if (nrm) {
    const na = nrm.array as Float32Array;
    for (let i = 0; i < nrm.count; i++) {
      _v.set(na[i * 3]!, na[i * 3 + 1]!, na[i * 3 + 2]!).applyQuaternion(_q);
      _v.y = -_v.y;
      _v.normalize();
      na[i * 3] = _v.x;
      na[i * 3 + 1] = _v.y;
      na[i * 3 + 2] = _v.z;
    }
    nrm.needsUpdate = true;
  } else {
    geo.computeVertexNormals();
  }
  pos.needsUpdate = true;
  geo.computeBoundingBox();
  geo.computeBoundingSphere();

  const matSrc = srcM.material;
  const mat = Array.isArray(matSrc) ? matSrc.map((m) => m.clone()) : matSrc.clone();
  const mats = Array.isArray(mat) ? mat : [mat];
  for (const m of mats) {
    const std = m as THREE.MeshStandardMaterial;
    if ("metalness" in std) {
      std.metalness = Math.max(std.metalness ?? 0.4, 0.35);
      std.roughness = Math.min(std.roughness ?? 0.4, 0.45);
      std.envMapIntensity = 0.85;
      std.side = THREE.DoubleSide;
    }
  }
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = 8;
  mesh.name = "bayonet";
  holder.add(mesh);
  return { root: holder, len: BLADE_LEN };
}
