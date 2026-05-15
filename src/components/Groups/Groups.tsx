<RenderPropsWrapper props={renderProps} override={componentOverrides?.reactNode}>
  <div className='cio-groups-container'>
    <RenderPropsWrapper props={renderProps} override={componentOverrides?.header?.reactNode}>
      <button className='cio-filter-header' type='button' onClick={toggleIsCollapsed}>
        {translatedTitle}
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
            <span className='cio-groups-crumb'>
              {renderProps.currentPage || groups[0]?.displayName || ''}
            </span>
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
          </ul>
        </RenderPropsWrapper>
      </div>
    </div>
  </div>
</RenderPropsWrapper>;
