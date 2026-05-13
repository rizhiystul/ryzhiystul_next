function to_kebab_case(value: string): string {
  return value.replace(
    /[A-Z]/g,
    (match) => `-${match.toLowerCase()}`
  );
}

export function serialize(
  property: string,
  value: string | number | boolean
): string {
  return `${to_kebab_case(property)}:${String(value)}`;
}
