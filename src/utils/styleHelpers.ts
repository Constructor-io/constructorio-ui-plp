// eslint-disable to be removed when more utils are added here.
// eslint-disable-next-line import/prefer-default-export
export function concatStyles(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
