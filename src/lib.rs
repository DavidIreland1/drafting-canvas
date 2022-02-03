use std::f64;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

extern crate serde_json;
extern crate wasm_bindgen;

#[macro_use]
extern crate serde_derive;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// #[derive(Serialize, Deserialize)]
// pub struct Fill {
// 	id: String,
// 	type: String,
// 	color: [f64, 4],
// 	visible: bool,
// }

#[derive(Serialize, Deserialize)]
pub struct Element {
    id: String,
    label: String,
	_type: String,
	x: f64,
	y: f64,
	rotation: f64,
	width: f64,
	height: f64,
	radius: f64,
}

#[derive(Serialize, Deserialize)]
pub struct View {
	id: String,
	label: String,
	scale: f64,
	x: f64,
	y: f64,
}

#[derive(Serialize, Deserialize)]
pub struct Cursor {
	id: String,
}



#[wasm_bindgen]
pub fn draw(elements: &JsValue,  views: &JsValue, cursors: &JsValue, user_id: &str) -> f64 {
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


	context.begin_path();
	// context.translate(user_view.x, user_view.y).expect("Failed to translate");
	// context.scale(user_view.scale, user_view.scale).expect("Failed to scale");

	context.clear_rect(0.0, 0.0, f64::from(canvas.width()), f64::from(canvas.height()));

	context.set_fill_style(&"rgb(0,250,0)".into());
	let sum: f64 = elements
        .iter()
        .map(|element| {
    		context.fill_rect(user_view.x, user_view.y, element.width*user_view.scale, element.height*user_view.scale);
			element.x
        })
		.sum();
	
    context.stroke();

	// log(user_id);

	user_view.x
}

pub fn draw_off(context: &web_sys::CanvasRenderingContext2d, x: f64, y: f64) {

	
    // Draw the outer circle.
    context.move_to(x, y);
	// context.set_filter("blur(15px)");
    context.begin_path();

    context
        .arc(x, y, 50.0, 0.0, f64::consts::PI * 2.0)
        .unwrap();

    // // Draw the mouth.
    // context.move_to(x+35.0, y);
    // context.arc(x, y, 35.0, 0.0, f64::consts::PI).unwrap();

    // // Draw the left eye.
    // context.move_to(x-10.0, y-10.0);
    // context
    //     .arc(x-15.0, y-10.0, 5.0, 0.0, f64::consts::PI * 2.0)
    //     .unwrap();

    // // Draw the right eye.
    // context.move_to(x+20.0, y-10.0);
    // context
    //     .arc(x+15.0, y-10.0, 5.0, 0.0, f64::consts::PI * 2.0)
    //     .unwrap();

    context.stroke();
}


