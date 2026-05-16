import type { Keyframes_Rule } from "./types/ast";


export function generate_keyframes(
  rule: Keyframes_Rule
): string {
  const steps: string[] = [];

  for (const step in rule.steps) {
    const styles = rule.steps[step];
    const declarations: string[] = [];

    for (const property in styles) {
      const value = styles[property];

      if (
        value == null ||
        typeof value === "object"
      ) {
        continue;
      }

      const kebab = property.replace(
        /[A-Z]/g,
        (match) => `-${match.toLowerCase()}`
      );

      declarations.push(
        `${kebab}:${value}`
      );
    }

    steps.push(
      `${step}{${declarations.join(";")}}`
    );
  }

  return `@keyframes ${rule.name}{${steps.join("")}}`;
}
