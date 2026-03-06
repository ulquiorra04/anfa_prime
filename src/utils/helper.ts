export const toMidnight = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const isSameDay = (a: Date, b: Date) =>
  toMidnight(a).getTime() === toMidnight(b).getTime();

export const isInRange = (d: Date, from: Date, to: Date) => {
  const t = toMidnight(d).getTime();
  return t >= toMidnight(from).getTime() && t <= toMidnight(to).getTime();
};

export const formatDayShort = (d: Date) =>
  d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const formatDayLabel = (d: Date) =>
  d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const formatTime = (raw: string) => {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
};

export const toDate = (raw: string) => new Date(raw);

export const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
export const MONTH_SHORT = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];
export const DAY_HEADERS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];



export const formatDate = () =>
  new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const generateRef = () => Math.random().toString(36).slice(2, 8).toUpperCase();
