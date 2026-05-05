export function routeParam(value: string | string[] | undefined, name: string) {
  if (typeof value !== "string") {
    throw new Error(`Missing route parameter: ${name}`);
  }

  return value;
}
