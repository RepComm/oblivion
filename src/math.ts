
export const EPSILON = 0.0001;

let Utils = {
  /** Convert two dimensional coordinates to a one dimensional index
   * @param x coordinate
   * @param y coordinate
   * @param width of bounding grid
   */
  twoDimToIndex(x: number, y: number, width: number): number {
    return x + width * y;
  },
  /** Convert one dimensional index to two dimensional X coordinate
   * @param index one dimensional offset index
   * @param width of bounding grid
   */
  indexToTwoDimX(index: number, width: number): number {
    return index % width;
  },
  /** Convert one dimensional index to two dimensional Y coordinate
   * @param index one dimensional offset index
   * @param width of bounding grid
   */
  indexToTwoDimY(index: number, width: number): number {
    return index / width;
  },
  /** Round *n* to the next increment of *next* argument
   * @param n to round
   * @param next round up to in increments of this number
   */
  roundToNext(n: number, next: number): number {
    let isNeg = (n < 0);
    if (isNeg) { n -= next };
    let resto = n % next;
    if (resto <= (next)) {
      return n - resto;
    } else {
      return n + next - resto;
    }
  },
  /** Regular round, but with added 'to' option
   * @param n number to round
   * @param to round to
   */
  roundTo(n: number, to: number): number {
    let resto = n % to;
    if (resto <= (to / 2)) {
      return n - resto;
    } else {
      return n + to - resto;
    }
  }
};
let pi = 3.141592653589793;

let radians = (degrees: number): number => degrees * (pi / 180);
let degrees = (radians: number): number => radians * (180 / pi);
let lerp = (a: number, b: number, c: number): number => a + c * (b - a);

let lerpClamped = (a: number, b: number, c: number): number => {
  return lerp(a, b, clamp(c, 0, 1));
};

let dist = (x1: number, y1: number, x2: number, y2: number): number => Math.sqrt(
  Math.pow(x1 - x2, 2) +
  Math.pow(y1 - y2, 2)
);

let ndist = (n1: number, n2: number): number => Math.abs(Math.abs(n1) - Math.abs(n2));

let pointInRect = (x: number, y: number, rx: number, ry: number, rw: number, rh: number) => (
  x > rx &&
  x < rx + rw &&
  y > ry &&
  y < ry + rh
);

export interface LineIntersectResult {
  x: number;
  y: number;
  onLine0: boolean;
  onLine1: boolean;
}

export const lineIntersect = (x0, y0, x1, y1, x2, y2, x3, y3, result: LineIntersectResult) => {
  let denom = 0;
  let a = 0;
  let b = 0;
  let num0 = 0;
  let num1 = 0;
  denom = ((y3 - y2) * (x1 - x0)) - ((x3 - x2) * (y1 - y0));
  if (denom == 0) {
    return result;
  }
  a = y0 - y2;
  b = x0 - x2;
  num0 = ((x3 - x2) * a) - ((y3 - y2) * b);
  num1 = ((x1 - x0) * a) - ((y1 - y0) * b);
  a = num0 / denom;
  b = num1 / denom;

  result.x = x0 + (a * (x1 - x0));
  result.y = y0 + (a * (y1 - y0));
  if (a > 0 && a < 1) {
    result.onLine0 = true;
  }
  if (b > 0 && b < 1) {
    result.onLine1 = true;
  }
  return result;
};

/**Clamp a number between a min and max
 * @param n to clamp
 * @param min value
 * @param max value
 */
let clamp = (n: number, min: number = 0, max: number = 1): number => {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

export { Utils, dist, lerp, lerpClamped, degrees, radians, pi, ndist, pointInRect, clamp };