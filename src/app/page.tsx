"use client";

import { Styled } from "@ryzhiy_ui/react";
import { dynamic } from "@ryzhiy_ui/styled_core";
import { useState } from "react";

export default function Page() {
  const [width, set_width] = useState(200);

  return (
    <>
      <Styled
        as="div"
        css={{
          width: dynamic(`${width}px`),
          height: "80px",
          backgroundColor: "black",
          transition: "width 200ms"
        }}
      />

      <button
        onClick={() => set_width((v) => v + 40)}
      >
        grow
      </button>
    </>
  );
}
