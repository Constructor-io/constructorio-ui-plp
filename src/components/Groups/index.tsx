import React from 'react';
import classNames from 'classnames';
import useGroups, { UseGroupProps } from '../../hooks/useGroups';
import FilterOptionListRow from '../Filters/FilterOptionListRow';
import { IncludeRenderProps } from '../../types';

export interface GroupsProps extends UseGroupProps {
  isCollapsed?: boolean;
}

export type GroupsWithRenderProps = IncludeRenderProps<GroupsProps, ReturnType<typeof useGroups>>;

export default function Groups(props: GroupsWithRenderProps) {
  const { isCollapsed = false, children } = props;
  const useGroupsReturn = useGroups(props);
  const {
    groups,
    optionsToRender,
    breadcrumbs,
    initialNumOptions,
    selectedGroupId,
    onOptionSelect,
    goToGroupFilter,
    isShowAll,
    setIsShowAll,
  } = useGroupsReturn;

  if (breadcrumbs.length === 0 && optionsToRender.length === 0) return null;
  return (
    <>
      {typeof children === 'function' ? (
        children(useGroupsReturn)
      ) : (
        <div
          className={classNames({
            'cio-collapsible-wrapper': true,
            'cio-collapsible-is-open': !isCollapsed,
          })}>
          <div className='cio-collapsible-inner cio-groups cio-filter-groups-options-list'>
            <div className='cio-groups-breadcrumbs'>
              {breadcrumbs.map((crumb) => (
                <span key={crumb.path}>
                  <button
                    className='cio-crumb'
                    onClick={() => goToGroupFilter(crumb)}
                    type='button'>
                    {crumb.breadcrumb}
                  </button>
                  {' > '}
                </span>
              ))}
              <span className='cio-crumb'>{groups[0].displayName}</span>
            </div>
            <ul>
              {optionsToRender.map((option) => (
                <FilterOptionListRow
                  key={option.groupId}
                  id={option.groupId}
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
          </div>
        </div>
      )}
    </>
  );
}
