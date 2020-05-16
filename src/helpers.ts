export function getDistance(x1: number, y1: number, x2: number, y2: number) {
    let xs = x2 - x1,
        ys = y2 - y1;
    xs *= xs;
    ys *= ys;
    return Math.sqrt(xs + ys);
}

export function getFillRectDataFromStartEnd(
    startX: number,
    startY: number,
    endX: number,
    endY: number
): [number, number, number, number] {
    return [
        Math.min(startX, endX),
        Math.min(startY, endY),
        Math.abs(endX - startX),
        Math.abs(endY - startY),
    ];
}

export function getArcDataFromStartEnd(
    startX: number,
    startY: number,
    endX: number,
    endY: number
): [number, number, number, number, number, boolean] {
    const originX = Math.abs(endX + startX) / 2;
    const originY = Math.abs(endY + startY) / 2;
    const radius = getDistance(startX, startY, endX, endY) / 2;
    return [originX, originY, radius, 0, 2 * Math.PI, false];
}

export function getMousePosition(
    canvas: HTMLCanvasElement,
    evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>
) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
        y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    };
}

interface Circle{
  x: number;
  y: number;
  r: number;
}

interface Rectangle{
  x: number;
  y: number;
  w: number;
  h: number;
}

export function RectCircleColliding(circle:Circle, rect: Rectangle) {
  var distX = Math.abs(circle.x - rect.x - rect.w / 2);
  var distY = Math.abs(circle.y - rect.y - rect.h / 2);

  if (distX > rect.w / 2 + circle.r) {
    return false;
  }
  if (distY > rect.h / 2 + circle.r) {
    return false;
  }

  if (distX <= rect.w / 2) {
    return true;
  }
  if (distY <= rect.h / 2) {
    return true;
  }

  var dx = distX - rect.w / 2;
  var dy = distY - rect.h / 2;
  return dx * dx + dy * dy <= circle.r * circle.r;
}
