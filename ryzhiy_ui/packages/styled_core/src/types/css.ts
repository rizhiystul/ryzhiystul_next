import type * as CSS from "csstype";
import type { Dynamic_Value } from "../dynamic";


type Primitive =
  | string
  | number
  | boolean
  | null
  | undefined;

type CSS_Value = Primitive | Dynamic_Value;

type CSS_Properties<
  T_Length = string | 0,
  T_Time = string
> = {
  [K in keyof CSS.Properties<T_Length, T_Time>]?:
    | CSS.Properties<T_Length, T_Time>[K]
    | readonly CSS.Properties<T_Length, T_Time>[K][]
    | CSS_Value;
};

type CSS_Object<
  T_Length = string | 0,
  T_Time = string
> =
  CSS_Properties<T_Length, T_Time>
  & {
    [K in
      | CSS.SimplePseudos
      | CSS.AdvancedPseudos
      | `@${string}`]?:
      CSS_Object<T_Length, T_Time>;
  }
  & {
    [key: string]:
      | CSS_Object<T_Length, T_Time>
      | CSS_Value;
  };


export type { CSS_Object };
