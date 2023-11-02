/**
 * Given a Type T and a set of keys K (pipe-delimited string), make those keys optional.
 */
export type MakeOptional<Type, Keys extends string & keyof Partial<Type>> = Omit<Type, Keys> &
  Partial<Pick<Type, Keys>>;
