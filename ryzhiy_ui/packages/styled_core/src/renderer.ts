class Style_Renderer {
  private style_element: HTMLStyleElement;
  private sheet: CSSStyleSheet;

  constructor() {
    this.style_element = document.createElement("style");
    this.style_element.setAttribute("data-ryzhiy-ui", "true");

    document.head.appendChild(this.style_element);

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
}

export { Style_Renderer };
