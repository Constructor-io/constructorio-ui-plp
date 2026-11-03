import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterOptionsList from '../../../src/components/Filters/FilterOptionsList';
import Filters from '../../../src/components/Filters';
import CioPlp from '../../../src/components/CioPlp';
import { DEMO_API_KEY } from '../../../src/constants';
import { renderWithCioPlp } from '../../test-utils';
import hierarchicalFacets from '../../local_examples/sampleHierarchicalFacets.json';

const [categoryFacet] = hierarchicalFacets;

/** Flat `single` facet: nested options only come on `hierarchical` facets. */
const sizeFacet = {
  displayName: 'Size',
  name: 'size',
  type: 'single',
  data: {},
  hidden: false,
  options: [
    { status: '', count: 12, displayName: 'Small', value: 'Small', data: {}, options: [] },
    { status: '', count: 8, displayName: 'Large', value: 'Large', data: {}, options: [] },
  ],
};

/** Number of options in `options`, at any depth. */
const countOptions = (options) =>
  options.reduce((total, option) => total + 1 + countOptions(option.options || []), 0);

const mockModifyRequestMultipleFilter = jest.fn();

const renderOptionsList = (props) =>
  renderWithCioPlp(
    <FilterOptionsList
      facet={categoryFacet}
      modifyRequestMultipleFilter={mockModifyRequestMultipleFilter}
      initialNumOptions={10}
      isCollapsed={false}
      {...props}
    />,
  );

/** Marks the options whose values are listed as `selected`, at any depth. */
const withSelected = (facet, selectedValues) => {
  const markOptions = (options) =>
    options.map((option) => ({
      ...option,
      status: selectedValues.includes(option.value) ? 'selected' : '',
      ...(option.options?.length && { options: markOptions(option.options) }),
    }));

  return { ...facet, options: markOptions(facet.options) };
};

const getToggle = (displayValue) =>
  screen.queryByRole('button', {
    name: (accessibleName) =>
      accessibleName === `Expand ${displayValue}` || accessibleName === `Collapse ${displayValue}`,
  });

/**
 * The values sent by the most recent call, sorted so assertions do not depend on map key order,
 * or `null` when the last call cleared the filter.
 */
const lastAppliedValues = () => {
  const { calls } = mockModifyRequestMultipleFilter.mock;
  const [values] = calls[calls.length - 1];

  return values === null ? null : [...values].sort();
};

/** Checked state of an option's checkbox, found through its label, which reads `<name> <count>`. */
const isChecked = (displayValue) =>
  screen.getByLabelText((labelText) => labelText.startsWith(displayValue), {
    selector: 'input',
  }).checked;

describe('FilterOptionsList - hierarchical options', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('Should render nested options at every depth', () => {
      renderOptionsList();

      expect(screen.getByText('Apparel')).toBeInTheDocument();
      expect(screen.getByText('Tops')).toBeInTheDocument();
      expect(screen.getByText('T-Shirts')).toBeInTheDocument();
      expect(screen.getByText('Shirts & Blouses')).toBeInTheDocument();
    });

    it('Should nest a child list inside its parent option', () => {
      const { container } = renderOptionsList();

      const parentOption = screen.getByText('Apparel').closest('li');
      const nestedList = parentOption.querySelector('ul');

      expect(nestedList).toBeInTheDocument();
      expect(nestedList).toContainElement(screen.getByText('Tops'));
      // The nested list is the toggle's aria-controls target
      expect(nestedList.getAttribute('id')).toBe(
        getToggle('Apparel').getAttribute('aria-controls'),
      );
      expect(container.querySelectorAll('.cio-filter-multiple-option').length).toBe(8);
    });

    it('Should render inside a filter group', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={hierarchicalFacets} />
        </CioPlp>,
      );

      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('T-Shirts')).toBeInTheDocument();
      expect(getToggle('Apparel')).toBeInTheDocument();
    });

    it('Should render counts for nested options', () => {
      renderOptionsList();

      const nestedOption = screen.getByText('T-Shirts').closest('li');

      expect(nestedOption).toHaveTextContent('25');
    });
  });

  describe('hierarchyCollapsible', () => {
    it('Should give options that have children a toggle, and leave leaf options without one', () => {
      renderOptionsList();

      expect(getToggle('Apparel')).toBeInTheDocument();
      expect(getToggle('Tops')).toBeInTheDocument();
      // Leaf options at either depth get no toggle
      expect(getToggle('Kids & Baby')).not.toBeInTheDocument();
      expect(getToggle('T-Shirts')).not.toBeInTheDocument();
    });

    it('Should collapse and expand a branch when its toggle is clicked', () => {
      renderOptionsList();

      expect(getToggle('Apparel')).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(getToggle('Apparel'));

      expect(getToggle('Apparel')).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Tops')).not.toBeInTheDocument();
      expect(screen.queryByText('T-Shirts')).not.toBeInTheDocument();
      // Siblings are unaffected
      expect(screen.getByText('Footwear')).toBeInTheDocument();

      fireEvent.click(getToggle('Apparel'));

      expect(getToggle('Apparel')).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Tops')).toBeInTheDocument();
    });

    it('Should collapse a nested branch independently of its parent', () => {
      renderOptionsList();

      fireEvent.click(getToggle('Tops'));

      expect(screen.queryByText('T-Shirts')).not.toBeInTheDocument();
      expect(screen.getByText('Tops')).toBeInTheDocument();
      expect(screen.getByText('Bottoms')).toBeInTheDocument();
    });

    it('Should render no toggles when hierarchyCollapsible is false', () => {
      renderOptionsList({ hierarchyCollapsible: false });

      expect(getToggle('Apparel')).not.toBeInTheDocument();
      expect(getToggle('Tops')).not.toBeInTheDocument();
      // Nested options are still rendered, they just cannot be collapsed
      expect(screen.getByText('T-Shirts')).toBeInTheDocument();
    });
  });

  describe('defaultHierarchyCollapsed', () => {
    it('Should start every branch collapsed', () => {
      renderOptionsList({ defaultHierarchyCollapsed: true });

      expect(screen.getByText('Apparel')).toBeInTheDocument();
      expect(screen.getByText('Kids & Baby')).toBeInTheDocument();
      expect(screen.queryByText('Tops')).not.toBeInTheDocument();
      expect(getToggle('Apparel')).toHaveAttribute('aria-expanded', 'false');
    });

    it('Should expand a collapsed branch on click', () => {
      renderOptionsList({ defaultHierarchyCollapsed: true });

      fireEvent.click(getToggle('Apparel'));

      expect(screen.getByText('Tops')).toBeInTheDocument();
      // Only the clicked branch opens; its own children stay collapsed
      expect(screen.queryByText('T-Shirts')).not.toBeInTheDocument();
    });

    it('Should auto-expand branches holding a selected option so an applied filter is never hidden', () => {
      renderOptionsList({
        facet: withSelected(categoryFacet, ['Apparel/Tops/T-Shirts']),
        defaultHierarchyCollapsed: true,
      });

      expect(screen.getByText('T-Shirts')).toBeInTheDocument();
      expect(screen.getByLabelText(/T-Shirts/, { selector: 'input' })).toBeChecked();
      // The unrelated branch stays collapsed
      expect(screen.queryByText('Sneakers')).not.toBeInTheDocument();
    });
  });

  describe('Selecting nested options', () => {
    it('Should apply a leaf option by its own value', () => {
      renderOptionsList();

      fireEvent.click(screen.getByText('T-Shirts'));

      expect(lastAppliedValues()).toEqual(['Apparel/Tops/T-Shirts']);
    });

    it('Should leave other branches untouched', () => {
      renderOptionsList();

      fireEvent.click(screen.getByText('Kids & Baby'));

      expect(lastAppliedValues()).toEqual(['Kids & Baby']);
    });

    // Rule 1: a parent stands for everything below it
    it('Should select the whole subtree when a parent is selected', () => {
      renderOptionsList();

      fireEvent.click(screen.getByText('Apparel'));

      expect(lastAppliedValues()).toEqual(
        [
          'Apparel',
          'Apparel/Bottoms',
          'Apparel/Tops/Shirts & Blouses',
          'Apparel/Tops/T-Shirts',
          'Apparel/Tops',
        ].sort(),
      );
      expect(isChecked('T-Shirts')).toBe(true);
      expect(isChecked('Bottoms')).toBe(true);
    });

    // Rule 2
    it('Should deselect the whole subtree when a parent is deselected', () => {
      renderOptionsList({
        facet: withSelected(categoryFacet, [
          'Apparel',
          'Apparel/Tops',
          'Apparel/Tops/T-Shirts',
          'Apparel/Tops/Shirts & Blouses',
          'Apparel/Bottoms',
        ]),
      });

      fireEvent.click(screen.getByText('Apparel'));

      expect(lastAppliedValues()).toBe(null);
      expect(isChecked('T-Shirts')).toBe(false);
      expect(isChecked('Tops')).toBe(false);
    });

    it('Should keep selections in other branches when a parent is deselected', () => {
      renderOptionsList({
        facet: withSelected(categoryFacet, [
          'Apparel',
          'Apparel/Tops',
          'Apparel/Tops/T-Shirts',
          'Apparel/Tops/Shirts & Blouses',
          'Apparel/Bottoms',
          'Footwear',
          'Footwear/Sneakers',
        ]),
      });

      fireEvent.click(screen.getByText('Apparel'));

      expect(lastAppliedValues()).toEqual(['Footwear', 'Footwear/Sneakers']);
    });

    // Rule 3: the last child selected carries the parent, and its parent in turn
    it('Should select a parent once all of its children are selected', () => {
      renderOptionsList();

      fireEvent.click(screen.getByText('T-Shirts'));
      expect(isChecked('Tops')).toBe(false);

      fireEvent.click(screen.getByText('Shirts & Blouses'));

      // Both of Tops' children are now selected, so Tops follows
      expect(isChecked('Tops')).toBe(true);
      expect(lastAppliedValues()).toEqual(
        ['Apparel/Tops/Shirts & Blouses', 'Apparel/Tops/T-Shirts', 'Apparel/Tops'].sort(),
      );
      // Apparel still has an unselected child (Bottoms)
      expect(isChecked('Apparel')).toBe(false);
    });

    it('Should carry the parent rule up through every level', () => {
      renderOptionsList();

      fireEvent.click(screen.getByText('T-Shirts'));
      fireEvent.click(screen.getByText('Shirts & Blouses'));
      fireEvent.click(screen.getByText('Bottoms'));

      // Tops came from its own children, and Apparel from Tops + Bottoms
      expect(isChecked('Tops')).toBe(true);
      expect(isChecked('Apparel')).toBe(true);
      expect(lastAppliedValues()).toEqual(
        [
          'Apparel',
          'Apparel/Bottoms',
          'Apparel/Tops/Shirts & Blouses',
          'Apparel/Tops/T-Shirts',
          'Apparel/Tops',
        ].sort(),
      );
    });

    // Rule 4
    it('Should deselect a parent as soon as one of its children is deselected', () => {
      renderOptionsList({
        facet: withSelected(categoryFacet, [
          'Apparel',
          'Apparel/Tops',
          'Apparel/Tops/T-Shirts',
          'Apparel/Tops/Shirts & Blouses',
          'Apparel/Bottoms',
        ]),
      });

      expect(isChecked('Apparel')).toBe(true);

      fireEvent.click(screen.getByText('T-Shirts'));

      expect(isChecked('Tops')).toBe(false);
      expect(isChecked('Apparel')).toBe(false);
      // The siblings that were not touched stay applied
      expect(lastAppliedValues()).toEqual(['Apparel/Bottoms', 'Apparel/Tops/Shirts & Blouses']);
    });

    it('Should select a parent whose children all arrive selected from the API', () => {
      renderOptionsList({
        facet: withSelected(categoryFacet, [
          'Apparel/Tops/T-Shirts',
          'Apparel/Tops/Shirts & Blouses',
        ]),
      });

      // Nothing clicked: the parent follows the state the API reported for its children
      expect(isChecked('Tops')).toBe(true);
      expect(isChecked('Apparel')).toBe(false);
    });

    it('Should accumulate selections across branches', () => {
      renderOptionsList({
        facet: withSelected(categoryFacet, ['Footwear', 'Footwear/Sneakers']),
      });

      fireEvent.click(screen.getByText('Kids & Baby'));

      expect(lastAppliedValues()).toEqual(['Footwear', 'Footwear/Sneakers', 'Kids & Baby']);
    });

    it('Should replace the selection on a single-select facet', () => {
      renderOptionsList({ facet: withSelected(sizeFacet, ['Small']) });

      fireEvent.click(screen.getByText('Large'));

      expect(mockModifyRequestMultipleFilter).toHaveBeenCalledWith(['Large']);
    });
  });

  describe('Option ids', () => {
    it('Should scope each id to its full path so repeated values stay unique', () => {
      const { container } = renderOptionsList();

      expect(container.querySelector('input[id="category-apparel"]')).toBeInTheDocument();
      expect(
        container.querySelector('input[id="category-apparel-apparel-tops"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('input[id="category-apparel-apparel-tops-apparel-tops-t-shirts"]'),
      ).toBeInTheDocument();
    });

    it('Should slugify values that are invalid inside an id', () => {
      const { container } = renderOptionsList();

      expect(
        container.querySelector(
          'input[id="category-apparel-apparel-tops-apparel-tops-shirts-blouses"]',
        ),
      ).toBeInTheDocument();
      container.querySelectorAll('[id]').forEach((element) => {
        expect(element.getAttribute('id')).not.toMatch(/\s/);
      });
    });

    it('Should point every label and toggle at an element that exists', () => {
      const { container } = renderOptionsList();

      container.querySelectorAll('label[for]').forEach((label) => {
        expect(container.querySelector(`#${label.getAttribute('for')}`)).toBeInTheDocument();
      });
      container.querySelectorAll('[aria-controls]').forEach((toggle) => {
        expect(container.querySelector(`#${toggle.getAttribute('aria-controls')}`)).toBeTruthy();
      });
    });

    it('Should keep ids unique when the same facets render twice on a page', () => {
      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={hierarchicalFacets} idPrefix='desktop' />
          <Filters facets={hierarchicalFacets} idPrefix='mobile' />
        </CioPlp>,
      );

      const ids = Array.from(container.querySelectorAll('[id]')).map((element) =>
        element.getAttribute('id'),
      );

      expect(new Set(ids).size).toBe(ids.length);
      expect(
        container.querySelector('input[id="desktop-category-apparel-apparel-tops"]'),
      ).toBeTruthy();
      expect(
        container.querySelector('input[id="mobile-category-apparel-apparel-tops"]'),
      ).toBeTruthy();
    });
  });

  describe('perFacetConfigs', () => {
    it('Should collapse branches for one facet only', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters
            facets={hierarchicalFacets}
            perFacetConfigs={{ category: { defaultHierarchyCollapsed: true } }}
          />
        </CioPlp>,
      );

      expect(screen.queryByText('Tops')).not.toBeInTheDocument();
      // collection is untouched, so its branch stays expanded
      expect(screen.getByText('Weekday')).toBeInTheDocument();
    });

    it('Should remove toggles for one facet only', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters
            facets={hierarchicalFacets}
            perFacetConfigs={{ category: { hierarchyCollapsible: false } }}
          />
        </CioPlp>,
      );

      expect(getToggle('Apparel')).not.toBeInTheDocument();
      expect(getToggle('Everyday')).toBeInTheDocument();
    });
  });

  describe('filterOption override', () => {
    const renderWithOverride = (filterOption) =>
      render(
        <CioPlp
          apiKey={DEMO_API_KEY}
          componentOverrides={{ filterGroup: { optionsList: { filterOption } } }}>
          <Filters facets={hierarchicalFacets} />
        </CioPlp>,
      );

    it('Should replace a single option, leaving its siblings at their default', () => {
      renderWithOverride((option) =>
        option.optionValue === 'Apparel/Tops/T-Shirts'
          ? { reactNode: () => <li data-testid='custom-option'>Custom T-Shirts</li> }
          : undefined,
      );

      expect(screen.getByTestId('custom-option')).toHaveTextContent('Custom T-Shirts');
      expect(screen.queryByText('T-Shirts')).not.toBeInTheDocument();
      expect(screen.getByText('Shirts & Blouses')).toBeInTheDocument();
      expect(screen.getByText('Apparel')).toBeInTheDocument();
    });

    it('Should keep nesting when an option with children re-emits props.children', () => {
      renderWithOverride((option) =>
        option.optionValue === 'Apparel'
          ? {
              reactNode: (props) => (
                <li data-testid='custom-parent'>
                  Custom Apparel
                  {props.children}
                </li>
              ),
            }
          : undefined,
      );

      expect(screen.getByTestId('custom-parent')).toContainElement(screen.getByText('Tops'));
      expect(screen.getByText('T-Shirts')).toBeInTheDocument();
    });

    it('Should apply an object override to every option at every depth', () => {
      renderWithOverride({
        reactNode: (props) => (
          <li className='custom-every-option'>
            {props.displayValue}
            {props.children}
          </li>
        ),
      });

      const totalOptions = hierarchicalFacets.reduce(
        (total, facet) => total + countOptions(facet.options),
        0,
      );

      expect(document.querySelectorAll('.custom-every-option').length).toBe(totalOptions);
    });

    it('Should receive the mapped option data, including checked state', () => {
      const filterOption = jest.fn().mockReturnValue(undefined);

      renderWithOverride(filterOption);

      expect(filterOption).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'category-apparel-apparel-tops',
          optionValue: 'Apparel/Tops',
          displayValue: 'Tops',
          displayCountValue: '60',
          isChecked: false,
        }),
      );
    });
  });
});
