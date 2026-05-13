import { is_dynamic } from "../dynamic";

import type { CSS_Object } from "../types/css";
import type { Flat_Rule } from "../types/ast";

type Flatten_Options = {
  selector?: string;
  media?: string;
};

export function flatten_styles(
  styles: CSS_Object,
  options: Flatten_Options = {}
): Flat_Rule[] {
  const rules: Flat_Rule[] = [];

  const selector = options.selector ?? "";
  const media = options.media;

  for (const key in styles) {
    const value = styles[key];

    if (value == null) {
      continue;
    }

    if (
      typeof value !== "object" ||
      is_dynamic(value)
    ) {
      rules.push({
        selector,
        property: key,
        value,
        media
      });

      continue;
    }

    if (key.startsWith("@")) {
      rules.push(
        ...flatten_styles(value, {
          selector,
          media: key
        })
      );

      continue;
    }

    rules.push(
      ...flatten_styles(value, {
        selector: `${selector}${key}`,
        media
      })
    );
  }

  return rules;
}
