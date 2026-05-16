import { Dynamic_Value } from "../dynamic";
import type { CSS_Object } from "./css";

export type Flat_Rule = {
  selector: string;
  property: string;
  value: string | number | boolean | Dynamic_Value;
  media?: string;
  order?: number;
};

export type Keyframes_Rule = {
  name: string;
  steps: Record<string, CSS_Object>;
};

export type Flat_Entry =
  | Flat_Rule
  | Keyframes_Rule;
