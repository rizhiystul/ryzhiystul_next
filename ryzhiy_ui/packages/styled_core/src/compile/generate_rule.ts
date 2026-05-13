import { serialize } from "../serialize";
import type { Flat_Rule } from "../types/ast";

type Generate_Rule_Options = {
  class_name: string;
};

export function generate_rule(
  rule: Flat_Rule,
  options: Generate_Rule_Options
): string {
  const selector =
    `.${options.class_name}${rule.selector}`;

  const declaration = serialize(
    rule.property,
    rule.value
  );

  const css_rule =
    `${selector}{${declaration}}`;

  if (rule.media) {
    return `${rule.media}{${css_rule}}`;
  }

  return css_rule;
}
