import { CANVAS_H, CANVAS_W, EDITOR_MAX_HEIGHT } from "@/data/chocolate-catalog";

export function getCanvasScale(containerWidth: number, containerHeight: number) {
  if (containerWidth <= 0 || containerHeight <= 0) return 1;
  return Math.min(containerWidth / CANVAS_W, containerHeight / CANVAS_H);
}

/** Escala pela largura — encaixa a caixa inteira (editor embutido) */
export function getCanvasFitScale(containerWidth: number) {
  if (containerWidth <= 0) return 1;
  return containerWidth / CANVAS_W;
}

/** Editor: limita altura a EDITOR_MAX_HEIGHT mantendo proporção */
export function getEditorCanvasScale(containerWidth: number) {
  if (containerWidth <= 0) return 1;
  return Math.min(containerWidth / CANVAS_W, EDITOR_MAX_HEIGHT / CANVAS_H);
}

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

export function isInsideCanvas(clientX: number, clientY: number, rect: DOMRect) {
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}
