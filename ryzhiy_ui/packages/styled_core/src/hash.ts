export function hash(value: string): string {
  let h = 5381;
  let i = value.length;

  while (i) {
    h = (h * 33) ^ value.charCodeAt(--i);
  }

  return (h >>> 0).toString(36);
}
