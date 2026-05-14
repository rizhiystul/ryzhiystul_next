type Register_Result = {
  new_rules: string[];
};

class Style_Registry {
  private rules = new Set<string>();

  register(
    rules: string[]
  ): Register_Result {
    const new_rules: string[] = [];

    for (const rule of rules) {
      if (this.rules.has(rule)) {
        continue;
      }

      this.rules.add(rule);
      new_rules.push(rule);
    }

    return {
      new_rules
    };
  }

  has(rule: string): boolean {
    return this.rules.has(rule);
  }

  get_all(): string[] {
    return [...this.rules];
  }

  to_string(): string {
    return this.get_all().join("");
  }

  hydrate(css_text: string): void {
    const matches = css_text.match(
      /[^}]+}/g
    );

    if (!matches) {
      return;
    }

    for (const rule of matches) {
      this.rules.add(rule);
    }
  }

  clear(): void {
    this.rules.clear();
  }
}

export { Style_Registry };
