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

    it('Should render inside a filter group, with branches collapsed by default', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={hierarchicalFacets} />
        </CioPlp>,
      );

      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Apparel')).toBeInTheDocument();
      expect(getToggle('Apparel')).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Tops')).not.toBeInTheDocument();
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
    // Every option is an independent filter: a click toggles exactly the clicked value
    it('Should apply a leaf option by its own value', () => {
      renderOptionsList();

      fireEvent.click(screen.getByText('T-Shirts'));

      expect(lastAppliedValues()).toEqual(['Apparel/Tops/T-Shirts']);
    });

    it('Should apply a parent by its own value, without its subtree', () => {
      renderOptionsList();

      fireEvent.click(screen.getByText('Apparel'));

      expect(lastAppliedValues()).toEqual(['Apparel']);
      expect(isChecked('Tops')).toBe(false);
      expect(isChecked('T-Shirts')).toBe(false);
    });

    it('Should deselect a parent without touching its subtree', () => {
      renderOptionsList({
        facet: withSelected(categoryFacet, ['Apparel', 'Apparel/Tops', 'Apparel/Tops/T-Shirts']),
      });

      fireEvent.click(screen.getByText('Apparel'));

      expect(lastAppliedValues()).toEqual(['Apparel/Tops', 'Apparel/Tops/T-Shirts']);
    });

    it('Should not select a parent when all of its children are selected', () => {
      renderOptionsList();

      fireEvent.click(screen.getByText('T-Shirts'));
      fireEvent.click(screen.getByText('Shirts & Blouses'));

      expect(isChecked('Tops')).toBe(false);
      expect(lastAppliedValues()).toEqual([
        'Apparel/Tops/Shirts & Blouses',
        'Apparel/Tops/T-Shirts',
      ]);
    });

    it('Should keep a selected parent when one of its children is deselected', () => {
      renderOptionsList({
        facet: withSelected(categoryFacet, [
          'Apparel/Tops',
          'Apparel/Tops/T-Shirts',
          'Apparel/Tops/Shirts & Blouses',
        ]),
      });

      fireEvent.click(screen.getByText('T-Shirts'));

      expect(isChecked('Tops')).toBe(true);
      expect(lastAppliedValues()).toEqual(['Apparel/Tops', 'Apparel/Tops/Shirts & Blouses']);
    });

    it('Should render the state the API reports, without deriving parents', () => {
      renderOptionsList({
        facet: withSelected(categoryFacet, [
          'Apparel/Tops/T-Shirts',
          'Apparel/Tops/Shirts & Blouses',
        ]),
      });

      // Both of Tops' children arrive selected, but the API did not report Tops itself
      expect(isChecked('T-Shirts')).toBe(true);
      expect(isChecked('Shirts & Blouses')).toBe(true);
      expect(isChecked('Tops')).toBe(false);
    });

    // A click in one branch must never change the state of another
    it('Should not add a parent the user did not choose when another branch is clicked', () => {
      renderOptionsList({
        facet: withSelected(categoryFacet, [
          'Apparel/Tops/T-Shirts',
          'Apparel/Tops/Shirts & Blouses',
        ]),
      });

      fireEvent.click(screen.getByText('Kids & Baby'));

      expect(lastAppliedValues()).toEqual([
        'Apparel/Tops/Shirts & Blouses',
        'Apparel/Tops/T-Shirts',
        'Kids & Baby',
      ]);
    });

    it('Should keep a parent the API applied when another branch is clicked', () => {
      renderOptionsList({ facet: withSelected(categoryFacet, ['Apparel/Tops']) });

      fireEvent.click(screen.getByText('Kids & Baby'));

      expect(lastAppliedValues()).toEqual(['Apparel/Tops', 'Kids & Baby']);
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
    /** Flat facet whose values only differ in case or punctuation, so their slugs collide. */
    const brandFacet = {
      displayName: 'Brand',
      name: 'brand',
      type: 'multiple',
      data: {},
      hidden: false,
      options: ['Tailorbyrd', 'TailorByrd', 'Black / Navy', 'Black-Navy', 'Black Navy 2'].map(
        (value) => ({ status: '', count: 1, displayName: value, value, data: {}, options: [] }),
      ),
    };

    it('Should build each id from the facet name and the option value', () => {
      const { container } = renderOptionsList();

      expect(container.querySelector('input[id="category-apparel"]')).toBeInTheDocument();
      expect(container.querySelector('input[id="category-apparel-tops"]')).toBeInTheDocument();
      expect(
        container.querySelector('input[id="category-apparel-tops-t-shirts"]'),
      ).toBeInTheDocument();
    });

    it('Should slugify values that are invalid inside an id', () => {
      const { container } = renderOptionsList();

      expect(
        container.querySelector('input[id="category-apparel-tops-shirts-blouses"]'),
      ).toBeInTheDocument();
      container.querySelectorAll('[id]').forEach((element) => {
        expect(element.getAttribute('id')).not.toMatch(/\s/);
      });
    });

    it('Should keep ids unique when values only differ in case or punctuation', () => {
      const { container } = renderOptionsList({ facet: brandFacet });

      const ids = Array.from(container.querySelectorAll('input')).map((input) => input.id);

      expect(ids).toEqual([
        'brand-tailorbyrd',
        'brand-tailorbyrd-2',
        'brand-black-navy',
        'brand-black-navy-2',
        // Its own slug is the suffixed id taken above, so it moves on to the next free one
        'brand-black-navy-2-2',
      ]);
    });

    it('Should link each label to its own checkbox when slugs collide', () => {
      renderOptionsList({ facet: brandFacet });

      fireEvent.click(screen.getByText('TailorByrd'));

      expect(lastAppliedValues()).toEqual(['TailorByrd']);
      expect(isChecked('TailorByrd')).toBe(true);
      expect(isChecked('Tailorbyrd')).toBe(false);
    });

    it('Should keep option ids clear of the ids of nested lists', () => {
      const facet = {
        ...categoryFacet,
        options: [
          {
            status: '',
            count: 1,
            displayName: 'Apparel Hierarchy',
            value: 'Apparel Hierarchy',
            data: {},
            options: [],
          },
          ...categoryFacet.options,
        ],
      };
      const { container } = renderOptionsList({ facet });

      const ids = Array.from(container.querySelectorAll('[id]')).map((element) => element.id);

      expect(new Set(ids).size).toBe(ids.length);
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
          <Filters
            facets={hierarchicalFacets}
            idPrefix='desktop'
            defaultHierarchyCollapsed={false}
          />
          <Filters
            facets={hierarchicalFacets}
            idPrefix='mobile'
            defaultHierarchyCollapsed={false}
          />
        </CioPlp>,
      );

      const ids = Array.from(container.querySelectorAll('[id]')).map((element) =>
        element.getAttribute('id'),
      );

      expect(new Set(ids).size).toBe(ids.length);
      expect(container.querySelector('input[id="desktop-category-apparel-tops"]')).toBeTruthy();
      expect(container.querySelector('input[id="mobile-category-apparel-tops"]')).toBeTruthy();
    });
  });

  describe('perFacetConfigs', () => {
    it('Should expand branches for one facet only', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters
            facets={hierarchicalFacets}
            perFacetConfigs={{ category: { defaultHierarchyCollapsed: false } }}
          />
        </CioPlp>,
      );

      expect(screen.getByText('Tops')).toBeInTheDocument();
      // collection is untouched, so its branch keeps the collapsed default
      expect(screen.queryByText('Weekday')).not.toBeInTheDocument();
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

    it('Should keep branches without toggles expanded, even when branches start collapsed', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters
            facets={hierarchicalFacets}
            defaultHierarchyCollapsed
            perFacetConfigs={{ category: { hierarchyCollapsible: false } }}
          />
        </CioPlp>,
      );

      // A branch with no toggle that started collapsed could never be opened
      expect(screen.getByText('Tops')).toBeInTheDocument();
      expect(screen.getByText('T-Shirts')).toBeInTheDocument();
      // collection keeps its toggle, so it follows defaultHierarchyCollapsed
      expect(screen.queryByText('Weekday')).not.toBeInTheDocument();
    });
  });

  describe('filterOption override', () => {
    const renderWithOverride = (filterOption) =>
      render(
        <CioPlp
          apiKey={DEMO_API_KEY}
          componentOverrides={{ filterGroup: { optionsList: { filterOption } } }}>
          <Filters facets={hierarchicalFacets} defaultHierarchyCollapsed={false} />
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
          id: 'category-apparel-tops',
          optionValue: 'Apparel/Tops',
          displayValue: 'Tops',
          displayCountValue: '60',
          isChecked: false,
        }),
      );
    });
  });
});
