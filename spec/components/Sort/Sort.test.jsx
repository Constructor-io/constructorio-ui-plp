import React from 'react';
import { render, waitFor, fireEvent, within } from '@testing-library/react';
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

    // aria-controls must always resolve to real elements: the desktop panel stays mounted
    // (hidden) while collapsed, and the mobile dialog is only referenced while open
    const expectControlsToResolve = () => {
      const ids = trigger.getAttribute('aria-controls').split(' ');
      ids.forEach((id) => expect(document.getElementById(id)).toBeInTheDocument());
      return ids;
    };

    expect(expectControlsToResolve()).toHaveLength(1);
    expect(document.getElementById(trigger.getAttribute('aria-controls'))).not.toBeVisible();

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const [panelId, mobilePanelId] = expectControlsToResolve();
    expect(document.getElementById(panelId)).toBeVisible();
    expect(document.getElementById(mobilePanelId)).toHaveAttribute('role', 'dialog');
  });

  it('Should keep keyboard focus on the radio after selection changes', async () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort sortOptions={searchData.response.sortOptions} />
      </CioPlp>,
    );

    const newSortOption = responseSortOptions.find((option) => option.status !== 'selected');
    const input = container.querySelector(`#${newSortOption.sortBy}-${newSortOption.sortOrder}`);

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

describe('Testing Component: Sort accessibility', () => {
  const originalWindowLocation = window.location;
  const searchData = transformSearchResponse(mockSearchResponse);
  const responseSortOptions = searchData.response.sortOptions;
  const defaultSort = responseSortOptions.find((option) => option.status === 'selected');
  const otherSorts = responseSortOptions.filter((option) => option.status !== 'selected');

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    window.location = 'https://example.com';
  });

  afterEach(() => {
    window.location = originalWindowLocation;
    jest.restoreAllMocks();
  });

  const renderSort = (isOpen = false) =>
    render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort sortOptions={responseSortOptions} isOpen={isOpen} />
      </CioPlp>,
    );

  const getDesktopRadios = () =>
    within(document.getElementById('cio-plp-sort-panel')).getAllByRole('radio', { hidden: true });

  it('Should move focus to the checked option on open and return it to the trigger on Escape', async () => {
    const { getByRole } = renderSort();
    const trigger = getByRole('button', { name: /sort/i });

    trigger.focus();
    fireEvent.click(trigger);

    await waitFor(() => expect(document.activeElement).toBe(getDesktopRadios()[0]));
    expect(document.activeElement).toBeChecked();
    expect(document.activeElement.value).toBe(JSON.stringify(defaultSort));

    fireEvent.keyDown(document.activeElement, { key: 'Escape' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(document.activeElement).toBe(trigger);
  });

  it('Should not steal focus when rendered open by default', () => {
    renderSort(true);
    expect(document.activeElement).toBe(document.body);
  });

  it('Should apply a sort immediately on click', () => {
    renderSort(true);
    const target = getDesktopRadios().find((r) => r.value === JSON.stringify(otherSorts[0]));

    fireEvent.click(target);

    expect(new URL(window.location.href).searchParams.get('sortBy')).toBe(otherSorts[0].sortBy);
  });

  it('Should defer applying an arrow-key selection until Enter, then apply it', () => {
    renderSort(true);
    const [, second] = getDesktopRadios();

    // Native arrow key behavior checks the next radio and fires a change event
    fireEvent.keyDown(second, { key: 'ArrowDown' });
    fireEvent.click(second);

    expect(second).toBeChecked();
    expect(new URL(window.location.href).searchParams.get('sortBy')).toBeNull();

    fireEvent.keyDown(second, { key: 'Enter' });

    const params = new URL(window.location.href).searchParams;
    expect(params.get('sortBy')).toBe(JSON.parse(second.value).sortBy);
    expect(params.get('sortOrder')).toBe(JSON.parse(second.value).sortOrder);
  });

  it('Should apply a pending arrow-key selection when focus leaves the group', () => {
    const { getByRole } = renderSort(true);
    const [, second] = getDesktopRadios();

    fireEvent.keyDown(second, { key: 'ArrowDown' });
    fireEvent.click(second);
    fireEvent.blur(second, { relatedTarget: getByRole('button', { name: /sort/i }) });

    expect(new URL(window.location.href).searchParams.get('sortOrder')).toBe(
      JSON.parse(second.value).sortOrder,
    );
  });

  it('Should discard a pending arrow-key selection on Escape', () => {
    const { getByRole } = renderSort(true);
    const [, second] = getDesktopRadios();

    fireEvent.keyDown(second, { key: 'ArrowDown' });
    fireEvent.click(second);
    // Like a real browser, moving focus to the trigger blurs the group mid-handler
    second.focus();
    fireEvent.keyDown(second, { key: 'Escape' });

    expect(document.activeElement).toBe(getByRole('button', { name: /sort/i }));
    expect(new URL(window.location.href).searchParams.get('sortBy')).toBeNull();
  });
});

describe('Testing Component: Sort with multiple instances', () => {
  const originalWindowLocation = window.location;
  const searchData = transformSearchResponse(mockSearchResponse);
  const responseSortOptions = searchData.response.sortOptions;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    window.location = 'https://example.com';
  });

  afterEach(() => {
    window.location = originalWindowLocation;
    jest.restoreAllMocks();
  });

  const renderTwo = (firstProps = {}, secondProps = {}) =>
    render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <div data-testid='first'>
          <Sort sortOptions={responseSortOptions} {...firstProps} />
        </div>
        <div data-testid='second'>
          <Sort sortOptions={responseSortOptions} {...secondProps} />
        </div>
      </CioPlp>,
    );

  const collectIdsAndNames = (container) => ({
    ids: Array.from(container.querySelectorAll('[id]')).map((el) => el.id),
    names: Array.from(container.querySelectorAll('input[type="radio"]')).map((el) => el.name),
  });

  it('Should keep ids and radio group names unique across instances', async () => {
    const { container, getByTestId } = renderTwo();

    await waitFor(() => {
      const { ids } = collectIdsAndNames(container);
      expect(new Set(ids).size).toBe(ids.length);
    });

    const first = collectIdsAndNames(getByTestId('first'));
    const second = collectIdsAndNames(getByTestId('second'));
    second.names.forEach((name) => expect(first.names).not.toContain(name));

    // The first instance keeps the original ids, so existing selectors keep working
    expect(getByTestId('first').querySelector('#cio-plp-sort-panel')).toBeInTheDocument();
    expect(getByTestId('first').querySelector('#relevance-descending')).toBeInTheDocument();
  });

  it('Should scope ids and names to a custom panelId', async () => {
    const { container } = renderTwo({ panelId: 'top-sort' }, { panelId: 'bottom-sort' });

    await waitFor(() => {
      const { ids, names } = collectIdsAndNames(container);
      expect(new Set(ids).size).toBe(ids.length);
      expect(names.every((name) => /^(top|bottom)-sort-/.test(name))).toBe(true);
    });
  });

  it('Should not uncheck an option in one instance when selecting in the other', async () => {
    const { getByTestId } = renderTwo();
    const firstGroup = () => getByTestId('first').querySelector('[role="radiogroup"]');
    const secondGroup = () => getByTestId('second').querySelector('[role="radiogroup"]');

    await waitFor(() => expect(firstGroup().querySelector('input:checked')).not.toBeNull());
    await waitFor(() => {
      const firstNames = Array.from(firstGroup().querySelectorAll('input')).map((el) => el.name);
      expect(firstNames).not.toContain(secondGroup().querySelector('input').name);
    });

    const target = Array.from(secondGroup().querySelectorAll('input')).find((el) => !el.checked);
    fireEvent.click(target);

    expect(firstGroup().querySelector('input:checked')).not.toBeNull();
  });
});
