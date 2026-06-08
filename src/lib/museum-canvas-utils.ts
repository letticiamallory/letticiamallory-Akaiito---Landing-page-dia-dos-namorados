import { CANVAS_H, CANVAS_W } from "@/data/museum-frames";

export function getCanvasScale(containerWidth: number, containerHeight: number) {
  if (containerWidth <= 0 || containerHeight <= 0) return 1;
  return Math.min(containerWidth / CANVAS_W, containerHeight / CANVAS_H);
}

/** Escala pelo width — encaixa o salão inteiro sem cortar (preview/card) */
export function getCanvasFitScale(containerWidth: number) {
  if (containerWidth <= 0) return 1;
  return containerWidth / CANVAS_W;
}

export const MUSEUM_ASPECT_RATIO = CANVAS_W / CANVAS_H;

export function screenToCanvas(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  scale: number
) {
  return {
    x: (clientX - rect.left) / scale,
    y: (clientY - rect.top) / scale,
  };
}

export function isInsideCanvas(
  clientX: number,
  clientY: number,
  rect: DOMRect
) {
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}

export function clampElementPosition(
  x: number,
  y: number,
  width: number,
  height: number
) {
  return {
    x: Math.max(0, Math.min(CANVAS_W - width, x)),
    y: Math.max(0, Math.min(CANVAS_H - height, y)),
  };
}

export type PointerPoint = { clientX: number; clientY: number };

export function getPointerPoint(e: MouseEvent | TouchEvent): PointerPoint | null {
  if ("touches" in e) {
    const t = e.touches[0] ?? e.changedTouches[0];
    if (!t) return null;
    return { clientX: t.clientX, clientY: t.clientY };
  }
  return { clientX: e.clientX, clientY: e.clientY };
}
