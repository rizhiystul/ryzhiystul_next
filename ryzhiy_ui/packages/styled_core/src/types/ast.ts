import { Dynamic_Value } from "../dynamic";

export type Flat_Rule = {
  selector: string;
  property: string;
  value: string | number | boolean | Dynamic_Value;
  media?: string;
};
