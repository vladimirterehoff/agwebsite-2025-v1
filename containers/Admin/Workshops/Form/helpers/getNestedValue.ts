type Key = string | number;

const parseKeyString = (keyString: string): Key[] => {
  return keyString
    .split('.')
    .flatMap((key) => key.match(/\w+|\d+/g))
    .map((key) => (isNaN(Number(key)) ? `${key}` : Number(key)));
};

export const getNestedValue = <T>(errors: any, name: string): string | undefined => {
  const keys = parseKeyString(name);
  const resp = keys.reduce((acc, key) => acc?.[key], errors)?.message;
  return resp ? `${resp}` : undefined;
};