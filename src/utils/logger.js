export function warnDeveloper(message, details) {
  if (!import.meta.env.DEV) return;
  if (details === undefined) {
    console.warn(message);
    return;
  }
  console.warn(message, details);
}
