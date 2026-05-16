class Style_Renderer {
  private style_element: HTMLStyleElement;
  private sheet: CSSStyleSheet;

  constructor() {
    const existing = document.querySelector(
      'style[data-ryzhiy-ui="true"]'
    ) as HTMLStyleElement | null;

    if (existing) {
      this.style_element = existing;
      this.sheet = existing.sheet as CSSStyleSheet;

      return;
    }

    this.style_element = document.createElement("style");
    this.style_element.setAttribute(
      "data-ryzhiy-ui",
      "true"
    );

    document.head.appendChild(
      this.style_element
    );

    this.sheet = this.style_element.sheet as CSSStyleSheet;
  }

  insert(rule: string): void {
    this.sheet.insertRule(
      rule,
      this.sheet.cssRules.length
    );
  }

  insert_many(rules: string[]): void {
    for (const rule of rules) {
      this.insert(rule);
    }
  }

  get_css_text(): string {
    return this.style_element.textContent ?? "";
  }
}

export { Style_Renderer };
