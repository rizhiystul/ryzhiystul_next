function to_kebab_case(
  value: string
): string {
  return value.replace(
    /[A-Z]/g,
    (match) => `-${match.toLowerCase()}`
  );
}

function normalize_value(
  value: unknown
): string {
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "number"
          ? `${item}px`
          : String(item)
      )
      .join(" ");
  }

  if (typeof value === "number") {
    return `${value}px`;
  }

  return String(value);
}

export function serialize(
  property: string,
  value: unknown
): string {
  const kebab_property =
    to_kebab_case(property);

  const normalized_value =
    normalize_value(value);

  return `${kebab_property}:${normalized_value}`;
}
