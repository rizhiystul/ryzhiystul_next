"use client";

import React from "react";

import { Style_Registry } from "@ryzhiy_ui/styled_core";

const Style_Context =
  React.createContext<Style_Registry | null>(
    null
  );

export { Style_Context };
