!(function () {
	'use strict';
	var t;
	!(function (t) {
		(t.None = 'none'), (t.Url = 'url'), (t.Blur = 'blur'), (t.Brightness = 'brightness'), (t.Contrast = 'contrast'), (t.DropShadow = 'drop-shadow'), (t.Grayscale = 'grayscale'), (t.HueRotate = 'hue-rotate'), (t.Invert = 'invert'), (t.Opacity = 'opacity'), (t.Saturate = 'saturate'), (t.Sepia = 'sepia');
	})(t || (t = {}));
	var r = new Map(),
		a = function (t) {
			var r = document.createElement('canvas');
			return (
				(r.height = t.canvas.height),
				(r.width = t.canvas.width),
				Object.defineProperty(r, '__skipFilterPatch', {
					value: !0,
				}),
				r.getContext('2d')
			);
		};
	var e = ['__skipFilterPatch', '__currentPathMirror', 'canvas', 'filter', 'getImageData'];
	var n = ['clearRect', 'drawImage', 'fill', 'fillRect', 'fillText', 'stroke', 'strokeRect', 'strokeText'],
		i = function (t, a) {
			a.match(/([-a-z]+)(?:\(([\w\d\s\.%-]*)\))?/gim)
				.map(function (t) {
					return t.match(/([-a-z]+)(?:\((.*)\))?/i).slice(1, 3);
				})
				.reduce(function (t, a) {
					var e = a[0],
						n = a[1];
					return r.has(e) ? r.get(e).apply(void 0, [t].concat((n || '').split(' '))) : t;
				}, t);
		},
		o = function (t) {
			var r = parseFloat(t);
			return /%\s*?$/i.test(t) && (r /= 100), r;
		},
		s = function (t) {
			return parseFloat(t);
		};
	var c, h;
	r.set(t.None, function (t) {
		return t;
	}),
		r.set(t.Blur, function (t, r) {
			void 0 === r && (r = '0');
			var a = s(r);
			if (a <= 0) return t;
			for (
				var e,
					n,
					i,
					o,
					c = t.canvas,
					h = c.height,
					u = c.width,
					v = t.getImageData(0, 0, u, h),
					f = v.data,
					p = u - 1,
					g = h - 1,
					l = a + 1,
					d = [
						1, 57, 41, 21, 203, 34, 97, 73, 227, 91, 149, 62, 105, 45, 39, 137, 241, 107, 3, 173, 39, 71, 65, 238, 219, 101, 187, 87, 81, 151, 141, 133, 249, 117, 221, 209, 197, 187, 177, 169, 5, 153, 73, 139, 133, 127, 243, 233, 223, 107, 103, 99, 191, 23, 177, 171, 165, 159, 77, 149, 9, 139, 135, 131, 253, 245, 119, 231, 224, 109, 211, 103, 25, 195, 189, 23, 45, 175, 171, 83, 81, 79, 155, 151, 147, 9, 141, 137, 67, 131, 129, 251, 123, 30, 235, 115, 113, 221,
						217, 53, 13, 51, 50, 49, 193, 189, 185, 91, 179, 175, 43, 169, 83, 163, 5, 79, 155, 19, 75, 147, 145, 143, 35, 69, 17, 67, 33, 65, 255, 251, 247, 243, 239, 59, 29, 229, 113, 111, 219, 27, 213, 105, 207, 51, 201, 199, 49, 193, 191, 47, 93, 183, 181, 179, 11, 87, 43, 85, 167, 165, 163, 161, 159, 157, 155, 77, 19, 75, 37, 73, 145, 143, 141, 35, 138, 137, 135, 67, 33, 131, 129, 255, 63, 250, 247, 61, 121, 239, 237, 117, 29, 229, 227, 225, 111, 55, 109,
						216, 213, 211, 209, 207, 205, 203, 201, 199, 197, 195, 193, 48, 190, 47, 93, 185, 183, 181, 179, 178, 176, 175, 173, 171, 85, 21, 167, 165, 41, 163, 161, 5, 79, 157, 78, 154, 153, 19, 75, 149, 74, 147, 73, 144, 143, 71, 141, 140, 139, 137, 17, 135, 134, 133, 66, 131, 65, 129, 1,
					][a],
					m = [
						0, 9, 10, 10, 14, 12, 14, 14, 16, 15, 16, 15, 16, 15, 15, 17, 18, 17, 12, 18, 16, 17, 17, 19, 19, 18, 19, 18, 18, 19, 19, 19, 20, 19, 20, 20, 20, 20, 20, 20, 15, 20, 19, 20, 20, 20, 21, 21, 21, 20, 20, 20, 21, 18, 21, 21, 21, 21, 20, 21, 17, 21, 21, 21, 22, 22, 21, 22, 22, 21, 22, 21, 19, 22, 22, 19, 20, 22, 22, 21, 21, 21, 22, 22, 22, 18, 22, 22, 21, 22, 22, 23, 22, 20, 23, 22, 22, 23, 23, 21, 19, 21, 21, 21, 23, 23, 23, 22, 23, 23, 21, 23, 22, 23,
						18, 22, 23, 20, 22, 23, 23, 23, 21, 22, 20, 22, 21, 22, 24, 24, 24, 24, 24, 22, 21, 24, 23, 23, 24, 21, 24, 23, 24, 22, 24, 24, 22, 24, 24, 22, 23, 24, 24, 24, 20, 23, 22, 23, 24, 24, 24, 24, 24, 24, 24, 23, 21, 23, 22, 23, 24, 24, 24, 22, 24, 24, 24, 23, 22, 24, 24, 25, 23, 25, 25, 23, 24, 25, 25, 24, 22, 25, 25, 25, 24, 23, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 23, 25, 23, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 24, 22, 25, 25, 23, 25,
						25, 20, 24, 25, 24, 25, 25, 22, 24, 25, 24, 25, 24, 25, 25, 24, 25, 25, 25, 25, 22, 25, 25, 25, 24, 25, 24, 25, 18,
					][a],
					_ = [],
					w = [],
					y = [],
					D = [],
					P = [],
					I = [],
					b = 3;
				b-- > 0;

			) {
				for (var M = 0, O = 0, k = 0; k < h; k++) {
					for (var C = f[M] * l, x = f[M + 1] * l, F = f[M + 2] * l, j = f[M + 3] * l, R = 1; R <= a; R++) (e = M + ((R > p ? p : R) << 2)), (C += f[e++]), (x += f[e++]), (F += f[e++]), (j += f[e]);
					for (var S = 0; S < u; S++) (_[O] = C), (w[O] = x), (y[O] = F), (D[O] = j), 0 === k && ((P[S] = ((e = S + l) < p ? e : p) << 2), (I[S] = (e = S - a) > 0 ? e << 2 : 0)), (n = M + P[S]), (i = M + I[S]), (C += f[n++] - f[i++]), (x += f[n++] - f[i++]), (F += f[n++] - f[i++]), (j += f[n] - f[i]), O++;
					M += u << 2;
				}
				for (S = 0; S < u; S++) {
					var T = S;
					for (C = _[T] * l, x = w[T] * l, F = y[T] * l, j = D[T] * l, R = 1; R <= a; R++) (C += _[(T += R > g ? 0 : u)]), (x += w[T]), (F += y[T]), (j += D[T]);
					for (O = S << 2, k = 0; k < h; k++) (f[O + 3] = o = (j * d) >>> m), o > 0 ? ((o = 255 / o), (f[O] = ((C * d) >>> m) * o), (f[O + 1] = ((x * d) >>> m) * o), (f[O + 2] = ((F * d) >>> m) * o)) : (f[O] = f[O + 1] = f[O + 2] = 0), 0 === S && ((P[k] = ((e = k + l) < g ? e : g) * u), (I[k] = (e = k - a) > 0 ? e * u : 0)), (n = S + P[k]), (i = S + I[k]), (C += _[n] - _[i]), (x += w[n] - w[i]), (F += y[n] - y[i]), (j += D[n] - D[i]), (O += u << 2);
				}
			}
			return t.putImageData(v, 0, 0), t;
		}),
		r.set(t.Brightness, function (t, r) {
			if ((void 0 === r && (r = '1'), 1 === (r = o(r)))) return t;
			r < 0 && (r = 0);
			for (var a = t.canvas, e = a.height, n = a.width, i = t.getImageData(0, 0, n, e), s = i.data, c = s.length, h = 0; h < c; h += 4) (s[h + 0] *= r), (s[h + 1] *= r), (s[h + 2] *= r);
			return t.putImageData(i, 0, 0), t;
		}),
		r.set(t.Contrast, function (t, r) {
			if ((void 0 === r && (r = '1'), 1 === (r = o(r)))) return t;
			r < 0 && (r = 0);
			for (var a = t.canvas, e = a.height, n = a.width, i = t.getImageData(0, 0, n, e), s = i.data, c = s.length, h = 0; h < c; h += 4) (s[h + 0] = 255 * ((s[h + 0] / 255 - 0.5) * r + 0.5)), (s[h + 1] = 255 * ((s[h + 1] / 255 - 0.5) * r + 0.5)), (s[h + 2] = 255 * ((s[h + 2] / 255 - 0.5) * r + 0.5));
			return t.putImageData(i, 0, 0), t;
		}),
		r.set(t.DropShadow, function (t, r, a, e, n) {
			var i = document.createElement('canvas').getContext('2d');
			(i.shadowOffsetX = s(r)), (i.shadowOffsetY = s(a)), (i.shadowBlur = n ? s(e || '0') : 0), (i.shadowColor = n || e || 'transparent'), i.drawImage(t.canvas, 0, 0);
			var o = t.canvas,
				c = o.width,
				h = o.height;
			return t.putImageData(i.getImageData(0, 0, c, h), 0, 0), t;
		}),
		r.set(t.Grayscale, function (t, r) {
			if ((void 0 === r && (r = '0'), (r = o(r)) <= 0)) return t;
			r > 1 && (r = 1);
			for (var a = t.canvas, e = a.height, n = a.width, i = t.getImageData(0, 0, n, e), s = i.data, c = s.length, h = 0; h < c; h += 4) {
				var u = 0.2126 * s[h] + 0.7152 * s[h + 1] + 0.0722 * s[h + 2];
				(s[h + 0] += (u - s[h + 0]) * r), (s[h + 1] += (u - s[h + 1]) * r), (s[h + 2] += (u - s[h + 2]) * r);
			}
			return t.putImageData(i, 0, 0), t;
		}),
		r.set(t.HueRotate, function (t, r) {
			void 0 === r && (r = '0deg');
			var a = (function (t) {
				var r = parseFloat(t);
				switch (t.slice(r.toString().length)) {
					case 'deg':
						r /= 360;
						break;
					case 'grad':
						r /= 400;
						break;
					case 'rad':
						r /= 2 * Math.PI;
				}
				return r;
			})(r);
			if (a <= 0) return t;
			var e,
				n,
				i,
				o,
				s,
				c,
				h,
				u,
				v,
				f = t.canvas,
				p = f.height,
				g = f.width,
				l = t.getImageData(0, 0, g, p),
				d = l.data,
				m = (((a % 1) + 1) % 1) * 3,
				_ = Math.floor(m),
				w = m - _,
				y = 1 - w;
			switch (_) {
				case 0:
					(e = y), (n = 0), (i = w), (o = w), (s = y), (c = 0), (h = 0), (u = w), (v = y);
					break;
				case 1:
					(e = 0), (n = w), (i = y), (o = y), (s = 0), (c = w), (h = w), (u = y), (v = 0);
					break;
				case 2:
					(e = w), (n = y), (i = 0), (o = 0), (s = w), (c = y), (h = y), (u = 0), (v = w);
			}
			for (var D = 0, P = 0; P < p; ++P)
				for (var I = 0; I < g; ++I) {
					var b = d[0 + (D = 4 * (P * g + I))],
						M = d[D + 1],
						O = d[D + 2];
					(d[D + 0] = Math.floor(e * b + n * M + i * O)), (d[D + 1] = Math.floor(o * b + s * M + c * O)), (d[D + 2] = Math.floor(h * b + u * M + v * O));
				}
			return t.putImageData(l, 0, 0), t;
		}),
		r.set(t.Invert, function (t, r) {
			if ((void 0 === r && (r = '0'), (r = o(r)) <= 0)) return t;
			r > 1 && (r = 1);
			for (var a = t.canvas, e = a.height, n = a.width, i = t.getImageData(0, 0, n, e), s = i.data, c = s.length, h = 0; h < c; h += 4) (s[h + 0] = Math.abs(s[h + 0] - 255 * r)), (s[h + 1] = Math.abs(s[h + 1] - 255 * r)), (s[h + 2] = Math.abs(s[h + 2] - 255 * r));
			return t.putImageData(i, 0, 0), t;
		}),
		r.set(t.Opacity, function (t, r) {
			if ((void 0 === r && (r = '1'), (r = o(r)) < 0)) return t;
			r > 1 && (r = 1);
			for (var a = t.canvas, e = a.height, n = a.width, i = t.getImageData(0, 0, n, e), s = i.data, c = s.length, h = 3; h < c; h += 4) s[h] *= r;
			return t.putImageData(i, 0, 0), t;
		}),
		r.set(t.Saturate, function (t, r) {
			void 0 === r && (r = '1');
			var a = o(r);
			if (1 === a) return t;
			a < 0 && (a = 0);
			for (var e = t.canvas, n = e.height, i = e.width, s = t.getImageData(0, 0, i, n), c = s.data, h = 0.3086 * (1 - a), u = 0.6094 * (1 - a), v = 0.082 * (1 - a), f = i << 2, p = 0; p < n; p++)
				for (var g = p * f, l = 0; l < i; l++) {
					var d = g + (l << 2),
						m = c[d + 0],
						_ = c[d + 1],
						w = c[d + 2];
					(c[d + 0] = (h + a) * m + u * _ + v * w), (c[d + 1] = h * m + (u + a) * _ + v * w), (c[d + 2] = h * m + u * _ + (v + a) * w);
				}
			return t.putImageData(s, 0, 0), t;
		}),
		r.set(t.Sepia, function (t, r) {
			if ((void 0 === r && (r = '0'), (r = o(r)) <= 0)) return t;
			r > 1 && (r = 1);
			for (var a = t.canvas, e = a.height, n = a.width, i = t.getImageData(0, 0, n, e), s = i.data, c = s.length, h = 0; h < c; h += 4) {
				var u = s[h + 0],
					v = s[h + 1],
					f = s[h + 2];
				(s[h + 0] = (0.393 * u + 0.769 * v + 0.189 * f) * r + u * (1 - r)), (s[h + 1] = (0.349 * u + 0.686 * v + 0.168 * f) * r + v * (1 - r)), (s[h + 2] = (0.272 * u + 0.534 * v + 0.131 * f) * r + f * (1 - r));
			}
			return t.putImageData(i, 0, 0), t;
		}),
		'filter' in CanvasRenderingContext2D.prototype ||
			((c = HTMLCanvasElement),
			(h = CanvasRenderingContext2D),
			Object.defineProperty(c.prototype, '__skipFilterPatch', {
				writable: !0,
				value: !1,
			}),
			Object.defineProperty(c.prototype, '__currentPathMirror', {
				writable: !0,
				value: void 0,
			}),
			Object.defineProperty(h.prototype, 'filter', {
				writable: !0,
				value: t.None,
			}),
			(function (t) {
				Object.keys(t.prototype)
					.filter(function (t) {
						return e.indexOf(t) < 0;
					})
					.map(function (r) {
						return {
							member: r,
							descriptor: Object.getOwnPropertyDescriptor(t.prototype, r),
						};
					})
					.filter(function (t) {
						return t.descriptor.set;
					})
					.forEach(function (r) {
						var e = r.member,
							n = r.descriptor;
						Object.defineProperty(t.prototype, e, {
							get: function () {
								return this.canvas.__skipFilterPatch ? n.get.call(this) : this.canvas.__currentPathMirror[e];
							},
							set: function (t) {
								if (this.canvas.__skipFilterPatch) return n.set.call(this, t);
								this.canvas.__currentPathMirror || (this.canvas.__currentPathMirror = a(this)), (this.canvas.__currentPathMirror[e] = t);
							},
						});
					});
			})(CanvasRenderingContext2D),
			(function (t) {
				Object.keys(t.prototype)
					.filter(function (t) {
						return e.indexOf(t) < 0;
					})
					.map(function (r) {
						return {
							member: r,
							descriptor: Object.getOwnPropertyDescriptor(t.prototype, r),
						};
					})
					.filter(function (t) {
						var r = t.descriptor;
						return r.value && 'function' == typeof r.value;
					})
					.forEach(function (r) {
						var e = r.member,
							o = r.descriptor.value;
						Object.defineProperty(t.prototype, e, {
							value: function () {
								for (var t, r = [], s = 0; s < arguments.length; s++) r[s] = arguments[s];
								if (this.canvas.__skipFilterPatch) return o.call.apply(o, [this].concat(r));
								this.canvas.__currentPathMirror || (this.canvas.__currentPathMirror = a(this));
								var c = (t = this.canvas.__currentPathMirror)[e].apply(t, r);
								if (n.indexOf(e) > -1) {
									i(this.canvas.__currentPathMirror, this.filter), (this.canvas.__skipFilterPatch = !0);
									var h = void 0;
									'getTransform' in this && ((h = this.getTransform()), this.setTransform(1, 0, 0, 1, 0, 0)), this.drawImage(this.canvas.__currentPathMirror.canvas, 0, 0), h && this.setTransform(h), (this.canvas.__skipFilterPatch = !1), (this.canvas.__currentPathMirror = a(this));
								}
								return c;
							},
						});
					});
			})(CanvasRenderingContext2D));
})();
