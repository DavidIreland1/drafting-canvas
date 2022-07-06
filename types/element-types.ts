import { Color, ColorFormat } from './color-types';

export type Fill = {
	id: string;
	type: 'Solid' | 'Image';
	color: Color;
	format: ColorFormat;
	visible: boolean;
};

export type Stroke = {
	id: string;
	type: 'Inner' | 'Center' | 'Outer';
	color: Color;
	format: ColorFormat;
	visible: boolean;
	width: number;
};

export type Effect = {
	id: string;
	type: 'Drop shadow' | 'Inner shadow';
	width: number;
	x: number;
	y: number;
	blur: number;
	spread: number;
	color: Color;
	format: ColorFormat;
	visible: boolean;
};

export type Dot = {
	x: number;
	y: number;
	selected: boolean;
};

export type Point = {
	id: string;
	selected: boolean;
	x: number;
	y: number;
	relation: 'Mirror angle and length' | 'Mirror angle' | 'No mirroring';
	controls: Array<Dot>;
};

export type ElementType = {
	id: string;
	type: string;
	editing: boolean;
	selected: boolean;
	hover: boolean;
	fill: Array<Fill>;
	stroke: Array<Stroke>;
	effect: Array<Effect>;
	points: Array<Point>;
	rotation: 0;
	visible: boolean;
	locked: boolean;
	elements?: Array<ElementType>;
};
