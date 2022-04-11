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

export type Point = {
	x: number;
	y: number;
	i: number;
	mirror: string;
	controls: Array<{ x: number; y: number }>;
};

export type ElementType = {
	id: string;
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
	x: number;
	y: number;
};
