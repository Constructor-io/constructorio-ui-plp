import React, { useState } from 'react';
import type { IncludeComponentOverrides } from '@constructor-io/constructorio-ui-components';
import type {
  PlpFacet,
  PlpFacetOption,
  FacetConfig,
  PlpFilterValue,
  FilterGroupOverrides,
  FilterGroupRenderProps,
} from '../../types';
import { isOptionFacet, isRangeFacet, shouldRenderVisualFacet } from '../../utils';
import FilterOptionsList from './FilterOptionsList';
import FilterRangeSlider from './FilterRangeSlider';
import { UseFilterReturn } from '../../hooks/useFilter';
import RenderPropsWrapper from '../RenderPropsWrapper/RenderPropsWrapper';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';

export interface FilterGroupProps extends IncludeComponentOverrides<FilterGroupOverrides> {
  facet: PlpFacet;
  setFilter: UseFilterReturn['setFilter'];
  initialNumOptions?: number;
  sliderStep?: number;
  facetSliderSteps?: Record<string, number>;
  /**
   * Function that takes in a PlpFacetOption and returns `true` if the option should be hidden from the final render
   * @returns boolean
   */
  isHiddenFilterOptionFn?: (option: PlpFacetOption) => boolean;
  defaultCollapsed?: boolean;
  getVisualImageUrl?: (option: PlpFacetOption) => string | undefined;
  getVisualColorHex?: (option: PlpFacetOption) => string | undefined;
  isVisualFilterFn?: (facet: PlpFacet) => boolean;
  perFacetConfigs?: Record<string, FacetConfig>;
  /**
   * Whether options that have nested options get a toggle collapsing their nested list. Collapses
   * branches *within* this group, unrelated to `defaultCollapsed` above, which collapses the group
   * itself. Already resolved against `perFacetConfigs` by `useFilter`. Defaults to `true`.
   */
  hierarchyCollapsible?: boolean;
  /**
   * Whether this group's nested option lists start collapsed. Initial state only. Already resolved
   * against `perFacetConfigs` by `useFilter`. Defaults to `false`.
   */
  defaultHierarchyCollapsed?: boolean;
  /** Namespace for option DOM ids, so the same facet can render more than once per page. */
  idPrefix?: string;
}

export default function FilterGroup(props: FilterGroupProps) {
  const {
    facet,
    setFilter,
    initialNumOptions = 10,
    sliderStep,
    facetSliderSteps,
    isHiddenFilterOptionFn,
    defaultCollapsed = false,
    getVisualImageUrl,
    getVisualColorHex,
    isVisualFilterFn,
    perFacetConfigs,
    hierarchyCollapsible,
    defaultHierarchyCollapsed,
    idPrefix,
    componentOverrides: componentOverridesProp,
  } = props;
  const context = useCioPlpContext();
  const componentOverrides = componentOverridesProp ?? context?.componentOverrides?.filterGroup;
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const isVisual = shouldRenderVisualFacet(facet, perFacetConfigs, isVisualFilterFn);
  const checkboxPosition = perFacetConfigs?.[facet.name]?.checkboxPosition;

  const toggleIsCollapsed = () => setIsCollapsed(!isCollapsed);
  const onFilterSelect = (facetName: string) => (value: PlpFilterValue) => {
    setFilter(facetName, value);
  };

  const renderProps: FilterGroupRenderProps = {
    facet,
    isCollapsed,
    toggleIsCollapsed,
    onFilterSelect: onFilterSelect(facet.name),
  };

  return (
    <RenderPropsWrapper props={renderProps} override={componentOverrides?.reactNode}>
      <li className='cio-filter-group'>
        <RenderPropsWrapper props={renderProps} override={componentOverrides?.header?.reactNode}>
          <button className='cio-filter-header' type='button' onClick={toggleIsCollapsed}>
            {facet.displayName}
            <i className={`cio-arrow ${isCollapsed ? 'cio-arrow-up' : 'cio-arrow-down'}`} />
          </button>
        </RenderPropsWrapper>

        {isOptionFacet(facet) && (
          <RenderPropsWrapper
            props={renderProps}
            override={componentOverrides?.optionsList?.reactNode}>
            <FilterOptionsList
              isCollapsed={isCollapsed}
              facet={facet}
              modifyRequestMultipleFilter={onFilterSelect(facet.name)}
              initialNumOptions={initialNumOptions}
              isHiddenFilterOptionFn={isHiddenFilterOptionFn}
              isVisual={isVisual}
              getVisualImageUrl={getVisualImageUrl}
              getVisualColorHex={getVisualColorHex}
              checkboxPosition={checkboxPosition}
              hierarchyCollapsible={hierarchyCollapsible}
              defaultHierarchyCollapsed={defaultHierarchyCollapsed}
              idPrefix={idPrefix}
              filterOptionOverride={componentOverrides?.optionsList?.filterOption}
            />
          </RenderPropsWrapper>
        )}

        {isRangeFacet(facet) && (
          <RenderPropsWrapper
            props={renderProps}
            override={componentOverrides?.rangeSlider?.reactNode}>
            <FilterRangeSlider
              isCollapsed={isCollapsed}
              rangedFacet={facet}
              modifyRequestRangeFilter={onFilterSelect(facet.name)}
              sliderStep={facetSliderSteps?.[facet.name] || sliderStep}
            />
          </RenderPropsWrapper>
        )}
      </li>
    </RenderPropsWrapper>
  );
}
