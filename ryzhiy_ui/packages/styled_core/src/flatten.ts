import { is_dynamic } from "./dynamic";

import type { CSS_Object } from "./types/css";
import type {
  Flat_Rule,
  Keyframes_Rule,
  Flat_Entry
} from "./types/ast";

type Flatten_Options = {
  selector?: string;
  media?: string;
};

let global_order = 0;

export function flatten_styles(
  styles: CSS_Object,
  options: Flatten_Options = {}
): Flat_Entry[] {
  const rules: Flat_Entry[] = [];

  const selector = options.selector ?? "";
  const media = options.media;

  for (const key in styles) {
    const value = styles[key];

    if (value == null) {
      continue;
    }

    if (
      key.startsWith("@keyframes") &&
      typeof value === "object"
    ) {
      rules.push({
        name: key.replace("@keyframes ", ""),
        steps: value as Record<string, CSS_Object>
      });

      continue;
    }

    if (
      typeof value !== "object" ||
      Array.isArray(value) ||
      is_dynamic(value)
    ) {
      rules.push({
        selector,
        property: key,
        value,
        media,
        order: global_order++
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

    const next_selector = key.includes("&")
      ? key.replaceAll("&", selector || "")
      : `${selector}${key}`;

    rules.push(
      ...flatten_styles(value, {
        selector: next_selector,
        media
      })
    );
  }

  return rules;
}
