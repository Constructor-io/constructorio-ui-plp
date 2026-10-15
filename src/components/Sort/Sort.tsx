import React, { useCallback, useEffect, useRef, useState } from 'react';
import useSort, { UseSortProps } from '../../hooks/useSort';
import { IncludeRenderProps, PlpSortOption, UseSortReturn } from '../../types';
import MobileModal from '../MobileModal';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';
import { translate } from '../../utils/helpers';

export type SortProps = UseSortProps & {
  /**
   * Default open state of dropdown
   */
  isOpen?: boolean;
  /**
   * `id` of the sort options panel, referenced by the trigger's `aria-controls`.
   * Also used to scope the option ids and radio group names. Only needs overriding when
   * the generated default must be stable (e.g. it's targeted by custom CSS or tests).
   * @default 'cio-plp-sort-panel', suffixed with a counter for every additional instance
   */
  panelId?: string;
};
export type SortWithRenderProps = IncludeRenderProps<SortProps, UseSortReturn>;

const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

// Radio grouping is scoped by `name` across the whole document, so every instance needs its
// own names and ids. `useId` would be preferable, but React >= 16.12 is supported.
// Each mounted instance takes the lowest free index, and the first keeps the original
// un-suffixed ids and names. Assigned after mount so server and client markup match
const mountedInstances = new Set<number>();
const useInstanceIndex = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let nextIndex = 0;
    while (mountedInstances.has(nextIndex)) nextIndex += 1;
    mountedInstances.add(nextIndex);
    setIndex(nextIndex);

    return () => {
      mountedInstances.delete(nextIndex);
    };
  }, []);

  return index;
};

export default function Sort({
  isOpen: defaultOpen = true,
  sortOptions: sortOptionsFromProps,
  panelId: panelIdFromProps,
  children,
}: SortWithRenderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { sortOptions, selectedSort, changeSelectedSort } = useSort({
    sortOptions: sortOptionsFromProps,
  });
  const { translations } = useCioPlpContext();

  // The first instance keeps the original, un-suffixed ids and names
  const instanceIndex = useInstanceIndex();
  const instanceSuffix = panelIdFromProps || !instanceIndex ? '' : `-${instanceIndex}`;
  const panelId = panelIdFromProps || `cio-plp-sort-panel${instanceSuffix}`;
  const mobilePanelId = `${panelId}-mobile`;
  const idScope = panelIdFromProps ? `${panelIdFromProps}-` : '';

  const buttonRef = useRef<HTMLButtonElement>(null);
  const shouldFocusOptionsRef = useRef(false);
  const isArrowKeyNavigationRef = useRef(false);
  // Option moved to with arrow keys but not applied yet. Arrow keys check radios natively, and
  // applying a sort on every key press would reload results before the user reaches their
  // choice (WCAG 3.2.2). Mirrored in a ref so handlers fired synchronously by focus changes
  // (e.g. blur while handling Escape) see the latest value
  const [pendingSort, setPendingSortState] = useState<PlpSortOption | null>(null);
  const pendingSortRef = useRef<PlpSortOption | null>(null);
  const setPendingSort = (option: PlpSortOption | null) => {
    pendingSortRef.current = option;
    setPendingSortState(option);
  };

  const toggleCollapsible = () => {
    shouldFocusOptionsRef.current = !isOpen;
    setIsOpen(!isOpen);
  };

  // Move focus into the options when opened by the user. Only one of the two panels is
  // displayed at a time, and hidden elements can't take focus, so try each in turn
  useEffect(() => {
    if (!isOpen || !shouldFocusOptionsRef.current) return;
    shouldFocusOptionsRef.current = false;

    [panelId, mobilePanelId].some((containerId) => {
      const container = document.getElementById(containerId);
      const option =
        container?.querySelector<HTMLInputElement>('input:checked') ||
        container?.querySelector<HTMLInputElement>('input');
      option?.focus();
      return !!option && document.activeElement === option;
    });
  }, [isOpen, panelId, mobilePanelId]);

  // Closing discards an unapplied arrow-key choice. Covers Escape inside MobileModal, which
  // handles the key natively and closes without it ever reaching `onOptionsKeyDown`
  useEffect(() => {
    if (!isOpen) setPendingSort(null);
  }, [isOpen]);

  const applyPendingSort = () => {
    const option = pendingSortRef.current;
    if (option) {
      setPendingSort(null);
      changeSelectedSort(option);
    }
  };

  const onOptionsKeyDown = (event: React.KeyboardEvent) => {
    if (ARROW_KEYS.includes(event.key)) {
      isArrowKeyNavigationRef.current = true;
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (pendingSortRef.current) {
        event.preventDefault();
        applyPendingSort();
      }
    } else if (event.key === 'Escape') {
      event.stopPropagation();
      setPendingSort(null);
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  const onOptionsMouseDown = () => {
    isArrowKeyNavigationRef.current = false;
  };

  const onOptionsBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      applyPendingSort();
    }
  };

  const activeSort = pendingSort || selectedSort;
  const isChecked = useCallback(
    (option: PlpSortOption) =>
      activeSort?.sortBy === option.sortBy && activeSort?.sortOrder === option.sortOrder,
    [activeSort],
  );

  const getOptionId = (option: PlpSortOption, idSuffix: string = '') =>
    `${idScope}${option.sortBy}-${option.sortOrder}${idSuffix}${instanceSuffix}`;

  // Each rendered option set (desktop + mobile) is its own radio group, so the two
  // instances don't compete over the same selection. Sharing one `name` within a group
  // is what makes the options arrow-navigable and mutually exclusive. (WCAG 4.1.2)
  const getGroupName = (idSuffix: string = '') =>
    `${idScope}cio-plp-sort${idSuffix}${instanceSuffix}`;

  const genDefaultMarkup = (idSuffix: string = '') => {
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const option = JSON.parse(event.target.value);

      if (isArrowKeyNavigationRef.current) {
        isArrowKeyNavigationRef.current = false;
        setPendingSort(option);
      } else {
        setPendingSort(null);
        changeSelectedSort(option);
      }
    };

    return (
      // Focus is taken by the native radios inside the group, not the group itself
      // eslint-disable-next-line jsx-a11y/interactive-supports-focus
      <div
        role='radiogroup'
        aria-label={translate('Sort by:', translations)}
        onKeyDown={onOptionsKeyDown}
        onBlur={onOptionsBlur}
        onMouseDown={onOptionsMouseDown}>
        {sortOptions.map((option) => (
          // The key is deliberately independent of the checked state: a key that
          // changes on selection remounts the label and drops keyboard focus
          // mid-navigation. The inputs are controlled via `checked`.
          <label htmlFor={getOptionId(option, idSuffix)} key={getOptionId(option, idSuffix)}>
            <input
              id={getOptionId(option, idSuffix)}
              type='radio'
              name={getGroupName(idSuffix)}
              value={JSON.stringify(option)}
              checked={isChecked(option)}
              onChange={handleOptionChange}
            />
            <span>{option.displayName}</span>
          </label>
        ))}
      </div>
    );
  };

  return (
    <>
      {typeof children === 'function' ? (
        children({
          sortOptions,
          selectedSort,
          changeSelectedSort,
        })
      ) : (
        <div className='cio-plp-sort'>
          <button
            ref={buttonRef}
            type='button'
            className='collapsible'
            aria-label={`sort by ${selectedSort?.displayName}`}
            aria-expanded={isOpen}
            // The mobile dialog is only mounted while open, so only reference it then
            aria-controls={isOpen ? `${panelId} ${mobilePanelId}` : panelId}
            onClick={toggleCollapsible}>
            {selectedSort?.displayName ? (
              <span className='cio-plp-sort-button-label'>
                <span className='cio-large-screen-only'>{translate('Sort by:', translations)}</span>
                <span className='cio-mobile-only'>{translate('By', translations)}</span>{' '}
                {selectedSort.displayName}
              </span>
            ) : (
              translate('Sort', translations)
            )}
            <i className={`arrow ${isOpen ? 'arrow-up' : 'arrow-down'}`} aria-hidden='true' />
          </button>
          <MobileModal
            id={mobilePanelId}
            side='right'
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            label={translate('Sort by:', translations)}>
            {genDefaultMarkup('-mobile')}
          </MobileModal>
          {/* Always mounted so `aria-controls` resolves while collapsed */}
          <div id={panelId} className='collapsible-content cio-large-screen-only' hidden={!isOpen}>
            {genDefaultMarkup()}
          </div>
        </div>
      )}
    </>
  );
}

Sort.defaultProps = {
  isOpen: true,
  panelId: undefined,
};
