/** Rotação persistida por seed (-12° a +12°) */
export function collageRotation(seed: string, index = 0): number {
  let h = 0;
  const s = `${seed}-${index}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return ((h % 25) - 12);
}

export function yearsTogether(startIso: string): number {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return 0;
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  const m = now.getMonth() - start.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < start.getDate())) years -= 1;
  return Math.max(0, years);
}

export interface CalendarCell {
  day: number | null;
  isWeekend: boolean;
  isMarked: boolean;
}

export function buildCalendarMonth(iso: string): {
  monthLabel: string;
  year: number;
  cells: CalendarCell[];
} {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    const now = new Date();
    return buildCalendarMonth(now.toISOString());
  }
  const year = d.getFullYear();
  const month = d.getMonth();
  const markedDay = d.getDate();
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = first.toLocaleDateString("pt-BR", { month: "long" });

  const cells: CalendarCell[] = [];
  for (let i = 0; i < startPad; i++) cells.push({ day: null, isWeekend: false, isMarked: false });
  for (let day = 1; day <= daysInMonth; day++) {
    const dow = new Date(year, month, day).getDay();
    cells.push({
      day,
      isWeekend: dow === 0 || dow === 6,
      isMarked: day === markedDay,
    });
  }
  return { monthLabel, year, cells };
}
