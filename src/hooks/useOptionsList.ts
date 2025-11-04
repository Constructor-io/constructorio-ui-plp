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
}

const defaultIsHiddenOptionFn = () => false;

export default function useOptionsList<T>(props: UseOptionsListProps<T>) {
  const { options, initialNumOptions = 5, isHiddenOptionFn = defaultIsHiddenOptionFn } = props;

  const filteredOptions = useMemo(
    () => options.filter((option) => !isHiddenOptionFn(option)),
    [isHiddenOptionFn, options],
  );
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
