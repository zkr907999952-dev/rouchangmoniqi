import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { B as MathUtils, L as LoadingManager, Tt as Vector3, _ as Euler, m as Color, st as Quaternion } from "../_libs/@react-three/drei+[...].mjs";
import { _ as Eye, a as Sword, b as ChevronsUpDown, c as RotateCw, d as Pause, f as MousePointerClick, g as Grab, h as Grid3x3, l as RotateCcw, m as Hand, n as Wrench, o as Settings2, p as Heart, r as Wind, s as Scan, t as Zap, u as Repeat, v as EyeOff, x as Activity, y as Crosshair } from "../_libs/lucide-react.mjs";
import { t as GLTFLoader } from "../_libs/three-stdlib.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BjnJqq51.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var EXPRESSIONS = [
	{
		id: "rest",
		label: "平静"
	},
	{
		id: "smile",
		label: "微笑"
	},
	{
		id: "surprise",
		label: "惊讶"
	},
	{
		id: "open",
		label: "开口"
	}
];
var POSES = [
	{
		id: "idle",
		label: "站立"
	},
	{
		id: "armsUp",
		label: "举手"
	},
	{
		id: "bow",
		label: "鞠躬"
	},
	{
		id: "legLift",
		label: "抬腿"
	},
	{
		id: "twist",
		label: "扭腰"
	},
	{
		id: "sway",
		label: "摇摆"
	}
];
var _q = new Quaternion();
var _from = new Vector3();
var _to = new Vector3();
var _axis = new Vector3();
var _v = new Vector3();
var _e = new Euler();
var IDENTITY = new Quaternion();
var _c = new Color();
function distToSeg(px, py, pz, ax, ay, az, bx, by, bz) {
	const abx = bx - ax;
	const aby = by - ay;
	const abz = bz - az;
	const apx = px - ax;
	const apy = py - ay;
	const apz = pz - az;
	const ab2 = abx * abx + aby * aby + abz * abz || 1e-8;
	let t = (apx * abx + apy * aby + apz * abz) / ab2;
	if (t < 0) t = 0;
	else if (t > 1) t = 1;
	const dx = apx - abx * t;
	const dy = apy - aby * t;
	const dz = apz - abz * t;
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
function smoother(d, r) {
	const t = d / Math.max(r, 1e-4);
	if (t >= 1) return 0;
	const u = 1 - t;
	return u * u * u * (u * (u * 6 - 15) + 10);
}
function hueColor(i, out) {
	return out.setHSL(i * .17 % 1, .62, .55);
}
function pt(lm, name, fb) {
	return lm[name] ?? fb;
}
var SoftSkeleton = class {
	names = [];
	parent;
	rest;
	radius;
	maxAng;
	group = [];
	count;
	energy = 0;
	expression = "rest";
	pose = "idle";
	q = [];
	qv = [];
	wpos = [];
	wrot = [];
	poseQ = [];
	exprQ = [];
	exprOff = [];
	off = [];
	hold = null;
	dents = [];
	rebound = .58;
	yawVel = 0;
	pitchVel = 0;
	yawF = 0;
	pitchF = 0;
	brL = {
		x: 0,
		y: 0,
		z: 0,
		vx: 0,
		vy: 0,
		vz: 0,
		sx: 0,
		sy: 0,
		sz: 0,
		svx: 0,
		svy: 0,
		svz: 0
	};
	brR = {
		x: 0,
		y: 0,
		z: 0,
		vx: 0,
		vy: 0,
		vz: 0,
		sx: 0,
		sy: 0,
		sz: 0,
		svx: 0,
		svy: 0,
		svz: 0
	};
	bindings = [];
	headY;
	bustY;
	navelY;
	breathT = 0;
	byName = {};
	constructor(lm, height) {
		const navel = pt(lm, "navel", new Vector3(0, height * .62, .1));
		const ny = navel.y;
		this.navelY = ny;
		this.headY = pt(lm, "head", new Vector3(0, height * .93, .02)).y;
		this.bustY = pt(lm, "lBreast", new Vector3(-.07, ny + .28, .08)).y;
		const h = (name, x, y, z) => pt(lm, name, new Vector3(x, y, z));
		const hips = h("hips", 0, ny - .12, .01);
		const spine1 = h("spine1", 0, ny - .01, .02);
		const spine2 = h("spine2", 0, ny + .11, .02);
		const spine3 = h("spine3", 0, ny + .27, .015);
		const neck = h("neck", 0, ny + .41, .01);
		const head = h("head", 0, this.headY, .02);
		const jaw = h("jaw", 0, this.headY - .035, .055);
		const eyeL = h("eyeL", -.03, this.headY + .005, .07);
		const eyeR = h("eyeR", .03, this.headY + .005, .07);
		const lClav = h("lClav", -.06, ny + .39, .01);
		const rClav = h("rClav", .06, ny + .39, .01);
		const lUpper = h("lUpper", -.16, ny + .36, .01);
		const rUpper = h("rUpper", .16, ny + .36, .01);
		const lFore = h("lFore", -.28, ny + .08, .02);
		const rFore = h("rFore", .28, ny + .08, .02);
		const lHand = h("lHand", -.42, ny - .18, .03);
		const rHand = h("rHand", .42, ny - .18, .03);
		const lThigh = h("lThigh", -.09, ny - .22, .01);
		const rThigh = h("rThigh", .09, ny - .22, .01);
		const lShin = h("lShin", -.09, .48, .02);
		const rShin = h("rShin", .09, .48, .02);
		const lAnkle = h("lAnkle", -.09, .1, .03);
		const rAnkle = h("rAnkle", .09, .1, .03);
		const lFoot = h("lFoot", -.09, .035, .06);
		const rFoot = h("rFoot", .09, .035, .06);
		const lToe = h("lToe", -.09, .025, .13);
		const rToe = h("rToe", .09, .025, .13);
		const hair1 = h("hair1", 0, this.headY + .04, -.03);
		const hair2 = h("hair2", 0, this.headY - .12, -.08);
		const hair3 = h("hair3", 0, this.headY - .3, -.07);
		const hair4 = h("hair4", 0, this.headY - .5, -.04);
		const hair5 = h("hair5", 0, this.headY - .7, -.02);
		const defs = [
			{
				name: "hips",
				parent: null,
				x: hips.x,
				y: hips.y,
				z: hips.z,
				radius: .16,
				maxAng: .35,
				group: "body"
			},
			{
				name: "spine1",
				parent: "hips",
				x: spine1.x,
				y: spine1.y,
				z: spine1.z,
				radius: .15,
				maxAng: .55,
				group: "body"
			},
			{
				name: "spine2",
				parent: "spine1",
				x: spine2.x,
				y: spine2.y,
				z: spine2.z,
				radius: .15,
				maxAng: .5,
				group: "body"
			},
			{
				name: "spine3",
				parent: "spine2",
				x: spine3.x,
				y: spine3.y,
				z: spine3.z,
				radius: .17,
				maxAng: .45,
				group: "body"
			},
			{
				name: "neck",
				parent: "spine3",
				x: neck.x,
				y: neck.y,
				z: neck.z,
				radius: .08,
				maxAng: .7,
				group: "body"
			},
			{
				name: "head",
				parent: "neck",
				x: head.x,
				y: head.y,
				z: head.z,
				radius: .12,
				maxAng: .55,
				group: "body"
			},
			{
				name: "jaw",
				parent: "head",
				x: jaw.x,
				y: jaw.y,
				z: jaw.z,
				radius: .055,
				maxAng: .7,
				group: "face"
			},
			{
				name: "browL",
				parent: "head",
				x: eyeL.x,
				y: eyeL.y + .018,
				z: eyeL.z - .01,
				radius: .04,
				maxAng: .4,
				group: "face"
			},
			{
				name: "browR",
				parent: "head",
				x: eyeR.x,
				y: eyeR.y + .018,
				z: eyeR.z - .01,
				radius: .04,
				maxAng: .4,
				group: "face"
			},
			{
				name: "eyeL",
				parent: "head",
				x: eyeL.x,
				y: eyeL.y,
				z: eyeL.z,
				radius: .032,
				maxAng: .3,
				group: "face"
			},
			{
				name: "eyeR",
				parent: "head",
				x: eyeR.x,
				y: eyeR.y,
				z: eyeR.z,
				radius: .032,
				maxAng: .3,
				group: "face"
			},
			{
				name: "cheekL",
				parent: "head",
				x: jaw.x - .038,
				y: jaw.y + .012,
				z: jaw.z,
				radius: .04,
				maxAng: .3,
				group: "face"
			},
			{
				name: "cheekR",
				parent: "head",
				x: jaw.x + .038,
				y: jaw.y + .012,
				z: jaw.z,
				radius: .04,
				maxAng: .3,
				group: "face"
			},
			{
				name: "mouthL",
				parent: "jaw",
				x: jaw.x - .02,
				y: jaw.y - .002,
				z: jaw.z + .012,
				radius: .03,
				maxAng: .4,
				group: "face"
			},
			{
				name: "mouthR",
				parent: "jaw",
				x: jaw.x + .02,
				y: jaw.y - .002,
				z: jaw.z + .012,
				radius: .03,
				maxAng: .4,
				group: "face"
			},
			{
				name: "tongue",
				parent: "jaw",
				x: jaw.x,
				y: jaw.y - .008,
				z: jaw.z,
				radius: .024,
				maxAng: .45,
				group: "face"
			},
			{
				name: "hair1",
				parent: "head",
				x: hair1.x,
				y: hair1.y,
				z: hair1.z,
				radius: .12,
				maxAng: .55,
				group: "hair"
			},
			{
				name: "hair2",
				parent: "hair1",
				x: hair2.x,
				y: hair2.y,
				z: hair2.z,
				radius: .13,
				maxAng: .75,
				group: "hair"
			},
			{
				name: "hair3",
				parent: "hair2",
				x: hair3.x,
				y: hair3.y,
				z: hair3.z,
				radius: .13,
				maxAng: .9,
				group: "hair"
			},
			{
				name: "hair4",
				parent: "hair3",
				x: hair4.x,
				y: hair4.y,
				z: hair4.z,
				radius: .13,
				maxAng: 1,
				group: "hair"
			},
			{
				name: "hair5",
				parent: "hair4",
				x: hair5.x,
				y: hair5.y,
				z: hair5.z,
				radius: .12,
				maxAng: 1.1,
				group: "hair"
			},
			{
				name: "belly",
				parent: "spine1",
				x: navel.x,
				y: navel.y,
				z: navel.z - .05,
				radius: .14,
				maxAng: .25,
				group: "body"
			},
			{
				name: "lClav",
				parent: "spine3",
				x: lClav.x,
				y: lClav.y,
				z: lClav.z,
				radius: .08,
				maxAng: .55,
				group: "body"
			},
			{
				name: "lUpper",
				parent: "lClav",
				x: lUpper.x,
				y: lUpper.y,
				z: lUpper.z,
				radius: .1,
				maxAng: 1.2,
				group: "body"
			},
			{
				name: "lFore",
				parent: "lUpper",
				x: lFore.x,
				y: lFore.y,
				z: lFore.z,
				radius: .08,
				maxAng: 1.3,
				group: "body"
			},
			{
				name: "lHand",
				parent: "lFore",
				x: lHand.x,
				y: lHand.y,
				z: lHand.z,
				radius: .06,
				maxAng: .8,
				group: "body"
			},
			{
				name: "rClav",
				parent: "spine3",
				x: rClav.x,
				y: rClav.y,
				z: rClav.z,
				radius: .08,
				maxAng: .55,
				group: "body"
			},
			{
				name: "rUpper",
				parent: "rClav",
				x: rUpper.x,
				y: rUpper.y,
				z: rUpper.z,
				radius: .1,
				maxAng: 1.2,
				group: "body"
			},
			{
				name: "rFore",
				parent: "rUpper",
				x: rFore.x,
				y: rFore.y,
				z: rFore.z,
				radius: .08,
				maxAng: 1.3,
				group: "body"
			},
			{
				name: "rHand",
				parent: "rFore",
				x: rHand.x,
				y: rHand.y,
				z: rHand.z,
				radius: .06,
				maxAng: .8,
				group: "body"
			},
			{
				name: "lThigh",
				parent: "hips",
				x: lThigh.x,
				y: lThigh.y,
				z: lThigh.z,
				radius: .12,
				maxAng: .9,
				group: "body"
			},
			{
				name: "lShin",
				parent: "lThigh",
				x: lShin.x,
				y: lShin.y,
				z: lShin.z,
				radius: .1,
				maxAng: 1,
				group: "body"
			},
			{
				name: "lAnkle",
				parent: "lShin",
				x: lAnkle.x,
				y: lAnkle.y,
				z: lAnkle.z,
				radius: .08,
				maxAng: .8,
				group: "foot"
			},
			{
				name: "lFoot",
				parent: "lAnkle",
				x: lFoot.x,
				y: lFoot.y,
				z: lFoot.z,
				radius: .08,
				maxAng: .6,
				group: "foot"
			},
			{
				name: "lToe",
				parent: "lFoot",
				x: lToe.x,
				y: lToe.y,
				z: lToe.z,
				radius: .06,
				maxAng: .45,
				group: "foot"
			},
			{
				name: "rThigh",
				parent: "hips",
				x: rThigh.x,
				y: rThigh.y,
				z: rThigh.z,
				radius: .12,
				maxAng: .9,
				group: "body"
			},
			{
				name: "rShin",
				parent: "rThigh",
				x: rShin.x,
				y: rShin.y,
				z: rShin.z,
				radius: .1,
				maxAng: 1,
				group: "body"
			},
			{
				name: "rAnkle",
				parent: "rShin",
				x: rAnkle.x,
				y: rAnkle.y,
				z: rAnkle.z,
				radius: .08,
				maxAng: .8,
				group: "foot"
			},
			{
				name: "rFoot",
				parent: "rAnkle",
				x: rFoot.x,
				y: rFoot.y,
				z: rFoot.z,
				radius: .08,
				maxAng: .6,
				group: "foot"
			},
			{
				name: "rToe",
				parent: "rFoot",
				x: rToe.x,
				y: rToe.y,
				z: rToe.z,
				radius: .06,
				maxAng: .45,
				group: "foot"
			}
		];
		this.count = defs.length;
		this.parent = new Int16Array(this.count);
		this.rest = new Float32Array(this.count * 3);
		this.radius = new Float32Array(this.count);
		this.maxAng = new Float32Array(this.count);
		defs.forEach((d, i) => {
			this.byName[d.name] = i;
		});
		for (let i = 0; i < this.count; i++) {
			const b = defs[i];
			this.names.push(b.name);
			this.group.push(b.group);
			this.parent[i] = b.parent ? this.byName[b.parent] ?? -1 : -1;
			this.rest[i * 3] = b.x;
			this.rest[i * 3 + 1] = b.y;
			this.rest[i * 3 + 2] = b.z;
			this.radius[i] = b.radius;
			this.maxAng[i] = b.maxAng;
			this.q.push(new Quaternion());
			this.qv.push(new Vector3());
			this.off.push(new Vector3());
			this.wpos.push(new Vector3(b.x, b.y, b.z));
			this.wrot.push(new Quaternion());
			this.poseQ.push(new Quaternion());
			this.exprQ.push(new Quaternion());
			this.exprOff.push(new Vector3());
		}
		this.updateFK();
	}
	bind(positions, hint = "body") {
		const n = positions.length / 3;
		const index = new Uint8Array(n * 4);
		const weight = new Float32Array(n * 4);
		const rest = new Float32Array(positions);
		const colors = new Float32Array(n * 3);
		const softness = new Float32Array(n);
		const delta = new Float32Array(n * 3);
		const dprev = new Float32Array(n * 3);
		const scores = new Float32Array(this.count);
		const allow = this.allowedBones(hint);
		const hy = this.headY;
		const by = this.bustY;
		const ny = this.navelY;
		for (let i = 0; i < n; i++) {
			const x = positions[i * 3];
			const y = positions[i * 3 + 1];
			const z = positions[i * 3 + 2];
			scores.fill(0);
			for (let a = 0; a < allow.length; a++) {
				const b = allow[a];
				const p = this.parent[b];
				const bx = this.rest[b * 3];
				const byy = this.rest[b * 3 + 1];
				const bz = this.rest[b * 3 + 2];
				scores[b] = smoother(p < 0 ? Math.hypot(x - bx, y - byy, z - bz) : distToSeg(x, y, z, this.rest[p * 3], this.rest[p * 3 + 1], this.rest[p * 3 + 2], bx, byy, bz), this.radius[b] * 1.35);
			}
			const bi = [
				0,
				0,
				0,
				0
			];
			const bw = [
				-1,
				-1,
				-1,
				-1
			];
			for (let b = 0; b < this.count; b++) {
				const s = scores[b];
				if (s > bw[0]) {
					bw[3] = bw[2];
					bi[3] = bi[2];
					bw[2] = bw[1];
					bi[2] = bi[1];
					bw[1] = bw[0];
					bi[1] = bi[0];
					bw[0] = s;
					bi[0] = b;
				} else if (s > bw[1]) {
					bw[3] = bw[2];
					bi[3] = bi[2];
					bw[2] = bw[1];
					bi[2] = bi[1];
					bw[1] = s;
					bi[1] = b;
				} else if (s > bw[2]) {
					bw[3] = bw[2];
					bi[3] = bi[2];
					bw[2] = s;
					bi[2] = b;
				} else if (s > bw[3]) {
					bw[3] = s;
					bi[3] = b;
				}
			}
			let sum = bw[0] + bw[1] + bw[2] + bw[3];
			if (sum < 1e-6) {
				bi[0] = allow[0] ?? 0;
				bw[0] = 1;
				bw[1] = 0;
				bw[2] = 0;
				bw[3] = 0;
				sum = 1;
			}
			const o = i * 4;
			index[o] = bi[0];
			index[o + 1] = bi[1];
			index[o + 2] = bi[2];
			index[o + 3] = bi[3];
			weight[o] = bw[0] / sum;
			weight[o + 1] = bw[1] / sum;
			weight[o + 2] = bw[2] / sum;
			weight[o + 3] = bw[3] / sum;
			hueColor(bi[0], _c);
			colors[i * 3] = _c.r;
			colors[i * 3 + 1] = _c.g;
			colors[i * 3 + 2] = _c.b;
			const front = MathUtils.clamp((z + .02) / .12, 0, 1);
			const belly = smoother(Math.abs(y - ny), .11) * smoother(Math.abs(x), .13) * front;
			const chest = smoother(Math.abs(y - by), .09) * smoother(Math.abs(Math.abs(x) - .07), .08) * front;
			const cheek = hint === "face" || hint === "mouth" ? smoother(Math.abs(y - (hy - .03)), .04) : 0;
			let soft = .12;
			if (hint === "dress") soft = .22 + belly * .7 + chest * .78;
			else if (hint === "organs") soft = .82;
			else if (hint === "hair") soft = .45;
			else if (hint === "legs") soft = y < .2 ? .2 : .35;
			else if (hint === "face" || hint === "mouth" || hint === "eye") soft = .2 + cheek * .4;
			softness[i] = Math.min(1, soft);
		}
		const binding = {
			positions,
			rest,
			count: n,
			index,
			weight,
			colors,
			softness,
			delta,
			dprev
		};
		this.bindings.push(binding);
		return binding;
	}
	allowedBones(hint) {
		const out = [];
		for (let i = 0; i < this.count; i++) {
			const g = this.group[i];
			const nm = this.names[i];
			let ok = false;
			if (hint === "hair") ok = g === "hair" || nm === "head" || nm === "neck";
			else if (hint === "eye") ok = /eye|head/.test(nm);
			else if (hint === "mouth") ok = /jaw|mouth|tongue|head/.test(nm);
			else if (hint === "face") ok = g === "face" || nm === "head" || nm === "neck";
			else if (hint === "legs") ok = g === "foot" || /hips|Thigh|Shin/.test(nm);
			else if (hint === "dress") ok = g === "body";
			else if (hint === "organs") ok = /belly|spine/.test(nm);
			else ok = g !== "hair" && g !== "face";
			if (ok) out.push(i);
		}
		return out.length ? out : [0];
	}
	pickBone(x, y, z) {
		let best = 1;
		let bestS = Infinity;
		for (let b = 0; b < this.count; b++) {
			if (this.names[b] === "hips") continue;
			const g = this.group[b];
			if (y < .22 && g !== "foot" && !/Shin|Thigh/.test(this.names[b])) continue;
			if (y > this.headY - .04 && g !== "face" && g !== "hair" && !/head|neck/.test(this.names[b])) continue;
			const p = this.parent[b];
			const bx = this.rest[b * 3];
			const by = this.rest[b * 3 + 1];
			const bz = this.rest[b * 3 + 2];
			let s = (p < 0 ? Math.hypot(x - bx, y - by, z - bz) : distToSeg(x, y, z, this.rest[p * 3], this.rest[p * 3 + 1], this.rest[p * 3 + 2], bx, by, bz)) / this.radius[b];
			if (y < .2 && g === "foot") s *= .4;
			if (s < bestS) {
				bestS = s;
				best = b;
			}
		}
		return best;
	}
	setPoseDrag(bone, gx, gy, gz, tx, ty, tz) {
		this.hold = {
			kind: "pose",
			bone,
			gx,
			gy,
			gz,
			tx,
			ty,
			tz
		};
	}
	setTissueDrag(gx, gy, gz, tx, ty, tz, radius = .14) {
		this.hold = {
			kind: "tissue",
			gx,
			gy,
			gz,
			tx,
			ty,
			tz,
			radius
		};
	}
	clearHold() {
		this.hold = null;
	}
	pushViewSpin(yawVel, pitchVel) {
		this.yawVel = MathUtils.clamp(yawVel, -12, 12);
		this.pitchVel = MathUtils.clamp(pitchVel, -8, 8);
	}
	commitPose() {
		for (let i = 0; i < this.count; i++) this.poseQ[i].copy(this.q[i]);
	}
	setExpression(id) {
		this.expression = id;
		for (let i = 0; i < this.count; i++) {
			this.exprQ[i].identity();
			this.exprOff[i].set(0, 0, 0);
		}
		const set = (name, ex, ey, ez, ox = 0, oy = 0, oz = 0) => {
			const i = this.byName[name];
			if (i === void 0) return;
			this.exprQ[i].setFromEuler(_e.set(ex, ey, ez, "XYZ"));
			this.exprOff[i].set(ox, oy, oz);
		};
		if (id === "smile") {
			set("mouthL", 0, 0, -.32, -.006, .01, .006);
			set("mouthR", 0, 0, .32, .006, .01, .006);
			set("cheekL", 0, .08, 0, -.008, .007, .006);
			set("cheekR", 0, -.08, 0, .008, .007, .006);
			set("eyeL", .18, 0, 0, 0, -.002, 0);
			set("eyeR", .18, 0, 0, 0, -.002, 0);
			set("browL", -.12, 0, 0, 0, .004, 0);
			set("browR", -.12, 0, 0, 0, .004, 0);
			set("jaw", -.06, 0, 0, 0, .003, 0);
		} else if (id === "surprise") {
			set("browL", -.42, .08, 0, -.004, .016, 0);
			set("browR", -.42, -.08, 0, .004, .016, 0);
			set("jaw", .58, 0, 0, 0, -.016, .01);
			set("mouthL", 0, 0, 0, -.01, -.004, .006);
			set("mouthR", 0, 0, 0, .01, -.004, .006);
			set("eyeL", -.18, 0, 0, 0, .004, .006);
			set("eyeR", -.18, 0, 0, 0, .004, .006);
		} else if (id === "open") {
			set("jaw", .72, 0, 0, 0, -.02, .012);
			set("mouthL", .14, 0, -.12, -.008, -.006, .006);
			set("mouthR", .14, 0, .12, .008, -.006, .006);
			set("tongue", .2, 0, 0, 0, -.008, .01);
		}
	}
	setPose(id) {
		this.pose = id;
		for (let i = 0; i < this.count; i++) this.poseQ[i].identity();
		const set = (name, ex, ey, ez) => {
			const i = this.byName[name];
			if (i === void 0) return;
			this.poseQ[i].setFromEuler(_e.set(ex, ey, ez, "XYZ"));
		};
		if (id === "armsUp") {
			set("lClav", 0, 0, .7);
			set("lUpper", -.25, .35, 1.7);
			set("lFore", .45, 0, .25);
			set("rClav", 0, 0, -.7);
			set("rUpper", -.25, -.35, -1.7);
			set("rFore", .45, 0, -.25);
			set("spine2", -.1, 0, 0);
		} else if (id === "bow") {
			set("spine1", .38, 0, 0);
			set("spine2", .42, 0, 0);
			set("spine3", .28, 0, 0);
			set("neck", .18, 0, 0);
			set("head", .12, 0, 0);
		} else if (id === "legLift") {
			set("lThigh", -1.15, .05, .08);
			set("lShin", .85, 0, 0);
			set("lAnkle", .2, 0, 0);
			set("spine1", -.06, 0, .04);
		} else if (id === "twist") {
			set("hips", 0, .12, 0);
			set("spine1", 0, .32, 0);
			set("spine2", 0, .38, 0);
			set("spine3", 0, .28, 0);
			set("neck", 0, -.18, 0);
			set("lUpper", .15, .25, .2);
			set("rUpper", .15, -.25, -.2);
		} else if (id === "sway") {
			set("hips", 0, 0, .22);
			set("spine1", 0, .18, -.12);
			set("spine2", 0, .22, .1);
			set("spine3", .08, .12, -.06);
			set("lUpper", .2, .3, .35);
			set("rUpper", .2, -.3, -.35);
			set("lThigh", .08, 0, .12);
			set("rThigh", -.12, 0, -.08);
		}
	}
	reset() {
		for (let i = 0; i < this.count; i++) {
			this.q[i].identity();
			this.qv[i].set(0, 0, 0);
			this.off[i].set(0, 0, 0);
			this.poseQ[i].identity();
		}
		for (const b of this.bindings) {
			b.delta.fill(0);
			b.dprev.fill(0);
		}
		this.brL.x = this.brL.y = this.brL.z = this.brL.vx = this.brL.vy = this.brL.vz = 0;
		this.brL.sx = this.brL.sy = this.brL.sz = this.brL.svx = this.brL.svy = this.brL.svz = 0;
		this.brR.x = this.brR.y = this.brR.z = this.brR.vx = this.brR.vy = this.brR.vz = 0;
		this.brR.sx = this.brR.sy = this.brR.sz = this.brR.svx = this.brR.svy = this.brR.svz = 0;
		this.yawF = this.pitchF = this.yawVel = this.pitchVel = 0;
		this.hold = null;
		this.dents.length = 0;
		this.setPose(this.pose);
		this.setExpression(this.expression);
		this.updateFK();
		this.applyAll();
	}
	shake(strength = .08) {
		for (const b of this.bindings) for (let i = 0; i < b.count; i++) {
			const s = b.softness[i] * strength;
			if (s < .002) continue;
			b.dprev[i * 3] += (Math.random() - .5) * s * .8;
			b.dprev[i * 3 + 1] += (Math.random() - .5) * s * .5;
			b.dprev[i * 3 + 2] += (Math.random() - .5) * s;
		}
	}
	impulse(x, y, z, force, range) {
		const f = MathUtils.clamp(force, .08, 1.15);
		const rg = MathUtils.clamp(range, .08, 1);
		const sig = .04 + rg * .1;
		const sig2 = sig * sig;
		const depth = .018 + f * .042;
		this.dents.push({
			x,
			y,
			z,
			t: 0,
			force: f,
			range: rg
		});
		if (this.dents.length > 3) this.dents.shift();
		for (const bind of this.bindings) {
			const { count, rest, softness, delta, dprev } = bind;
			for (let i = 0; i < count; i++) {
				const i3 = i * 3;
				const dx = rest[i3] - x;
				const dy = rest[i3 + 1] - y;
				rest[i3 + 2] - z;
				const r2 = dx * dx + dy * dy;
				const crater = Math.exp(-r2 / sig2);
				if (crater < .02) continue;
				const front = MathUtils.clamp((rest[i3 + 2] + .02) / .12, .15, 1);
				const wall = MathUtils.clamp(softness[i] * 2.8 + .4, .4, 1);
				const sink = crater * depth * front * wall;
				const inv = 1 / Math.max(1e-4, Math.hypot(dx, dy));
				delta[i3] += dx * inv * sink * .35;
				delta[i3 + 1] += dy * inv * sink * .28;
				delta[i3 + 2] -= sink;
				dprev[i3] += dx * inv * sink * 1.1;
				dprev[i3 + 1] += dy * inv * sink * .85;
				dprev[i3 + 2] -= sink * 2.4;
			}
		}
		for (let b = 0; b < this.count; b++) {
			if (this.names[b] !== "belly" && this.names[b] !== "spine1") continue;
			this.qv[b].z += f * (this.names[b] === "belly" ? 2.4 : .7);
		}
	}
	step(dt, params) {
		const d = Math.min(dt, .04);
		this.rebound = MathUtils.clamp(params.rebound, 0, 1);
		this.applyHoldPose();
		const heldBone = this.hold?.kind === "pose" ? this.hold.bone : -1;
		const heldParent = heldBone >= 0 ? this.parent[heldBone] : -1;
		const stiff = 14 + params.stiffness * 18;
		const damp = 6 + params.damping * 7;
		const jiggle = .4 + params.jiggle * .85;
		for (let i = 0; i < this.count; i++) {
			const g = this.group[i];
			const locked = i === heldBone || i === heldParent;
			const q = this.q[i];
			const qv = this.qv[i];
			const isFace = g === "face";
			const targetQ = isFace && this.expression !== "rest" ? this.exprQ[i] : this.poseQ[i];
			if (!locked) {
				_q.copy(q).invert().multiply(targetQ);
				const ang = 2 * Math.acos(Math.min(1, Math.abs(_q.w)));
				if (ang > 1e-5) {
					const s = Math.sqrt(1 - _q.w * _q.w) || 1e-6;
					const sign = _q.w < 0 ? -1 : 1;
					const k = isFace ? stiff * 1.5 : stiff;
					qv.x += sign * (_q.x / s) * ang * k * d;
					qv.y += sign * (_q.y / s) * ang * k * d;
					qv.z += sign * (_q.z / s) * ang * k * d;
				}
			}
			qv.multiplyScalar(Math.exp(-damp * d));
			const spin = qv.length() * d * (g === "hair" ? jiggle * 1.3 : .55);
			if (spin > 1e-8) {
				_axis.copy(qv).normalize();
				_q.setFromAxisAngle(_axis, spin);
				q.premultiply(_q);
				q.normalize();
			}
			const maxA = this.maxAng[i];
			const aNow = 2 * Math.acos(Math.min(1, Math.abs(q.w)));
			if (aNow > maxA && aNow > 1e-5) q.slerp(IDENTITY, 1 - maxA / aNow);
		}
		this.updateFK();
		this.stepDents(d);
		this.stepTissue(d, params);
		this.stepBreasts(d, params);
		this.applyAll();
		let e = 0;
		for (let i = 0; i < this.count; i++) {
			const a = 2 * Math.acos(Math.min(1, Math.abs(this.q[i].w)));
			e += a * a;
		}
		this.energy = e;
	}
	jointPositions(out) {
		for (let i = 0; i < this.count; i++) {
			out[i * 3] = this.wpos[i].x;
			out[i * 3 + 1] = this.wpos[i].y;
			out[i * 3 + 2] = this.wpos[i].z;
		}
		return out;
	}
	boneLineCount() {
		let n = 0;
		for (let i = 0; i < this.count; i++) if (this.parent[i] >= 0) n++;
		return n;
	}
	writeBoneLines(out) {
		let o = 0;
		for (let i = 0; i < this.count; i++) {
			const p = this.parent[i];
			if (p < 0) continue;
			out[o] = this.wpos[p].x;
			out[o + 1] = this.wpos[p].y;
			out[o + 2] = this.wpos[p].z;
			out[o + 3] = this.wpos[i].x;
			out[o + 4] = this.wpos[i].y;
			out[o + 5] = this.wpos[i].z;
			o += 6;
		}
		return out;
	}
	applyHoldPose() {
		const h = this.hold;
		if (!h || h.kind !== "pose") return;
		let b = h.bone;
		const maxChain = this.group[h.bone] === "foot" ? 4 : 3;
		for (let chain = 0; chain < maxChain && b >= 0; chain++) {
			if (this.names[b] === "hips") break;
			const restx = this.rest[b * 3];
			const resty = this.rest[b * 3 + 1];
			const restz = this.rest[b * 3 + 2];
			_from.set(h.gx - restx, h.gy - resty, h.gz - restz);
			_to.set(h.tx - restx, h.ty - resty, h.tz - restz);
			if (_from.lengthSq() < 1e-8 || _to.lengthSq() < 1e-8) {
				b = this.parent[b];
				continue;
			}
			_from.normalize();
			_to.normalize();
			_q.setFromUnitVectors(_from, _to);
			const influence = chain === 0 ? .78 : chain === 1 ? .4 : .16;
			this.q[b].slerp(_q, influence);
			const ang = 2 * Math.acos(Math.min(1, Math.abs(this.q[b].w)));
			if (ang > this.maxAng[b]) this.q[b].slerp(IDENTITY, 1 - this.maxAng[b] / ang);
			b = this.parent[b];
		}
	}
	get hasDents() {
		return this.dents.length > 0;
	}
	stepDents(d) {
		const rec = .5 + (1 - this.rebound) * 3.4;
		const hold = .18 + (1 - this.rebound) * .28;
		for (const dent of this.dents) dent.t += d;
		this.dents = this.dents.filter((dent) => dent.t < hold + rec + .15);
	}
	dentGain(t) {
		const hold = .18 + (1 - this.rebound) * .28;
		const rec = .5 + (1 - this.rebound) * 3.4;
		if (t < .055) {
			const u = t / .055;
			return u * u;
		}
		if (t < hold) return 1;
		const s = 1 - Math.min(1, (t - hold) / rec);
		return s * s * (3 - 2 * s);
	}
	stepTissue(d, params) {
		const boost = MathUtils.clamp(params.breathBoost, 0, 1);
		const freq = (.85 + params.breathSpeed * 1.9) * (1 + boost * .55);
		const amp = (.006 + params.breathAmp * .012) * (1 + boost * .4);
		this.breathT += d * freq;
		const breath = params.breathing ? Math.sin(this.breathT) * amp : 0;
		const grab = this.hold?.kind === "tissue" ? this.hold : null;
		const k = 18 + params.stiffness * 26;
		const damp = Math.exp(-(4 + params.damping * 6) * d);
		const g = params.gravity * 9e-4;
		const ny = this.navelY;
		const by = this.bustY;
		for (const bind of this.bindings) {
			const { count, rest, softness, delta, dprev } = bind;
			for (let i = 0; i < count; i++) {
				const s = softness[i];
				if (s < .02) {
					delta[i * 3] = 0;
					delta[i * 3 + 1] = 0;
					delta[i * 3 + 2] = 0;
					continue;
				}
				const i3 = i * 3;
				const x = rest[i3];
				const y = rest[i3 + 1];
				const z = rest[i3 + 2];
				let tx = 0;
				let ty = 0;
				let tz = 0;
				const belly = smoother(Math.abs(y - ny), .12) * smoother(Math.abs(x), .14);
				const chest = smoother(Math.abs(y - by), .1) * smoother(Math.abs(Math.abs(x) - .07), .09);
				const front = MathUtils.clamp((z + .01) / .11, 0, 1);
				tz += breath * .72 * belly * front;
				if (params.fistDepth > .002) {
					const over = params.fistDepth;
					const bAmp = params.fistBulge;
					const spread = Math.max(.2, params.fistSpread);
					const dx = x - params.fistTx;
					const dy = y - params.fistTy;
					const bulge = smoother(Math.hypot(dx, dy), .16 * spread) * front;
					const rise = params.fistRise;
					tz += over * .9 * bAmp * rise * bulge;
					ty += over * .26 * bAmp * rise * bulge;
					tx += params.fistLx * .07 * over * bulge * 6 * params.fistLever * rise;
					tz += params.fistLz * .05 * over * bulge * 6 * params.fistLever * rise;
				}
				const inf = params.inflate;
				if (Math.abs(inf) > .004) {
					const yMask = smoother(Math.abs(y - ny), .2);
					const xMask = smoother(Math.abs(x), .22);
					const zMask = MathUtils.clamp((z + .04) / .14, 0, 1);
					const mask = yMask * xMask * (.28 + .72 * zMask);
					if (mask > .01) {
						if (inf > 0) {
							tz += inf * .24 * mask;
							tx += Math.sign(x) * inf * .15 * mask * Math.min(1, Math.abs(x) / .035);
							ty -= inf * .045 * mask * zMask;
						} else {
							const c = -inf;
							tx += -x * c * .9 * yMask * xMask;
							tz -= c * .08 * mask;
							ty += c * .02 * mask;
						}
					}
				}
				if (this.dents.length) for (const dent of this.dents) {
					const gain = this.dentGain(dent.t);
					if (gain < .01) continue;
					const dx = x - dent.x;
					const dy = y - dent.y;
					const r2 = dx * dx + dy * dy;
					const sig = .04 + dent.range * .1;
					const crater = Math.exp(-r2 / (sig * sig));
					const r = Math.sqrt(r2);
					const rim = Math.exp(-((r - sig * 1.12) / (sig * .42)) * ((r - sig * 1.12) / (sig * .42)));
					const depth = (.016 + dent.force * .042) * gain;
					const wall = MathUtils.clamp(s * 2.6 + .45, .45, 1) * front;
					const sink = crater * depth * wall;
					tz -= sink;
					tz += rim * depth * .22 * wall;
					const inv = r < 1e-4 ? 0 : 1 / r;
					tx += dx * inv * sink * .32;
					ty += dy * inv * sink * .26;
				}
				if (grab) {
					const dx = x - grab.gx;
					const dy = y - grab.gy;
					const dz = z - grab.gz;
					const w = s * Math.exp(-(dx * dx + dy * dy + dz * dz) / (grab.radius * grab.radius));
					tx += (grab.tx - grab.gx) * w;
					ty += (grab.ty - grab.gy) * w;
					tz += (grab.tz - grab.gz) * w;
				}
				let vx = (delta[i3] - dprev[i3]) * damp;
				let vy = (delta[i3 + 1] - dprev[i3 + 1]) * damp;
				let vz = (delta[i3 + 2] - dprev[i3 + 2]) * damp;
				vy += g * s * belly * .2;
				const bounce = .62 + chest * -.08;
				vx += (tx - delta[i3]) * k * d * bounce;
				vy += (ty - delta[i3 + 1]) * k * d * bounce;
				vz += (tz - delta[i3 + 2]) * k * d * bounce;
				dprev[i3] = delta[i3];
				dprev[i3 + 1] = delta[i3 + 1];
				dprev[i3 + 2] = delta[i3 + 2];
				delta[i3] = delta[i3] + vx;
				delta[i3 + 1] = delta[i3 + 1] + vy;
				delta[i3 + 2] = delta[i3 + 2] + vz;
				const over = params.fistDepth;
				const lim = .12 + s * .04 + Math.abs(params.inflate) * .18 + Math.min(.22, over * .85 * params.fistBulge * params.fistRise);
				const len = Math.hypot(delta[i3], delta[i3 + 1], delta[i3 + 2]);
				if (len > lim) {
					const m = lim / len;
					delta[i3] *= m;
					delta[i3 + 1] *= m;
					delta[i3 + 2] *= m;
				}
			}
		}
	}
	stepBreasts(d, params) {
		const follow = 1 - Math.exp(-6 * d);
		this.yawF += (this.yawVel - this.yawF) * follow;
		this.pitchF += (this.pitchVel - this.pitchF) * follow;
		const j = .5 + params.jiggle * .7;
		const tX = -this.yawF * .013 * j;
		const tY = this.pitchF * .007 * j;
		const tZ = Math.abs(this.yawF) * .0028 * j;
		const c1 = 6.324;
		const c2 = .64 * 10.4;
		const lim = .042;
		const step = (m, lag) => {
			m.vx += (-26.009999999999998 * (m.x - tX * lag) - c1 * m.vx) * d;
			m.vy += (-26.009999999999998 * (m.y - tY * lag) - c1 * m.vy) * d;
			m.vz += (-26.009999999999998 * (m.z - tZ * lag) - c1 * m.vz) * d;
			m.x += m.vx * d;
			m.y += m.vy * d;
			m.z += m.vz * d;
			m.svx += (-108.16000000000001 * (m.sx - m.x) - c2 * (m.svx - m.vx)) * d;
			m.svy += (-108.16000000000001 * (m.sy - m.y) - c2 * (m.svy - m.vy)) * d;
			m.svz += (-108.16000000000001 * (m.sz - m.z) - c2 * (m.svz - m.vz)) * d;
			m.sx += m.svx * d;
			m.sy += m.svy * d;
			m.sz += m.svz * d;
			const len = Math.hypot(m.sx, m.sy, m.sz);
			if (len > lim) {
				const s = lim / len;
				m.sx *= s;
				m.sy *= s;
				m.sz *= s;
			}
		};
		step(this.brL, 1);
		step(this.brR, 1.08);
	}
	updateFK() {
		for (let i = 0; i < this.count; i++) {
			const p = this.parent[i];
			const ox = this.exprOff[i].x;
			const oy = this.exprOff[i].y;
			const oz = this.exprOff[i].z;
			if (p < 0) {
				this.wrot[i].copy(this.q[i]);
				this.wpos[i].set(this.rest[i * 3] + ox, this.rest[i * 3 + 1] + oy, this.rest[i * 3 + 2] + oz);
				continue;
			}
			this.wrot[i].copy(this.wrot[p]).multiply(this.q[i]);
			_v.set(this.rest[i * 3] - this.rest[p * 3] + ox, this.rest[i * 3 + 1] - this.rest[p * 3 + 1] + oy, this.rest[i * 3 + 2] - this.rest[p * 3 + 2] + oz);
			_v.applyQuaternion(this.wrot[p]);
			this.wpos[i].copy(this.wpos[p]).add(_v);
		}
	}
	applyAll() {
		for (const b of this.bindings) this.apply(b);
	}
	apply(binding) {
		const { positions, rest, count, index, weight, delta } = binding;
		for (let i = 0; i < count; i++) {
			const i3 = i * 3;
			const rx = rest[i3];
			const ry = rest[i3 + 1];
			const rz = rest[i3 + 2];
			let ox = 0;
			let oy = 0;
			let oz = 0;
			const o = i * 4;
			for (let k = 0; k < 4; k++) {
				const w = weight[o + k];
				if (w < 8e-4) continue;
				const bi = index[o + k];
				_v.set(rx - this.rest[bi * 3], ry - this.rest[bi * 3 + 1], rz - this.rest[bi * 3 + 2]);
				_v.applyQuaternion(this.wrot[bi]);
				_v.add(this.wpos[bi]);
				ox += _v.x * w;
				oy += _v.y * w;
				oz += _v.z * w;
			}
			positions[i3] = ox + delta[i3];
			positions[i3 + 1] = oy + delta[i3 + 1];
			positions[i3 + 2] = oz + delta[i3 + 2];
			const chest = smoother(Math.abs(ry - this.bustY), .13) * smoother(Math.abs(Math.abs(rx) - .075), .11) * MathUtils.clamp((rz + .02) / .12, 0, 1);
			if (chest > .04) {
				const br = rx < 0 ? this.brL : this.brR;
				const w = chest * (.4 + .6 * MathUtils.clamp((this.bustY + .04 - ry) / .14, .15, 1));
				positions[i3] += br.sx * w;
				positions[i3 + 1] += br.sy * w;
				positions[i3 + 2] += br.sz * w;
			}
		}
	}
};
var PRESETS = {
	soft: {
		label: "柔软",
		hint: "松弛回弹",
		stiffness: .28,
		damping: .94,
		gravity: -1.4,
		pressure: .55,
		jiggle: 1,
		wind: 0,
		breathing: true,
		breathAmp: .72,
		breathSpeed: .48,
		slowMo: false,
		showLattice: false,
		showWeights: false,
		autoRotate: false,
		abdomenXray: .38,
		bellyInflate: 0,
		navelDepth: .5,
		navelDiameter: 1,
		showOrgans: true,
		showGutHp: false,
		gutAmp: .3,
		gutSpeed: .5,
		strikeForce: .52,
		strikeRange: .32,
		strikeRebound: .72,
		fistBulge: 1.4,
		fistSpread: 1,
		fistGut: 1,
		fistLever: 1,
		fistMaxDepth: 1,
		fistRise: .7,
		fistThrust: false,
		fistStir: false,
		fistThrustSpeed: .45,
		fistThrustStart: .025,
		fistStirSpeed: .55,
		fistStirRadius: .4,
		bedStance: "front",
		uiHidden: false
	},
	firm: {
		label: "紧致",
		hint: "快速复位",
		stiffness: .82,
		damping: .9,
		gravity: -.4,
		pressure: .85,
		jiggle: .55,
		wind: 0,
		breathing: true,
		breathAmp: .72,
		breathSpeed: .48,
		slowMo: false,
		showLattice: false,
		showWeights: false,
		autoRotate: false,
		abdomenXray: .38,
		bellyInflate: 0,
		navelDepth: .5,
		navelDiameter: 1,
		showOrgans: true,
		showGutHp: false,
		gutAmp: .3,
		gutSpeed: .5,
		strikeForce: .52,
		strikeRange: .32,
		strikeRebound: .72,
		fistBulge: 1.4,
		fistSpread: 1,
		fistGut: 1,
		fistLever: 1,
		fistMaxDepth: 1,
		fistRise: .7,
		fistThrust: false,
		fistStir: false,
		fistThrustSpeed: .45,
		fistThrustStart: .025,
		fistStirSpeed: .55,
		fistStirRadius: .4,
		bedStance: "front",
		uiHidden: false
	},
	jelly: {
		label: "果冻",
		hint: "长时间晃动",
		stiffness: .16,
		damping: .985,
		gravity: -.2,
		pressure: .7,
		jiggle: 1,
		wind: .15,
		breathing: false,
		breathAmp: .72,
		breathSpeed: .48,
		slowMo: false,
		showLattice: false,
		showWeights: false,
		autoRotate: false,
		abdomenXray: .38,
		bellyInflate: 0,
		navelDepth: .5,
		navelDiameter: 1,
		showOrgans: true,
		showGutHp: false,
		gutAmp: .3,
		gutSpeed: .5,
		strikeForce: .52,
		strikeRange: .32,
		strikeRebound: .72,
		fistBulge: 1.4,
		fistSpread: 1,
		fistGut: 1,
		fistLever: 1,
		fistMaxDepth: 1,
		fistRise: .7,
		fistThrust: false,
		fistStir: false,
		fistThrustSpeed: .45,
		fistThrustStart: .025,
		fistStirSpeed: .55,
		fistStirRadius: .4,
		bedStance: "front",
		uiHidden: false
	},
	athletic: {
		label: "运动",
		hint: "弹性支撑",
		stiffness: .58,
		damping: .92,
		gravity: -.8,
		pressure: .72,
		jiggle: .78,
		wind: 0,
		breathing: true,
		breathAmp: .72,
		breathSpeed: .48,
		slowMo: false,
		showLattice: false,
		showWeights: false,
		autoRotate: false,
		abdomenXray: .38,
		bellyInflate: 0,
		navelDepth: .5,
		navelDiameter: 1,
		showOrgans: true,
		showGutHp: false,
		gutAmp: .3,
		gutSpeed: .5,
		strikeForce: .52,
		strikeRange: .32,
		strikeRebound: .72,
		fistBulge: 1.4,
		fistSpread: 1,
		fistGut: 1,
		fistLever: 1,
		fistMaxDepth: 1,
		fistRise: .7,
		fistThrust: false,
		fistStir: false,
		fistThrustSpeed: .45,
		fistThrustStart: .025,
		fistStirSpeed: .55,
		fistStirRadius: .4,
		bedStance: "front",
		uiHidden: false
	}
};
var useStudio = create((set) => ({
	...PRESETS.soft,
	preset: "soft",
	interactMode: "drag",
	expression: "rest",
	pose: "idle",
	energy: 0,
	grabbing: false,
	shakeNonce: 0,
	resetNonce: 0,
	strikeNonce: 0,
	strikePoint: null,
	loading: true,
	loadProgress: 0,
	loadHint: "准备下载",
	loadError: null,
	retryNonce: 0,
	bayonetHasEntry: false,
	bayonetPen: 0,
	bayonetAuto: false,
	bayonetPump: false,
	bayonetKind: "short",
	setParam: (key, value) => set((s) => ({
		...s,
		[key]: value,
		preset: s.preset
	})),
	applyPreset: (id) => set((s) => ({
		...PRESETS[id],
		preset: id,
		abdomenXray: s.abdomenXray,
		bellyInflate: s.bellyInflate,
		navelDepth: s.navelDepth,
		navelDiameter: s.navelDiameter,
		breathAmp: s.breathAmp,
		breathSpeed: s.breathSpeed,
		showOrgans: s.showOrgans,
		showGutHp: s.showGutHp,
		gutAmp: s.gutAmp,
		gutSpeed: s.gutSpeed,
		strikeForce: s.strikeForce,
		strikeRange: s.strikeRange,
		strikeRebound: s.strikeRebound,
		fistBulge: s.fistBulge,
		fistSpread: s.fistSpread,
		fistGut: s.fistGut,
		fistLever: s.fistLever,
		fistMaxDepth: s.fistMaxDepth,
		fistRise: s.fistRise,
		fistThrust: s.fistThrust,
		fistStir: s.fistStir,
		fistThrustSpeed: s.fistThrustSpeed,
		fistThrustStart: s.fistThrustStart,
		fistStirSpeed: s.fistStirSpeed,
		fistStirRadius: s.fistStirRadius,
		bedStance: s.bedStance,
		showLattice: s.showLattice,
		showWeights: s.showWeights,
		uiHidden: s.uiHidden,
		interactMode: s.interactMode,
		expression: s.expression,
		pose: s.pose
	})),
	setInteractMode: (interactMode) => set({ interactMode }),
	setExpression: (expression) => set({ expression }),
	setPose: (pose) => set({ pose }),
	setEnergy: (energy) => set({ energy }),
	setGrabbing: (grabbing) => set({ grabbing }),
	setBayonetHasEntry: (bayonetHasEntry) => set({ bayonetHasEntry }),
	setBayonetPen: (bayonetPen) => set({ bayonetPen: Math.max(0, Math.min(1, bayonetPen)) }),
	setBayonetAuto: (bayonetAuto) => set((s) => ({
		bayonetAuto,
		bayonetPump: bayonetAuto ? false : s.bayonetPump
	})),
	setBayonetPump: (bayonetPump) => set((s) => ({
		bayonetPump,
		bayonetAuto: bayonetPump ? false : s.bayonetAuto
	})),
	setBayonetKind: (bayonetKind) => set({
		bayonetKind,
		interactMode: "bayonet"
	}),
	shake: () => set((s) => ({ shakeNonce: s.shakeNonce + 1 })),
	fireStrike: (point = null) => set((s) => ({
		strikeNonce: s.strikeNonce + 1,
		strikePoint: point ?? null
	})),
	resetSim: () => set((s) => ({
		resetNonce: s.resetNonce + 1,
		energy: 0,
		bayonetHasEntry: false,
		bayonetPen: 0
	})),
	retryLoad: () => set((s) => ({
		loading: true,
		loadProgress: 0,
		loadHint: "重新下载",
		loadError: null,
		retryNonce: s.retryNonce + 1
	}))
}));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var SLIDERS = [
	{
		id: "stiffness",
		label: "刚度",
		min: .08,
		max: 1,
		step: .01
	},
	{
		id: "damping",
		label: "阻尼",
		min: .82,
		max: .995,
		step: .001
	},
	{
		id: "gravity",
		label: "重力",
		min: -4,
		max: 2,
		step: .05
	},
	{
		id: "pressure",
		label: "体积",
		min: .1,
		max: 1,
		step: .01
	},
	{
		id: "jiggle",
		label: "柔度",
		min: .2,
		max: 1,
		step: .01
	},
	{
		id: "wind",
		label: "风力",
		min: 0,
		max: 1,
		step: .01
	},
	{
		id: "breathAmp",
		label: "呼吸幅度",
		min: 0,
		max: 1,
		step: .01
	},
	{
		id: "breathSpeed",
		label: "呼吸速度",
		min: .05,
		max: 1,
		step: .01
	},
	{
		id: "abdomenXray",
		label: "腹部半透明",
		min: 0,
		max: 1,
		step: .01
	},
	{
		id: "bellyInflate",
		label: "彭腹",
		min: -1,
		max: 1,
		step: .01
	},
	{
		id: "navelDepth",
		label: "肚脐深度",
		min: 0,
		max: 1,
		step: .01
	},
	{
		id: "navelDiameter",
		label: "肚脐直径",
		min: .4,
		max: 2,
		step: .01
	},
	{
		id: "gutAmp",
		label: "蠕动幅度",
		min: 0,
		max: 1,
		step: .01
	},
	{
		id: "gutSpeed",
		label: "蠕动速度",
		min: 0,
		max: 1,
		step: .01
	},
	{
		id: "fistBulge",
		label: "拳头鼓起",
		min: 0,
		max: 2,
		step: .01
	},
	{
		id: "fistSpread",
		label: "鼓起范围",
		min: .2,
		max: 2,
		step: .01
	},
	{
		id: "fistGut",
		label: "肠子撑开",
		min: 0,
		max: 2,
		step: .01
	},
	{
		id: "fistLever",
		label: "杠杆搅动",
		min: 0,
		max: 2,
		step: .01
	},
	{
		id: "fistMaxDepth",
		label: "最大插入深度",
		min: .5,
		max: 1.5,
		step: .01
	},
	{
		id: "fistRise",
		label: "隆起叠加速度",
		min: .2,
		max: 3,
		step: .01
	}
];
var PANELS = [
	{
		id: "settings",
		label: "设置",
		icon: Settings2
	},
	{
		id: "interact",
		label: "互动",
		icon: Hand
	},
	{
		id: "tools",
		label: "工具",
		icon: Wrench
	},
	{
		id: "weapons",
		label: "武器",
		icon: Sword
	}
];
var STRIKE_LEVELS = [
	{
		id: "light",
		label: "轻",
		force: .28
	},
	{
		id: "mid",
		label: "中",
		force: .52
	},
	{
		id: "heavy",
		label: "重",
		force: .78
	},
	{
		id: "max",
		label: "极重",
		force: 1
	}
];
function Overlay() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [panel, setPanel] = (0, import_react.useState)("settings");
	const preset = useStudio((s) => s.preset);
	const breathing = useStudio((s) => s.breathing);
	const slowMo = useStudio((s) => s.slowMo);
	const showLattice = useStudio((s) => s.showLattice);
	const showWeights = useStudio((s) => s.showWeights);
	const expression = useStudio((s) => s.expression);
	const pose = useStudio((s) => s.pose);
	const setExpression = useStudio((s) => s.setExpression);
	const setPose = useStudio((s) => s.setPose);
	const autoRotate = useStudio((s) => s.autoRotate);
	const showOrgans = useStudio((s) => s.showOrgans);
	const showGutHp = useStudio((s) => s.showGutHp);
	const uiHidden = useStudio((s) => s.uiHidden);
	const abdomenXray = useStudio((s) => s.abdomenXray);
	const bedStance = useStudio((s) => s.bedStance);
	const interactMode = useStudio((s) => s.interactMode);
	const setInteractMode = useStudio((s) => s.setInteractMode);
	const grabbing = useStudio((s) => s.grabbing);
	const loading = useStudio((s) => s.loading);
	const loadProgress = useStudio((s) => s.loadProgress);
	const loadHint = useStudio((s) => s.loadHint);
	const loadError = useStudio((s) => s.loadError);
	const retryLoad = useStudio((s) => s.retryLoad);
	const applyPreset = useStudio((s) => s.applyPreset);
	const setParam = useStudio((s) => s.setParam);
	const resetSim = useStudio((s) => s.resetSim);
	const fireStrike = useStudio((s) => s.fireStrike);
	const strikeForce = useStudio((s) => s.strikeForce);
	const strikeRange = useStudio((s) => s.strikeRange);
	const strikeRebound = useStudio((s) => s.strikeRebound);
	const fistMaxDepth = useStudio((s) => s.fistMaxDepth);
	const fistThrust = useStudio((s) => s.fistThrust);
	const fistStir = useStudio((s) => s.fistStir);
	const fistThrustSpeed = useStudio((s) => s.fistThrustSpeed);
	const fistThrustStart = useStudio((s) => s.fistThrustStart);
	const fistStirSpeed = useStudio((s) => s.fistStirSpeed);
	const fistStirRadius = useStudio((s) => s.fistStirRadius);
	const bayonetHasEntry = useStudio((s) => s.bayonetHasEntry);
	const bayonetPen = useStudio((s) => s.bayonetPen);
	const bayonetAuto = useStudio((s) => s.bayonetAuto);
	const bayonetPump = useStudio((s) => s.bayonetPump);
	const bayonetKind = useStudio((s) => s.bayonetKind);
	const setBayonetPen = useStudio((s) => s.setBayonetPen);
	const setBayonetAuto = useStudio((s) => s.setBayonetAuto);
	const setBayonetPump = useStudio((s) => s.setBayonetPump);
	const setBayonetKind = useStudio((s) => s.setBayonetKind);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const tag = e.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;
			if (e.key === "r" || e.key === "R") resetSim();
			if (e.key === "b" || e.key === "B") setParam("breathing", !useStudio.getState().breathing);
			if (e.key === "h" || e.key === "H") setParam("uiHidden", !useStudio.getState().uiHidden);
			if (e.key === "t" || e.key === "T") {
				const order = [
					"drag",
					"pose",
					"strike",
					"fist",
					"bayonet"
				];
				const cur = useStudio.getState().interactMode;
				const i = order.indexOf(cur);
				setInteractMode(order[(i + 1) % order.length]);
			}
			if (e.key === "x" || e.key === "X") {
				const cur = useStudio.getState().abdomenXray;
				setParam("abdomenXray", cur > .05 ? 0 : .38);
				if (cur <= .05) setParam("showOrgans", true);
			}
			if (e.key === "k" || e.key === "K") setParam("showLattice", !useStudio.getState().showLattice);
			if (e.key === "w" || e.key === "W") setParam("showWeights", !useStudio.getState().showWeights);
			const exprKeys = {
				"1": "rest",
				"2": "smile",
				"3": "surprise",
				"4": "open"
			};
			if (exprKeys[e.key]) setExpression(exprKeys[e.key]);
			const poseKeys = {
				"5": "idle",
				"6": "armsUp",
				"7": "bow",
				"8": "legLift",
				"9": "twist",
				"0": "sway"
			};
			if (poseKeys[e.key]) setPose(poseKeys[e.key]);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		resetSim,
		setParam,
		setInteractMode,
		setExpression,
		setPose
	]);
	const hideUi = () => setParam("uiHidden", true);
	const showUi = () => setParam("uiHidden", false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-10 text-fg",
		children: [
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-30 flex items-center justify-center bg-bg/70",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-64 rounded-xl border border-border bg-surface px-6 py-5 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl tracking-display",
						children: loadError ? "载入失败" : "载入模型"
					}), loadError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs leading-relaxed text-muted text-pretty",
						children: loadError
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: retryLoad,
						className: "pointer-events-auto mt-4 inline-flex h-11 w-full items-center justify-center rounded-md bg-accent text-sm font-medium text-accent-fg",
						children: "重试"
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 h-1 overflow-hidden rounded-full bg-surface-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-accent transition-[width] duration-fast ease-smooth-out",
								style: { width: `${Math.max(3, Math.round(loadProgress))}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted tabular-nums",
							children: [Math.round(loadProgress), "%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: loadHint
						})
					] })]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: uiHidden ? showUi : hideUi,
				className: "pointer-events-auto absolute top-4 right-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-fg sm:top-6 sm:right-6",
				"aria-label": uiHidden ? "显示菜单" : "隐藏菜单",
				children: uiHidden ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" })
			}),
			uiHidden ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "pointer-events-none absolute top-0 right-0 left-0 flex items-start justify-between gap-4 p-4 pr-16 sm:p-6 sm:pr-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-[16rem]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl leading-none tracking-display text-fg sm:text-3xl",
							children: "柔肠模拟器"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-[11px] leading-snug text-muted sm:hidden",
							children: "双指拖动平移 · 双击后拖动旋转"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								const on = abdomenXray > .05;
								setParam("abdomenXray", on ? 0 : .38);
								if (!on) setParam("showOrgans", true);
							},
							className: cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-fast ease-smooth-out", abdomenXray > .05 ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface/80 text-muted hover:text-fg"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scan, { className: "size-3.5" }), "透视"]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: cn("pointer-events-auto absolute right-4 bottom-4 left-4 max-h-[52vh] overflow-hidden rounded-xl border border-border bg-surface sm:right-6 sm:bottom-auto sm:left-auto sm:top-24 sm:max-h-[calc(100dvh-8rem)] sm:w-80"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-4 border-b border-border",
							children: PANELS.map((item) => {
								const Icon = item.icon;
								const on = panel === item.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setPanel(item.id);
										setOpen(true);
									},
									className: cn("inline-flex h-11 flex-col items-center justify-center gap-0.5 text-[10px] font-medium sm:h-12 sm:text-[11px]", on ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }), item.label]
								}, item.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 px-3 pt-2 sm:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: PANELS.find((p) => p.id === panel)?.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-xs text-muted",
								onClick: () => setOpen((v) => !v),
								children: open ? "收起" : "展开"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("overflow-y-auto p-3 sm:block sm:max-h-[calc(100dvh-12rem)] sm:p-4", open ? "block" : "hidden"),
							children: [
								panel === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-3 flex gap-1 overflow-x-auto",
										children: Object.keys(PRESETS).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => applyPreset(id),
											className: cn("shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium", preset === id ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface-2 text-muted"),
											children: PRESETS[id].label
										}, id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-col gap-3",
										children: SLIDERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, { ...item }, item.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mb-1.5 text-xs text-muted",
											children: "站位"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-3 gap-1",
											children: [
												{
													id: "front",
													label: "站在床前"
												},
												{
													id: "on",
													label: "站在床上"
												},
												{
													id: "lie",
													label: "躺在床上"
												}
											].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setParam("bedStance", item.id),
												className: cn("h-9 rounded-md border px-1 text-[11px] font-medium", bedStance === item.id ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface-2 text-muted hover:text-fg"),
												children: item.label
											}, item.id))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 grid grid-cols-2 gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
												active: breathing,
												onClick: () => setParam("breathing", !breathing),
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { className: "size-3.5" }),
												label: "呼吸"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
												active: slowMo,
												onClick: () => setParam("slowMo", !slowMo),
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-3.5" }),
												label: "慢动作"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
												active: showLattice,
												onClick: () => setParam("showLattice", !showLattice),
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { className: "size-3.5" }),
												label: "显示骨骼"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
												active: showWeights,
												onClick: () => setParam("showWeights", !showWeights),
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scan, { className: "size-3.5" }),
												label: "显示绑定"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
												active: autoRotate,
												onClick: () => setParam("autoRotate", !autoRotate),
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "size-3.5" }),
												label: "旋转"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
												active: showOrgans,
												onClick: () => {
													const next = !showOrgans;
													setParam("showOrgans", next);
													if (next && abdomenXray < .08) setParam("abdomenXray", .38);
													if (!next) setParam("abdomenXray", 0);
												},
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scan, { className: "size-3.5" }),
												label: "脏器"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
												active: abdomenXray > .05,
												onClick: () => {
													setParam("abdomenXray", abdomenXray > .05 ? 0 : .38);
													if (abdomenXray <= .05) setParam("showOrgans", true);
												},
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scan, { className: "size-3.5" }),
												label: "透视"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
												active: showGutHp,
												onClick: () => {
													const next = !showGutHp;
													setParam("showGutHp", next);
													if (next) {
														setParam("showOrgans", true);
														if (abdomenXray < .08) setParam("abdomenXray", .38);
													}
												},
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-3.5" }),
												label: "显示生命值"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 mb-1.5 text-xs text-muted",
										children: "表情"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-4 gap-1",
										children: EXPRESSIONS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setExpression(item.id),
											className: cn("h-9 rounded-md border text-[11px] font-medium", expression === item.id ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface-2 text-muted hover:text-fg"),
											children: item.label
										}, item.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 mb-1.5 text-xs text-muted",
										children: "动作"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-3 gap-1",
										children: POSES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setPose(item.id),
											className: cn("h-9 rounded-md border text-[11px] font-medium", pose === item.id ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface-2 text-muted hover:text-fg"),
											children: item.label
										}, item.id))
									})
								] }) : null,
								panel === "interact" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-3 text-xs leading-relaxed text-muted",
										children: "左键点身体操作。拖拽捏软组织，姿势拉关节，击腹点击释放环状冲击，拳交拖动手臂沿大肠插入，刺刀点腹壁后拖角度与深度。"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setInteractMode("drag"),
												className: cn("inline-flex h-11 items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors duration-fast", interactMode === "drag" ? "bg-accent text-accent-fg" : "border border-border bg-surface-2 text-muted hover:text-fg"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hand, { className: "size-4" }), "拖拽"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setInteractMode("pose"),
												className: cn("inline-flex h-11 items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors duration-fast", interactMode === "pose" ? "bg-accent text-accent-fg" : "border border-border bg-surface-2 text-muted hover:text-fg"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointerClick, { className: "size-4" }), "姿势"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setInteractMode("strike"),
												className: cn("inline-flex h-11 items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors duration-fast", interactMode === "strike" ? "bg-accent text-accent-fg" : "border border-border bg-surface-2 text-muted hover:text-fg"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-4" }), "击腹"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setInteractMode("fist"),
												className: cn("inline-flex h-11 items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors duration-fast", interactMode === "fist" ? "bg-accent text-accent-fg" : "border border-border bg-surface-2 text-muted hover:text-fg"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grab, { className: "size-4" }), "拳交"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setBayonetKind("short"),
												className: cn("inline-flex h-11 items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors duration-fast", interactMode === "bayonet" && bayonetKind === "short" ? "bg-accent text-accent-fg" : "border border-border bg-surface-2 text-muted hover:text-fg"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sword, { className: "size-4" }), "刺刀"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setBayonetKind("long"),
												className: cn("inline-flex h-11 items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors duration-fast", interactMode === "bayonet" && bayonetKind === "long" ? "bg-accent text-accent-fg" : "border border-border bg-surface-2 text-muted hover:text-fg"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sword, { className: "size-4" }), "长刺刀"]
											})
										]
									}),
									interactMode === "fist" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs leading-relaxed text-muted",
												children: "左键拖拳头。肛门是支点，体外的手臂会跟着转，手臂本身是刚体不会弯折。"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "mt-3 block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "mb-1.5 flex items-center justify-between text-xs text-muted",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "最大插入深度" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "tabular-nums text-fg",
														children: fistMaxDepth.toFixed(2)
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider, {
													value: [fistMaxDepth],
													min: .5,
													max: 1.5,
													step: .01,
													onValueChange: ([v]) => {
														if (typeof v === "number") setParam("fistMaxDepth", v);
													},
													className: "relative flex h-5 w-full touch-none items-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
														className: "relative h-1 grow rounded-full bg-surface-2",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full rounded-full bg-accent" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-3.5 rounded-full bg-fg shadow-sm outline-none ring-2 ring-transparent focus-visible:ring-accent" })]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 grid grid-cols-2 gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
													active: fistThrust,
													onClick: () => setParam("fistThrust", !fistThrust),
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-3.5" }),
													label: "抽插"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
													active: fistStir,
													onClick: () => setParam("fistStir", !fistStir),
													icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "size-3.5" }),
													label: "搅动"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 flex flex-col gap-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "block",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "mb-1.5 flex items-center justify-between text-xs text-muted",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "抽插速度" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "tabular-nums text-fg",
																children: fistThrustSpeed.toFixed(2)
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider, {
															value: [fistThrustSpeed],
															min: .05,
															max: 1,
															step: .01,
															onValueChange: ([v]) => {
																if (typeof v === "number") setParam("fistThrustSpeed", v);
															},
															className: "relative flex h-5 w-full touch-none items-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
																className: "relative h-1 grow rounded-full bg-surface-2",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full rounded-full bg-accent" })
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-3.5 rounded-full bg-fg shadow-sm outline-none ring-2 ring-transparent focus-visible:ring-accent" })]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "block",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "mb-1.5 flex items-center justify-between text-xs text-muted",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "抽插起始深度" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "tabular-nums text-fg",
																children: fistThrustStart.toFixed(2)
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider, {
															value: [fistThrustStart],
															min: .012,
															max: .12,
															step: .001,
															onValueChange: ([v]) => {
																if (typeof v === "number") setParam("fistThrustStart", v);
															},
															className: "relative flex h-5 w-full touch-none items-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
																className: "relative h-1 grow rounded-full bg-surface-2",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full rounded-full bg-accent" })
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-3.5 rounded-full bg-fg shadow-sm outline-none ring-2 ring-transparent focus-visible:ring-accent" })]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "block",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "mb-1.5 flex items-center justify-between text-xs text-muted",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "搅动速度" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "tabular-nums text-fg",
																children: fistStirSpeed.toFixed(2)
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider, {
															value: [fistStirSpeed],
															min: .05,
															max: 1,
															step: .01,
															onValueChange: ([v]) => {
																if (typeof v === "number") setParam("fistStirSpeed", v);
															},
															className: "relative flex h-5 w-full touch-none items-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
																className: "relative h-1 grow rounded-full bg-surface-2",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full rounded-full bg-accent" })
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-3.5 rounded-full bg-fg shadow-sm outline-none ring-2 ring-transparent focus-visible:ring-accent" })]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "block",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "mb-1.5 flex items-center justify-between text-xs text-muted",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "搅动半径" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "tabular-nums text-fg",
																children: fistStirRadius.toFixed(2)
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider, {
															value: [fistStirRadius],
															min: .05,
															max: 1,
															step: .01,
															onValueChange: ([v]) => {
																if (typeof v === "number") setParam("fistStirRadius", v);
															},
															className: "relative flex h-5 w-full touch-none items-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
																className: "relative h-1 grow rounded-full bg-surface-2",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full rounded-full bg-accent" })
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-3.5 rounded-full bg-fg shadow-sm outline-none ring-2 ring-transparent focus-visible:ring-accent" })]
														})]
													})
												]
											})
										]
									}) : null,
									interactMode === "bayonet" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs leading-relaxed text-muted",
												children: bayonetHasEntry ? `${bayonetKind === "long" ? "长刺刀" : "刺刀"}已锁定刺入点。拖动改角度和深度。刀刃可全部没入，刀柄停在体外。` : "点击腹壁选择刺入点。刀伤会一直留着，直到点复位。"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 grid grid-cols-2 gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: () => {
															useStudio.getState().setBayonetHasEntry(false);
															useStudio.getState().setBayonetPen(0);
														},
														disabled: !bayonetHasEntry,
														className: cn("inline-flex h-10 items-center justify-center gap-1.5 rounded-md border text-xs font-medium", bayonetHasEntry ? "border-border bg-surface-2 text-fg hover:text-fg" : "border-border bg-bg text-muted opacity-50"),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat, { className: "size-3.5" }), "再次刺入"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
														active: bayonetAuto,
														onClick: () => setBayonetAuto(!bayonetAuto),
														icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3.5" }),
														label: "自动刺入"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
														active: bayonetPump,
														onClick: () => setBayonetPump(!bayonetPump),
														icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsUpDown, { className: "size-3.5" }),
														label: "抽插"
													})
												]
											}),
											bayonetHasEntry ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "mt-3 block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "mb-1.5 flex items-center justify-between text-xs text-muted",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "刺入深度" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "tabular-nums text-fg",
														children: bayonetPen.toFixed(2)
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider, {
													value: [bayonetPen],
													min: 0,
													max: 1,
													step: .01,
													onValueChange: (v) => {
														const n = v[0];
														if (typeof n === "number") setBayonetPen(n);
													},
													className: "relative flex h-5 w-full touch-none items-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
														className: "relative h-1 grow rounded-full bg-surface-2",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full rounded-full bg-accent" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-3.5 rounded-full bg-fg shadow-sm outline-none ring-2 ring-transparent focus-visible:ring-accent" })]
												})]
											}) : null
										]
									}) : null,
									interactMode === "strike" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mb-1.5 text-xs text-muted",
												children: "力度档位"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid grid-cols-4 gap-1",
												children: STRIKE_LEVELS.map((lv) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setParam("strikeForce", lv.force),
													className: cn("h-9 rounded-md border text-[11px] font-medium", Math.abs(strikeForce - lv.force) < .06 ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface-2 text-muted hover:text-fg"),
													children: lv.label
												}, lv.id))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 flex flex-col gap-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "block",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "mb-1.5 flex items-center justify-between text-xs text-muted",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "力度" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "tabular-nums text-fg",
																children: strikeForce.toFixed(2)
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider, {
															value: [strikeForce],
															min: .1,
															max: 1,
															step: .01,
															onValueChange: ([v]) => {
																if (typeof v === "number") setParam("strikeForce", v);
															},
															className: "relative flex h-5 w-full touch-none items-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
																className: "relative h-1 grow rounded-full bg-surface-2",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full rounded-full bg-accent" })
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-3.5 rounded-full bg-fg shadow-sm outline-none ring-2 ring-transparent focus-visible:ring-accent" })]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "block",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "mb-1.5 flex items-center justify-between text-xs text-muted",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "范围" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "tabular-nums text-fg",
																children: strikeRange.toFixed(2)
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider, {
															value: [strikeRange],
															min: .1,
															max: 1,
															step: .01,
															onValueChange: ([v]) => {
																if (typeof v === "number") setParam("strikeRange", v);
															},
															className: "relative flex h-5 w-full touch-none items-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
																className: "relative h-1 grow rounded-full bg-surface-2",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full rounded-full bg-accent" })
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-3.5 rounded-full bg-fg shadow-sm outline-none ring-2 ring-transparent focus-visible:ring-accent" })]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "block",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "mb-1.5 flex items-center justify-between text-xs text-muted",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "回弹速度" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "tabular-nums text-fg",
																children: strikeRebound.toFixed(2)
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider, {
															value: [strikeRebound],
															min: 0,
															max: 1,
															step: .01,
															onValueChange: ([v]) => {
																if (typeof v === "number") setParam("strikeRebound", v);
															},
															className: "relative flex h-5 w-full touch-none items-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
																className: "relative h-1 grow rounded-full bg-surface-2",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full rounded-full bg-accent" })
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-3.5 rounded-full bg-fg shadow-sm outline-none ring-2 ring-transparent focus-visible:ring-accent" })]
														})]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => fireStrike(null),
												className: "mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-accent text-sm font-medium text-accent-fg transition-transform duration-quick ease-smooth-out active:scale-[0.98]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-4" }), "释放冲击"]
											})
										]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: resetSim,
										className: "mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface-2 text-sm font-medium text-fg transition-transform duration-quick ease-smooth-out active:scale-[0.98]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "复位"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-xs text-muted",
										children: grabbing ? interactMode === "pose" ? "调姿中" : interactMode === "bayonet" ? "拖刀中" : "拖拽中" : interactMode === "strike" ? "击腹就绪" : interactMode === "fist" ? "拳交：拖动手臂插入" : interactMode === "bayonet" ? bayonetHasEntry ? "刺刀：拖动刺入" : "刺刀：点击选择刺入点" : "待机"
									})
								] }) : null,
								panel === "tools" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center gap-2 py-10 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-6 text-muted" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-fg",
											children: "工具"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted",
											children: "测量、截图等工具稍后加入"
										})
									]
								}) : null,
								panel === "weapons" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs leading-relaxed text-muted",
											children: "点腹壁确定刺入点。拖动改角度和深度；按住右键时滚轮调深度。刀伤保留到复位。"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-3 gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => setBayonetKind("short"),
													className: cn("flex aspect-square flex-col items-center justify-center gap-1 rounded-md border text-[11px] font-medium", interactMode === "bayonet" && bayonetKind === "short" ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface-2 text-muted hover:text-fg"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sword, { className: "size-5" }), "刺刀"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => setBayonetKind("long"),
													className: cn("flex aspect-square flex-col items-center justify-center gap-1 rounded-md border text-[11px] font-medium", interactMode === "bayonet" && bayonetKind === "long" ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface-2 text-muted hover:text-fg"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sword, { className: "size-5" }), "长刺刀"]
												}),
												Array.from({ length: 4 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex aspect-square items-center justify-center rounded-md border border-dashed border-border bg-surface-2/50 text-muted",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "size-4 opacity-40" })
												}, i))
											]
										}),
										interactMode === "bayonet" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted",
												children: bayonetHasEntry ? `${bayonetKind === "long" ? "长刺刀" : "刺刀"}刺入点已锁定。刀刃可全部没入，刀柄停在体外。` : bayonetAuto ? "自动刺入已开：点腹壁后会垂直刺入，再等待下一次。" : "装备中 · 点击腹壁选择刺入点。"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: () => {
															useStudio.getState().setBayonetHasEntry(false);
															useStudio.getState().setBayonetPen(0);
														},
														disabled: !bayonetHasEntry,
														className: cn("inline-flex h-10 items-center justify-center gap-1.5 rounded-md border text-xs font-medium", bayonetHasEntry ? "border-border bg-surface-2 text-fg" : "border-border bg-bg text-muted opacity-50"),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat, { className: "size-3.5" }), "再次刺入"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
														active: bayonetAuto,
														onClick: () => setBayonetAuto(!bayonetAuto),
														icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3.5" }),
														label: "自动刺入"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
														active: bayonetPump,
														onClick: () => setBayonetPump(!bayonetPump),
														icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsUpDown, { className: "size-3.5" }),
														label: "抽插"
													})
												]
											})]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted",
											children: "点击刺刀装备。"
										})
									]
								}) : null
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none absolute bottom-auto left-4 hidden items-center gap-2 text-xs text-muted sm:bottom-6 sm:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hand, { className: "size-3.5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: interactMode === "pose" ? "姿势" : interactMode === "strike" ? "击腹" : interactMode === "fist" ? "拳交" : interactMode === "bayonet" ? bayonetKind === "long" ? "长刺刀" : "刺刀" : "拖拽" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-border",
							children: "/"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-3.5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "右键旋转 · 左键点身体 · 按住右键滚轮调刺入深度 · T 切换互动 · X 透视" })
					]
				})
			] })
		]
	});
}
function SliderRow(item) {
	const value = useStudio((s) => s[item.id]);
	const setParam = useStudio((s) => s.setParam);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mb-1.5 flex items-center justify-between text-xs text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums text-fg",
				children: value.toFixed(item.step < .01 ? 3 : 2)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider, {
			value: [value],
			min: item.min,
			max: item.max,
			step: item.step,
			onValueChange: ([v]) => {
				if (typeof v === "number") setParam(item.id, v);
			},
			className: "relative flex h-5 w-full touch-none items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
				className: "relative h-1 grow rounded-full bg-surface-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full rounded-full bg-accent" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-3.5 rounded-full bg-fg shadow-sm outline-none ring-2 ring-transparent focus-visible:ring-accent" })]
		})]
	});
}
function Toggle({ active, onClick, icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("inline-flex h-10 items-center justify-center gap-1.5 rounded-md border text-xs font-medium transition-colors duration-fast", active ? "border-accent/40 bg-surface-2 text-fg" : "border-border bg-bg text-muted hover:text-fg"),
		children: [icon, label]
	});
}
var MODEL_FILES = [
	{
		id: "character",
		url: "/models/tifa.glb",
		bytes: 16115192,
		path: "/models/",
		hint: "角色"
	},
	{
		id: "intestines",
		url: "/models/intestines.glb",
		bytes: 15629192,
		path: "/models/",
		hint: "大小肠"
	},
	{
		id: "pelvis",
		url: "/models/pelvis.glb",
		bytes: 760380,
		path: "/models/",
		hint: "盆腔"
	},
	{
		id: "arm",
		url: "/models/arm.glb",
		bytes: 139896,
		path: "/models/",
		hint: "手臂"
	},
	{
		id: "bayonet",
		url: "/models/bayonet.glb",
		bytes: 3873372,
		path: "/models/",
		hint: "刺刀"
	},
	{
		id: "bayonetLong",
		url: "/models/bayonet-long.glb",
		bytes: 158192,
		path: "/models/",
		hint: "长刺刀"
	},
	{
		id: "room",
		url: "/models/room.glb",
		bytes: 16153124,
		path: "/models/",
		hint: "房间"
	}
];
var TOTAL_BYTES = MODEL_FILES.reduce((s, f) => s + f.bytes, 0);
function formatMb(n) {
	return `${(n / 1048576).toFixed(1)} MB`;
}
function fetchBuffer(url, expected, onBytes) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.responseType = "arraybuffer";
		xhr.timeout = 18e4;
		xhr.onprogress = (e) => {
			onBytes(e.lengthComputable ? e.loaded : Math.min(expected, e.loaded));
		};
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
				onBytes(xhr.response.byteLength);
				resolve(xhr.response);
			} else reject(/* @__PURE__ */ new Error(`下载失败 (${xhr.status})`));
		};
		xhr.onerror = () => reject(/* @__PURE__ */ new Error("网络中断，模型没有下完"));
		xhr.ontimeout = () => reject(/* @__PURE__ */ new Error("下载超时，请重试"));
		xhr.send();
	});
}
function parseGlb(data, resourcePath) {
	return new Promise((resolve, reject) => {
		new GLTFLoader(new LoadingManager()).parse(data, resourcePath, (gltf) => resolve(gltf.scene), (err) => reject(err instanceof Error ? err : /* @__PURE__ */ new Error("模型解析失败")));
	});
}
function useModelAssets(enabled) {
	const [scenes, setScenes] = (0, import_react.useState)(null);
	const retryNonce = useStudio((s) => s.retryNonce);
	(0, import_react.useEffect)(() => {
		if (!enabled) return;
		let cancelled = false;
		const received = MODEL_FILES.map(() => 0);
		const bumpDownload = () => {
			const got = received.reduce((a, n) => a + n, 0);
			const pct = Math.min(86, Math.round(got / TOTAL_BYTES * 86));
			useStudio.setState({
				loading: true,
				loadError: null,
				loadProgress: pct,
				loadHint: `下载 ${formatMb(got)} / ${formatMb(TOTAL_BYTES)}`
			});
		};
		(async () => {
			try {
				useStudio.setState({
					loading: true,
					loadError: null,
					loadProgress: 1,
					loadHint: "开始下载模型"
				});
				setScenes(null);
				const buffers = await Promise.all(MODEL_FILES.map((file, i) => fetchBuffer(retryNonce ? `${file.url}?r=${retryNonce}` : file.url, file.bytes, (n) => {
					if (cancelled) return;
					received[i] = n;
					bumpDownload();
				})));
				if (cancelled) return;
				useStudio.setState({
					loadProgress: 88,
					loadHint: "解析角色"
				});
				const character = await parseGlb(buffers[0], MODEL_FILES[0].path);
				if (cancelled) return;
				useStudio.setState({
					loadProgress: 93,
					loadHint: "解析大小肠"
				});
				const intestines = await parseGlb(buffers[1], MODEL_FILES[1].path);
				if (cancelled) return;
				useStudio.setState({
					loadProgress: 96,
					loadHint: "解析盆腔器官"
				});
				const pelvis = await parseGlb(buffers[2], MODEL_FILES[2].path);
				if (cancelled) return;
				useStudio.setState({
					loadProgress: 97,
					loadHint: "解析手臂"
				});
				const arm = await parseGlb(buffers[3], MODEL_FILES[3].path);
				if (cancelled) return;
				useStudio.setState({
					loadProgress: 98,
					loadHint: "解析刺刀"
				});
				const bayonet = await parseGlb(buffers[4], MODEL_FILES[4].path);
				if (cancelled) return;
				useStudio.setState({
					loadProgress: 98,
					loadHint: "解析长刺刀"
				});
				const bayonetLong = await parseGlb(buffers[5], MODEL_FILES[5].path);
				if (cancelled) return;
				useStudio.setState({
					loadProgress: 99,
					loadHint: "解析房间"
				});
				const room = await parseGlb(buffers[6], MODEL_FILES[6].path);
				if (cancelled) return;
				useStudio.setState({
					loadProgress: 99,
					loadHint: "组装柔体"
				});
				setScenes({
					character,
					intestines,
					pelvis,
					arm,
					bayonet,
					bayonetLong,
					room
				});
			} catch (err) {
				if (cancelled) return;
				const message = err instanceof Error ? err.message : "模型加载失败";
				useStudio.setState({
					loading: true,
					loadError: message,
					loadHint: "加载失败"
				});
				setScenes(null);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [enabled, retryNonce]);
	return scenes;
}
var Scene = (0, import_react.lazy)(() => import("./scene-DR3zlLPM.mjs"));
function StudioApp() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	const scenes = useModelAssets(mounted);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg",
		children: [mounted && scenes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {
				character: scenes.character,
				intestines: scenes.intestines,
				pelvis: scenes.pelvis,
				arm: scenes.arm,
				bayonet: scenes.bayonet,
				bayonetLong: scenes.bayonetLong,
				room: scenes.room
			})
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {})]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioApp, {});
}
//#endregion
export { useStudio as n, SoftSkeleton as r, routes_exports as t };
