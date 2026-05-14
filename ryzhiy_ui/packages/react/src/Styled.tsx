"use client";

import React from "react";
import type { CSSProperties } from "react";

import {
  compile_styles,
  Style_Registry,
  Style_Renderer,
  type CSS_Object
} from "../../styled_core";

type Styled_Props<T extends React.ElementType> = {
  as?: T;
  css?: CSS_Object | CSS_Object[];
} & Omit<
  React.ComponentPropsWithoutRef<T>,
  "as"
>;

const registry = new Style_Registry();
let renderer: Style_Renderer | null = null;

function ensure_renderer(): Style_Renderer {
  if (!renderer) {
    renderer = new Style_Renderer();
  }

  return renderer;
}

function normalize_css(
  css: Styled_Props<any>["css"]
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

function merge_css_objects(
  target: CSS_Object,
  source: CSS_Object
): CSS_Object {
  const result = { ...target };

  for (const key in source) {
    const source_value = source[key];
    const target_value = result[key];

    if (
      source_value &&
      typeof source_value === "object" &&
      !Array.isArray(source_value) &&
      !("__dynamic" in source_value)
    ) {
      result[key] = merge_css_objects(
        (target_value as CSS_Object) ?? {},
        source_value as CSS_Object
      );

      continue;
    }

    result[key] = source_value;
  }

  return result;
}

function Styled<T extends React.ElementType = "div">(
  props: Styled_Props<T>
) {
  const {
    as,
    css,
    className,
    ...rest
  } = props;

  const Component = as ?? "div";

  const normalized = normalize_css(css);

  const compiled = React.useMemo(
    () => compile_styles(normalized),
    [normalized]
  );

  if (typeof window !== "undefined") {
    const active_renderer = ensure_renderer();

    const { new_rules } = registry.register(
      compiled.rules
    );

    active_renderer.insert_many(new_rules);
  }

  const merged_class_name = [
    compiled.className,
    className
  ]
    .filter(Boolean)
    .join(" ");

  const style_vars = compiled.vars as CSSProperties;

  return (
    <Component
      {...rest}
      className={merged_class_name}
      style={{
        ...(props as any).style,
        ...style_vars
      }}
    />
  );
}

export { Styled };
