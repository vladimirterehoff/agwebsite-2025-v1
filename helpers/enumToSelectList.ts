export function enumToSelectList<T extends { [key: string]: string }>(
  enumObj: T, addAllItem: boolean = false
): { name: string; id: T[keyof T] | 'not_selected' }[] {
  const resp = Object.values(enumObj).map((value) => ({
    name: value.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
    id: value as T[keyof T],
  }));
  if (addAllItem) {
    resp.unshift({ name: 'All', id: 'not_selected' as T[keyof T] });
  }
  return resp;
}
