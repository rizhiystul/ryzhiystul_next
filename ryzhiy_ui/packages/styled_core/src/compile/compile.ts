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

const compile_cache = new Map<
  string,
  Compiled_Style
>();

export function compile_styles(
  styles: CSS_Object
): Compiled_Style {
  const cache_key = JSON.stringify(
    styles,
    (_, value) => {
      if (is_dynamic(value)) {
        return "__dynamic__";
      }

      return value;
    }
  );

  const cached = compile_cache.get(cache_key);

  if (cached) {
    const vars: Record<string, string | number> = {};

    for (const key in styles) {
      const value = styles[key];

      if (
        value &&
        typeof value === "object" &&
        is_dynamic(value)
      ) {
        const hashed = hash(
          JSON.stringify({
            property: key,
            value: "__dynamic__"
          })
        );

        vars[`--r${hashed}`] = value.value;
      }
    }

    return {
      ...cached,
      vars
    };
  }

  const flat_rules = flatten_styles(styles);

  const rules: string[] = [];
  const class_names: string[] = [];
  const vars: Record<string, string | number> = {};

  flat_rules.sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  for (const rule of flat_rules) {
    const serialized = JSON.stringify({
      ...rule,
      value: is_dynamic(rule.value)
        ? "__dynamic__"
        : rule.value
    });

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

  const result = {
    className: [...new Set(class_names)].join(" "),
    rules,
    vars
  };

  compile_cache.set(cache_key, result);

  return result;
}
