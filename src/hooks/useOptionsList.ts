import { useEffect, useState } from 'react';

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
}

export default function useOptionsList<T>(props: UseOptionsListProps<T>) {
  const { options, initialNumOptions = 5 } = props;

  const [isShowAll, setIsShowAll] = useState(false);
  const [optionsToRender, setOptionsToRender] = useState<Array<T>>(options);

  useEffect(() => {
    if (isShowAll) {
      setOptionsToRender(options);
    } else {
      setOptionsToRender(options.slice(0, initialNumOptions));
    }
  }, [isShowAll, options, initialNumOptions]);

  return {
    // props
    initialNumOptions,

    isShowAll,
    setIsShowAll,
    optionsToRender,
    setOptionsToRender,
  };
}
