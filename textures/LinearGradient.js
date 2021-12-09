/*
  LinearGradient texture

  Properties:
    h: height of the texture
    w: width the texture
    degrees: rotation of the gradient clockwise from 0 (top->bottom), inclusive to 360
    steps: color steps in the gradient.

  Usage Example (gradient from right to left)
    Gradient: {
      texture: {
        type: LinearGradient,
        w: gradient_width,
        h: gradient_height,
        degrees: 90,
        steps: [
          { percent: 0, color: 'rgba(20, 20, 23, 0.48)' },
          { percent: 0.09, color: 'rgba(20, 20, 23, 0.52)' },
          { percent: 0.18, color: 'rgba(20, 20, 23, 0.6)' },
          { percent: 0.26, color: 'rgba(20, 20, 23, 0.69)' },
          { percent: 0.37, color: 'rgba(20, 20, 23, 0.78)' },
          { percent: 0.52, color: 'rgba(20, 20, 23, 0.87)' },
          { percent: 0.72, color: 'rgba(20, 20, 23, 0.94)' },
          { percent: 1, color: 'rgba(20, 20, 23, 0.96)' }
        ]
      }
    }

  Each step in the gradient is an object with the following properties:
    percent: number between 0 and 1
    color: string 'hsla(0,0,0,0)' or 'rgba(0,0,0,0)`
*/

import lng from '@lightningjs/core';

// translates degrees into radians
const rad = deg => {
  return (deg * Math.PI) / 180;
};

// translates radians into degrees
const deg = rad => {
  return (rad * 180) / Math.PI;
};

// given the width and height of the texture area,
// calculates the breakpoint angles at which the assumed
// side of the triangle necessary for calculating the origin
// points of the linear gradient changes.

const getBreakpoints = (width, height) => {
  const a = height / 2;
  const b = width / 2;
  const c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
  const C = 90;
  const A = Math.ceil(deg(Math.asin((a * Math.sin(rad(C))) / c)));
  const B = 180 - C - A;
  return [B, 90, 90 + A, 180, 180 + B, 270, 270 + A, 360];
};

// given the degrees of rotation, width and height of the texture,
// calculates the x/y coordinates on the bounding box of the texture
// where the linear gradient should start and end

const points = (degrees, width, height) => {
  const breakAngles = getBreakpoints(width, height);
  const breakIndex = breakAngles.findIndex(angle => angle >= degrees);
  let b = height / 2;
  let max = width / 2;
  if ([1, 2, 5, 6].includes(breakIndex)) {
    b = width / 2;
    max = height / 2;
  }
  if ([2, 4, 6].includes(breakIndex)) {
    degrees = degrees - breakAngles[breakIndex - 1];
  } else if (breakIndex > 0) {
    degrees = breakAngles[breakIndex] - degrees;
  }

  const A = degrees;
  const B = 90 - A;
  let a = Math.ceil((Math.sin(rad(A)) * b) / Math.sin(rad(B)));
  if (a > max) {
    a = max;
  }

  let x0 = 0;
  let y0 = 0;
  let x1 = 0;
  let y1 = 0;

  switch (breakIndex) {
    case 0:
      x0 = width / 2 + a;
      break;
    case 1:
      x0 = width;
      y0 = height / 2 - a;
      break;
    case 2:
      x0 = width;
      y0 = height / 2 + a;
      break;
    case 3:
      x0 = width / 2 + a;
      y0 = height;
      break;
    case 4:
      x0 = width / 2 - a;
      y0 = height;
      break;
    case 5:
      y0 = height / 2 + a;
      break;
    case 6:
      y0 = height / 2 - a;
      break;
    case 7:
      x0 = width / 2 - a;
      break;
  }

  if (x0 == 0) {
    x1 = width;
    y1 = height - y0;
  }
  if (y0 == 0) {
    y1 = height;
    x1 = width - x0;
  }
  if (x0 == width) {
    x1 = 0;
    y1 = height - y0;
  }
  if (y0 == height) {
    y1 = 0;
    x1 = width - x0;
  }
  return { x0, y0, x1, y1 };
};

// The class for the texture

export default class LinearGradient extends lng.Texture {
  constructor(stage) {
    super(stage);
    this._w = 0;
    this._h = 0;
    this._steps = [];
    this._degrees = 0;
  }

  // Width
  get w() {
    return this._w;
  }

  set w(w) {
    this._w = w;
    this._changed();
  }

  // Height
  get h() {
    return this._h;
  }

  set h(h) {
    this._h = h;
    this._changed();
  }

  // Steps
  get steps() {
    return this._steps;
  }

  set steps(steps) {
    this._steps = steps;
    this._changed();
  }

  // Degrees
  get degrees() {
    return this._degrees;
  }

  set degrees(degrees) {
    this._degrees = degrees;
    this._changed();
  }

  _getLookupId() {
    return `__linearGradient_${this._h}_${this._w}_${this._steps.count}_${this._degrees}`;
  }

  _getSourceLoader() {
    const w = this._w;
    const h = this._h;
    const d = this._degrees;
    const p = points(d, w, h);
    const { x0, y0, x1, y1 } = p;

    const steps = this._steps;

    return function (cb) {
      const canvas = this.stage.platform.getDrawingCanvas();

      canvas.width = w;
      canvas.height = h;
      var context = canvas.getContext('2d');

      var gradient = context.createLinearGradient(x0, y0, x1, y1);

      steps.forEach(step => {
        gradient.addColorStop(step.percent, step.color);
      });
      context.fillStyle = gradient;
      context.fillRect(0, 0, w, h);

      cb(null, { source: canvas, w, h });
    };
  }
}
