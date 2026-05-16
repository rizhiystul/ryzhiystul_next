"use client";

import React from "react";
import { useServerInsertedHTML } from "next/navigation";

import { Style_Registry } from "@ryzhiy_ui/styled_core";
import { Style_Context } from "@ryzhiy_ui/react";

export function Style_Provider({
  children
}: {
  children: React.ReactNode;
}) {
  const registry_ref = React.useRef<Style_Registry | null>(null);

  if (!registry_ref.current) {
    registry_ref.current = new Style_Registry();
  }

  const registry = registry_ref.current;

  useServerInsertedHTML(() => {
    const css = registry.to_string();

    registry.clear();

    if (!css) {
      return null;
    }

    return (
      <style
        data-ryzhiy-ui="true"
        dangerouslySetInnerHTML={{
          __html: css
        }}
      />
    );
  });

  return (
    <Style_Context.Provider value={registry}>
      {children}
    </Style_Context.Provider>
  );
}
