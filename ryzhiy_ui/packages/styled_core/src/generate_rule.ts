import type { Flat_Rule } from "./types/ast";
import { unitless_properties } from "./unitless";


type Generate_Options = {
  class_name: string;
};

function to_kebab_case(
  value: string
): string {
  return value.replace(
    /[A-Z]/g,
    (match) => `-${match.toLowerCase()}`
  );
}

function normalize_css_value(
  property: string,
  value: unknown
): string {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "number") {
          if (
            unitless_properties.has(
              property
            )
          ) {
            return String(item);
          }

          return `${item}px`;
        }

        return String(item);
      })
      .join(" ");
  }

  if (typeof value === "number") {
    if (
      unitless_properties.has(property)
    ) {
      return String(value);
    }

    return `${value}px`;
  }

  return String(value);
}

export function generate_rule(
  rule: Flat_Rule,
  options: Generate_Options
): string {
  const { class_name } = options;

  const property = to_kebab_case(
    rule.property
  );

  const value = normalize_css_value(
    rule.property,
    rule.value
  );

  const selector = rule.selector
    ? `.${class_name}${rule.selector}`
    : `.${class_name}`;

  const css_rule =
    `${selector}{${property}:${value}}`;

  if (rule.media) {
    return `${rule.media}{${css_rule}}`;
  }

  return css_rule;
}
