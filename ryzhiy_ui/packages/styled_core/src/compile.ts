import { flatten_styles } from "./flatten";
import { hash } from "./hash";
import { generate_rule } from "./generate_rule";
import { generate_keyframes } from "./generate_keyframes";
import { is_dynamic } from "./dynamic";

import type { CSS_Object } from "./types/css";
import type { Flat_Rule } from "./types/ast";

type Compiled_Style = {
  className: string;
  rules: string[];
  vars: Record<string, string | number>;
};

type Cached_Entry = {
  className: string;
  rules: string[];
  dynamic_class_map: Record<string, string>;
};

const compile_cache = new Map<
  string,
  Cached_Entry
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

  const flat_rules = flatten_styles(styles);

  const normal_rules = flat_rules.filter(
    (rule) => "property" in rule
  );

  const keyframes_rules = flat_rules.filter(
    (rule) => "name" in rule
  );

  const cached = compile_cache.get(cache_key);

  if (cached) {
    const vars: Record<string, string | number> = {};

    for (const rule of normal_rules) {
      if (!is_dynamic(rule.value)) {
        continue;
      }

      const dynamic_key = [
        rule.selector,
        rule.property,
        rule.media ?? ""
      ].join("|");

      const class_name =
        cached.dynamic_class_map[dynamic_key];

      if (!class_name) {
        continue;
      }

      vars[`--${class_name}`] =
        rule.value.value;
    }

    return {
      className: cached.className,
      rules: cached.rules,
      vars
    };
  }

  normal_rules.sort((a, b) => {
    const a_media = a.media ? 1 : 0;
    const b_media = b.media ? 1 : 0;

    if (a_media !== b_media) {
      return a_media - b_media;
    }

    return (a.order ?? 0) - (b.order ?? 0);
  });

  const rules: string[] = [];
  const class_names: string[] = [];
  const vars: Record<string, string | number> = {};
  const dynamic_class_map: Record<
    string,
    string
  > = {};

  for (const rule of normal_rules) {
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

      const dynamic_key = [
        rule.selector,
        rule.property,
        rule.media ?? ""
      ].join("|");

      dynamic_class_map[dynamic_key] =
        class_name;

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

  for (const keyframes of keyframes_rules) {
    const css_rule =
      generate_keyframes(keyframes);

    rules.push(css_rule);
  }

  const result = {
    className: [...new Set(class_names)].join(" "),
    rules,
    vars
  };

  compile_cache.set(cache_key, {
    className: result.className,
    rules: result.rules,
    dynamic_class_map
  });

  return result;
}
