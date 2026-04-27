import React, { useState } from 'react';
import classNames from 'classnames';
import type { IncludeComponentOverrides } from '@constructor-io/constructorio-ui-components';
import useGroups, { UseGroupProps } from '../../hooks/useGroups';
import FilterOptionListRow from '../Filters/FilterOptionListRow';
import { IncludeRenderProps, GroupsOverrides, GroupsRenderProps } from '../../types';
import RenderPropsWrapper from '../RenderPropsWrapper/RenderPropsWrapper';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';

/**
 * Props for the Groups component
 */
export interface GroupsProps extends UseGroupProps, IncludeComponentOverrides<GroupsOverrides> {
  /**
   * Initial collapsed state of the groups filter panel
   * @default false
   */
  isCollapsed?: boolean;
  /**
   * Title displayed in the groups filter header
   * @default Categories
   */
  title?: string;
  /**
   * Whether to hide the entire groups component
   * @default false
   */
  hideGroups?: boolean;
}

export type GroupsWithRenderProps = IncludeRenderProps<GroupsProps, ReturnType<typeof useGroups>>;

export default function Groups(props: GroupsWithRenderProps) {
  const {
    isCollapsed: isCollapsedDefault = false,
    title = 'Categories',
    children,
    groups,
    hideGroups,
    componentOverrides: componentOverridesProp,
  } = props;
  const context = useCioPlpContext();
  const componentOverrides = componentOverridesProp ?? context?.componentOverrides?.groups;
  const useGroupsReturn = useGroups(props);
  const {
    optionsToRender,
    breadcrumbs,
    initialNumOptions,
    selectedGroupId,
    onOptionSelect,
    goToGroupFilter,
    isShowAll,
    setIsShowAll,
  } = useGroupsReturn;

  const [isCollapsed, setIsCollapsed] = useState(isCollapsedDefault);

  const toggleIsCollapsed = () => setIsCollapsed(!isCollapsed);

  if (breadcrumbs.length === 0 && optionsToRender.length === 0) return null;

  if (hideGroups) return null;

  const renderProps: GroupsRenderProps = {
    groups,
    isCollapsed,
    toggleIsCollapsed,
    onOptionSelect,
    goToGroupFilter,
  };

  return (
    <>
      {typeof children === 'function' ? (
        children(useGroupsReturn)
      ) : (
        <RenderPropsWrapper props={renderProps} override={componentOverrides?.reactNode}>
          <div className='cio-groups-container'>
            <RenderPropsWrapper
              props={renderProps}
              override={componentOverrides?.header?.reactNode}>
              <button
                className='cio-filter-header'
                type='button'
                onClick={() => setIsCollapsed(!isCollapsed)}>
                {title}
                <i className={`cio-arrow ${isCollapsed ? 'cio-arrow-up' : 'cio-arrow-down'}`} />
              </button>
            </RenderPropsWrapper>
            <div
              className={classNames({
                'cio-collapsible-wrapper': true,
                'cio-collapsible-is-open': !isCollapsed,
              })}>
              <div className='cio-collapsible-inner cio-groups cio-filter-groups-options-list'>
                <RenderPropsWrapper
                  props={renderProps}
                  override={componentOverrides?.breadcrumbs?.reactNode}>
                  <div className='cio-groups-breadcrumbs'>
                    {breadcrumbs.map((crumb) => (
                      <span key={crumb.path}>
                        <button
                          className='cio-groups-crumb'
                          onClick={() => goToGroupFilter(crumb)}
                          type='button'>
                          {crumb.breadcrumb}
                        </button>
                        {' > '}
                      </span>
                    ))}
                    <span className='cio-groups-crumb'>{groups[0].displayName}</span>
                  </div>
                </RenderPropsWrapper>
                <RenderPropsWrapper
                  props={renderProps}
                  override={componentOverrides?.optionsList?.reactNode}>
                  <ul>
                    {optionsToRender.map((option) => (
                      <FilterOptionListRow
                        showCheckbox={false}
                        key={option.groupId}
                        id={option.groupId}
                        optionValue={option.groupId}
                        displayValue={option.displayName}
                        displayCountValue={option.count.toString()}
                        isChecked={selectedGroupId === option.groupId}
                        onChange={onOptionSelect}
                      />
                    ))}

                    {initialNumOptions < groups[0].children.length && (
                      <button
                        type='button'
                        className='cio-see-all'
                        onClick={() => setIsShowAll(!isShowAll)}>
                        {isShowAll ? 'Show Less' : 'Show All'}
                      </button>
                    )}
                  </ul>
                </RenderPropsWrapper>
              </div>
            </div>
          </div>
        </RenderPropsWrapper>
      )}
    </>
  );
}
