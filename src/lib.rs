use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

mod colors;

#[macro_use]
extern crate serde_derive;
extern crate wasm_bindgen;

#[derive(Serialize, Deserialize)]
struct Fill {
	id: String,
	_type: String,
	// color: String,
	color: Vec<f64>,
	visible: bool,
}

#[derive(Serialize, Deserialize)]
struct Element {
	id: String,
	label: String,
	_type: String,
	x: f64,
	y: f64,
	rotation: f64,
	width: f64,
	height: f64,
	radius: f64,
	fill: Vec<Fill>,
}

#[derive(Serialize, Deserialize)]
struct View {
	id: String,
	label: String,
	scale: f64,
	x: f64,
	y: f64,
}

#[derive(Serialize, Deserialize)]
struct Cursor {
	id: String,
}

#[wasm_bindgen]
pub fn draw(elements: &JsValue, views: &JsValue, cursors: &JsValue, user_id: &str) -> String {
	let document = web_sys::window().unwrap().document().unwrap();
	let canvas = document.get_element_by_id("canvas").unwrap();
	let canvas: web_sys::HtmlCanvasElement = canvas
		.dyn_into::<web_sys::HtmlCanvasElement>()
		.map_err(|_| ())
		.unwrap();

	let context = canvas
		.get_context("2d")
		.unwrap()
		.unwrap()
		.dyn_into::<web_sys::CanvasRenderingContext2d>()
		.unwrap();

	let elements: Vec<Element> = elements.into_serde().unwrap();
	let views: Vec<View> = views.into_serde().unwrap();
	let cursors: Vec<Cursor> = cursors.into_serde().unwrap();

	let user_view: &View = views.iter().find(|&view| view.id.eq(user_id)).unwrap();

	context.clear_rect(
		0.0,
		0.0,
		f64::from(canvas.width()),
		f64::from(canvas.height()),
	);
	context.save();
	context
		.translate(user_view.x, user_view.y)
		.expect("Failed to translate");
	context
		.scale(user_view.scale, user_view.scale)
		.expect("Failed to scale");

	let sum: f64 = elements
		.iter()
		.map(|element| {
			element
				.fill
				.iter()
				.map(|fill| {
					let col = colors::HSBA::from_vec(&fill.color)
						.to_hsla()
						.to_css_string();

					context.set_fill_style(&JsValue::from(
						colors::HSBA::from_vec(&fill.color)
							.to_hsla()
							.to_css_string(),
					));
					context.fill_rect(element.x, element.y, element.width, element.height);
					1.0
				})
				.sum::<f64>();

			element.fill.len() as f64
		})
		.sum();

	context.stroke();
	context.restore();
	"qho".into()
}
