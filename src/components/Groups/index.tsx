import React from 'react';
import classNames from 'classnames';
import useGroups, { UseGroupProps } from '../../hooks/useGroups';

export interface GroupsProps extends UseGroupProps {
  isCollapsed?: boolean;
}

export default function Groups(props: GroupsProps) {
  const { isCollapsed = false } = props;
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
  } = useGroups(props);

  if (breadcrumbs.length === 0 && optionsToRender.length === 0) return null;
  return (
    <div
      className={classNames({
        'cio-collapsible-wrapper': true,
        'cio-collapsible-is-open': !isCollapsed,
      })}>
      <div className='cio-collapsible-inner cio-filter-groups-options-list'>
        <div className='cio-groups' key={selectedGroupId}>
          {breadcrumbs.map((crumb) => (
            <>
              <button className='cio-crumb' onClick={() => goToGroupFilter(crumb)} type='button'>
                {crumb.breadcrumb}
              </button>
              {' > '}
            </>
          ))}
          <span className='cio-crumb'>{groups[0].displayName}</span>
        </div>
        <ul>
          {optionsToRender.map((option) => (
            <li className='cio-filter-multiple-option' key={option.groupId}>
              <label htmlFor={option.groupId}>
                <input
                  type='checkbox'
                  id={option.groupId}
                  value={option.displayName}
                  checked={selectedGroupId === option.groupId}
                  onChange={() => onOptionSelect(option.groupId)}
                />
                <div className='cio-checkbox'>
                  <svg
                    width='10'
                    height='8'
                    viewBox='0 0 10 8'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className='cio-check'>
                    <path
                      d='M1 4L3.5 6.5L9 1'
                      stroke='white'
                      strokeWidth='1.7'
                      strokeLinecap='round'
                    />
                  </svg>
                </div>
                <div className='cio-filter-multiple-option-display'>
                  <span className='cio-filter-option-name'>{option.displayName}</span>
                  <span className='cio-filter-option-count'>{option.count}</span>
                </div>
              </label>
            </li>
          ))}

          {initialNumOptions < groups.length && (
            <button type='button' className='cio-see-all' onClick={() => setIsShowAll(!isShowAll)}>
              {isShowAll ? 'Show Less' : 'Show All'}
            </button>
          )}
        </ul>
      </div>
    </div>
  );
}
