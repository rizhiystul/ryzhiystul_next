"use client";

import React from "react";

import {
  compile_styles,
  Style_Registry,
  Style_Renderer,
  type CSS_Object
} from "@ryzhiy_ui/styled_core";
import { Style_Context } from "./context";

type Styled_Props<T extends React.ElementType> = {
  as?: T;
  css?: CSS_Object | CSS_Object[];
} & Omit<
  React.ComponentPropsWithoutRef<T>,
  "as"
>;

let renderer: Style_Renderer | null = null;
let hydrated = false;

function get_renderer(): Style_Renderer {
  if (!renderer) {
    renderer = new Style_Renderer();
  }

  return renderer;
}

function ensure_hydration(
  registry: Style_Registry
): void {
  if (hydrated) {
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  const active_renderer = get_renderer();

  registry.hydrate(
    active_renderer.get_css_text()
  );

  hydrated = true;
}

function is_plain_object(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !("__dynamic" in (value as any))
  );
}

function merge_css_objects(
  target: CSS_Object,
  source: CSS_Object
): CSS_Object {
  const result = { ...target };

  for (const key in source) {
    const source_value = source[key];
    const target_value = result[key];

    if (
      is_plain_object(source_value) &&
      is_plain_object(target_value)
    ) {
      result[key] = merge_css_objects(
        target_value as CSS_Object,
        source_value as CSS_Object
      );

      continue;
    }

    result[key] = source_value;
  }

  return result;
}

function normalize_css(
  css: CSS_Object | CSS_Object[] | undefined
): CSS_Object {
  if (!css) {
    return {};
  }

  if (!Array.isArray(css)) {
    return css;
  }

  let merged: CSS_Object = {};

  for (const item of css) {
    if (!item) {
      continue;
    }

    merged = merge_css_objects(
      merged,
      item
    );
  }

  return merged;
}

const fallback_registry =
  new Style_Registry();

const Styled = React.forwardRef(
  <
    T extends React.ElementType = "div"
  >(
    props: Styled_Props<T>,
    ref: React.ForwardedRef<any>
  ) => {

    const registry =
      React.useContext(Style_Context) ??
      fallback_registry;

    const {
      as,
      css,
      className,
      style,
      ...rest
    } = props;

    const Component = as ?? "div";

    const normalized = React.useMemo(
      () => normalize_css(css),
      [css]
    );

    const compiled = React.useMemo(
      () => compile_styles(normalized),
      [normalized]
    );

    const { new_rules } = registry.register(
      compiled.rules
    );

    React.useInsertionEffect(() => {
      if (typeof window === "undefined") {
        return;
      }

      ensure_hydration(registry);

      const active_renderer = get_renderer();

      active_renderer.insert_many(new_rules);
    }, [compiled, registry]);

    const merged_class_name = [
      compiled.className,
      className
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Component
        {...rest}
        ref={ref}
        className={merged_class_name}
        style={{
          ...style,
          ...(compiled.vars as React.CSSProperties)
        }}
      />
    );
  }
);

Styled.displayName = "Styled";

export { Styled };
