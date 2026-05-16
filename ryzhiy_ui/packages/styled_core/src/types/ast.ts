import { Dynamic_Value } from "../dynamic";
import type { CSS_Object } from "./css";


type Flat_Rule = {
  selector: string;
  property: string;
  value: string | number | boolean | Dynamic_Value;
  media?: string;
  order?: number;
};

type Keyframes_Rule = {
  name: string;
  steps: Record<string, CSS_Object>;
};

type Flat_Entry =
  | Flat_Rule
  | Keyframes_Rule;


export type { Flat_Rule, Keyframes_Rule, Flat_Entry };
