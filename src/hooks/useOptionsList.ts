import { useEffect, useMemo, useState } from 'react';

export interface UseOptionsListProps<T> {
  /**
   * Array of options to render.
   */
  options: Array<T>;
  /**
   * The number of options to render for non-ranged facets.
   * The remaining options will be hidden under a "Show All" button
   */
  initialNumOptions?: number;
  /**
   * Function that takes in an option object T and returns `true` if it should NOT be rendered as an option
   * @returns boolean
   */
  isHiddenOptionFn?: (option: T) => boolean;
  /**
   * Key name for nested options array (e.g., 'options' for hierarchical facets, 'children' for groups).
   * When provided, filtering will be applied recursively to nested options.
   */
  nestedOptionsKey?: string;
}

const defaultIsHiddenOptionFn = () => false;

/**
 * Recursively filters options and their nested children
 */
function filterOptionsRecursively<T>(
  options: Array<T>,
  isHiddenFn: (option: T) => boolean,
  nestedKey: string,
): Array<T> {
  return options
    .filter((option) => !isHiddenFn(option))
    .map((option) => {
      const nestedOptions = (option as Record<string, any>)[nestedKey];
      if (Array.isArray(nestedOptions) && nestedOptions.length > 0) {
        return {
          ...option,
          [nestedKey]: filterOptionsRecursively(nestedOptions, isHiddenFn, nestedKey),
        };
      }
      return option;
    });
}

export default function useOptionsList<T>(props: UseOptionsListProps<T>) {
  const {
    options,
    initialNumOptions = 5,
    isHiddenOptionFn = defaultIsHiddenOptionFn,
    nestedOptionsKey,
  } = props;

  const filteredOptions = useMemo(() => {
    if (nestedOptionsKey) {
      return filterOptionsRecursively(options, isHiddenOptionFn, nestedOptionsKey);
    }
    return options.filter((option) => !isHiddenOptionFn(option));
  }, [isHiddenOptionFn, options, nestedOptionsKey]);
  const [isShowAll, setIsShowAll] = useState(false);
  const [optionsToRender, setOptionsToRender] = useState<Array<T>>(filteredOptions);

  useEffect(() => {
    if (isShowAll) {
      setOptionsToRender(filteredOptions);
    } else {
      setOptionsToRender(filteredOptions.slice(0, initialNumOptions));
    }
  }, [isShowAll, filteredOptions, initialNumOptions]);

  return {
    // props
    initialNumOptions,

    isShowAll,
    setIsShowAll,
    optionsToRender,
    setOptionsToRender,
  };
}
