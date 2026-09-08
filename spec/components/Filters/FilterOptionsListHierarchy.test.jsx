import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterOptionsList from '../../../src/components/Filters/FilterOptionsList';
import Filters from '../../../src/components/Filters';
import CioPlp from '../../../src/components/CioPlp';
import { DEMO_API_KEY } from '../../../src/constants';
import { renderWithCioPlp } from '../../test-utils';
import hierarchicalFacets from '../../local_examples/sampleHierarchicalFacets.json';

const [categoryFacet, , collectionFacet] = hierarchicalFacets;

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
        facet: withSelected(categoryFacet, ['T-Shirts']),
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

      expect(lastAppliedValues()).toEqual(['T-Shirts']);
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
        ['Apparel', 'Bottoms', 'Shirts & Blouses', 'T-Shirts', 'Tops'].sort(),
      );
      expect(isChecked('T-Shirts')).toBe(true);
      expect(isChecked('Bottoms')).toBe(true);
    });

    // Rule 2
    it('Should deselect the whole subtree when a parent is deselected', () => {
      renderOptionsList({
        facet: withSelected(categoryFacet, [
          'Apparel',
          'Tops',
          'T-Shirts',
          'Shirts & Blouses',
          'Bottoms',
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
          'Tops',
          'T-Shirts',
          'Shirts & Blouses',
          'Bottoms',
          'Footwear',
          'Sneakers',
        ]),
      });

      fireEvent.click(screen.getByText('Apparel'));

      expect(lastAppliedValues()).toEqual(['Footwear', 'Sneakers']);
    });

    // Rule 3: the last child selected carries the parent, and its parent in turn
    it('Should select a parent once all of its children are selected', () => {
      renderOptionsList();

      fireEvent.click(screen.getByText('T-Shirts'));
      expect(isChecked('Tops')).toBe(false);

      fireEvent.click(screen.getByText('Shirts & Blouses'));

      // Both of Tops' children are now selected, so Tops follows
      expect(isChecked('Tops')).toBe(true);
      expect(lastAppliedValues()).toEqual(['Shirts & Blouses', 'T-Shirts', 'Tops'].sort());
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
        ['Apparel', 'Bottoms', 'Shirts & Blouses', 'T-Shirts', 'Tops'].sort(),
      );
    });

    // Rule 4
    it('Should deselect a parent as soon as one of its children is deselected', () => {
      renderOptionsList({
        facet: withSelected(categoryFacet, [
          'Apparel',
          'Tops',
          'T-Shirts',
          'Shirts & Blouses',
          'Bottoms',
        ]),
      });

      expect(isChecked('Apparel')).toBe(true);

      fireEvent.click(screen.getByText('T-Shirts'));

      expect(isChecked('Tops')).toBe(false);
      expect(isChecked('Apparel')).toBe(false);
      // The siblings that were not touched stay applied
      expect(lastAppliedValues()).toEqual(['Bottoms', 'Shirts & Blouses']);
    });

    it('Should select a parent whose children all arrive selected from the API', () => {
      renderOptionsList({
        facet: withSelected(categoryFacet, ['T-Shirts', 'Shirts & Blouses']),
      });

      // Nothing clicked: the parent follows the state the API reported for its children
      expect(isChecked('Tops')).toBe(true);
      expect(isChecked('Apparel')).toBe(false);
    });

    it('Should not cascade on a single-select facet, which holds one value at a time', () => {
      renderWithCioPlp(
        <FilterOptionsList
          facet={collectionFacet}
          modifyRequestMultipleFilter={mockModifyRequestMultipleFilter}
          initialNumOptions={10}
          isCollapsed={false}
        />,
      );

      fireEvent.click(screen.getByText('Everyday'));

      // Everyday has a child, but a single facet cannot hold both
      expect(lastAppliedValues()).toEqual(['Everyday']);
    });

    it('Should replace the selection on a single-select facet', () => {
      renderWithCioPlp(
        <FilterOptionsList
          facet={withSelected(collectionFacet, ['Everyday'])}
          modifyRequestMultipleFilter={mockModifyRequestMultipleFilter}
          initialNumOptions={10}
          isCollapsed={false}
        />,
      );

      fireEvent.click(screen.getByText('Weekday'));

      expect(mockModifyRequestMultipleFilter).toHaveBeenCalledWith(['Weekday']);
    });
  });

  describe('Option ids', () => {
    it('Should scope each id to its full path so repeated values stay unique', () => {
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
      expect(container.querySelector('input[id="desktop-category-apparel-tops"]')).toBeTruthy();
      expect(container.querySelector('input[id="mobile-category-apparel-tops"]')).toBeTruthy();
    });
  });

  describe('Facets of type "hierarchical"', () => {
    // A hierarchical facet reaches the option list the same way a multiple facet with nested
    // options does, so it is the facet `type` — not the option shape — being covered here.
    const hierarchicalTypeFacet = {
      ...categoryFacet,
      name: 'department',
      displayName: 'Department',
      type: 'hierarchical',
    };

    it('Should render its nested options', () => {
      renderOptionsList({ facet: hierarchicalTypeFacet });

      expect(screen.getByText('Apparel')).toBeInTheDocument();
      expect(screen.getByText('T-Shirts')).toBeInTheDocument();
      expect(getToggle('Apparel')).toBeInTheDocument();
    });

    it('Should render inside a filter group, alongside the other facet types', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={[...hierarchicalFacets, hierarchicalTypeFacet]} />
        </CioPlp>,
      );

      expect(screen.getByText('Department')).toBeInTheDocument();
      // The department facet duplicates the category options, so each appears in both groups
      expect(screen.getAllByText('Sneakers')).toHaveLength(2);
      expect(screen.getAllByText('Apparel')).toHaveLength(2);
    });

    it('Should accumulate selections rather than replacing them like a single facet', () => {
      renderOptionsList({
        facet: withSelected(hierarchicalTypeFacet, ['Footwear', 'Sneakers']),
      });

      fireEvent.click(screen.getByText('Kids & Baby'));

      expect(lastAppliedValues()).toEqual(['Footwear', 'Kids & Baby', 'Sneakers']);
    });

    it('Should cascade a parent selection down its subtree', () => {
      renderOptionsList({ facet: hierarchicalTypeFacet });

      fireEvent.click(screen.getByText('Apparel'));

      expect(lastAppliedValues()).toEqual(
        ['Apparel', 'Bottoms', 'Shirts & Blouses', 'T-Shirts', 'Tops'].sort(),
      );
    });

    it('Should clear the subtree when a parent is deselected', () => {
      renderOptionsList({
        facet: withSelected(hierarchicalTypeFacet, [
          'Apparel',
          'Tops',
          'T-Shirts',
          'Shirts & Blouses',
          'Bottoms',
          'Footwear',
          'Sneakers',
        ]),
      });

      fireEvent.click(screen.getByText('Apparel'));

      expect(lastAppliedValues()).toEqual(['Footwear', 'Sneakers']);
    });

    it('Should apply path-style option values as the API returns them', () => {
      // Real hierarchical facets carry the full path in each nested option's value
      const pathValuedFacet = {
        ...hierarchicalTypeFacet,
        options: [
          {
            status: '',
            count: 987,
            displayName: 'Adventures',
            value: 'adventures',
            data: { parentValue: null },
            options: [
              {
                status: '',
                count: 126,
                displayName: 'Battles and Wars',
                value: 'adventures/battles-and-wars',
                data: { parentValue: 'adventures' },
                options: [],
              },
            ],
          },
        ],
      };

      const { container } = renderOptionsList({ facet: pathValuedFacet });

      fireEvent.click(screen.getByText('Battles and Wars'));

      // "Adventures" comes along because it has only this one child, so selecting the child
      // completes the parent
      expect(lastAppliedValues()).toEqual(['adventures', 'adventures/battles-and-wars']);
      // The slash in the value would be invalid in an id, and the path keeps it unique
      expect(
        container.querySelector('input[id="department-adventures-adventures-battles-and-wars"]'),
      ).toBeInTheDocument();
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
        option.optionValue === 'T-Shirts'
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

      // 8 category options + 2 color options + 3 collection options
      expect(document.querySelectorAll('.custom-every-option').length).toBe(13);
    });

    it('Should receive the mapped option data, including checked state', () => {
      const filterOption = jest.fn().mockReturnValue(undefined);

      renderWithOverride(filterOption);

      expect(filterOption).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'category-apparel-tops',
          optionValue: 'Tops',
          displayValue: 'Tops',
          displayCountValue: '60',
          isChecked: false,
        }),
      );
    });
  });
});
