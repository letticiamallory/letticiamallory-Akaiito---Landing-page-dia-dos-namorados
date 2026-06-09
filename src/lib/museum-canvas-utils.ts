import { CANVAS_H, CANVAS_W } from "@/data/museum-frames";

/** Viewport do card embutido — mesmo espaço do demo de marketing (680×400) */
export const MUSEUM_WALL_VIEW_W = 680;
export const MUSEUM_WALL_VIEW_H = 400;
export const MUSEUM_WALL_TO_CANVAS_X = CANVAS_W / MUSEUM_WALL_VIEW_W;
export const MUSEUM_WALL_TO_CANVAS_Y = CANVAS_H / MUSEUM_WALL_VIEW_H;

/** Recorte do lustre sobre os quadros (coordenadas do SVG 1728×1117) */
export const MUSEUM_CHANDELIER_CLIP = `inset(0 ${((1728 - 1005) / 1728) * 100}% ${100 - (307 / CANVAS_H) * 100}% ${(724 / 1728) * 100}%)`;

export type MuseumRect = { x: number; y: number; width: number; height: number };

export function isMuseumCanvasSpace(element: Pick<MuseumRect, "x" | "y">) {
  return element.x > MUSEUM_WALL_VIEW_W || element.y > MUSEUM_WALL_VIEW_H;
}

export function museumCanvasToWallRect(rect: MuseumRect): MuseumRect {
  return {
    x: Math.round(rect.x / MUSEUM_WALL_TO_CANVAS_X),
    y: Math.round(rect.y / MUSEUM_WALL_TO_CANVAS_Y),
    width: Math.round(rect.width / MUSEUM_WALL_TO_CANVAS_X),
    height: Math.round(rect.height / MUSEUM_WALL_TO_CANVAS_Y),
  };
}

export function museumWallToCanvasRect(rect: MuseumRect): MuseumRect {
  return {
    x: Math.round(rect.x * MUSEUM_WALL_TO_CANVAS_X),
    y: Math.round(rect.y * MUSEUM_WALL_TO_CANVAS_Y),
    width: Math.round(rect.width * MUSEUM_WALL_TO_CANVAS_X),
    height: Math.round(rect.height * MUSEUM_WALL_TO_CANVAS_Y),
  };
}

export function getWallFitScale(containerWidth: number) {
  if (containerWidth <= 0) return 1;
  return containerWidth / MUSEUM_WALL_VIEW_W;
}

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
