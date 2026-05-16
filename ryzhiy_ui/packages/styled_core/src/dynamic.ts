type Dynamic_Value = {
  __dynamic: true;
  value: string | number;
};

function dynamic(
  value: string | number
): Dynamic_Value {
  return {
    __dynamic: true,
    value
  };
}

function is_dynamic(
  value: unknown
): value is Dynamic_Value {
  return (
    typeof value === "object" &&
    value !== null &&
    "__dynamic" in value &&
    (value as Dynamic_Value).__dynamic === true
  );
}


export type { Dynamic_Value };
export { dynamic, is_dynamic };
