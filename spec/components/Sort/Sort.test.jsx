import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import Sort from '../../../src/components/Sort';
import CioPlp from '../../../src/components/CioPlp';
import { DEMO_API_KEY } from '../../../src/constants';
import '@testing-library/jest-dom';
import { transformSearchResponse } from '../../../src/utils/transformers';
import mockSearchResponse from '../../local_examples/apiSearchResponse.json';

describe('Testing Component: Sort', () => {
  const originalWindowLocation = window.location;

  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    window.location = 'https://example.com';
  });

  afterEach(() => {
    window.location = originalWindowLocation;
    jest.resetAllMocks(); // This will reset all mocks after each test
  });

  const searchData = transformSearchResponse(mockSearchResponse);
  const responseSortOptions = searchData.response.sortOptions;

  it('Should throw error if used outside the CioPlp', () => {
    expect(() => render(<Sort sortOptions={searchData.response.sortOptions} />)).toThrow();
  });

  it('Should render sort options based on search or browse response', async () => {
    const { getAllByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort sortOptions={searchData.response.sortOptions} />
      </CioPlp>,
    );

    await waitFor(() => {
      responseSortOptions.forEach((option) => {
        expect(getAllByText(option.displayName).length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  it('Should change selected sort option in component correctly', async () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort sortOptions={searchData.response.sortOptions} />
      </CioPlp>,
    );

    const defaultSort = responseSortOptions.find((option) => option.status === 'selected');
    expect(container.querySelector('input:checked')).toBeDefined();
    expect(container.querySelector('input:checked').value).toBe(JSON.stringify(defaultSort));

    const newSortOption = responseSortOptions.find((option) => option.status !== 'selected');
    fireEvent.click(
      container?.querySelector(`#${newSortOption.sortBy}-${newSortOption.sortOrder}`),
    );

    expect(container.querySelector('input:checked')).toBeDefined();
    expect(container.querySelector('input:checked').value).toBe(JSON.stringify(newSortOption));
  });

  it('Should change selected sort option in url correctly', async () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort sortOptions={searchData.response.sortOptions} />
      </CioPlp>,
    );

    const newSortOption = responseSortOptions.find((option) => option.status !== 'selected');
    fireEvent.click(
      container?.querySelector(`#${newSortOption.sortBy}-${newSortOption.sortOrder}`),
    );

    const urlObject = new URL(window.location.href);
    expect(urlObject.searchParams.get('sortBy')).toEqual(newSortOption.sortBy);
    expect(urlObject.searchParams.get('sortOrder')).toEqual(newSortOption.sortOrder);
  });

  it('Should render correctly with render props', () => {
    const mockChildren = jest.fn().mockReturnValue(<div>Custom Sort</div>);

    const sortProps = {
      sortOptions: searchData.response.sortOptions,
      children: mockChildren,
    };

    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort {...sortProps} />
      </CioPlp>,
    );
    expect(mockChildren).toHaveBeenCalled();
    expect(getByText('Custom Sort')).toBeInTheDocument();
  });

  it('Should render sort options with unique ids for both desktop and mobile', async () => {
    const { getAllByLabelText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort sortOptions={searchData.response.sortOptions} />
      </CioPlp>,
    );

    await waitFor(() => {
      responseSortOptions.forEach((option) => {
        const spanEls = getAllByLabelText(option.displayName);
        expect(spanEls.length).toBe(2);

        const inputEls = spanEls.map((el) => el.closest('label').querySelector('input'));
        const uniqueInputIds = new Set(inputEls.map((el) => el.id));
        expect(uniqueInputIds.size).toBe(2);
      });
    });
  });

  it('Should group radios under a single name per rendered group (keyboard navigable)', async () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort sortOptions={searchData.response.sortOptions} />
      </CioPlp>,
    );

    await waitFor(() => {
      const groups = container.querySelectorAll('[role="radiogroup"]');
      // One desktop group + one mobile group
      expect(groups.length).toBe(2);

      groups.forEach((group) => {
        const inputs = Array.from(group.querySelectorAll('input[type="radio"]'));
        expect(inputs.length).toBe(responseSortOptions.length);

        // All options within a group share one `name`, which is what makes them a
        // single mutually-exclusive, arrow-navigable radio group.
        const names = new Set(inputs.map((el) => el.name));
        expect(names.size).toBe(1);
      });

      // The two groups must not share a name, or they would fight over selection.
      const groupNames = Array.from(groups).map(
        (group) => group.querySelector('input[type="radio"]').name,
      );
      expect(new Set(groupNames).size).toBe(2);
    });
  });

  it('Should not hide sort radios from assistive tech', async () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort sortOptions={searchData.response.sortOptions} />
      </CioPlp>,
    );

    await waitFor(() => {
      const inputs = container.querySelectorAll('input[type="radio"]');
      expect(inputs.length).toBeGreaterThan(0);

      // Guards against a regression to `hidden` / `aria-hidden` / `tabindex="-1"`,
      // which would re-break WCAG 4.1.2. The CSS itself is asserted in Storybook,
      // since Jest maps stylesheets to a mock.
      inputs.forEach((input) => {
        expect(input).not.toHaveAttribute('hidden');
        expect(input).not.toHaveAttribute('aria-hidden');
        expect(input).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  it('Should expose aria-expanded and aria-controls on the sort trigger', async () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort sortOptions={searchData.response.sortOptions} isOpen={false} />
      </CioPlp>,
    );

    const trigger = container.querySelector('button.collapsible');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    const panelId = trigger.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    expect(container.querySelector(`#${panelId}`)).not.toBeInTheDocument();

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // aria-controls must resolve to a real element once the panel is open
    expect(container.querySelector(`#${panelId}`)).toBeInTheDocument();
  });

  it('Should keep keyboard focus on the radio after selection changes', async () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort sortOptions={searchData.response.sortOptions} />
      </CioPlp>,
    );

    const newSortOption = responseSortOptions.find((option) => option.status !== 'selected');
    const input = container.querySelector(
      `#${newSortOption.sortBy}-${newSortOption.sortOrder}`,
    );

    input.focus();
    expect(document.activeElement).toBe(input);

    fireEvent.click(input);

    // The label key must not depend on checked state: a changing key remounts the
    // label and drops focus, which breaks arrow-key navigation through the group.
    const inputAfter = container.querySelector(
      `#${newSortOption.sortBy}-${newSortOption.sortOrder}`,
    );
    expect(inputAfter.checked).toBe(true);
    expect(document.activeElement).toBe(inputAfter);
  });
});
