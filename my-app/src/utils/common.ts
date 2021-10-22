export const stringifyDate = (date: Date) =>
    (
        date.toLocaleDateString("ru-RU", {year: "numeric"})
        + date.toLocaleDateString("ru-RU", {month: "2-digit"})
        + date.toLocaleDateString("ru-RU", {day: "2-digit"})
    );