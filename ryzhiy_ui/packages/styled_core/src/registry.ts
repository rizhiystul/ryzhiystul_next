type Registered_Result = {
  new_rules: string[];
};

class Style_Registry {
  private inserted = new Set<string>();

  register(rules: string[]): Registered_Result {
    const new_rules: string[] = [];

    for (const rule of rules) {
      if (this.inserted.has(rule)) {
        continue;
      }

      this.inserted.add(rule);
      new_rules.push(rule);
    }

    return {
      new_rules
    };
  }

  has(rule: string): boolean {
    return this.inserted.has(rule);
  }

  clear(): void {
    this.inserted.clear();
  }

  get_all(): string[] {
    return Array.from(this.inserted);
  }
}

export { Style_Registry };
