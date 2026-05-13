import { flatten_styles } from "./flatten";
import { hash } from "../hash";
import { generate_rule } from "./generate_rule";
import { is_dynamic } from "../dynamic";

import type { CSS_Object } from "../types/css";
import type { Flat_Rule } from "../types/ast";


type Compiled_Style = {
  className: string;
  rules: string[];
  vars: Record<string, string | number>;
};


export function compile_styles(
  styles: CSS_Object
): Compiled_Style {
  const flat_rules = flatten_styles(styles);

  const rules: string[] = [];
  const class_names: string[] = [];
  const vars: Record<string, string | number> = {};

  for (const rule of flat_rules) {
    const serialized = JSON.stringify(rule);
    const hashed = hash(serialized);
    const class_name = `r${hashed}`;

    let processed_rule: Flat_Rule = rule;

    if (is_dynamic(rule.value)) {
      const variable_name = `--${class_name}`;

      vars[variable_name] = rule.value.value;

      processed_rule = {
        ...rule,
        value: `var(${variable_name})`
      };
    }

    const css_rule = generate_rule(
      processed_rule,
      { class_name }
    );

    rules.push(css_rule);
    class_names.push(class_name);
  }

  return {
    className: [...new Set(class_names)].join(" "),
    rules,
    vars
  };
}
