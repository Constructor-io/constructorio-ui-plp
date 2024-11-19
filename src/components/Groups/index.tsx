import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { PlpItemGroup } from '../../types';
import useGroups from '../../hooks/useGroups';
import useCioBreadcrumb from '../../hooks/useCioBreadcrumb';

export interface GroupsOptionsListProps {
  groups: Array<PlpItemGroup>;
  initialNumOptions?: number;
  isCollapsed: boolean;
}

export default function GroupsOptionsList(props: GroupsOptionsListProps) {
  const { groups: rawGroups, initialNumOptions = 5, isCollapsed } = props;

  const { groups, groupOptions, setGroup, currentGroupId } = useGroups({ groups: rawGroups });
  const breadcrumbs = useCioBreadcrumb({ groups, filterValue: currentGroupId || 'all' }) || [];

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>();
  const [isShowAll, setIsShowAll] = useState(false);
  const [optionsToRender, setOptionsToRender] = useState<Array<PlpItemGroup>>(groups);

  const onOptionSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    setGroup(groupId);
  };

  const goToGroupFilter = (breadcrumb) => {
    const groupIds = breadcrumb?.path?.split('/');
    const targetGroupId = groupIds[groupIds.length - 1];
    onOptionSelect(targetGroupId);
  };

  useEffect(() => {
    if (isShowAll) {
      setOptionsToRender(groupOptions);
    } else {
      setOptionsToRender(groupOptions.slice(0, initialNumOptions));
    }
  }, [isShowAll, groupOptions, initialNumOptions]);

  if (breadcrumbs.length === 0 && optionsToRender.length === 0) return null;
  return (
    <div
      className={classNames({
        'cio-collapsible-wrapper': true,
        'cio-collapsible-is-open': !isCollapsed,
      })}>
      <ul className='cio-filter-groups-options-list cio-collapsible-inner'>
        <div className='cio-groups'>
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
  );
}
