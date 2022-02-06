pub struct HSBA {
	pub h: f64,
	pub s: f64,
	pub b: f64,
	pub a: f64,
}

impl HSBA {
	pub fn from_vec(vector: &Vec<f64>) -> HSBA {
		HSBA {
			h: vector[0],
			s: vector[1],
			b: vector[2],
			a: vector[3],
		}
	}

	pub fn to_hsla(&self) -> HSLA {
		let mut result = HSLA {
			h: self.h,
			s: self.s,
			l: ((2.0 - self.s) * self.b) / 2.0,
			a: self.a,
		};

		if result.l != 0.0 {
			if result.l == 1.0 {
				result.s = 0.0;
			} else if result.l < 0.5 {
				result.s = (self.s * self.b) / (result.l * 2.0);
			} else {
				result.s = (self.s * self.b) / (2.0 - result.l * 2.0);
			}
		}
		result
	}
}

pub struct HSLA {
	pub h: f64,
	pub s: f64,
	pub l: f64,
	pub a: f64,
}

impl HSLA {
	pub fn to_css_string(&self) -> &str {
		return "hsla({self.h * 360},{self.l * 100}%,{self.s * 100}%,{a})";
	}
}
