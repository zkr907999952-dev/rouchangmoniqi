import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { B as MathUtils, Ct as Vector2, H as Mesh, K as MeshStandardMaterial, R as MOUSE, Tt as Vector4, U as MeshBasicMaterial, V as Matrix4, W as MeshLambertMaterial, _ as Euler, _t as SphereGeometry, bt as TOUCH, d as BufferGeometry, dt as RingGeometry, f as CanvasTexture, ft as SRGBColorSpace, g as DynamicDrawUsage, i as useThree, j as LineSegments, k as LineBasicMaterial, l as Box3, lt as Ray, m as Color, n as Canvas, nt as PlaneGeometry, p as ClampToEdgeWrapping, r as useFrame, rt as PointLight, st as Quaternion, t as OrbitControls, tt as Plane, u as BufferAttribute, vt as Spherical, wt as Vector3, y as Group } from "../_libs/@react-three/drei+[...].mjs";
import { n as SkeletonUtils } from "../_libs/three-stdlib.mjs";
import { n as useStudio, r as SoftSkeleton } from "./routes-CgjXBDin.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scene-rDu4aqis.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function addEdge(adj, slot, a, b, len) {
	if (a === b) return;
	const i = slot.n++;
	adj.next[i] = adj.head[a];
	adj.to[i] = b;
	adj.w[i] = len;
	adj.head[a] = i;
}
function buildAdj(rest, count, index) {
	const nTri = index ? index.length / 3 | 0 : count / 3 | 0;
	const maxE = nTri * 6 + 8;
	const adj = {
		head: new Int32Array(count).fill(-1),
		next: new Int32Array(maxE),
		to: new Int32Array(maxE),
		w: new Float32Array(maxE)
	};
	const slot = { n: 0 };
	const edge = (a, b) => {
		if (a >= count || b >= count) return;
		const dx = rest[a * 3] - rest[b * 3];
		const dy = rest[a * 3 + 1] - rest[b * 3 + 1];
		const dz = rest[a * 3 + 2] - rest[b * 3 + 2];
		addEdge(adj, slot, a, b, Math.hypot(dx, dy, dz));
	};
	for (let t = 0; t < nTri; t++) {
		const a = index ? index[t * 3] : t * 3;
		const b = index ? index[t * 3 + 1] : t * 3 + 1;
		const c = index ? index[t * 3 + 2] : t * 3 + 2;
		edge(a, b);
		edge(b, a);
		edge(b, c);
		edge(c, b);
		edge(c, a);
		edge(a, c);
	}
	return adj;
}
var MinHeap = class {
	i;
	d;
	n = 0;
	constructor(cap) {
		this.i = new Int32Array(cap);
		this.d = new Float32Array(cap);
	}
	push(i, d) {
		if (this.n >= this.i.length) {
			const cap = this.i.length * 2;
			const ni = new Int32Array(cap);
			const nd = new Float32Array(cap);
			ni.set(this.i);
			nd.set(this.d);
			this.i = ni;
			this.d = nd;
		}
		let n = this.n++;
		const ii = this.i;
		const dd = this.d;
		ii[n] = i;
		dd[n] = d;
		while (n > 0) {
			const p = n - 1 >> 1;
			if (dd[p] <= dd[n]) break;
			const ti = ii[p];
			const td = dd[p];
			ii[p] = ii[n];
			dd[p] = dd[n];
			ii[n] = ti;
			dd[n] = td;
			n = p;
		}
	}
	pop() {
		const ii = this.i;
		const dd = this.d;
		const i0 = ii[0];
		const d0 = dd[0];
		const last = --this.n;
		if (last > 0) {
			ii[0] = ii[last];
			dd[0] = dd[last];
			let n = 0;
			while (true) {
				const l = n * 2 + 1;
				if (l >= last) break;
				const r = l + 1;
				const c = r < last && dd[r] < dd[l] ? r : l;
				if (dd[n] <= dd[c]) break;
				const ti = ii[n];
				const td = dd[n];
				ii[n] = ii[c];
				dd[n] = dd[c];
				ii[c] = ti;
				dd[c] = td;
				n = c;
			}
		}
		return {
			i: i0,
			d: d0
		};
	}
};
function dijkstra(start, count, adj, dist, heap) {
	dist.fill(0xe8d4a51000);
	dist[start] = 0;
	heap.n = 0;
	heap.push(start, 0);
	while (heap.n > 0) {
		const { i: v, d: dv } = heap.pop();
		if (dv > dist[v] + 1e-8) continue;
		for (let e = adj.head[v]; e !== -1; e = adj.next[e]) {
			const u = adj.to[e];
			const nd = dv + adj.w[e];
			if (nd < dist[u]) {
				dist[u] = nd;
				heap.push(u, nd);
			}
		}
	}
}
function smoothField(field, count, adj, iters) {
	const tmp = new Float32Array(count);
	for (let k = 0; k < iters; k++) {
		for (let i = 0; i < count; i++) {
			let s = field[i];
			let n = 1;
			for (let e = adj.head[i]; e !== -1; e = adj.next[e]) {
				s += field[adj.to[e]];
				n++;
			}
			tmp[i] = s / n;
		}
		field.set(tmp);
	}
}
function fillAlong(rest, count, along, seen, seed, adj, dist, heap) {
	dijkstra(seed, count, adj, dist, heap);
	let rectum = -1;
	let yMin = Infinity;
	let visited = 0;
	for (let i = 0; i < count; i++) {
		if (dist[i] > 1e11) continue;
		visited++;
		const y = rest[i * 3 + 1];
		if (y < yMin) {
			yMin = y;
			rectum = i;
		}
	}
	if (visited < 12 || rectum < 0) {
		seen[seed] = 1;
		along[seed] = 0;
		return;
	}
	dijkstra(rectum, count, adj, dist, heap);
	let prox = rectum;
	let maxD = -1;
	for (let i = 0; i < count; i++) {
		if (dist[i] > 1e11) continue;
		if (dist[i] > maxD) {
			maxD = dist[i];
			prox = i;
		}
	}
	dijkstra(prox, count, adj, dist, heap);
	let length = 0;
	for (let i = 0; i < count; i++) {
		if (dist[i] > 1e11) continue;
		if (dist[i] > length) length = dist[i];
	}
	const inv = 1 / Math.max(1e-5, length);
	for (let i = 0; i < count; i++) {
		if (dist[i] > 1e11) continue;
		seen[i] = 1;
		along[i] = Math.min(1, dist[i] * inv);
	}
}
function computeAlong(rest, count, geometry, adj) {
	const along = new Float32Array(count);
	const dist = new Float32Array(count);
	const heap = new MinHeap(Math.max(64, count * 2));
	const seen = new Uint8Array(count);
	for (let i = 0; i < count; i++) {
		if (seen[i]) continue;
		fillAlong(rest, count, along, seen, i, adj, dist, heap);
	}
	smoothField(along, count, adj, 10);
	let lo = 1;
	let hi = 0;
	for (let i = 0; i < count; i++) {
		if (!seen[i]) continue;
		if (along[i] < lo) lo = along[i];
		if (along[i] > hi) hi = along[i];
	}
	const inv = 1 / Math.max(1e-5, hi - lo);
	for (let i = 0; i < count; i++) along[i] = seen[i] ? (along[i] - lo) * inv : .5;
	return along;
}
function computeRadial(rest, along, count, adj) {
	const bins = 96;
	const cx = new Float32Array(bins);
	const cy = new Float32Array(bins);
	const cz = new Float32Array(bins);
	const cn = new Float32Array(bins);
	for (let i = 0; i < count; i++) {
		const b = Math.min(95, Math.max(0, along[i] * bins | 0));
		cx[b] += rest[i * 3];
		cy[b] += rest[i * 3 + 1];
		cz[b] += rest[i * 3 + 2];
		cn[b] += 1;
	}
	for (let b = 0; b < bins; b++) {
		const n = cn[b];
		if (n < 1) continue;
		cx[b] /= n;
		cy[b] /= n;
		cz[b] /= n;
	}
	for (let b = 1; b < bins; b++) {
		if (cn[b] >= 6) continue;
		cx[b] = cx[b - 1];
		cy[b] = cy[b - 1];
		cz[b] = cz[b - 1];
		cn[b] = cn[b - 1];
	}
	const rad = new Float32Array(count * 3);
	for (let i = 0; i < count; i++) {
		const u = along[i] * 95;
		const b = Math.min(94, Math.max(0, u | 0));
		const f = u - b;
		const mx = cx[b] * (1 - f) + cx[b + 1] * f;
		const my = cy[b] * (1 - f) + cy[b + 1] * f;
		const mz = cz[b] * (1 - f) + cz[b + 1] * f;
		let rx = rest[i * 3] - mx;
		let ry = rest[i * 3 + 1] - my;
		let rz = rest[i * 3 + 2] - mz;
		const len = Math.hypot(rx, ry, rz);
		if (len > .022) {
			const s = .022 / len;
			rx *= s;
			ry *= s;
			rz *= s;
		}
		rad[i * 3] = rx;
		rad[i * 3 + 1] = ry;
		rad[i * 3 + 2] = rz;
	}
	const tmp = new Float32Array(count * 3);
	for (let k = 0; k < 6; k++) {
		for (let i = 0; i < count; i++) {
			let sx = rad[i * 3];
			let sy = rad[i * 3 + 1];
			let sz = rad[i * 3 + 2];
			let n = 1;
			for (let e = adj.head[i]; e !== -1; e = adj.next[e]) {
				const j = adj.to[e];
				sx += rad[j * 3];
				sy += rad[j * 3 + 1];
				sz += rad[j * 3 + 2];
				n++;
			}
			tmp[i * 3] = sx / n;
			tmp[i * 3 + 1] = sy / n;
			tmp[i * 3 + 2] = sz / n;
		}
		rad.set(tmp);
	}
	return rad;
}
function lobe(frac, width) {
	const d = Math.min(frac, 1 - frac);
	const t = 1 - Math.min(1, d / Math.max(1e-4, width));
	return t * t * (3 - 2 * t);
}
function pulse(along, time, amp, speed) {
	const n = 1.55;
	const sp = .03 + speed * .2;
	let p = along * n - time * sp * n;
	p -= Math.floor(p);
	const perist = lobe(p, .34);
	let p2 = along * .85 - time * sp * .55;
	p2 -= Math.floor(p2);
	const perist2 = lobe(p2, .42);
	const haustra = .5 + .5 * Math.sin(along * 12 * Math.PI - time * (.45 + speed * .9));
	const mix = .5 + .5 * Math.sin(along * 7 * Math.PI + time * (.25 + speed * .5));
	const hs = haustra * haustra * (3 - 2 * haustra);
	const ms = mix * mix * (3 - 2 * mix);
	const seg = hs * .45 + ms * .25;
	return (perist * .62 + perist2 * .28 + seg * .18) * (.16 + amp * .42);
}
var GutPeristalsis = class {
	tubes = [];
	getTubes() {
		return this.tubes;
	}
	attach(root) {
		this.tubes.length = 0;
		root.traverse((obj) => {
			const mesh = obj;
			if (!mesh.isMesh || !mesh.geometry) return;
			const pos = mesh.geometry.getAttribute("position");
			if (!pos || !(pos.array instanceof Float32Array) || pos.count < 24) return;
			const rest = new Float32Array(pos.array);
			const idx = mesh.geometry.getIndex();
			const adj = buildAdj(rest, pos.count, idx ? idx.array : null);
			const along = computeAlong(rest, pos.count, mesh.geometry, adj);
			const rad = computeRadial(rest, along, pos.count, adj);
			pos.setUsage(DynamicDrawUsage);
			this.tubes.push({
				positions: pos.array,
				along,
				rad,
				count: pos.count
			});
		});
	}
	apply(time, amp = .3, speed = .5) {
		const a = MathUtils.clamp(amp, 0, 1);
		const s = MathUtils.clamp(speed, 0, 1);
		for (const tube of this.tubes) {
			const { positions, along, rad, count } = tube;
			for (let i = 0; i < count; i++) {
				const k = pulse(along[i], time, a, s);
				const i3 = i * 3;
				positions[i3] -= rad[i3] * k;
				positions[i3 + 1] -= rad[i3 + 1] * k;
				positions[i3 + 2] -= rad[i3 + 2] * k;
			}
		}
	}
};
var BellyStrike = class {
	waves = [];
	tubes = [];
	attach(root) {
		this.tubes.length = 0;
		root.traverse((obj) => {
			const mesh = obj;
			if (!mesh.isMesh || !mesh.geometry) return;
			const pos = mesh.geometry.getAttribute("position");
			if (!pos || !(pos.array instanceof Float32Array) || pos.count < 24) return;
			this.tubes.push({
				positions: pos.array,
				count: pos.count
			});
		});
	}
	get active() {
		return this.waves.length > 0;
	}
	fire(x, y, z, force, range) {
		this.waves.push({
			x,
			y,
			z,
			t: 0,
			force: MathUtils.clamp(force, .08, 1),
			range: MathUtils.clamp(range, .05, 1)
		});
		if (this.waves.length > 4) this.waves.shift();
	}
	step(dt) {
		const d = Math.min(dt, .05);
		for (const w of this.waves) w.t += d;
		this.waves = this.waves.filter((w) => w.t < 3.6);
	}
	apply(rebound = .58) {
		if (!this.waves.length) return;
		const rec = 1.05 + (1 - MathUtils.clamp(rebound, 0, 1)) * 2.4;
		const decay = .28 + rebound * .85;
		for (const tube of this.tubes) {
			const { positions, count } = tube;
			for (let i = 0; i < count; i++) {
				const i3 = i * 3;
				let px = positions[i3];
				let py = positions[i3 + 1];
				let pz = positions[i3 + 2];
				for (const w of this.waves) {
					const dx = px - w.x;
					const dy = py - w.y;
					const r = Math.hypot(dx, dy);
					const span = .055 + w.range * .13;
					const ringR = w.t * (.18 + w.range * .15);
					const width = .03 + w.range * .024;
					const life = Math.max(0, 1 - w.t / rec);
					const fade = life * life * (3 - 2 * life);
					const ring = Math.exp(-((r - ringR) / width) * ((r - ringR) / width));
					const hole = Math.exp(-(r * r) / (span * span * .55)) * Math.exp(-w.t * decay);
					const amp = w.force * fade;
					const inv = r < 1e-4 ? 0 : 1 / r;
					const push = amp * (.03 * ring + .026 * hole);
					const crush = amp * (.062 * hole + .018 * ring);
					px += dx * inv * push;
					py += dy * inv * push * .7;
					pz -= crush;
				}
				positions[i3] = px;
				positions[i3 + 1] = py;
				positions[i3 + 2] = pz;
			}
		}
	}
	ringRadius() {
		const w = this.waves[this.waves.length - 1];
		if (!w) return 0;
		return w.t * (.2 + w.range * .16);
	}
	ringOpacity() {
		const w = this.waves[this.waves.length - 1];
		if (!w) return 0;
		return Math.max(0, 1 - w.t / 1.2) * .85 * w.force;
	}
	lastOrigin(out) {
		const w = this.waves[this.waves.length - 1];
		if (!w) {
			out.set(0, 0, 0);
			return false;
		}
		out.set(w.x, w.y, w.z);
		return true;
	}
};
var GutHealth = class {
	hp = (/* @__PURE__ */ new Float32Array(40)).fill(1);
	cx = /* @__PURE__ */ new Float32Array(40);
	cy = /* @__PURE__ */ new Float32Array(40);
	cz = /* @__PURE__ */ new Float32Array(40);
	bars;
	parts = [];
	fills = [];
	dirty = true;
	n = /* @__PURE__ */ new Float32Array(40);
	constructor() {
		this.bars = new Group();
		this.bars.visible = false;
		const trackMat = new MeshBasicMaterial({
			color: "#1a1f1c",
			depthTest: false,
			transparent: true,
			opacity: .7
		});
		const fillMat = new MeshBasicMaterial({
			color: "#3dcc6e",
			depthTest: false,
			transparent: true,
			opacity: .95
		});
		const trackGeo = new PlaneGeometry(1, 1);
		const fillGeo = new PlaneGeometry(1, 1);
		fillGeo.translate(.5, 0, 0);
		for (let i = 0; i < 40; i++) {
			const g = new Group();
			const track = new Mesh(trackGeo, trackMat);
			track.scale.set(.05, .007, 1);
			track.renderOrder = 40;
			track.frustumCulled = false;
			const fill = new Mesh(fillGeo, fillMat);
			fill.position.x = -.025;
			fill.scale.set(.05, .0055, 1);
			fill.renderOrder = 41;
			fill.frustumCulled = false;
			g.add(track);
			g.add(fill);
			this.fills.push(fill);
			this.bars.add(g);
		}
	}
	attach(root, tubes) {
		this.parts.length = 0;
		let k = 0;
		root.traverse((obj) => {
			const mesh = obj;
			if (!mesh.isMesh || !mesh.geometry) return;
			const pos = mesh.geometry.getAttribute("position");
			if (!pos || !(pos.array instanceof Float32Array) || pos.count < 24) return;
			const tube = tubes[k++];
			if (!tube) return;
			let color = mesh.geometry.getAttribute("color");
			if (!color || !(color.array instanceof Float32Array) || color.count !== pos.count) {
				color = new BufferAttribute(new Float32Array(pos.count * 3).fill(1), 3);
				mesh.geometry.setAttribute("color", color);
			}
			color.setUsage(DynamicDrawUsage);
			const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
			for (const raw of mats) {
				const m = raw;
				if (m) {
					m.vertexColors = true;
					m.needsUpdate = true;
				}
			}
			const seg = new Uint8Array(pos.count);
			this.parts.push({
				positions: pos.array,
				along: tube.along,
				colors: color.array,
				colorAttr: color,
				seg,
				count: pos.count
			});
		});
		this.assignSegments();
		this.recomputeCenters();
		this.dirty = true;
		this.applyColor();
	}
	assignSegments() {
		if (this.parts.length >= 2) {
			const order = this.parts.map((p, i) => ({
				i,
				n: p.count
			})).sort((a, b) => b.n - a.n);
			const small = this.parts[order[0].i];
			const colon = this.parts[order[1].i];
			fillSeg(small.seg, small.along, 0, 30);
			fillSeg(colon.seg, colon.along, 30, 10);
			for (let i = 2; i < order.length; i++) fillSeg(this.parts[order[i].i].seg, this.parts[order[i].i].along, 30, 10);
			return;
		}
		for (const p of this.parts) for (let i = 0; i < p.count; i++) {
			const u = p.along[i];
			if (u < .75) p.seg[i] = Math.min(29, u / .75 * 30) | 0;
			else p.seg[i] = 30 + Math.min(9, (u - .75) / .25 * 10) | 0;
		}
	}
	recomputeCenters() {
		this.cx.fill(0);
		this.cy.fill(0);
		this.cz.fill(0);
		this.n.fill(0);
		for (const p of this.parts) for (let i = 0; i < p.count; i++) {
			const s = p.seg[i];
			const i3 = i * 3;
			this.cx[s] += p.positions[i3];
			this.cy[s] += p.positions[i3 + 1];
			this.cz[s] += p.positions[i3 + 2];
			this.n[s] += 1;
		}
		for (let s = 0; s < 40; s++) {
			const n = Math.max(1, this.n[s]);
			this.cx[s] /= n;
			this.cy[s] /= n;
			this.cz[s] /= n;
		}
	}
	hit(x, y, z, force, range) {
		let best = 0;
		let bd = Infinity;
		for (let i = 0; i < 40; i++) {
			if (this.n[i] < 1) continue;
			const d = Math.hypot(this.cx[i] - x, this.cy[i] - y, this.cz[i] - z);
			if (d < bd) {
				bd = d;
				best = i;
			}
		}
		const rad = .035 + range * .07;
		const dmg = .16 + force * .48;
		for (let i = 0; i < 40; i++) {
			if (this.n[i] < 1) continue;
			const d = Math.hypot(this.cx[i] - x, this.cy[i] - y, this.cz[i] - z);
			const adj = (i === best - 1 || i === best + 1) && sameOrgan(i, best) ? .4 : 0;
			const fall = i === best ? 1 : Math.max(adj, Math.exp(-(d * d) / (rad * rad)) * .45);
			if (fall < .08) continue;
			this.hp[i] = Math.max(0, this.hp[i] - dmg * fall);
		}
		this.dirty = true;
	}
	reset() {
		this.hp.fill(1);
		this.dirty = true;
	}
	applyColor() {
		if (!this.dirty) return;
		for (const p of this.parts) {
			for (let i = 0; i < p.count; i++) {
				const hurt = 1 - this.hp[p.seg[i]];
				const i3 = i * 3;
				p.colors[i3] = 1;
				p.colors[i3 + 1] = 1 - hurt * .88;
				p.colors[i3 + 2] = 1 - hurt * .9;
			}
			p.colorAttr.needsUpdate = true;
		}
		this.dirty = false;
	}
	updateBars(camera, visible) {
		this.bars.visible = visible;
		if (!visible) return;
		this.recomputeCenters();
		camera.getWorldDirection(_dir);
		for (let i = 0; i < 40; i++) {
			const g = this.bars.children[i];
			if (this.n[i] < 4) {
				g.visible = false;
				continue;
			}
			g.visible = true;
			g.position.set(this.cx[i], this.cy[i], this.cz[i]);
			g.position.addScaledVector(_dir, -.03);
			g.lookAt(camera.position);
			this.fills[i].scale.x = .05 * Math.max(.02, this.hp[i]);
		}
	}
};
var _dir = new Vector3();
function fillSeg(seg, along, offset, n) {
	for (let i = 0; i < seg.length; i++) seg[i] = offset + Math.min(n - 1, along[i] * n) | 0;
}
function sameOrgan(a, b) {
	return a < 30 === b < 30;
}
var _v$1 = new Vector3();
var _n$1 = new Vector3();
var _q$1 = new Quaternion();
var _axisY$1 = new Vector3(0, 1, 0);
var _side$1 = new Vector3();
var _bin = new Vector3();
var MIN_PITCH = .3;
var MAX_PITCH = 1.22;
var FistPlay = class {
	root = new Group();
	depth = .018;
	enabled = false;
	anus = new Vector3();
	tip = new Vector3();
	dir = new Vector3(0, .85, .5);
	entry = new Vector3(0, .85, .5);
	mid = new Vector3();
	baseDir = new Vector3(0, .85, .5);
	baseDepth = .018;
	thrustPhase = 0;
	stirPhase = 0;
	arousal = 0;
	colon = null;
	armPos = null;
	armRest = null;
	armCount = 0;
	armLen = .38;
	yMin = .7;
	yMax = 1.15;
	maxScale = 1;
	wallZ = .1;
	slices = [];
	attach(arm, tubes, rectumHint) {
		this.root.clear();
		this.colon = pickColon(tubes);
		this.anus.copy(rectumHint);
		this.entry.copy(entryFromColon(this.colon, rectumHint));
		this.dir.copy(this.entry);
		this.anus.addScaledVector(this.entry, .01);
		const prepared = prepareArm(arm);
		this.armLen = prepared.len;
		this.armPos = prepared.pos;
		this.armRest = prepared.rest;
		this.armCount = prepared.count;
		this.root.add(prepared.root);
		this.root.visible = false;
		this.reset();
		this.layoutArm();
	}
	setEnvelope(yMin, yMax, slices) {
		this.yMin = yMin;
		this.yMax = yMax;
		this.slices = slices;
		this.clampLateral();
		this.baseDir.copy(this.dir);
		this.baseDepth = this.depth;
		this.layoutArm();
	}
	setMid(navel) {
		this.mid.copy(navel);
		this.wallZ = navel.z - .004;
	}
	wallOver() {
		const palm = Math.max(.01, this.depth - .038);
		const fz = this.anus.z + this.dir.z * palm;
		const along = (this.wallZ - fz) / Math.max(.18, this.dir.z);
		return Math.max(0, .058 - along);
	}
	setMaxScale(scale) {
		this.maxScale = MathUtils.clamp(scale, .5, 1.5);
		this.depth = Math.min(this.depth, this.reach());
		this.baseDepth = Math.min(this.baseDepth, this.reach());
	}
	reach() {
		return this.armLen * .86 * this.maxScale;
	}
	reset() {
		this.depth = .018;
		this.dir.copy(this.entry);
		this.baseDir.copy(this.entry);
		this.baseDepth = .018;
		this.thrustPhase = 0;
		this.stirPhase = 0;
		this.arousal = 0;
		this.tip.copy(this.anus).addScaledVector(this.dir, this.depth);
	}
	setEnabled(on) {
		if (this.enabled === on) {
			this.root.visible = on;
			return;
		}
		this.enabled = on;
		this.root.visible = on;
		if (!on) this.reset();
		else this.layoutArm();
	}
	dragTo(_from, to) {
		if (!this.enabled) return;
		_v$1.copy(to).sub(this.anus);
		const inward = _v$1.dot(this.entry);
		const len = _v$1.length();
		if (len < 1e-5) return;
		if (inward > .004) {
			this.dir.copy(_v$1).normalize();
			this.clampPitch();
			this.depth = MathUtils.clamp(len, .012, this.reach());
		} else {
			this.depth = Math.max(.012, this.depth + inward);
			_n$1.copy(_v$1).addScaledVector(this.entry, -inward);
			if (_n$1.lengthSq() > 1e-8) {
				this.dir.addScaledVector(_n$1.normalize(), .28).normalize();
				this.clampPitch();
			}
		}
		this.clampLateral();
		this.baseDir.copy(this.dir);
		this.baseDepth = this.depth;
	}
	halfXAt(y) {
		const sl = this.slices;
		if (sl.length === 0) return .08;
		if (y <= sl[0].y) return sl[0].halfX;
		const last = sl[sl.length - 1];
		if (y >= last.y) return last.halfX;
		for (let i = 1; i < sl.length; i++) {
			const a = sl[i - 1];
			const b = sl[i];
			if (y > b.y) continue;
			const t = (y - a.y) / Math.max(1e-5, b.y - a.y);
			return a.halfX + (b.halfX - a.halfX) * t;
		}
		return last.halfX;
	}
	clampPitch() {
		const pitch = Math.atan2(Math.max(0, this.dir.z), Math.max(.04, this.dir.y));
		const p = MathUtils.clamp(pitch, MIN_PITCH, MAX_PITCH);
		const xz = this.dir.x;
		this.dir.y = Math.cos(p);
		this.dir.z = Math.sin(p);
		this.dir.x = xz;
		this.dir.normalize();
	}
	clampLateral() {
		this.clampPitch();
		const fy = MathUtils.clamp(this.anus.y + this.dir.y * this.depth, this.yMin, this.yMax);
		const half = Math.max(.03, this.halfXAt(fy) * .72);
		const fx = MathUtils.clamp(this.anus.x + this.dir.x * this.depth, -half, half);
		const fz = Math.max(this.anus.z + .01, this.anus.z + this.dir.z * this.depth);
		_v$1.set(fx - this.anus.x, fy - this.anus.y, fz - this.anus.z);
		const len = _v$1.length();
		if (len < 1e-5) return;
		this.dir.copy(_v$1).normalize();
		this.clampPitch();
		this.depth = MathUtils.clamp(len, .012, this.reach());
	}
	step(dt, opts) {
		if (!this.enabled) {
			this.arousal += (0 - this.arousal) * (1 - Math.exp(-2.1 * dt));
			return;
		}
		this.dir.copy(this.baseDir);
		this.depth = this.baseDepth;
		if (opts.thrust) {
			this.thrustPhase += dt * (.35 + opts.thrustSpeed * 1.7);
			const wave = .5 - .5 * Math.cos(this.thrustPhase);
			const start = MathUtils.clamp(opts.thrustStart, .012, Math.max(.014, this.baseDepth - .004));
			this.depth = start + (this.baseDepth - start) * wave;
		}
		if (opts.stir) {
			this.stirPhase += dt * (.45 + opts.stirSpeed * 2.5);
			const r = .005 + opts.stirRadius * .034;
			_side$1.crossVectors(this.dir, _axisY$1);
			if (_side$1.lengthSq() < 1e-6) _side$1.set(1, 0, 0);
			_side$1.normalize();
			_bin.crossVectors(this.dir, _side$1).normalize();
			const c = Math.cos(this.stirPhase);
			const s = Math.sin(this.stirPhase);
			const fx = this.anus.x + this.dir.x * this.depth + (_side$1.x * c + _bin.x * s) * r;
			const fy = this.anus.y + this.dir.y * this.depth + (_side$1.y * c + _bin.y * s) * r;
			const fz = this.anus.z + this.dir.z * this.depth + (_side$1.z * c + _bin.z * s) * r;
			_v$1.set(fx - this.anus.x, fy - this.anus.y, fz - this.anus.z);
			const len = _v$1.length();
			if (len > 1e-5) {
				this.dir.copy(_v$1).normalize();
				this.clampPitch();
				this.depth = MathUtils.clamp(len, .012, this.reach());
			}
		}
		const inBody = this.depth > .042;
		let want = 0;
		if (inBody) {
			want = .48 + MathUtils.clamp((this.depth - .042) / .2, 0, 1) * .4;
			if (opts.thrust) want = Math.min(1, want + .18);
			if (opts.stir) want = Math.min(1, want + .32);
		}
		const k = want > this.arousal ? 2.6 : 1.7;
		this.arousal += (want - this.arousal) * (1 - Math.exp(-k * dt));
	}
	apply(gut = 1, keepPose = false) {
		if (!this.enabled) return;
		if (!keepPose) {
			this.dir.copy(this.baseDir);
			this.depth = this.baseDepth;
			this.clampLateral();
			this.baseDir.copy(this.dir);
			this.baseDepth = this.depth;
		}
		this.layoutArm();
		this.deformColon(gut);
	}
	belly() {
		if (!this.enabled || this.depth < .025) return {
			depth: 0,
			start: 0,
			x: this.anus.x,
			y: this.anus.y,
			z: this.anus.z,
			lx: 0,
			lz: 0
		};
		return {
			depth: this.wallOver(),
			start: 0,
			x: this.tip.x,
			y: this.tip.y,
			z: this.tip.z,
			lx: this.dir.x - this.entry.x,
			lz: this.dir.z - this.entry.z
		};
	}
	layoutArm() {
		if (!this.armPos || !this.armRest) return;
		_q$1.setFromUnitVectors(_axisY$1, this.dir);
		const fx = this.anus.x + this.dir.x * this.depth;
		const fy = this.anus.y + this.dir.y * this.depth;
		const fz = this.anus.z + this.dir.z * this.depth;
		this.tip.set(fx, fy, fz);
		const rest = this.armRest;
		const arr = this.armPos.array;
		for (let i = 0; i < this.armCount; i++) {
			const i3 = i * 3;
			_v$1.set(rest[i3], rest[i3 + 1], rest[i3 + 2]);
			_v$1.applyQuaternion(_q$1);
			arr[i3] = _v$1.x + fx;
			arr[i3 + 1] = _v$1.y + fy;
			arr[i3 + 2] = _v$1.z + fz;
		}
		this.armPos.needsUpdate = true;
		let sx = 0;
		let sy = 0;
		let sz = 0;
		let n = 0;
		for (let i = 0; i < this.armCount; i++) {
			const ry = rest[i * 3 + 1];
			if (ry > -.018 || ry < -.1) continue;
			const i3 = i * 3;
			sx += arr[i3];
			sy += arr[i3 + 1];
			sz += arr[i3 + 2];
			n++;
		}
		if (n > 8) {
			this.tip.set(sx / n, sy / n, sz / n);
			this.tip.addScaledVector(this.dir, -.028);
		} else {
			this.tip.set(fx, fy, fz);
			this.tip.addScaledVector(this.dir, -.045);
		}
	}
	deformColon(gut = 1) {
		const tube = this.colon;
		if (!tube || this.depth < .02) return;
		const { positions, count } = tube;
		const ax = this.anus.x;
		const ay = this.anus.y;
		const az = this.anus.z;
		const dx = this.dir.x;
		const dy = this.dir.y;
		const dz = this.dir.z;
		const reach = this.depth;
		const rad = .018 * (.55 + gut * .7);
		const mix = .9 * MathUtils.clamp(gut, 0, 2);
		for (let i = 0; i < count; i++) {
			const i3 = i * 3;
			const px = positions[i3];
			const py = positions[i3 + 1];
			const pz = positions[i3 + 2];
			const vx = px - ax;
			const vy = py - ay;
			const vz = pz - az;
			const s = MathUtils.clamp(vx * dx + vy * dy + vz * dz, 0, reach);
			const w = 1 - MathUtils.smoothstep(reach - .01, reach + .05, s);
			if (w < .02) continue;
			const cx = ax + dx * s;
			const cy = ay + dy * s;
			const cz = az + dz * s;
			let ox = px - cx;
			let oy = py - cy;
			let oz = pz - cz;
			const len = Math.hypot(ox, oy, oz);
			const want = rad + .01 * w;
			if (len > 1e-5) {
				const k = Math.max(len, want) / len;
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
};
function entryFromColon(tube, hint) {
	const d = new Vector3(0, .82, .47);
	if (!tube) return d.normalize();
	let x = 0;
	let y = 0;
	let z = 0;
	let n = 0;
	for (let i = 0; i < tube.count; i++) {
		if (tube.along[i] < .88) continue;
		x += tube.positions[i * 3];
		y += tube.positions[i * 3 + 1];
		z += tube.positions[i * 3 + 2];
		n++;
	}
	if (n < 6) return d.normalize();
	d.set(x / n - hint.x, y / n - hint.y, z / n - hint.z);
	if (d.lengthSq() < 1e-6) d.set(0, .82, .47);
	return d.normalize();
}
function pickColon(tubes) {
	if (tubes.length === 0) return null;
	let best = null;
	let bestY = Infinity;
	for (const t of tubes) {
		let y = 0;
		let n = 0;
		for (let i = 0; i < t.count; i++) {
			if (t.along[i] < .9) continue;
			y += t.positions[i * 3 + 1];
			n++;
		}
		if (n < 8) continue;
		y /= n;
		if (y < bestY) {
			bestY = y;
			best = t;
		}
	}
	if (best) return best;
	const order = tubes.map((t, i) => ({
		i,
		n: t.count
	})).sort((a, b) => b.n - a.n);
	return tubes[order[Math.min(1, order.length - 1)].i] ?? tubes[0];
}
function prepareArm(src) {
	const holder = new Group();
	const clone = src.clone(true);
	clone.updateMatrixWorld(true);
	let srcMesh = null;
	clone.traverse((obj) => {
		const m = obj;
		if (m.isMesh) srcMesh = m;
	});
	if (!srcMesh) return {
		root: holder,
		pos: null,
		rest: null,
		count: 0,
		len: .38
	};
	const srcM = srcMesh;
	srcM.updateWorldMatrix(true, false);
	const geo = srcM.geometry.clone();
	const pos = geo.getAttribute("position");
	const arr = pos.array;
	const count = pos.count;
	for (let i = 0; i < count; i++) {
		_v$1.fromBufferAttribute(pos, i).applyMatrix4(srcM.matrixWorld);
		arr[i * 3] = _v$1.x;
		arr[i * 3 + 1] = _v$1.y;
		arr[i * 3 + 2] = _v$1.z;
	}
	let yMin = Infinity;
	let yMax = -Infinity;
	for (let i = 0; i < count; i++) {
		const y = arr[i * 3 + 1];
		if (y < yMin) yMin = y;
		if (y > yMax) yMax = y;
	}
	const span = Math.max(1e-4, yMax - yMin);
	let fistX = 0;
	let fistY = 0;
	let fistZ = 0;
	let fistN = 0;
	let stumpX = 0;
	let stumpY = 0;
	let stumpZ = 0;
	let stumpN = 0;
	for (let i = 0; i < count; i++) {
		const y = arr[i * 3 + 1];
		if (y > yMax - span * .08) {
			fistX += arr[i * 3];
			fistY += y;
			fistZ += arr[i * 3 + 2];
			fistN++;
		}
		if (y < yMin + span * .08) {
			stumpX += arr[i * 3];
			stumpY += y;
			stumpZ += arr[i * 3 + 2];
			stumpN++;
		}
	}
	fistX /= Math.max(1, fistN);
	fistY /= Math.max(1, fistN);
	fistZ /= Math.max(1, fistN);
	stumpX /= Math.max(1, stumpN);
	stumpY /= Math.max(1, stumpN);
	stumpZ /= Math.max(1, stumpN);
	_v$1.set(stumpX - fistX, stumpY - fistY, stumpZ - fistZ);
	if (_v$1.lengthSq() < 1e-8) _v$1.set(0, -1, 0);
	_q$1.setFromUnitVectors(_v$1.normalize(), new Vector3(0, -1, 0));
	const targetLen = .38;
	const scl = targetLen / (Math.hypot(stumpX - fistX, stumpY - fistY, stumpZ - fistZ) || span);
	for (let i = 0; i < count; i++) {
		_v$1.set(arr[i * 3] - fistX, arr[i * 3 + 1] - fistY, arr[i * 3 + 2] - fistZ);
		_v$1.applyQuaternion(_q$1).multiplyScalar(scl);
		arr[i * 3] = _v$1.x;
		arr[i * 3 + 1] = _v$1.y;
		arr[i * 3 + 2] = _v$1.z;
	}
	geo.computeVertexNormals();
	pos.needsUpdate = true;
	pos.setUsage(DynamicDrawUsage);
	const mat = new MeshStandardMaterial({
		color: "#c9947a",
		roughness: .52,
		metalness: .02,
		side: 2
	});
	const mesh = new Mesh(geo, mat);
	mesh.frustumCulled = false;
	mesh.renderOrder = 8;
	holder.add(mesh);
	return {
		root: holder,
		pos,
		rest: new Float32Array(arr),
		count,
		len: targetLen
	};
}
var _v = new Vector3();
var _n = new Vector3();
var _side = new Vector3();
var _q = new Quaternion();
var _axisY = new Vector3(0, 1, 0);
var _look = new Vector3();
var _down = new Vector3(0, -1, 0);
var _xA = new Vector3();
var _zA = new Vector3();
var _mat = new Matrix4();
var _t = new Vector3();
var _b = new Vector3();
var SHORT_TOTAL = .248;
var LONG_TOTAL = .42;
var HOVER = .075;
var SQUEEZE_MAX = .013;
var BLADE_RAD = .016;
var HIT_EVERY = .2;
var MAX_CONE = MathUtils.degToRad(30);
var BayonetPlay = class {
	root = new Group();
	wounds = new Group();
	hasEntry = false;
	punctured = false;
	enabled = false;
	squeeze = 0;
	penetration = 0;
	rawPen = 0;
	punctureEvent = false;
	kind = "short";
	bladeLen = SHORT_TOTAL * .6;
	totalLen = SHORT_TOTAL;
	maxPen = SHORT_TOTAL * .6;
	entry = new Vector3();
	entryNormal = new Vector3(0, 0, 1);
	restAxis = new Vector3(0, 0, -1);
	handle = new Vector3();
	tip = new Vector3();
	dir = new Vector3(0, 0, -1);
	edgeWorld = new Vector3(0, -1, 0);
	tubes = [];
	knife = null;
	knifeShort = null;
	knifeLong = null;
	shortStats = {
		totalLen: SHORT_TOTAL,
		bladeLen: SHORT_TOTAL * .6
	};
	longStats = {
		totalLen: LONG_TOTAL,
		bladeLen: LONG_TOTAL * .75
	};
	marker = null;
	woundTex = null;
	patches = [];
	skinMeshes = [];
	xray = {
		y0: .92,
		y1: 1.18,
		xMax: .12,
		zFront: .1
	};
	skinHit = null;
	skinFace = -1;
	xrayValue = 0;
	hitAcc = 0;
	autoPhase = "idle";
	holdT = 0;
	pumpT = 0;
	autoReleased = false;
	attach(shortSrc, tubes, longSrc) {
		this.root.clear();
		this.wounds.clear();
		this.patches = [];
		this.skinHit = null;
		this.skinFace = -1;
		this.tubes = tubes;
		const preparedShort = prepareBayonet(shortSrc, SHORT_TOTAL);
		this.knifeShort = preparedShort.root;
		this.shortStats = {
			totalLen: preparedShort.totalLen,
			bladeLen: preparedShort.bladeLen
		};
		this.root.add(preparedShort.root);
		if (longSrc) {
			const preparedLong = prepareBayonet(longSrc, LONG_TOTAL);
			this.knifeLong = preparedLong.root;
			this.longStats = {
				totalLen: preparedLong.totalLen,
				bladeLen: preparedLong.bladeLen
			};
			preparedLong.root.visible = false;
			this.root.add(preparedLong.root);
		} else this.knifeLong = null;
		this.knife = this.knifeShort;
		this.kind = "short";
		this.totalLen = this.shortStats.totalLen;
		this.bladeLen = this.shortStats.bladeLen;
		this.maxPen = this.bladeLen * .97;
		const markerGeo = new RingGeometry(.012, .02, 28);
		const markerMat = new MeshBasicMaterial({
			color: "#c45a4a",
			transparent: true,
			opacity: .9,
			side: 2,
			depthTest: true,
			depthWrite: false
		});
		this.marker = new Mesh(markerGeo, markerMat);
		this.marker.frustumCulled = false;
		this.marker.renderOrder = 14;
		this.marker.raycast = () => {};
		this.marker.visible = false;
		this.root.add(this.marker);
		this.root.visible = false;
		this.loadWoundAtlas();
		this.reset();
	}
	setSkin(meshes, xray) {
		this.skinMeshes = meshes;
		this.xray = xray;
	}
	setKind(kind) {
		if (kind === this.kind && this.knife) return;
		if (kind === "long" && !this.knifeLong) kind = "short";
		this.kind = kind;
		const stats = kind === "long" ? this.longStats : this.shortStats;
		this.totalLen = stats.totalLen;
		this.bladeLen = stats.bladeLen;
		this.maxPen = this.bladeLen * .97;
		if (this.knifeShort) this.knifeShort.visible = kind === "short";
		if (this.knifeLong) this.knifeLong.visible = kind === "long";
		this.knife = kind === "long" ? this.knifeLong : this.knifeShort;
		if (this.hasEntry) {
			this.rawPen = MathUtils.clamp(this.rawPen, -.075, this.maxPen);
			this.handle.copy(this.entry).addScaledVector(this.dir, -(this.totalLen - this.rawPen));
			this.layout();
			this.updateContact();
		}
	}
	loadWoundAtlas() {
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
				const m = Math.max(p[i], p[i + 1], p[i + 2]);
				p[i + 3] = m < 10 ? 0 : m < 36 ? (m - 10) / 26 * 255 : 255;
			}
			ctx.putImageData(data, 0, 0);
			const tex = new CanvasTexture(c);
			tex.colorSpace = SRGBColorSpace;
			tex.wrapS = ClampToEdgeWrapping;
			tex.wrapT = ClampToEdgeWrapping;
			tex.needsUpdate = true;
			this.woundTex = tex;
		};
		img.src = "/textures/wounds.png";
	}
	pick(point, normal, mesh, faceIndex) {
		this.hasEntry = true;
		this.punctured = false;
		this.punctureEvent = false;
		this.squeeze = 0;
		this.penetration = 0;
		this.rawPen = -.075;
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
		this.skinHit = mesh ?? null;
		this.skinFace = faceIndex ?? -1;
		const dist = this.totalLen - this.rawPen;
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
		this.rawPen = -.075;
		this.hitAcc = 0;
		this.autoPhase = "idle";
		this.root.visible = false;
		if (this.marker) this.marker.visible = false;
	}
	get isAuto() {
		return this.autoPhase !== "idle";
	}
	dragTo(to) {
		if (!this.enabled || !this.hasEntry) return;
		this.autoPhase = "idle";
		_v.copy(this.entry).sub(to);
		const len = _v.length();
		if (len < 1e-5) return;
		_v.normalize();
		clampDirToCone(_v, this.restAxis, MAX_CONE);
		this.dir.copy(_v);
		const intended = this.totalLen - len;
		if (!this.punctured && intended >= SQUEEZE_MAX * .92) {
			this.punctured = true;
			this.punctureEvent = true;
			this.spawnWound();
		}
		const maxPen = this.punctured ? this.maxPen : SQUEEZE_MAX;
		const minDist = Math.max(.04, this.totalLen - maxPen);
		const maxDist = this.totalLen + HOVER + .08;
		const d = MathUtils.clamp(len, minDist, maxDist);
		this.handle.copy(this.entry).addScaledVector(this.dir, -d);
		this.layout();
		this.updateContact();
	}
	pen01() {
		return MathUtils.clamp((this.rawPen + HOVER) / (this.maxPen + HOVER), 0, 1);
	}
	setPen01(t) {
		if (!this.hasEntry) return;
		const u = MathUtils.clamp(t, 0, 1);
		this.rawPen = -.075 + u * (this.maxPen + HOVER);
		this.handle.copy(this.entry).addScaledVector(this.dir, -(this.totalLen - this.rawPen));
		this.layout();
		this.updateContact();
	}
	setRawPen(pen) {
		this.setPen01((MathUtils.clamp(pen, -.075, this.maxPen) + HOVER) / (this.maxPen + HOVER));
	}
	adjustDepth(delta01) {
		this.setPen01(this.pen01() + delta01);
		return this.pen01();
	}
	setEnabled(on) {
		this.enabled = on;
		this.root.visible = on && this.hasEntry;
		if (!on) this.hitAcc = 0;
	}
	reset() {
		this.releaseEntry();
		this.autoReleased = false;
		this.pumpT = 0;
		this.clearWounds();
	}
	clearWounds() {
		this.patches = [];
		while (this.wounds.children.length) {
			const ch = this.wounds.children[0];
			this.wounds.remove(ch);
			const mesh = ch;
			mesh.geometry?.dispose();
			const mat = mesh.material;
			if (mat && !Array.isArray(mat)) mat.dispose();
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
		if (!this.enabled || !this.hasEntry || this.rawPen <= 8e-4) return null;
		const depth = this.punctured ? Math.min(.018, .008 + this.penetration * .04) : Math.min(SQUEEZE_MAX, this.rawPen);
		_n.copy(this.entry).addScaledVector(this.dir, depth);
		return {
			gx: this.entry.x,
			gy: this.entry.y,
			gz: this.entry.z,
			tx: _n.x,
			ty: _n.y,
			tz: _n.z,
			radius: this.punctured ? .055 : .07
		};
	}
	apply(dt, gut, health, opts) {
		if (!this.enabled) return;
		const grabbing = opts?.grabbing ?? false;
		const pump = opts?.pump ?? false;
		if (this.hasEntry && !grabbing) {
			if (pump) {
				this.autoPhase = "idle";
				this.pumpT += dt * 2.35;
				const u = .5 - .5 * Math.cos(this.pumpT);
				this.setPen01(.16 + .8 * u);
			} else if (this.autoPhase === "in") {
				const t = Math.min(1, this.pen01() + dt * 1.7);
				this.setPen01(t);
				if (t >= .94) {
					this.autoPhase = "hold";
					this.holdT = 0;
				}
			} else if (this.autoPhase === "hold") {
				this.holdT += dt;
				if (this.holdT > .16) this.autoPhase = "out";
			} else if (this.autoPhase === "out") {
				const t = Math.max(0, this.pen01() - dt * 1.5);
				this.setPen01(t);
				if (t <= .02) {
					this.releaseEntry();
					this.autoReleased = true;
				}
			}
		}
		if (!this.hasEntry) return;
		this.updateContact();
		this.layout();
		if (this.punctured && this.penetration > .012) {
			this.deformGuts(gut);
			this.hitAcc += dt;
			if (this.hitAcc >= HIT_EVERY) {
				this.hitAcc = 0;
				this.cutGuts(health);
			}
		}
	}
	updateContact() {
		const dist = this.handle.distanceTo(this.entry);
		this.rawPen = this.totalLen - dist;
		this.squeeze = MathUtils.clamp(this.rawPen / SQUEEZE_MAX, 0, 1);
		if (!this.punctured && this.rawPen >= SQUEEZE_MAX * .92) {
			this.punctured = true;
			this.punctureEvent = true;
			this.spawnWound();
		}
		this.penetration = this.punctured ? Math.max(0, this.rawPen) : 0;
	}
	layout() {
		this.tip.copy(this.handle).addScaledVector(this.dir, this.totalLen);
		if (this.knife) {
			this.knife.position.copy(this.handle);
			this.orientBladeDown();
		}
		if (this.marker) {
			this.marker.visible = this.hasEntry && !this.punctured;
			this.marker.position.copy(this.entry).addScaledVector(this.entryNormal, .002);
			_look.copy(this.entry).add(this.entryNormal);
			this.marker.lookAt(_look);
		}
		this.layoutWounds();
	}
	orientBladeDown() {
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
	layoutWounds() {
		this.syncWounds(this.xrayValue);
	}
	syncWounds(xray) {
		this.xrayValue = xray;
		for (const patch of this.patches) {
			const src = patch.src.array;
			const dst = patch.pos.array;
			for (let i = 0; i < patch.map.length; i++) {
				const s = patch.map[i] * 3;
				const d = i * 3;
				dst[d] = src[s];
				dst[d + 1] = src[s + 1];
				dst[d + 2] = src[s + 2];
			}
			patch.pos.needsUpdate = true;
			const shader = patch.mesh.material.userData.shader;
			if (shader?.uniforms?.uXray) shader.uniforms.uXray.value = xray;
		}
	}
	spawnWound() {
		const host = this.skinHit ?? nearestSkin(this.skinMeshes, this.entry);
		if (!host) return;
		const srcPos = host.geometry.getAttribute("position");
		if (!srcPos || !(srcPos.array instanceof Float32Array)) return;
		const patch = buildSkinPatch(host, this.entry, this.entryNormal, this.dir, this.skinFace);
		if (!patch) return;
		const tile = Math.random() * 4 | 0;
		const col = tile & 1;
		const row = tile >> 1;
		const u0 = col * .5 + .02;
		const v0 = (1 - row) * .5 + .02;
		const uSpan = .46;
		const vSpan = .46;
		const twist = (Math.random() - .5) * .5;
		const cs = Math.cos(twist);
		const sn = Math.sin(twist);
		const uv = patch.geo.getAttribute("uv");
		for (let i = 0; i < uv.count; i++) {
			const lx = uv.getX(i);
			const ly = uv.getY(i);
			uv.setXY(i, lx * cs - ly * sn + .5, lx * sn + ly * cs + .5);
		}
		uv.needsUpdate = true;
		const mat = new MeshBasicMaterial({
			map: this.woundTex,
			color: this.woundTex ? "#ffd4cc" : "#b42318",
			transparent: true,
			opacity: 1,
			depthWrite: false,
			depthTest: true,
			polygonOffset: true,
			polygonOffsetFactor: -8,
			polygonOffsetUnits: -8,
			toneMapped: false,
			side: 0
		});
		const { y0, y1, xMax, zFront } = this.xray;
		mat.onBeforeCompile = (shader) => {
			shader.uniforms.uXray = { value: this.xrayValue };
			shader.uniforms.uY0 = { value: y0 };
			shader.uniforms.uY1 = { value: y1 };
			shader.uniforms.uXMax = { value: xMax };
			shader.uniforms.uZFront = { value: zFront };
			shader.uniforms.uTile = { value: new Vector4(u0, v0, uSpan, vSpan) };
			shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vBodyW;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvBodyW = (modelMatrix * vec4(transformed, 1.0)).xyz;");
			shader.fragmentShader = shader.fragmentShader.replace("#include <common>", `#include <common>
uniform float uXray; uniform float uY0; uniform float uY1; uniform float uXMax; uniform float uZFront;
uniform vec4 uTile;
varying vec3 vBodyW;
float xrayHole() {
  float band = smoothstep(uY0, uY0 + 0.08, vBodyW.y) * (1.0 - smoothstep(uY1 - 0.08, uY1, vBodyW.y));
  float torso = 1.0 - smoothstep(uXMax * 0.65, uXMax + 0.1, abs(vBodyW.x));
  float front = smoothstep(uZFront - 0.16, uZFront + 0.04, vBodyW.z);
  return clamp(band * torso * front * uXray, 0.0, 1.0);
}`).replace("#include <map_fragment>", `#ifdef USE_MAP
           if (vMapUv.x < 0.0 || vMapUv.x > 1.0 || vMapUv.y < 0.0 || vMapUv.y > 1.0) discard;
           vec4 sampledDiffuseColor = texture2D(map, uTile.xy + vMapUv * uTile.zw);
           if (sampledDiffuseColor.a < 0.08) discard;
           diffuseColor *= sampledDiffuseColor;
           #endif`).replace("#include <dithering_fragment>", `if (!gl_FrontFacing) discard;
           float hole = xrayHole();
           gl_FragColor.a *= mix(1.0, 0.06, pow(hole, 0.68));
           if (gl_FragColor.a < 0.04) discard;
           #include <dithering_fragment>`);
			mat.userData.shader = shader;
		};
		mat.needsUpdate = true;
		const mesh = new Mesh(patch.geo, mat);
		mesh.frustumCulled = false;
		mesh.renderOrder = 8;
		mesh.raycast = () => {};
		this.wounds.add(mesh);
		this.patches.push({
			mesh,
			src: srcPos,
			map: patch.map,
			pos: patch.pos
		});
		this.syncWounds(this.xrayValue);
	}
	deformGuts(gut = 1) {
		const reach = this.penetration + .012;
		if (reach < .01) return;
		const ax = this.entry.x;
		const ay = this.entry.y;
		const az = this.entry.z;
		const dx = this.dir.x;
		const dy = this.dir.y;
		const dz = this.dir.z;
		const rad = BLADE_RAD * (.7 + gut * .55);
		const mix = .88 * MathUtils.clamp(gut, .2, 2);
		for (const tube of this.tubes) {
			const { positions, count } = tube;
			for (let i = 0; i < count; i++) {
				const i3 = i * 3;
				const px = positions[i3];
				const py = positions[i3 + 1];
				const pz = positions[i3 + 2];
				const vx = px - ax;
				const vy = py - ay;
				const vz = pz - az;
				const s = MathUtils.clamp(vx * dx + vy * dy + vz * dz, -.012, reach);
				const w = 1 - MathUtils.smoothstep(reach - .008, reach + .04, s);
				if (w < .02) continue;
				const cx = ax + dx * s;
				const cy = ay + dy * s;
				const cz = az + dz * s;
				let ox = px - cx;
				let oy = py - cy;
				let oz = pz - cz;
				const len = Math.hypot(ox, oy, oz);
				const want = rad + .006 * w;
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
	cutGuts(health) {
		const n = 3;
		for (let i = 1; i <= n; i++) {
			const t = this.penetration * i / 3.2;
			_v.copy(this.entry).addScaledVector(this.dir, t);
			health.hit(_v.x, _v.y, _v.z, .22 + this.penetration * .4, .22);
		}
	}
};
function nearestSkin(meshes, point) {
	let best = null;
	let bestD = 1e9;
	for (const mesh of meshes) {
		const pos = mesh.geometry.getAttribute("position");
		if (!pos) continue;
		const arr = pos.array;
		const step = Math.max(1, Math.floor(pos.count / 4e3));
		for (let i = 0; i < pos.count; i += step) {
			const dx = arr[i * 3] - point.x;
			const dy = arr[i * 3 + 1] - point.y;
			const dz = arr[i * 3 + 2] - point.z;
			const d = dx * dx + dy * dy + dz * dz;
			if (d < bestD) {
				bestD = d;
				best = mesh;
			}
		}
	}
	return best;
}
function buildSkinPatch(mesh, center, normal, dir, faceIndex) {
	const geo = mesh.geometry;
	const pos = geo.getAttribute("position");
	const arr = pos.array;
	const index = geo.getIndex();
	const triCount = index ? index.count / 3 : Math.floor(pos.count / 3);
	const r2 = .002116;
	const faces = [];
	const vertAt = (f, k) => {
		if (index) return index.getX(f * 3 + k);
		return f * 3 + k;
	};
	const near = (vi) => {
		const d0 = arr[vi * 3] - center.x;
		const d1 = arr[vi * 3 + 1] - center.y;
		const d2 = arr[vi * 3 + 2] - center.z;
		return d0 * d0 + d1 * d1 + d2 * d2 <= r2;
	};
	if (faceIndex >= 0 && faceIndex < triCount) faces.push(faceIndex);
	for (let f = 0; f < triCount; f++) {
		if (f === faceIndex) continue;
		if (near(vertAt(f, 0)) || near(vertAt(f, 1)) || near(vertAt(f, 2))) faces.push(f);
	}
	if (faces.length < 1) return null;
	const remap = /* @__PURE__ */ new Map();
	const map = [];
	const positions = [];
	const uvs = [];
	_t.crossVectors(normal, dir);
	if (_t.lengthSq() < 1e-8) _t.crossVectors(normal, _down);
	if (_t.lengthSq() < 1e-8) _t.set(1, 0, 0);
	_t.normalize();
	_b.crossVectors(normal, _t).normalize();
	const take = (vi) => {
		let id = remap.get(vi);
		if (id !== void 0) return id;
		id = map.length;
		remap.set(vi, id);
		map.push(vi);
		const x = arr[vi * 3];
		const y = arr[vi * 3 + 1];
		const z = arr[vi * 3 + 2];
		positions.push(x, y, z);
		const dx = x - center.x;
		const dy = y - center.y;
		const dz = z - center.z;
		uvs.push((dx * _t.x + dy * _t.y + dz * _t.z) / .052, (dx * _b.x + dy * _b.y + dz * _b.z) / .084);
		return id;
	};
	const idx = [];
	for (const f of faces) idx.push(take(vertAt(f, 0)), take(vertAt(f, 1)), take(vertAt(f, 2)));
	const out = new BufferGeometry();
	const posAttr = new BufferAttribute(new Float32Array(positions), 3);
	posAttr.setUsage(DynamicDrawUsage);
	out.setAttribute("position", posAttr);
	out.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));
	out.setIndex(idx);
	out.computeVertexNormals();
	return {
		geo: out,
		map: new Int32Array(map),
		pos: posAttr
	};
}
function clampDirToCone(dir, axis, maxAng) {
	_side.copy(axis).normalize();
	dir.normalize();
	const dot = MathUtils.clamp(_side.dot(dir), -1, 1);
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
function prepareBayonet(src, totalLen) {
	const holder = new Group();
	const clone = src.clone(true);
	clone.updateMatrixWorld(true);
	let srcMesh = null;
	clone.traverse((obj) => {
		const m = obj;
		if (m.isMesh && m.geometry && !srcMesh) srcMesh = m;
	});
	if (!srcMesh) return {
		root: holder,
		totalLen,
		bladeLen: totalLen * .62
	};
	const srcM = srcMesh;
	srcM.updateWorldMatrix(true, false);
	const geo = srcM.geometry.clone();
	geo.applyMatrix4(srcM.matrixWorld);
	const pos = geo.getAttribute("position");
	const arr = pos.array;
	const count = pos.count;
	let minX = Infinity, minY = Infinity, minZ = Infinity;
	let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
	for (let i = 0; i < count; i++) {
		const x = arr[i * 3];
		const y = arr[i * 3 + 1];
		const z = arr[i * 3 + 2];
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
	const dens = (end) => {
		const lo = end === "lo" ? minA : maxA - span * .18;
		const hi = end === "lo" ? minA + span * .18 : maxA;
		let n = 0;
		for (let i = 0; i < count; i++) {
			const a = axis === 0 ? arr[i * 3] : axis === 1 ? arr[i * 3 + 1] : arr[i * 3 + 2];
			if (a >= lo && a <= hi) n++;
		}
		return n;
	};
	const tipAtMax = dens("hi") < dens("lo");
	const tipA = tipAtMax ? maxA : minA;
	const hdlA = tipAtMax ? minA : maxA;
	const mid = (t) => {
		let x = 0, y = 0, z = 0, n = 0;
		const lo = t - span * .06;
		const hi = t + span * .06;
		for (let i = 0; i < count; i++) {
			const px = arr[i * 3];
			const py = arr[i * 3 + 1];
			const pz = arr[i * 3 + 2];
			const a = axis === 0 ? px : axis === 1 ? py : pz;
			if (a < lo || a > hi) continue;
			x += px;
			y += py;
			z += pz;
			n++;
		}
		if (n < 1) {
			if (axis === 0) return new Vector3(t, (minY + maxY) * .5, (minZ + maxZ) * .5);
			if (axis === 1) return new Vector3((minX + maxX) * .5, t, (minZ + maxZ) * .5);
			return new Vector3((minX + maxX) * .5, (minY + maxY) * .5, t);
		}
		return new Vector3(x / n, y / n, z / n);
	};
	const tip = mid(tipA);
	const hdl = mid(hdlA);
	_v.copy(tip).sub(hdl);
	if (_v.lengthSq() < 1e-10) _v.set(0, 1, 0);
	_q.setFromUnitVectors(_v.normalize(), _axisY);
	const scl = totalLen / (tip.distanceTo(hdl) || span);
	for (let i = 0; i < count; i++) {
		_v.set(arr[i * 3] - hdl.x, arr[i * 3 + 1] - hdl.y, arr[i * 3 + 2] - hdl.z);
		_v.applyQuaternion(_q).multiplyScalar(scl);
		arr[i * 3] = _v.x;
		arr[i * 3 + 1] = _v.y;
		arr[i * 3 + 2] = _v.z;
	}
	const nrm = geo.getAttribute("normal");
	if (nrm) {
		const na = nrm.array;
		for (let i = 0; i < nrm.count; i++) {
			_v.set(na[i * 3], na[i * 3 + 1], na[i * 3 + 2]).applyQuaternion(_q);
			_v.normalize();
			na[i * 3] = _v.x;
			na[i * 3 + 1] = _v.y;
			na[i * 3 + 2] = _v.z;
		}
		nrm.needsUpdate = true;
	} else geo.computeVertexNormals();
	pos.needsUpdate = true;
	geo.computeBoundingBox();
	geo.computeBoundingSphere();
	const matSrc = srcM.material;
	const mat = Array.isArray(matSrc) ? matSrc.map((m) => m.clone()) : matSrc.clone();
	const mats = Array.isArray(mat) ? mat : [mat];
	for (const m of mats) {
		const std = m;
		if ("metalness" in std) {
			std.metalness = Math.max(std.metalness ?? .4, .35);
			std.roughness = Math.min(std.roughness ?? .4, .45);
			std.envMapIntensity = .85;
			std.side = 2;
		}
	}
	const mesh = new Mesh(geo, mat);
	mesh.frustumCulled = false;
	mesh.renderOrder = 8;
	mesh.name = "bayonet";
	holder.add(mesh);
	return {
		root: holder,
		totalLen,
		bladeLen: detectBladeLen(arr, count, totalLen)
	};
}
function detectBladeLen(arr, count, totalLen) {
	const bins = 40;
	const ext = new Float32Array(bins);
	const ns = new Int32Array(bins);
	for (let i = 0; i < count; i++) {
		const y = arr[i * 3 + 1];
		const b = Math.min(39, Math.max(0, Math.floor(y / Math.max(1e-4, totalLen) * bins)));
		const r = Math.hypot(arr[i * 3], arr[i * 3 + 2]);
		if (r > ext[b]) ext[b] = r;
		ns[b]++;
	}
	const samples = [];
	for (let i = 39; i >= Math.floor(bins * .55); i--) if (ns[i] > 3) samples.push(ext[i]);
	samples.sort((a, b) => a - b);
	const bladeExt = samples.length ? samples[samples.length >> 1] : .012;
	let guardBin = Math.floor(bins * .38);
	for (let i = 38; i >= 2; i--) {
		if (ns[i] < 3) continue;
		if (ext[i] > bladeExt * 1.7 && ext[i] > bladeExt + .005) {
			guardBin = i;
			break;
		}
	}
	const bladeLen = totalLen - (guardBin + .2) / bins * totalLen;
	return MathUtils.clamp(bladeLen, totalLen * .48, totalLen * .84);
}
var _hit = new Vector3();
var _normal = new Vector3();
var _target = new Vector3();
var _camDir = new Vector3();
new Vector3();
var _plane = new Plane();
var _ray = new Ray();
var _ndc = new Vector2();
var _box = new Box3();
var _size = new Vector3();
var _center = new Vector3();
var _local = new Vector3();
var TORSO_RE = /skin|dress|body|torso|outfit|cloth|top|bottom|nude|mesh/i;
var SKIP_BIND_RE = /charm|wing/i;
function meshKey(mesh) {
	const mat = mesh.material;
	const matName = mat && !Array.isArray(mat) ? mat.name : "";
	return `${mesh.name} ${mesh.parent?.name ?? ""} ${matName}`.toLowerCase();
}
function isTorsoMesh(mesh) {
	const k = meshKey(mesh);
	if (/hair|eye|mouth|charm|wing|lash|\.001/.test(k) && !/skin|dress|body/.test(k)) return false;
	return TORSO_RE.test(k);
}
function bindHint(mesh) {
	const k = meshKey(mesh);
	if (/hair|\.001/.test(k) && !/skin|dress|head|eye|mouth/.test(k)) return "hair";
	if (/eye/.test(k)) return "eye";
	if (/mouth/.test(k)) return "mouth";
	if (/head/.test(k)) return "face";
	if (/skin/.test(k)) return "legs";
	if (/dress/.test(k)) return "dress";
	if (/gut|intestin/.test(k)) return "organs";
	if (/pelvis|uterus|ovary/.test(k)) return "organs";
	return "body";
}
function shouldBind(mesh) {
	if (mesh.userData.xrayOverlay) return false;
	const k = meshKey(mesh);
	if (SKIP_BIND_RE.test(k)) return false;
	return ((mesh.geometry?.getAttribute("position"))?.count ?? 0) >= 12;
}
function findCrotch(body, height) {
	const y0 = height * .49;
	const y1 = height * .545;
	const best = new Vector3(0, height * .515, .05);
	let bestScore = -Infinity;
	body.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		if (!isTorsoMesh(mesh) && !/skin|dress/.test(meshKey(mesh))) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos) return;
		const step = Math.max(1, Math.floor(pos.count / 9e3));
		for (let i = 0; i < pos.count; i += step) {
			_local.fromBufferAttribute(pos, i);
			mesh.localToWorld(_local);
			if (_local.y < y0 || _local.y > y1) continue;
			if (Math.abs(_local.x) > .03) continue;
			const score = _local.z * 6 - Math.abs(_local.x) * 10 - (_local.y - y0) * 1.8;
			if (score > bestScore) {
				bestScore = score;
				best.copy(_local);
			}
		}
	});
	return best;
}
function findAnus(body, height, crotch) {
	const yTarget = crotch.y - .01;
	const y0 = yTarget - .03;
	const y1 = yTarget + .022;
	let zMin = crotch.z;
	body.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		if (!isTorsoMesh(mesh) && !/skin|dress/.test(meshKey(mesh))) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos) return;
		const step = Math.max(1, Math.floor(pos.count / 9e3));
		for (let i = 0; i < pos.count; i += step) {
			_local.fromBufferAttribute(pos, i);
			mesh.localToWorld(_local);
			if (_local.y < y0 || _local.y > y1) continue;
			if (Math.abs(_local.x) > .018) continue;
			if (_local.z < zMin) zMin = _local.z;
		}
	});
	const zTarget = zMin + .042;
	const best = new Vector3(0, yTarget, zTarget);
	let bestScore = -Infinity;
	body.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		if (!isTorsoMesh(mesh) && !/skin|dress/.test(meshKey(mesh))) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos) return;
		const step = Math.max(1, Math.floor(pos.count / 9e3));
		for (let i = 0; i < pos.count; i += step) {
			_local.fromBufferAttribute(pos, i);
			mesh.localToWorld(_local);
			if (_local.y < y0 || _local.y > y1) continue;
			if (Math.abs(_local.x) > .02) continue;
			if (_local.z > crotch.z - .012) continue;
			const score = -Math.abs(_local.z - zTarget) * 12 - Math.abs(_local.x) * 18 - Math.abs(_local.y - yTarget) * 5;
			if (score > bestScore) {
				bestScore = score;
				best.copy(_local);
			}
		}
	});
	best.x = 0;
	best.z += .012;
	return best;
}
function liftGutsOffUterus(gut, uterusBox) {
	const ucx = (uterusBox.min.x + uterusBox.max.x) * .5;
	const ucy = (uterusBox.min.y + uterusBox.max.y) * .5;
	const ucz = (uterusBox.min.z + uterusBox.max.z) * .5;
	const hx = Math.max(.02, (uterusBox.max.x - uterusBox.min.x) * .5 + .012);
	const hy = Math.max(.02, (uterusBox.max.y - uterusBox.min.y) * .5 + .01);
	const hz = Math.max(.02, (uterusBox.max.z - uterusBox.min.z) * .5 + .01);
	const ySurf = uterusBox.max.y + .006;
	gut.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos || !(pos.array instanceof Float32Array)) return;
		const arr = pos.array;
		for (let i = 0; i < pos.count; i++) {
			const i3 = i * 3;
			const nx = (arr[i3] - ucx) / hx;
			const ny = (arr[i3 + 1] - ucy) / hy;
			const nz = (arr[i3 + 2] - ucz) / hz;
			const d2 = nx * nx + ny * ny + nz * nz;
			if (d2 >= 1) continue;
			const s = 1.08 / Math.sqrt(Math.max(d2, 1e-6));
			arr[i3] = ucx + nx * hx * s;
			arr[i3 + 1] = Math.max(ucy + ny * hy * s, ySurf);
			arr[i3 + 2] = ucz + nz * hz * s;
		}
		pos.needsUpdate = true;
		mesh.geometry.computeBoundingBox();
	});
}
function findNavel(body, height) {
	const y0 = height * .56;
	const y1 = height * .63;
	const best = new Vector3(0, height * .59, .06);
	let bestScore = -Infinity;
	body.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		if (!isTorsoMesh(mesh)) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos) return;
		const step = Math.max(1, Math.floor(pos.count / 8e3));
		for (let i = 0; i < pos.count; i += step) {
			_local.fromBufferAttribute(pos, i);
			mesh.localToWorld(_local);
			if (_local.y < y0 || _local.y > y1) continue;
			if (Math.abs(_local.x) > .04) continue;
			const score = _local.z * 4 - Math.abs(_local.x) * 8;
			if (score > bestScore) {
				bestScore = score;
				best.copy(_local);
			}
		}
	});
	return best;
}
function collectSample(root, test, cap = 8e3) {
	const pts = [];
	root.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		if (!test(mesh)) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos) return;
		const step = Math.max(1, Math.floor(pos.count / cap));
		for (let i = 0; i < pos.count; i += step) {
			const v = new Vector3().fromBufferAttribute(pos, i);
			mesh.localToWorld(v);
			pts.push(v);
		}
	});
	return pts;
}
function pickBest(pts, pred, score, fallback) {
	let best = fallback.clone();
	let bestS = -Infinity;
	for (const p of pts) {
		if (!pred(p)) continue;
		const s = score(p);
		if (s > bestS) {
			bestS = s;
			best.copy(p);
		}
	}
	return best;
}
function sampleLandmarks(body, navel, height) {
	const lm = { navel: navel.clone() };
	const dress = collectSample(body, (m) => /dress/.test(meshKey(m)));
	const skin = collectSample(body, (m) => /skin/.test(meshKey(m)));
	const headM = collectSample(body, (m) => /head/.test(meshKey(m)) && !/hair/.test(meshKey(m)));
	const hair = collectSample(body, (m) => bindHint(m) === "hair");
	const eyes = collectSample(body, (m) => /eye/.test(meshKey(m)));
	const mouth = collectSample(body, (m) => /mouth/.test(meshKey(m)));
	const ny = navel.y;
	const avg = (pts, pred, fb) => {
		let x = 0;
		let y = 0;
		let z = 0;
		let n = 0;
		for (const p of pts) {
			if (!pred(p)) continue;
			x += p.x;
			y += p.y;
			z += p.z;
			n++;
		}
		return n ? new Vector3(x / n, y / n, z / n) : fb;
	};
	lm.head = avg(headM, () => true, new Vector3(0, height * .93, .03));
	lm.jaw = avg(mouth, () => true, new Vector3(0, lm.head.y - .04, .06));
	lm.eyeL = avg(eyes, (p) => p.x < 0, new Vector3(-.03, lm.head.y + .005, .07));
	lm.eyeR = avg(eyes, (p) => p.x >= 0, new Vector3(.03, lm.head.y + .005, .07));
	lm.neck = avg(headM, (p) => p.y < lm.head.y - .04, new Vector3(0, ny + .4, .02));
	lm.hips = avg(skin, (p) => p.y > ny - .18 && p.y < ny - .06 && Math.abs(p.x) < .12, new Vector3(0, ny - .12, .01));
	lm.spine1 = new Vector3(0, ny - .01, .02);
	lm.spine2 = new Vector3(0, ny + .1, .02);
	lm.spine3 = avg(dress, (p) => p.y > ny + .22 && p.y < ny + .32 && Math.abs(p.x) < .08, new Vector3(0, ny + .27, .02));
	lm.lBreast = pickBest(dress, (p) => p.x < -.03 && p.x > -.14 && p.y > ny + .22 && p.y < ny + .36 && p.z > .03, (p) => p.z, new Vector3(-.07, ny + .28, .09));
	lm.rBreast = pickBest(dress, (p) => p.x > .03 && p.x < .14 && p.y > ny + .22 && p.y < ny + .36 && p.z > .03, (p) => p.z, new Vector3(.07, ny + .28, .09));
	lm.lClav = pickBest(dress, (p) => p.x < -.04 && p.x > -.12 && p.y > ny + .35 && p.y < ny + .44, (p) => -Math.abs(p.z), new Vector3(-.07, ny + .39, .01));
	lm.rClav = pickBest(dress, (p) => p.x > .04 && p.x < .12 && p.y > ny + .35 && p.y < ny + .44, (p) => -Math.abs(p.z), new Vector3(.07, ny + .39, .01));
	lm.lUpper = pickBest(dress, (p) => p.x < -.12 && p.y > ny + .3 && p.y < ny + .42, (p) => -p.x, new Vector3(-.16, ny + .36, .01));
	lm.rUpper = pickBest(dress, (p) => p.x > .12 && p.y > ny + .3 && p.y < ny + .42, (p) => p.x, new Vector3(.16, ny + .36, .01));
	lm.lFore = pickBest(dress, (p) => p.x < -.18 && p.y > ny - .05 && p.y < ny + .18, (p) => -p.x - Math.abs(p.y - (ny + .06)), new Vector3(-.3, ny + .06, .02));
	lm.rFore = pickBest(dress, (p) => p.x > .18 && p.y > ny - .05 && p.y < ny + .18, (p) => p.x - Math.abs(p.y - (ny + .06)), new Vector3(.3, ny + .06, .02));
	lm.lHand = pickBest(dress, (p) => p.x < -.25 && p.y < ny - .05, (p) => -p.y - p.x * .3, new Vector3(-.42, ny - .18, .03));
	lm.rHand = pickBest(dress, (p) => p.x > .25 && p.y < ny - .05, (p) => -p.y + p.x * .3, new Vector3(.42, ny - .18, .03));
	lm.lThigh = avg(skin, (p) => p.x < -.04 && p.y > ny - .28 && p.y < ny - .12, new Vector3(-.09, ny - .2, .01));
	lm.rThigh = avg(skin, (p) => p.x > .04 && p.y > ny - .28 && p.y < ny - .12, new Vector3(.09, ny - .2, .01));
	lm.lShin = avg(skin, (p) => p.x < -.04 && p.y > .42 && p.y < .55, new Vector3(-.09, .48, .02));
	lm.rShin = avg(skin, (p) => p.x > .04 && p.y > .42 && p.y < .55, new Vector3(.09, .48, .02));
	lm.lAnkle = avg(skin, (p) => p.x < -.04 && p.y > .07 && p.y < .16, new Vector3(-.09, .1, .03));
	lm.rAnkle = avg(skin, (p) => p.x > .04 && p.y > .07 && p.y < .16, new Vector3(.09, .1, .03));
	lm.lFoot = avg(skin, (p) => p.x < -.04 && p.y < .07, new Vector3(-.09, .035, .05));
	lm.rFoot = avg(skin, (p) => p.x > .04 && p.y < .07, new Vector3(.09, .035, .05));
	lm.lToe = pickBest(skin, (p) => p.x < -.03 && p.y < .06, (p) => p.z, new Vector3(-.09, .025, .12));
	lm.rToe = pickBest(skin, (p) => p.x > .03 && p.y < .06, (p) => p.z, new Vector3(.09, .025, .12));
	const hairTop = pickBest(hair, () => true, (p) => p.y, new Vector3(0, lm.head.y + .04, -.02));
	const hairBot = pickBest(hair, () => true, (p) => -p.y, new Vector3(0, lm.head.y - .7, -.02));
	lm.hair1 = hairTop;
	lm.hair5 = hairBot;
	lm.hair2 = new Vector3(0, hairTop.y * .75 + hairBot.y * .25, hairTop.z * .7 + hairBot.z * .3);
	lm.hair3 = new Vector3(0, hairTop.y * .5 + hairBot.y * .5, hairTop.z * .45 + hairBot.z * .55);
	lm.hair4 = new Vector3(0, hairTop.y * .25 + hairBot.y * .75, hairTop.z * .25 + hairBot.z * .75);
	return lm;
}
function stripPelvicVulva(root) {
	const kill = [];
	root.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh) return;
		if (/vulve|clitoris|corpsetracines|materialcorps|materialbulbes/.test(meshKey(mesh))) kill.push(mesh);
	});
	for (const m of kill) {
		const mesh = m;
		mesh.removeFromParent();
		mesh.geometry?.dispose();
	}
}
function stubVagina(root) {
	const uterus = collectNamedBox(root, /uterus/);
	const ucx = 0;
	const ucy = uterus ? (uterus.min.y + uterus.max.y) * .5 - .02 : .92;
	const ucz = uterus ? (uterus.min.z + uterus.max.z) * .5 + .008 : .05;
	root.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		if (!/vagin/.test(meshKey(mesh))) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos || !(pos.array instanceof Float32Array)) return;
		const arr = pos.array;
		for (let i = 0; i < pos.count; i++) {
			const i3 = i * 3;
			const x = arr[i3];
			const y = arr[i3 + 1];
			const z = arr[i3 + 2];
			const d = Math.hypot(x - ucx, y - ucy, z - ucz);
			const w = MathUtils.clamp((d - .028) / .05, 0, 1);
			if (w <= 0) continue;
			arr[i3] = x + (ucx - x) * w;
			arr[i3 + 1] = y + (ucy - y) * w;
			arr[i3 + 2] = z + (ucz - z) * w;
		}
		pos.needsUpdate = true;
		mesh.geometry.computeBoundingBox();
		mesh.geometry.computeBoundingSphere();
	});
}
function bakeIntoVertices(group) {
	group.updateMatrixWorld(true);
	group.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		mesh.updateWorldMatrix(true, false);
		const geo = mesh.geometry.clone();
		geo.applyMatrix4(mesh.matrixWorld);
		mesh.geometry = geo;
		mesh.position.set(0, 0, 0);
		mesh.quaternion.identity();
		mesh.scale.set(1, 1, 1);
		mesh.matrix.identity();
		mesh.matrixWorld.identity();
	});
	group.position.set(0, 0, 0);
	group.quaternion.identity();
	group.scale.set(1, 1, 1);
	group.matrix.identity();
	group.updateMatrixWorld(true);
}
function cloneGraph(source) {
	return SkeletonUtils.clone(source);
}
function fitStanding(source, targetHeight) {
	const root = cloneGraph(source);
	root.updateMatrixWorld(true);
	_box.setFromObject(root);
	_box.getSize(_size);
	_box.getCenter(_center);
	if (_size.z > _size.x * 1.2) {
		const facePlusX = _center.x < .2;
		root.rotation.y += facePlusX ? -Math.PI / 2 : Math.PI / 2;
		root.updateMatrixWorld(true);
		_box.setFromObject(root);
		_box.getSize(_size);
		_box.getCenter(_center);
	}
	if (_size.z > _size.y * 1.25) {
		root.rotation.x += -Math.PI / 2;
		root.updateMatrixWorld(true);
		_box.setFromObject(root);
		_box.getSize(_size);
		_box.getCenter(_center);
	}
	const s = targetHeight / Math.max(_size.y, .001);
	root.scale.multiplyScalar(s);
	root.updateMatrixWorld(true);
	_box.setFromObject(root);
	_box.getSize(_size);
	_box.getCenter(_center);
	root.position.x -= _center.x;
	root.position.z -= _center.z;
	root.position.y -= _box.min.y;
	root.updateMatrixWorld(true);
	return root;
}
function flattenToWorld(source) {
	const baked = new Group();
	source.updateMatrixWorld(true);
	source.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.visible || !mesh.geometry) return;
		const geo0 = mesh.geometry.clone();
		geo0.applyMatrix4(mesh.matrixWorld);
		if (geo0.attributes.skinIndex) geo0.deleteAttribute("skinIndex");
		if (geo0.attributes.skinWeight) geo0.deleteAttribute("skinWeight");
		const mat = mesh.material;
		const out = new Mesh(geo0, mat);
		out.name = mesh.name;
		out.userData.parentName = mesh.parent?.name ?? "";
		out.userData.matName = !Array.isArray(mat) ? mat.name : "";
		out.frustumCulled = false;
		baked.add(out);
	});
	return baked;
}
function sampleBand(character, y0, y1, maxAbsX = .22) {
	const box = new Box3();
	box.makeEmpty();
	let count = 0;
	character.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		if (!isTorsoMesh(mesh)) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos) return;
		const step = Math.max(1, Math.floor(pos.count / 6e3));
		for (let i = 0; i < pos.count; i += step) {
			_local.fromBufferAttribute(pos, i);
			mesh.localToWorld(_local);
			if (_local.y < y0 || _local.y > y1) continue;
			if (Math.abs(_local.x) > maxAbsX) continue;
			box.expandByPoint(_local);
			count++;
		}
	});
	return {
		box,
		count
	};
}
function sliceWidths(root, y0, y1, bands = 8) {
	const dy = (y1 - y0) / bands;
	const out = Array.from({ length: bands }, (_, i) => ({
		y: y0 + (i + .5) * dy,
		halfX: 0,
		zF: -1,
		zB: 1
	}));
	root.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos) return;
		for (let i = 0; i < pos.count; i += Math.max(1, Math.floor(pos.count / 12e3))) {
			_local.fromBufferAttribute(pos, i);
			mesh.localToWorld(_local);
			if (_local.y < y0 || _local.y > y1) continue;
			const b = Math.min(bands - 1, Math.max(0, Math.floor((_local.y - y0) / dy)));
			const s = out[b];
			s.halfX = Math.max(s.halfX, Math.abs(_local.x));
			s.zF = Math.max(s.zF, _local.z);
			s.zB = Math.min(s.zB, _local.z);
		}
	});
	return out.map((s) => ({
		y: +s.y.toFixed(3),
		halfX: +s.halfX.toFixed(3),
		zF: +s.zF.toFixed(3)
	}));
}
function collectNamedBox(root, re) {
	const box = new Box3();
	box.makeEmpty();
	let n = 0;
	root.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.visible) return;
		if (!re.test(meshKey(mesh))) return;
		box.expandByObject(mesh);
		n++;
	});
	return n > 0 ? box : null;
}
function sampleTorsoProfile(body, y0, y1, bands = 20) {
	const dy = (y1 - y0) / bands;
	const slots = [];
	const n = new Int16Array(bands);
	for (let i = 0; i < bands; i++) slots.push({
		y: y0 + (i + .5) * dy,
		halfX: .04,
		zFront: -1,
		zBack: 1
	});
	body.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		if (!isTorsoMesh(mesh)) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos) return;
		const step = Math.max(1, Math.floor(pos.count / 1e4));
		for (let i = 0; i < pos.count; i += step) {
			_local.fromBufferAttribute(pos, i);
			mesh.localToWorld(_local);
			if (_local.y < y0 || _local.y > y1) continue;
			if (Math.abs(_local.x) > .16) continue;
			if (_local.z < -.02) continue;
			const b = Math.min(bands - 1, Math.max(0, Math.floor((_local.y - y0) / dy)));
			const s = slots[b];
			s.halfX = Math.max(s.halfX, Math.abs(_local.x));
			if (n[b] === 0) {
				s.zFront = _local.z;
				s.zBack = _local.z;
			} else {
				s.zFront = Math.max(s.zFront, _local.z);
				s.zBack = Math.min(s.zBack, _local.z);
			}
			n[b]++;
		}
	});
	for (let i = 0; i < bands; i++) {
		if (n[i] > 4) continue;
		const src = slots[i > 0 && n[i - 1] > 4 ? i - 1 : Math.min(bands - 1, i + 1)];
		slots[i].halfX = src.halfX;
		slots[i].zFront = src.zFront;
		slots[i].zBack = src.zBack;
	}
	return slots;
}
function profileAt(profile, y) {
	if (y <= profile[0].y) return profile[0];
	const last = profile[profile.length - 1];
	if (y >= last.y) return last;
	for (let i = 0; i < profile.length - 1; i++) {
		const a = profile[i];
		const b = profile[i + 1];
		if (y > b.y) continue;
		const t = (y - a.y) / Math.max(1e-5, b.y - a.y);
		return {
			y,
			halfX: a.halfX + (b.halfX - a.halfX) * t,
			zFront: a.zFront + (b.zFront - a.zFront) * t,
			zBack: a.zBack + (b.zBack - a.zBack) * t
		};
	}
	return last;
}
function placeGuts(source, cavity, navel, profile) {
	const root = cloneGraph(source);
	root.updateMatrixWorld(true);
	const ss = new Box3().setFromObject(root).getSize(new Vector3());
	const ts = cavity.getSize(new Vector3());
	const s = Math.min(ts.x / Math.max(ss.x, 1e-4), ts.y / Math.max(ss.y, 1e-4)) * .9;
	root.scale.set(s, s, s * 1.2);
	root.updateMatrixWorld(true);
	const ac = new Box3().setFromObject(root).getCenter(new Vector3());
	root.position.x += navel.x - ac.x;
	root.position.y += navel.y + .016 - ac.y;
	const cz = (cavity.min.z + cavity.max.z) * .5;
	root.position.z += cz - ac.z;
	root.updateMatrixWorld(true);
	const baked = flattenToWorld(root);
	bakeIntoVertices(baked);
	liftColonFlexures(baked, navel.y);
	fitGutEnvelope(baked, cavity, profile, navel.y);
	balanceLowerGuts(baked, profile, navel.y);
	tuckColonSides(baked, profile, navel.y);
	centerGutsInCavity(baked, cavity);
	return baked;
}
function balanceLowerGuts(group, profile, navelY) {
	const yLo = new Box3().setFromObject(group).min.y;
	const yHi = navelY + .02;
	if (yHi <= yLo) return;
	let sumX = 0;
	let n = 0;
	let left = 0;
	let right = 0;
	group.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos || !(pos.array instanceof Float32Array)) return;
		const arr = pos.array;
		for (let i = 0; i < pos.count; i++) {
			if (arr[i * 3 + 1] > yHi) continue;
			const x = arr[i * 3];
			sumX += x;
			n++;
			if (x < 0) left = Math.max(left, -x);
			else right = Math.max(right, x);
		}
	});
	if (n < 20) return;
	const cx = sumX / n;
	const span = Math.max(left, right, .03);
	group.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos || !(pos.array instanceof Float32Array)) return;
		const arr = pos.array;
		for (let i = 0; i < pos.count; i++) {
			const i3 = i * 3;
			const y = arr[i3 + 1];
			const t = 1 - MathUtils.smoothstep(y, yLo, yHi);
			if (t <= 0) continue;
			let x = arr[i3] - cx * t * .8;
			const p = profileAt(profile, y);
			const sx = 1 + (Math.max(.055, p.halfX * .84) / span - 1) * t * .7;
			x *= MathUtils.clamp(sx, 1, 1.4);
			arr[i3] = x;
		}
		pos.needsUpdate = true;
		mesh.geometry.computeBoundingBox();
		mesh.geometry.computeBoundingSphere();
	});
}
function tuckColonSides(group, profile, navelY) {
	group.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos || !(pos.array instanceof Float32Array)) return;
		const arr = pos.array;
		for (let i = 0; i < pos.count; i++) {
			const i3 = i * 3;
			let x = arr[i3];
			const ax = Math.abs(x);
			if (ax < .004) continue;
			const y = arr[i3 + 1];
			const w = MathUtils.smoothstep(ax, .022, .08) * (.4 + .6 * MathUtils.smoothstep(y, navelY + .02, navelY + .16));
			x -= Math.sign(x) * .011 * w;
			const zLimit = profileAt(profile, y).zFront - .015;
			let z = arr[i3 + 2];
			if (z > zLimit) z -= (z - zLimit) * .45 * w;
			arr[i3] = x;
			arr[i3 + 2] = z;
		}
		pos.needsUpdate = true;
		mesh.geometry.computeBoundingBox();
		mesh.geometry.computeBoundingSphere();
	});
}
function centerGutsInCavity(group, cavity) {
	const box = new Box3().setFromObject(group);
	const gz = (box.min.z + box.max.z) * .5;
	const cz = (cavity.min.z + cavity.max.z) * .5;
	const dz = cz - gz;
	const front = box.max.z + dz;
	const allow = cavity.max.z;
	const halfHave = Math.max(1e-4, front - cz);
	const halfAllow = Math.max(1e-4, allow - cz);
	const sz = halfHave > halfAllow ? halfAllow / halfHave : 1;
	group.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos || !(pos.array instanceof Float32Array)) return;
		const arr = pos.array;
		for (let i = 0; i < pos.count; i++) {
			const z = arr[i * 3 + 2] + dz;
			arr[i * 3 + 2] = cz + (z - cz) * sz;
		}
		pos.needsUpdate = true;
		mesh.geometry.computeBoundingBox();
		mesh.geometry.computeBoundingSphere();
	});
}
function liftColonFlexures(group, navelY) {
	const box = new Box3().setFromObject(group);
	const y0 = box.min.y;
	const span = Math.max(1e-4, box.max.y - y0);
	const cx = (box.min.x + box.max.x) * .5;
	group.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos || !(pos.array instanceof Float32Array)) return;
		const arr = pos.array;
		for (let i = 0; i < pos.count; i++) {
			const i3 = i * 3;
			const x = arr[i3];
			const y = arr[i3 + 1];
			const t = (y - y0) / span;
			if (t < .38) continue;
			const w = (t - .38) / .62;
			const side = MathUtils.smoothstep(Math.abs(x - cx), .03, .075);
			arr[i3 + 1] = y + .046 * w * (.62 + .38 * side);
		}
		pos.needsUpdate = true;
		mesh.geometry.computeBoundingBox();
	});
}
function fitGutEnvelope(group, cavity, profile, navelY) {
	const box = new Box3().setFromObject(group);
	const y0 = box.min.y;
	const span = Math.max(1e-4, box.max.y - y0);
	const cx = (box.min.x + box.max.x) * .5;
	const bands = 16;
	const gHalf = new Float32Array(bands);
	const gZ1 = new Float32Array(bands);
	gZ1.fill(-1e3);
	group.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos || !(pos.array instanceof Float32Array)) return;
		const arr = pos.array;
		for (let i = 0; i < pos.count; i++) {
			const y = arr[i * 3 + 1];
			const b = Math.min(15, Math.max(0, Math.floor((y - y0) / span * bands)));
			gHalf[b] = Math.max(gHalf[b], Math.abs(arr[i * 3] - cx));
			gZ1[b] = Math.max(gZ1[b], arr[i * 3 + 2]);
		}
	});
	for (let b = 1; b < bands; b++) {
		if (gHalf[b] < .02) gHalf[b] = gHalf[b - 1];
		if (gZ1[b] < -10) gZ1[b] = gZ1[b - 1];
	}
	const sx = new Float32Array(bands);
	const zPull = new Float32Array(bands);
	for (let b = 0; b < bands; b++) {
		const y = y0 + (b + .5) / bands * span;
		const p = profileAt(profile, y);
		const above = MathUtils.smoothstep(y, navelY + .08, navelY + .22);
		const allowX = Math.max(.05, p.halfX * (.78 - above * .02));
		sx[b] = MathUtils.clamp(allowX / Math.max(gHalf[b], 1e-4), .84, 1);
		const allowZ = Math.min(cavity.max.z, p.zFront - .012);
		zPull[b] = Math.max(0, (gZ1[b] - allowZ) * .35);
	}
	const lerpB = (arr, t) => {
		const x = MathUtils.clamp(t, 0, 1) * 15;
		const i = Math.min(14, Math.max(0, Math.floor(x)));
		const f = x - i;
		return arr[i] * (1 - f) + arr[i + 1] * f;
	};
	group.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos || !(pos.array instanceof Float32Array)) return;
		const arr = pos.array;
		for (let i = 0; i < pos.count; i++) {
			const i3 = i * 3;
			const y = arr[i3 + 1];
			const t = MathUtils.clamp((y - y0) / span, 0, 1);
			const s = lerpB(sx, t);
			arr[i3] = cx + (arr[i3] - cx) * s;
			let z = arr[i3 + 2] - lerpB(zPull, t);
			const p = profileAt(profile, y);
			const zFront = Math.min(cavity.max.z, p.zFront - .01);
			if (z > zFront) z = zFront + (z - zFront) * .2;
			arr[i3 + 2] = z;
		}
		pos.needsUpdate = true;
		mesh.geometry.computeBoundingBox();
		mesh.geometry.computeBoundingSphere();
	});
}
function shiftNamedMeshes(root, re, dx, dy, dz) {
	root.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		if (!re.test(meshKey(mesh))) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos || !(pos.array instanceof Float32Array)) return;
		const arr = pos.array;
		for (let i = 0; i < pos.count; i++) {
			arr[i * 3] += dx;
			arr[i * 3 + 1] += dy;
			arr[i * 3 + 2] += dz;
		}
		pos.needsUpdate = true;
		mesh.geometry.computeBoundingBox();
		mesh.geometry.computeBoundingSphere();
	});
}
function scaleNamedMeshes(root, re, factor) {
	root.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		if (!re.test(meshKey(mesh))) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos || !(pos.array instanceof Float32Array)) return;
		const arr = pos.array;
		let cx = 0;
		let cy = 0;
		let cz = 0;
		for (let i = 0; i < pos.count; i++) {
			cx += arr[i * 3];
			cy += arr[i * 3 + 1];
			cz += arr[i * 3 + 2];
		}
		const inv = 1 / Math.max(1, pos.count);
		cx *= inv;
		cy *= inv;
		cz *= inv;
		for (let i = 0; i < pos.count; i++) {
			arr[i * 3] = cx + (arr[i * 3] - cx) * factor;
			arr[i * 3 + 1] = cy + (arr[i * 3 + 1] - cy) * factor;
			arr[i * 3 + 2] = cz + (arr[i * 3 + 2] - cz) * factor;
		}
		pos.needsUpdate = true;
		mesh.geometry.computeBoundingBox();
		mesh.geometry.computeBoundingSphere();
	});
}
function placePelvisPack(source, crotch, navel, frontZ) {
	const root = cloneGraph(source);
	stripPelvicVulva(root);
	root.updateMatrixWorld(true);
	const uSize = (collectNamedBox(root, /uterus/) ?? new Box3().setFromObject(root)).getSize(new Vector3());
	root.scale.multiplyScalar(.058 / Math.max(uSize.y, 1e-4));
	root.updateMatrixWorld(true);
	const uc = (collectNamedBox(root, /uterus/) ?? new Box3().setFromObject(root)).getCenter(new Vector3());
	root.position.add(new Vector3(0, navel.y - .1, navel.z - .055).sub(uc));
	root.updateMatrixWorld(true);
	const baked = flattenToWorld(root);
	bakeIntoVertices(baked);
	stripPelvicVulva(baked);
	scaleNamedMeshes(baked, /uterus/, 1.02);
	scaleNamedMeshes(baked, /vessie|bladder/, .7);
	bakeIntoVertices(baked);
	const internals = /uterus|vessie|bladder|ovaire|trompe|ligament|vagin/;
	const ub = collectNamedBox(baked, /uterus/);
	if (ub) {
		const cz = (ub.min.z + ub.max.z) * .5;
		shiftNamedMeshes(baked, internals, 0, navel.y - .06 - ub.max.y, navel.z - .07 - cz);
	}
	stubVagina(baked);
	stripPelvicVulva(baked);
	return baked;
}
function inflateGuts(root, navel, inf) {
	if (Math.abs(inf) < .004) return;
	const ny = navel.y;
	const nx = navel.x;
	const nz = navel.z;
	root.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh || !mesh.geometry) return;
		const pos = mesh.geometry.getAttribute("position");
		if (!pos || !(pos.array instanceof Float32Array)) return;
		const arr = pos.array;
		for (let i = 0; i < pos.count; i++) {
			const i3 = i * 3;
			const x = arr[i3];
			const y = arr[i3 + 1];
			const z = arr[i3 + 2];
			const mask = (1 - MathUtils.smoothstep(Math.abs(y - ny), .02, .22)) * (.35 + .65 * (1 - MathUtils.smoothstep(Math.abs(x - nx), .02, .16)));
			if (mask < .02) continue;
			if (inf > 0) {
				arr[i3] = nx + (x - nx) * (1 + inf * .62 * mask);
				arr[i3 + 1] = y - inf * .03 * mask;
				arr[i3 + 2] = nz + (z - nz) * (1 + inf * .78 * mask) + inf * .055 * mask;
			} else {
				const c = -inf;
				arr[i3] = nx + (x - nx) * (1 - c * .48 * mask);
				arr[i3 + 2] = nz + (z - nz) * (1 - c * .32 * mask);
			}
		}
		pos.needsUpdate = true;
	});
}
function polishOrgans(root, kind) {
	root.traverse((obj) => {
		const mesh = obj;
		if (!mesh.isMesh) return;
		const next = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map((raw) => {
			const m = raw ? raw.clone() : new MeshStandardMaterial();
			m.side = 2;
			m.roughness = kind === "gut" ? .48 : .42;
			m.metalness = 0;
			if (!m.map) m.color.lerp(new Color(kind === "gut" ? "#b85a4a" : "#c4786a"), .12);
			m.emissive = new Color("#000000");
			m.emissiveIntensity = 0;
			m.transparent = false;
			m.depthWrite = true;
			m.depthTest = true;
			m.needsUpdate = true;
			return m;
		});
		mesh.material = next.length === 1 ? next[0] : next;
		mesh.renderOrder = 1;
		mesh.frustumCulled = false;
		mesh.raycast = () => {};
	});
}
function injectXray(shader, y0, y1, xMax, zFront) {
	shader.uniforms.uXray = { value: 0 };
	shader.uniforms.uY0 = { value: y0 };
	shader.uniforms.uY1 = { value: y1 };
	shader.uniforms.uXMax = { value: xMax };
	shader.uniforms.uZFront = { value: zFront };
	shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vBodyW;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvBodyW = (modelMatrix * vec4(transformed, 1.0)).xyz;");
	shader.fragmentShader = shader.fragmentShader.replace("#include <common>", `#include <common>
uniform float uXray; uniform float uY0; uniform float uY1; uniform float uXMax; uniform float uZFront;
varying vec3 vBodyW;
float xrayHole() {
  float band = smoothstep(uY0, uY0 + 0.08, vBodyW.y) * (1.0 - smoothstep(uY1 - 0.08, uY1, vBodyW.y));
  float torso = 1.0 - smoothstep(uXMax * 0.65, uXMax + 0.1, abs(vBodyW.x));
  float front = smoothstep(uZFront - 0.16, uZFront + 0.04, vBodyW.z);
  return clamp(band * torso * front * uXray, 0.0, 1.0);
}`);
}
function attachXray(mesh, y0, y1, xMax, zFront, list, overlays) {
	const punchMats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map((mat) => {
		if (!mat) return mat;
		const punch = mat.clone();
		punch.transparent = false;
		punch.opacity = 1;
		punch.side = 0;
		punch.depthWrite = true;
		punch.depthTest = true;
		punch.onBeforeCompile = (shader) => {
			injectXray(shader, y0, y1, xMax, zFront);
			shader.fragmentShader = shader.fragmentShader.replace("#include <dithering_fragment>", `if (!gl_FrontFacing) discard;
         if (xrayHole() > 0.07) discard;
         #include <dithering_fragment>`);
			punch.userData.shader = shader;
		};
		punch.needsUpdate = true;
		list.push(punch);
		return punch;
	});
	mesh.material = punchMats.length === 1 ? punchMats[0] : punchMats;
	const fadeMats = punchMats.map((punch) => {
		if (!punch) return punch;
		const fade = punch.clone();
		fade.transparent = true;
		fade.opacity = 1;
		fade.depthWrite = false;
		fade.depthTest = true;
		fade.side = 0;
		fade.onBeforeCompile = (shader) => {
			injectXray(shader, y0, y1, xMax, zFront);
			shader.fragmentShader = shader.fragmentShader.replace("#include <dithering_fragment>", `if (!gl_FrontFacing) discard;
         float hole = xrayHole();
         if (hole < 0.012) discard;
         float fade = smoothstep(0.012, 1.0, hole);
         gl_FragColor.rgb *= mix(1.0, 0.5, fade);
         gl_FragColor.a *= mix(0.96, 0.05, pow(fade, 0.72));
         #include <dithering_fragment>`);
			fade.userData.shader = shader;
		};
		fade.needsUpdate = true;
		list.push(fade);
		return fade;
	});
	const overlay = new Mesh(mesh.geometry, fadeMats.length === 1 ? fadeMats[0] : fadeMats);
	overlay.name = "__xrayOverlay";
	overlay.userData.xrayOverlay = true;
	overlay.frustumCulled = false;
	overlay.renderOrder = 6;
	overlay.raycast = () => {};
	overlay.visible = false;
	overlays.push(overlay);
	return overlay;
}
function Figure({ controlsRef, character, intestines, pelvis, arm, bayonet, bayonetLong }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FittedFigure, {
		character,
		intestines,
		pelvis,
		arm,
		bayonet,
		bayonetLong,
		controlsRef
	});
}
function FittedFigure({ character, intestines, pelvis, arm, bayonet, bayonetLong, controlsRef }) {
	const pokeRef = (0, import_react.useRef)(null);
	const ringRef = (0, import_react.useRef)(null);
	const lastShake = (0, import_react.useRef)(0);
	const lastReset = (0, import_react.useRef)(0);
	const lastStrike = (0, import_react.useRef)(0);
	const latticeRef = (0, import_react.useRef)(null);
	const bonesRef = (0, import_react.useRef)(null);
	const exprRef = (0, import_react.useRef)(useStudio.getState().expression);
	const poseRef = (0, import_react.useRef)(useStudio.getState().pose);
	const grab = (0, import_react.useRef)(null);
	const energyTick = (0, import_react.useRef)(0);
	const gutExc = (0, import_react.useRef)(0);
	const lastAz = (0, import_react.useRef)(null);
	const lastPol = (0, import_react.useRef)(null);
	const bayonetPenRef = (0, import_react.useRef)(0);
	const rmbDown = (0, import_react.useRef)(false);
	const { camera, gl, raycaster, pointer } = useThree();
	const setup = (0, import_react.useMemo)(() => {
		const xrayList = [];
		const xrayOverlays = [];
		const xrayHosts = [];
		const torsoMeshes = [];
		const root = new Group();
		const body = flattenToWorld(fitStanding(character, 1.66));
		root.add(body);
		_box.setFromObject(body);
		_box.getSize(_size);
		const height = _size.y;
		const charBox = new Box3().setFromObject(body);
		const navel = findNavel(body, height);
		const yNavel = navel.y;
		const yAb0 = yNavel - .08;
		const yAb1 = yNavel + .11;
		const yX0 = yNavel - .2;
		const yX1 = yNavel + .28;
		const abSample = sampleBand(body, yAb0, yAb1, .12);
		const abdomen = abSample.count > 40 ? abSample.box.clone() : new Box3(new Vector3(-.11, yAb0, -.04), new Vector3(.11, yAb1, .1));
		const abx = Math.max(.11, Math.min(.13, (abdomen.max.x - abdomen.min.x) * .42));
		const acx = (abdomen.min.x + abdomen.max.x) * .5;
		abdomen.min.x = acx - abx;
		abdomen.max.x = acx + abx;
		const skinZ = navel.z;
		abdomen.max.z = skinZ - .012;
		abdomen.min.z = skinZ - .1;
		const crotch = findCrotch(body, height);
		const anus = findAnus(body, height, crotch);
		const pelvic = placePelvisPack(pelvis, crotch, navel, skinZ - .028);
		polishOrgans(pelvic, "pelvis");
		pelvic.visible = false;
		root.add(pelvic);
		const uterusNow = collectNamedBox(pelvic, /uterus/);
		const gutBox = new Box3(new Vector3(acx - .12, yNavel - .16, abdomen.min.z), new Vector3(acx + .12, yNavel + .22, abdomen.max.z));
		const waistProfile = sampleTorsoProfile(body, gutBox.min.y - .02, gutBox.max.y + .1);
		const gut = placeGuts(intestines, gutBox, navel, waistProfile);
		polishOrgans(gut, "gut");
		if (uterusNow) liftGutsOffUterus(gut, uterusNow);
		gut.visible = false;
		root.add(gut);
		const bellyLight = new PointLight("#a07060", 0, .48);
		bellyLight.position.set(0, yNavel, abdomen.max.z - .04);
		root.add(bellyLight);
		const armSpan = Math.max(charBox.max.x, -charBox.min.x);
		const landmarks = sampleLandmarks(body, navel, height);
		landmarks.lHand ??= new Vector3(-armSpan * .85, yNavel - .2, .03);
		landmarks.rHand ??= new Vector3(armSpan * .85, yNavel - .2, .03);
		const skeleton = new SoftSkeleton(landmarks, height);
		const boundGeos = [];
		const weightViews = [];
		const bindMesh = (mesh, hint) => {
			let geo = mesh.geometry;
			const pos0 = geo.getAttribute("position");
			if (!pos0 || pos0.itemSize !== 3) return;
			mesh.geometry = geo.clone();
			geo = mesh.geometry;
			const pos = geo.getAttribute("position");
			if (!(pos.array instanceof Float32Array)) return;
			mesh.updateWorldMatrix(true, false);
			const n = pos.count;
			const world = new Float32Array(n * 3);
			for (let i = 0; i < n; i++) {
				_local.fromBufferAttribute(pos, i);
				mesh.localToWorld(_local);
				world[i * 3] = _local.x;
				world[i * 3 + 1] = _local.y;
				world[i * 3 + 2] = _local.z;
			}
			pos.array.set(world);
			pos.needsUpdate = true;
			const binding = skeleton.bind(pos.array, hint ?? bindHint(mesh));
			geo.setAttribute("color", new BufferAttribute(binding.colors, 3));
			boundGeos.push(geo);
			const weightMat = new MeshLambertMaterial({
				vertexColors: true,
				side: 2
			});
			weightViews.push({
				mesh,
				orig: mesh.material,
				weight: weightMat
			});
		};
		body.traverse((obj) => {
			const mesh = obj;
			if (!mesh.isMesh || !mesh.geometry) return;
			if (!shouldBind(mesh)) {
				mesh.raycast = () => {};
				return;
			}
			bindMesh(mesh);
			if (isTorsoMesh(mesh)) {
				torsoMeshes.push(mesh);
				if (attachXray(mesh, yX0, yX1, .12, skinZ - .01, xrayList, xrayOverlays)) xrayHosts.push(mesh);
			}
		});
		for (let i = 0; i < xrayOverlays.length; i++) xrayHosts[i]?.add(xrayOverlays[i]);
		gut.traverse((obj) => {
			const mesh = obj;
			if (mesh.isMesh) bindMesh(mesh, "organs");
		});
		const peristalsis = new GutPeristalsis();
		peristalsis.attach(gut);
		const strike = new BellyStrike();
		strike.attach(gut);
		const gutHealth = new GutHealth();
		gutHealth.attach(gut, peristalsis.getTubes());
		root.add(gutHealth.bars);
		const fist = new FistPlay();
		fist.attach(arm, peristalsis.getTubes(), anus);
		fist.setEnvelope(crotch.y + .012, navel.y + .108, waistProfile);
		fist.setMid(navel);
		root.add(fist.root);
		const knife = new BayonetPlay();
		knife.attach(bayonet, peristalsis.getTubes(), bayonetLong);
		knife.setSkin(torsoMeshes, {
			y0: yX0,
			y1: yX1,
			xMax: .12,
			zFront: skinZ - .01
		});
		root.add(knife.root);
		root.add(knife.wounds);
		pelvic.traverse((obj) => {
			const mesh = obj;
			if (mesh.isMesh) bindMesh(mesh, "organs");
		});
		const jointBuf = new Float32Array(skeleton.count * 3);
		const boneVis = new Group();
		boneVis.visible = false;
		const jointGeo = new SphereGeometry(.014, 8, 8);
		const jointMat = new MeshBasicMaterial({
			color: "#d4b5a0",
			depthTest: false,
			transparent: true,
			opacity: .95
		});
		const joints = [];
		for (let i = 0; i < skeleton.count; i++) {
			const m = new Mesh(jointGeo, jointMat);
			m.frustumCulled = false;
			m.renderOrder = 30;
			boneVis.add(m);
			joints.push(m);
		}
		const linePos = new Float32Array(skeleton.boneLineCount() * 6);
		const lineGeo = new BufferGeometry();
		lineGeo.setAttribute("position", new BufferAttribute(linePos, 3));
		const boneLines = new LineSegments(lineGeo, new LineBasicMaterial({
			color: "#f2efe9",
			depthTest: false,
			transparent: true,
			opacity: .85
		}));
		boneLines.frustumCulled = false;
		boneLines.renderOrder = 29;
		boneVis.add(boneLines);
		root.add(boneVis);
		for (const v of weightViews) v.orig = v.mesh.material;
		const gutBoxNow = new Box3().setFromObject(gut);
		const pelBoxNow = new Box3().setFromObject(pelvic);
		if (typeof window !== "undefined") window.__vela = {
			char: {
				min: charBox.min.toArray(),
				max: charBox.max.toArray()
			},
			abdomen: {
				min: abdomen.min.toArray(),
				max: abdomen.max.toArray()
			},
			pelvis: {
				min: pelBoxNow.min.toArray(),
				max: pelBoxNow.max.toArray()
			},
			uterusBox: (() => {
				const b = collectNamedBox(pelvic, /uterus/);
				return b ? {
					min: b.min.toArray(),
					max: b.max.toArray()
				} : null;
			})(),
			bladderBox: (() => {
				const b = collectNamedBox(pelvic, /vessie|bladder/);
				return b ? {
					min: b.min.toArray(),
					max: b.max.toArray()
				} : null;
			})(),
			vulvaBox: (() => {
				const b = collectNamedBox(pelvic, /vulve|clitoris/);
				return b ? {
					min: b.min.toArray(),
					max: b.max.toArray()
				} : null;
			})(),
			guts: {
				min: gutBoxNow.min.toArray(),
				max: gutBoxNow.max.toArray()
			},
			navel: navel.toArray(),
			crotch: crotch.toArray(),
			anus: anus.toArray(),
			bayonet: {
				hasEntry: false,
				punctured: false,
				penetration: 0,
				squeeze: 0
			},
			uterus: uterusNow ? [
				(uterusNow.min.x + uterusNow.max.x) * .5,
				(uterusNow.min.y + uterusNow.max.y) * .5,
				(uterusNow.min.z + uterusNow.max.z) * .5
			] : [
				0,
				yNavel - .1,
				0
			],
			waist: waistProfile.map((s) => ({
				y: +s.y.toFixed(3),
				halfX: +s.halfX.toFixed(3),
				zF: +s.zFront.toFixed(3)
			})),
			gutBands: sliceWidths(gut, gutBoxNow.min.y, gutBoxNow.max.y, 8),
			bones: skeleton.names,
			bound: boundGeos.length
		};
		return {
			root,
			skeleton,
			y0: yAb0,
			y1: yAb1,
			abdomen,
			xrayList,
			xrayOverlays,
			gutRoot: gut,
			pelvisRoot: pelvic,
			peristalsis,
			strike,
			gutHealth,
			fist,
			knife,
			torsoMeshes,
			navel,
			boundGeos,
			bellyLight,
			weightViews,
			boneVis,
			joints,
			boneLines,
			jointBuf
		};
	}, [
		character,
		intestines,
		pelvis,
		arm,
		bayonet,
		bayonetLong
	]);
	(0, import_react.useEffect)(() => {
		const id = requestAnimationFrame(() => {
			useStudio.setState({
				loading: false,
				loadProgress: 100,
				loadHint: "就绪",
				loadError: null
			});
		});
		return () => cancelAnimationFrame(id);
	}, []);
	(0, import_react.useEffect)(() => {
		const el = gl.domElement;
		const onPointerDown = (e) => {
			if (e.button === 2) rmbDown.current = true;
		};
		const onPointerUp = (e) => {
			if (e.button === 2) rmbDown.current = false;
		};
		const onWheel = (e) => {
			const s = useStudio.getState();
			if (!rmbDown.current) return;
			if (s.interactMode !== "bayonet" || !setup.knife.hasEntry) return;
			e.preventDefault();
			e.stopPropagation();
			const notches = MathUtils.clamp(e.deltaY, -180, 180) / 120;
			const next = setup.knife.adjustDepth(notches * .055);
			bayonetPenRef.current = next;
			s.setBayonetPen(next);
		};
		el.addEventListener("pointerdown", onPointerDown);
		window.addEventListener("pointerup", onPointerUp);
		window.addEventListener("pointercancel", onPointerUp);
		el.addEventListener("wheel", onWheel, {
			passive: false,
			capture: true
		});
		return () => {
			el.removeEventListener("pointerdown", onPointerDown);
			window.removeEventListener("pointerup", onPointerUp);
			window.removeEventListener("pointercancel", onPointerUp);
			el.removeEventListener("wheel", onWheel, true);
		};
	}, [gl, setup]);
	(0, import_react.useEffect)(() => {
		if (controlsRef.current) {
			const c = setup.abdomen.getCenter(new Vector3());
			controlsRef.current.target.set(c.x, c.y, c.z);
			controlsRef.current.update();
		}
	}, [setup, controlsRef]);
	(0, import_react.useEffect)(() => {
		const onUp = () => {
			if (grab.current?.mode === "pose") setup.skeleton.commitPose();
			grab.current = null;
			setup.skeleton.clearHold();
			useStudio.getState().setGrabbing(false);
			gl.domElement.style.cursor = "default";
			if (pokeRef.current) pokeRef.current.visible = false;
		};
		window.addEventListener("pointerup", onUp);
		window.addEventListener("pointercancel", onUp);
		window.addEventListener("studio-cancel-grab", onUp);
		return () => {
			window.removeEventListener("pointerup", onUp);
			window.removeEventListener("pointercancel", onUp);
			window.removeEventListener("studio-cancel-grab", onUp);
		};
	}, [gl, setup]);
	const writeBindings = () => {
		for (const geo of setup.boundGeos) {
			const pos = geo.getAttribute("position");
			if (pos) pos.needsUpdate = true;
		}
	};
	useFrame((state, delta) => {
		const d = Math.min(delta, .05);
		const s = useStudio.getState();
		const dt = s.slowMo ? d * .38 : d;
		if (s.shakeNonce !== lastShake.current) {
			lastShake.current = s.shakeNonce;
			setup.skeleton.shake(.08);
		}
		if (s.resetNonce !== lastReset.current) {
			lastReset.current = s.resetNonce;
			setup.skeleton.reset();
			setup.gutHealth.reset();
			setup.fist.reset();
			setup.knife.reset();
			bayonetPenRef.current = 0;
			useStudio.getState().setBayonetHasEntry(false);
			useStudio.getState().setBayonetPen(0);
			gutExc.current = 0;
		}
		if (s.strikeNonce !== lastStrike.current) {
			lastStrike.current = s.strikeNonce;
			const p = s.strikePoint;
			const ox = p ? p[0] : setup.navel.x;
			const oy = p ? p[1] : setup.navel.y;
			const oz = p ? p[2] : setup.navel.z;
			setup.skeleton.impulse(ox, oy, oz, s.strikeForce, s.strikeRange);
			setup.strike.fire(ox, oy, oz, s.strikeForce, s.strikeRange);
			setup.gutHealth.hit(ox, oy, oz, s.strikeForce, s.strikeRange);
			gutExc.current = Math.min(.35, gutExc.current + .08 + s.strikeForce * .14);
		}
		if (s.expression !== exprRef.current) {
			exprRef.current = s.expression;
			setup.skeleton.setExpression(s.expression);
		}
		if (s.pose !== poseRef.current) {
			poseRef.current = s.pose;
			setup.skeleton.setPose(s.pose);
		}
		const ctrl = controlsRef.current;
		camera.getWorldDirection(_camDir);
		const az = ctrl ? ctrl.getAzimuthalAngle() : Math.atan2(_camDir.x, _camDir.z);
		const pol = ctrl ? ctrl.getPolarAngle() : Math.acos(MathUtils.clamp(_camDir.y, -1, 1));
		if (lastAz.current === null) {
			lastAz.current = az;
			lastPol.current = pol;
		}
		const invDt = 1 / Math.max(dt, 1e-4);
		setup.skeleton.pushViewSpin(MathUtils.clamp((az - lastAz.current) * invDt, -14, 14), MathUtils.clamp((pol - (lastPol.current ?? pol)) * invDt, -10, 10));
		lastAz.current = az;
		lastPol.current = pol;
		if (grab.current?.active) {
			camera.getWorldDirection(_camDir);
			_plane.setFromNormalAndCoplanarPoint(_camDir, grab.current.planePoint);
			_ndc.copy(pointer);
			raycaster.setFromCamera(_ndc, camera);
			_ray.copy(raycaster.ray);
			const o = grab.current.origin;
			const bone = grab.current.bone;
			if (_ray.intersectPlane(_plane, _target)) {
				if (grab.current.mode === "fist") {
					setup.fist.dragTo(o, _target);
					grab.current.origin.copy(_target);
					grab.current.planePoint.copy(_target);
				} else if (grab.current.mode === "bayonet") {
					_plane.setFromNormalAndCoplanarPoint(_camDir, setup.knife.handle);
					if (_ray.intersectPlane(_plane, _target)) {
						setup.knife.dragTo(_target);
						grab.current.origin.copy(setup.knife.handle);
						grab.current.planePoint.copy(setup.knife.handle);
						const t = setup.knife.pen01();
						bayonetPenRef.current = t;
						s.setBayonetPen(t);
					}
				} else if (grab.current.mode === "pose") setup.skeleton.setPoseDrag(bone, o.x, o.y, o.z, _target.x, _target.y, _target.z);
				else setup.skeleton.setTissueDrag(o.x, o.y, o.z, _target.x, _target.y, _target.z, .16);
				if (pokeRef.current) {
					pokeRef.current.position.copy(_target);
					pokeRef.current.visible = true;
				}
			}
		}
		setup.fist.setEnabled(s.interactMode === "fist");
		setup.fist.setMaxScale(s.fistMaxDepth);
		setup.knife.setEnabled(s.interactMode === "bayonet");
		setup.knife.setKind(s.bayonetKind);
		setup.knife.syncWounds(s.abdomenXray);
		if (controlsRef.current) controlsRef.current.enableZoom = !(rmbDown.current && s.interactMode === "bayonet" && setup.knife.hasEntry);
		if (!s.bayonetHasEntry && setup.knife.hasEntry) setup.knife.releaseEntry();
		const grabbingKnife = grab.current?.mode === "bayonet";
		const animating = s.bayonetPump || setup.knife.isAuto;
		if (s.interactMode === "bayonet" && setup.knife.hasEntry && !grabbingKnife && !animating) {
			if (Math.abs(s.bayonetPen - bayonetPenRef.current) > 1e-4) {
				bayonetPenRef.current = s.bayonetPen;
				setup.knife.setPen01(s.bayonetPen);
			}
		}
		if (s.interactMode === "bayonet") {
			const sq = setup.knife.squeezeTarget();
			if (sq && grab.current?.mode !== "pose" && grab.current?.mode !== "drag") setup.skeleton.setTissueDrag(sq.gx, sq.gy, sq.gz, sq.tx, sq.ty, sq.tz, sq.radius);
			else if (!sq && grab.current?.mode !== "pose" && grab.current?.mode !== "drag") setup.skeleton.clearHold();
		}
		const autoFist = s.fistThrust || s.fistStir;
		setup.fist.step(dt, {
			thrust: s.fistThrust,
			stir: s.fistStir,
			thrustSpeed: s.fistThrustSpeed,
			thrustStart: s.fistThrustStart,
			stirSpeed: s.fistStirSpeed,
			stirRadius: s.fistStirRadius
		});
		const fistBelly = setup.fist.belly();
		setup.skeleton.step(dt, {
			stiffness: s.stiffness,
			damping: s.damping,
			jiggle: s.jiggle,
			gravity: s.gravity,
			wind: s.wind,
			time: state.clock.elapsedTime,
			breathing: s.breathing,
			breathAmp: s.breathAmp,
			breathSpeed: s.breathSpeed,
			breathBoost: setup.fist.arousal,
			rebound: s.strikeRebound,
			inflate: s.bellyInflate,
			fistDepth: fistBelly.depth,
			fistStart: fistBelly.start,
			fistTx: fistBelly.x,
			fistTy: fistBelly.y,
			fistTz: fistBelly.z,
			fistLx: fistBelly.lx,
			fistLz: fistBelly.lz,
			fistBulge: s.fistBulge,
			fistSpread: s.fistSpread,
			fistLever: s.fistLever,
			fistRise: s.fistRise
		});
		gutExc.current += (0 - gutExc.current) * (1 - Math.exp(-.42 * dt));
		if (s.showOrgans && s.abdomenXray > .08) {
			const g = gutExc.current;
			setup.peristalsis.apply(state.clock.elapsedTime, s.gutAmp * (1 + g * .38), s.gutSpeed * (1 + g * .3));
		}
		inflateGuts(setup.gutRoot, setup.navel, s.bellyInflate);
		setup.strike.step(dt);
		setup.strike.apply(s.strikeRebound);
		setup.fist.apply(s.fistGut, autoFist);
		setup.knife.apply(dt, s.fistGut, setup.gutHealth, {
			pump: s.bayonetPump,
			grabbing: grabbingKnife
		});
		if (setup.knife.consumeAutoReleased()) {
			bayonetPenRef.current = 0;
			useStudio.setState({
				bayonetHasEntry: false,
				bayonetPen: 0
			});
		} else if ((s.bayonetPump || setup.knife.isAuto) && setup.knife.hasEntry) {
			const t = setup.knife.pen01();
			if (Math.abs(t - s.bayonetPen) > .012) {
				bayonetPenRef.current = t;
				s.setBayonetPen(t);
			}
		}
		if (setup.knife.consumePunctureEvent()) {
			const e = setup.knife.entry;
			const ddir = setup.knife.dir;
			setup.skeleton.impulse(e.x, e.y, e.z, .42, .28);
			for (let i = 1; i <= 5; i++) {
				const t = setup.knife.penetration * i / 5;
				setup.gutHealth.hit(e.x + ddir.x * t, e.y + ddir.y * t, e.z + ddir.z * t, .38, .32);
			}
			gutExc.current = Math.min(.35, gutExc.current + .12);
			if (!s.showOrgans || s.abdomenXray < .08) useStudio.setState({
				showOrgans: true,
				abdomenXray: Math.max(.38, s.abdomenXray),
				showGutHp: true
			});
		}
		setup.gutHealth.applyColor();
		setup.gutHealth.updateBars(camera, s.showGutHp);
		const ring = ringRef.current;
		if (ring) {
			if (setup.strike.lastOrigin(_center)) {
				ring.position.copy(_center);
				ring.position.z += .012;
				const rr = Math.max(.02, setup.strike.ringRadius());
				ring.scale.set(rr, rr, 1);
				const mat = ring.material;
				mat.opacity = setup.strike.ringOpacity();
				ring.visible = mat.opacity > .02;
			} else ring.visible = false;
		}
		energyTick.current += 1;
		writeBindings();
		if (energyTick.current % 8 === 0) s.setEnergy(setup.skeleton.energy);
		if (!grab.current?.active && (setup.skeleton.hasDents || Math.abs(s.bellyInflate) > .04 ? energyTick.current % 2 === 0 : energyTick.current % 20 === 0)) {
			for (const geo of setup.boundGeos) if (geo.getAttribute("position").count < 8e4) geo.computeVertexNormals();
		}
		const xray = s.abdomenXray;
		for (const mat of setup.xrayList) {
			const shader = mat.userData.shader;
			if (shader?.uniforms?.uXray) shader.uniforms.uXray.value = xray;
			if (mat.transparent) {
				mat.depthWrite = false;
				mat.depthTest = true;
				mat.side = 0;
			} else {
				mat.transparent = false;
				mat.depthWrite = true;
				mat.depthTest = true;
				mat.side = 0;
			}
		}
		for (const ov of setup.xrayOverlays) ov.visible = xray > .03 && !s.showWeights;
		const show = s.showOrgans && xray > .08;
		setup.gutRoot.visible = show;
		setup.pelvisRoot.visible = show;
		setup.bellyLight.intensity = show ? .05 + xray * .06 : 0;
		if (show && energyTick.current % 6 === 0) setup.gutRoot.traverse((obj) => {
			const mesh = obj;
			if (!mesh.isMesh || !mesh.geometry) return;
			const n = mesh.geometry.getAttribute("position")?.count ?? 0;
			if (n > 0 && n < 12e4) mesh.geometry.computeVertexNormals();
		});
		setup.boneVis.visible = s.showLattice;
		if (s.showLattice) {
			const jp = setup.skeleton.jointPositions(setup.jointBuf);
			for (let i = 0; i < setup.joints.length; i++) setup.joints[i].position.set(jp[i * 3], jp[i * 3 + 1], jp[i * 3 + 2]);
			const lp = setup.boneLines.geometry.getAttribute("position");
			setup.skeleton.writeBoneLines(lp.array);
			lp.needsUpdate = true;
		}
		for (const v of setup.weightViews) v.mesh.material = s.showWeights ? v.weight : v.orig;
		const vela = window.__vela;
		if (vela) {
			vela.frameBelly = () => {
				camera.position.set(.12, 1.05, .68);
				camera.lookAt(setup.navel.x, setup.navel.y, setup.navel.z);
				if (controlsRef.current) {
					controlsRef.current.target.copy(setup.navel);
					controlsRef.current.update();
				}
			};
			vela.tiltBayonet = (x, y, z) => {
				setup.knife.dragTo(new Vector3(x, y, z));
				const ang = MathUtils.radToDeg(setup.knife.dir.angleTo(setup.knife.restAxis));
				return {
					dir: setup.knife.dir.toArray(),
					restAxis: setup.knife.restAxis.toArray(),
					angleDeg: +ang.toFixed(2)
				};
			};
			vela.driveBayonet = (pen) => {
				setup.knife.setEnabled(true);
				if (!setup.knife.hasEntry) setup.knife.pick(setup.navel, new Vector3(0, 0, 1));
				setup.knife.setRawPen(pen);
				const t = setup.knife.pen01();
				bayonetPenRef.current = t;
				useStudio.setState({
					interactMode: "bayonet",
					bayonetHasEntry: true,
					showOrgans: true,
					abdomenXray: Math.max(.38, useStudio.getState().abdomenXray),
					showGutHp: true,
					bayonetPen: t
				});
				return {
					hasEntry: setup.knife.hasEntry,
					punctured: setup.knife.punctured,
					penetration: setup.knife.penetration,
					rawPen: setup.knife.rawPen,
					enabled: setup.knife.enabled,
					storePen: t,
					wounds: setup.knife.wounds.children.length,
					kind: setup.knife.kind,
					bladeLen: setup.knife.bladeLen,
					totalLen: setup.knife.totalLen,
					maxPen: setup.knife.maxPen
				};
			};
			vela.setBayonetKind = (kind) => {
				setup.knife.setKind(kind);
				useStudio.setState({
					bayonetKind: kind,
					interactMode: "bayonet"
				});
				return {
					kind: setup.knife.kind,
					bladeLen: setup.knife.bladeLen,
					totalLen: setup.knife.totalLen,
					maxPen: setup.knife.maxPen
				};
			};
			vela.pickBayonet = (dx, dy, dz) => {
				const p = setup.navel.clone().add(new Vector3(dx, dy, dz));
				setup.knife.setEnabled(true);
				setup.knife.pick(p, new Vector3(0, 0, 1));
				bayonetPenRef.current = 0;
				useStudio.setState({
					interactMode: "bayonet",
					bayonetHasEntry: true,
					bayonetPen: 0,
					showOrgans: true,
					abdomenXray: Math.max(.38, useStudio.getState().abdomenXray),
					showGutHp: true
				});
				return {
					entry: setup.knife.entry.toArray(),
					wounds: setup.knife.wounds.children.length
				};
			};
			vela.nextStab = () => {
				setup.knife.releaseEntry();
				bayonetPenRef.current = 0;
				useStudio.setState({
					bayonetHasEntry: false,
					bayonetPen: 0
				});
				return {
					wounds: setup.knife.wounds.children.length,
					hasEntry: setup.knife.hasEntry
				};
			};
			if (energyTick.current % 2 === 0) {
				let minHp = 1;
				for (let i = 0; i < setup.gutHealth.hp.length; i++) minHp = Math.min(minHp, setup.gutHealth.hp[i]);
				vela.bayonet = {
					hasEntry: setup.knife.hasEntry,
					punctured: setup.knife.punctured,
					penetration: +setup.knife.penetration.toFixed(3),
					squeeze: +setup.knife.squeeze.toFixed(3),
					rawPen: +setup.knife.rawPen.toFixed(3),
					kind: setup.knife.kind,
					bladeLen: +setup.knife.bladeLen.toFixed(3),
					totalLen: +setup.knife.totalLen.toFixed(3),
					maxPen: +setup.knife.maxPen.toFixed(3),
					entry: setup.knife.entry.toArray(),
					tip: setup.knife.tip.toArray(),
					handle: setup.knife.handle.toArray(),
					dir: setup.knife.dir.toArray(),
					restAxis: setup.knife.restAxis.toArray(),
					edge: setup.knife.edgeWorld.toArray(),
					cone: 30,
					wounds: setup.knife.wounds.children.length,
					wound0: setup.knife.wounds.children[0] ? (() => {
						const m = setup.knife.wounds.children[0];
						const p = m.geometry.getAttribute("position");
						return p ? [
							p.getX(0),
							p.getY(0),
							p.getZ(0)
						] : m.position.toArray();
					})() : null,
					wound1: setup.knife.wounds.children[1] ? (() => {
						const m = setup.knife.wounds.children[1];
						const p = m.geometry.getAttribute("position");
						return p ? [
							p.getX(0),
							p.getY(0),
							p.getZ(0)
						] : m.position.toArray();
					})() : null,
					minHp: +minHp.toFixed(3)
				};
			}
		}
	});
	const latticeGeo = (0, import_react.useMemo)(() => {
		const g = new BufferGeometry();
		g.setAttribute("position", new BufferAttribute(new Float32Array(setup.skeleton.count * 3), 3));
		return g;
	}, [setup]);
	const boneGeo = (0, import_react.useMemo)(() => {
		const g = new BufferGeometry();
		g.setAttribute("position", new BufferAttribute(new Float32Array(setup.skeleton.boneLineCount() * 2 * 3), 3));
		return g;
	}, [setup]);
	const beginGrab = (point, normal, mode) => {
		grab.current = {
			active: true,
			mode,
			origin: point.clone(),
			planePoint: point.clone(),
			normal: normal.clone().normalize(),
			bone: setup.skeleton.pickBone(point.x, point.y, point.z)
		};
		useStudio.getState().setGrabbing(true);
		gl.domElement.style.cursor = "grabbing";
		if (pokeRef.current) {
			pokeRef.current.position.copy(point);
			pokeRef.current.lookAt(point.clone().add(normal));
			pokeRef.current.visible = true;
		}
	};
	const onPointerDown = (e) => {
		if (e.button !== 0 && e.nativeEvent.button !== 0) return;
		e.stopPropagation();
		_hit.copy(e.point);
		const mode = useStudio.getState().interactMode;
		if (mode === "strike") {
			useStudio.getState().fireStrike([
				_hit.x,
				_hit.y,
				_hit.z
			]);
			return;
		}
		if (mode === "fist") {
			beginGrab(_hit, _normal.set(0, 0, 1), "fist");
			return;
		}
		if (e.face) _normal.copy(e.face.normal).transformDirection(e.object.matrixWorld).normalize();
		else _normal.set(0, 0, 1);
		if (mode === "bayonet") {
			if (!setup.knife.hasEntry) {
				camera.getWorldDirection(_camDir);
				raycaster.setFromCamera(pointer, camera);
				const hit = raycaster.intersectObjects(setup.torsoMeshes, false).find((h) => h.face && h.distance > .001);
				if (!hit?.face) return;
				_hit.copy(hit.point);
				_normal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld).normalize();
				if (_normal.dot(_camDir) > 0) _normal.negate();
				setup.knife.pick(_hit, _normal, hit.object, hit.faceIndex ?? -1);
				bayonetPenRef.current = 0;
				const st = useStudio.getState();
				st.setBayonetHasEntry(true);
				st.setBayonetPen(0);
				if (st.bayonetAuto && !st.bayonetPump) setup.knife.beginAuto();
				if (pokeRef.current) {
					pokeRef.current.position.copy(_hit);
					pokeRef.current.visible = true;
				}
				return;
			}
			beginGrab(setup.knife.handle, _normal, "bayonet");
			return;
		}
		beginGrab(_hit, _normal, mode === "pose" ? "pose" : "drag");
	};
	const midY = (setup.y0 + setup.y1) * .5;
	const ab = setup.abdomen;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
			object: setup.root,
			onPointerDown,
			onPointerOver: () => {
				const m = useStudio.getState().interactMode;
				gl.domElement.style.cursor = m === "strike" || m === "bayonet" && !setup.knife.hasEntry ? "crosshair" : "grab";
			},
			onPointerOut: () => {
				if (!grab.current) gl.domElement.style.cursor = "default";
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				midY,
				ab.max.z + .01
			],
			onPointerDown,
			onPointerOver: () => {
				const m = useStudio.getState().interactMode;
				gl.domElement.style.cursor = m === "strike" || m === "bayonet" && !setup.knife.hasEntry ? "crosshair" : "grab";
			},
			onPointerOut: () => {
				if (!grab.current) gl.domElement.style.cursor = "default";
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				Math.max(.28, ab.max.x - ab.min.x + .12),
				Math.max(.55, setup.y1 - setup.y0 + .35),
				.14
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				transparent: true,
				opacity: 0,
				depthWrite: false
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("points", {
			ref: latticeRef,
			geometry: latticeGeo,
			visible: false,
			renderOrder: 20,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointsMaterial", {
				color: "#f2efe9",
				size: .018,
				sizeAttenuation: true,
				depthTest: false
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineSegments", {
			ref: bonesRef,
			geometry: boneGeo,
			visible: false,
			renderOrder: 19,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineBasicMaterial", {
				color: "#d4b5a0",
				depthTest: false
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref: pokeRef,
			visible: false,
			renderOrder: 10,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
				.024,
				.036,
				28
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#d4b5a0",
				transparent: true,
				opacity: .8,
				side: 2,
				depthTest: false
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref: ringRef,
			visible: false,
			renderOrder: 12,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
				.92,
				1,
				48
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#f2efe9",
				transparent: true,
				opacity: 0,
				side: 2,
				depthTest: false
			})]
		})
	] });
}
function Scene({ character, intestines, pelvis, arm, bayonet, bayonetLong, room }) {
	const controlsRef = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 touch-none",
		onContextMenu: (e) => e.preventDefault(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
			dpr: [1, 1.5],
			camera: {
				position: [
					.28,
					1.18,
					2.35
				],
				fov: 34,
				near: .05,
				far: 40
			},
			gl: {
				antialias: true,
				toneMapping: 4,
				toneMappingExposure: 1.05,
				alpha: false,
				powerPreference: "high-performance",
				preserveDrawingBuffer: true
			},
			onCreated: ({ gl, scene }) => {
				gl.setClearColor("#1a1614");
				scene.background = new Color("#1a1614");
				gl.domElement.style.touchAction = "none";
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Suspense, {
				fallback: null,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bedroom, { room }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioLights, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Figure, {
						controlsRef,
						character,
						intestines,
						pelvis,
						arm,
						bayonet,
						bayonetLong
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlsBridge, { controlsRef })
				]
			})
		})
	});
}
var ROOM_S = .7;
var BED_FOOT_Z = .347;
var BED_CENTER_Z = 1.288;
var PILLOW_Z = 2.64;
var _standQ = new Quaternion().setFromEuler(new Euler(0, Math.PI, 0));
var _lieQ = new Quaternion().setFromRotationMatrix(new Matrix4().set(-1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1));
function applyBedStance(room, stance) {
	const S = ROOM_S;
	room.scale.setScalar(S);
	if (stance === "on") {
		room.quaternion.copy(_standQ);
		room.position.set(0, -.57 * S, BED_CENTER_Z * S);
		return;
	}
	if (stance === "lie") {
		room.quaternion.copy(_lieQ);
		room.position.set(0, 1.98 - PILLOW_Z * S, -.1 - .5 * S);
		return;
	}
	room.quaternion.copy(_standQ);
	room.position.set(0, .016 * S, -.82 - BED_FOOT_Z * S);
}
function Bedroom({ room }) {
	const stance = useStudio((s) => s.bedStance);
	(0, import_react.useMemo)(() => {
		room.traverse((obj) => {
			const mesh = obj;
			if (!mesh.isMesh) return;
			mesh.castShadow = false;
			mesh.receiveShadow = false;
			const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
			for (const mat of mats) {
				const std = mat;
				if ("envMapIntensity" in std) std.envMapIntensity = .35;
				if (std.opacity >= .98 && !std.alphaMap) {
					std.transparent = false;
					std.depthWrite = true;
					std.depthTest = true;
				}
			}
		});
	}, [room]);
	applyBedStance(room, stance);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", { object: room });
}
function ControlsBridge({ controlsRef }) {
	const autoRotate = useStudio((s) => s.autoRotate);
	const grabbing = useStudio((s) => s.grabbing);
	const { gl, camera } = useThree();
	(0, import_react.useEffect)(() => {
		const canvas = gl.domElement;
		const host = canvas.parentElement ?? canvas;
		const TAP_MS = 340;
		const HOLD_MS = 280;
		const sph = new Spherical();
		const offset = new Vector3();
		let pressT = 0;
		let pressX = 0;
		let pressY = 0;
		let pressId = -1;
		let lastTapT = 0;
		let lastTapX = 0;
		let lastTapY = 0;
		let rotating = false;
		let rotId = -1;
		let px = 0;
		let py = 0;
		const setRotateFlag = (on) => {
			const c = controlsRef.current;
			if (c) c._touchRotate = on;
		};
		const rotateBy = (x, y) => {
			const c = controlsRef.current;
			if (!c) return;
			const dx = x - px;
			const dy = y - py;
			px = x;
			py = y;
			offset.copy(camera.position).sub(c.target);
			sph.setFromVector3(offset);
			sph.theta -= dx * .0055;
			sph.phi = MathUtils.clamp(sph.phi - dy * .0055, c.minPolarAngle, c.maxPolarAngle);
			sph.makeSafe();
			offset.setFromSpherical(sph);
			camera.position.copy(c.target).add(offset);
			camera.lookAt(c.target);
			c.update();
		};
		const down = (e) => {
			if (e.pointerType !== "touch") return;
			const now = performance.now();
			const dx = e.clientX - lastTapX;
			const dy = e.clientY - lastTapY;
			if (e.isPrimary && now - lastTapT < TAP_MS && dx * dx + dy * dy < 1444) {
				rotating = true;
				rotId = e.pointerId;
				px = e.clientX;
				py = e.clientY;
				lastTapT = 0;
				setRotateFlag(true);
				window.dispatchEvent(new Event("studio-cancel-grab"));
				e.stopPropagation();
				e.preventDefault();
				return;
			}
			pressT = now;
			pressX = e.clientX;
			pressY = e.clientY;
			pressId = e.pointerId;
		};
		const move = (e) => {
			if (!rotating || e.pointerId !== rotId) return;
			rotateBy(e.clientX, e.clientY);
			e.stopPropagation();
			e.preventDefault();
		};
		const up = (e) => {
			if (e.pointerType !== "touch") return;
			if (rotating && e.pointerId === rotId) {
				rotating = false;
				rotId = -1;
				setRotateFlag(false);
				return;
			}
			if (e.pointerId !== pressId) return;
			const dt = performance.now() - pressT;
			const dx = e.clientX - pressX;
			const dy = e.clientY - pressY;
			if (dt < HOLD_MS && dx * dx + dy * dy < 1444) {
				lastTapT = performance.now();
				lastTapX = e.clientX;
				lastTapY = e.clientY;
			} else lastTapT = 0;
			pressId = -1;
		};
		const touchStart = (e) => {
			if (e.touches.length < 2) return;
			rotating = false;
			rotId = -1;
			setRotateFlag(false);
			window.dispatchEvent(new Event("studio-cancel-grab"));
			const c = controlsRef.current;
			if (c) {
				c.enablePan = true;
				c.enableRotate = false;
			}
		};
		host.addEventListener("pointerdown", down, true);
		host.addEventListener("pointermove", move, true);
		host.addEventListener("pointerup", up, true);
		host.addEventListener("pointercancel", up, true);
		host.addEventListener("touchstart", touchStart, {
			capture: true,
			passive: true
		});
		return () => {
			host.removeEventListener("pointerdown", down, true);
			host.removeEventListener("pointermove", move, true);
			host.removeEventListener("pointerup", up, true);
			host.removeEventListener("pointercancel", up, true);
			host.removeEventListener("touchstart", touchStart, true);
		};
	}, [
		gl,
		camera,
		controlsRef
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
		ref: controlsRef,
		makeDefault: true,
		enableRotate: !grabbing,
		enablePan: !grabbing,
		enableDamping: true,
		dampingFactor: .08,
		autoRotate: autoRotate && !grabbing,
		autoRotateSpeed: .45,
		minDistance: .45,
		maxDistance: 5.4,
		minPolarAngle: Math.PI * .08,
		maxPolarAngle: Math.PI * .9,
		target: [
			0,
			.95,
			.02
		],
		mouseButtons: {
			LEFT: -1,
			MIDDLE: MOUSE.PAN,
			RIGHT: MOUSE.ROTATE
		},
		touches: {
			ONE: -1,
			TWO: TOUCH.DOLLY_PAN
		}
	});
}
function StudioLights() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", {
			intensity: .28,
			color: "#e6d8c8"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
			"#f2ebe3",
			"#3a322c",
			.42
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				1.8,
				3.2,
				2.4
			],
			intensity: 1.15,
			color: "#fff1e0"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				-2.6,
				2.4,
				.6
			],
			intensity: .35,
			color: "#c8d0dc"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
			position: [
				0,
				1.78,
				-.77
			],
			intensity: 4.8,
			distance: 6.5,
			decay: 2,
			color: "#ffd7b0"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
			position: [
				1.26,
				.95,
				-1.68
			],
			intensity: 1.8,
			distance: 3.6,
			decay: 2,
			color: "#ffc98a"
		})
	] });
}
//#endregion
export { Scene as default };
