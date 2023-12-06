# Pull Request Checklist

Before you submit a pull request, please make sure you have to following:

- [ ] I have added or updated TypeScript types for my changes, ensuring they are compatible with the existing codebase.
- [ ] I have added JSDoc comments to my TypeScript definitions for improved documentation.
- [ ] I have added tests that prove my fix is effective or that my feature works.
- [ ] I have added any necessary documentation (if appropriate).
- [ ] I have made sure my PR is up-to-date with the main branch.

# PR Type
What kind of change does this PR introduce?

- [ ] Bugfix
- [ ] Feature
- [ ] Code style update (formatting, local variables)
- [ ] Refactoring (no functional changes, no API changes)
- [ ] Documentation content changes
- [ ] TypeScript type definitions update
- [ ] Other... Please describe:

# TypeScript Type Definitions and Documentation

Ensure that all new code has TypeScript type definitions with JSDoc comments. Here is an example of how they should look:

```typescript

/**
 * Represents a function that handles pagination logic.
 * @param searchResponse - The search response data.
 * @param windowSize - The number of pages to display in the pagination window.
 * @returns An object containing pagination information and methods.
 */
export type UsePagination = (
  searchResponse: Nullable<PlpSearchResponse>,
  windowSize?: number,
) => PaginationObject;

export interface PaginationObject {
  // represents the current page number in the pagination
  // It's typically used to highlight the current page in the UI and to determine which set of data to fetch or display
  currentPage: number;

  // Allows you to navigate to a specific page and takes a page number as an argument
  goToPage: (page: number) => void;

  // navigate to the next page. Used to implement "Next" button in a pagination control.
  nextPage: () => void;

  // navigate to the previous page. Used to implement "Previous" button in a pagination control.
  prevPage: () => void;

  // The total number of pages available in the pagination object
  totalPages: number;

  /**
   *  Returns an array of numbers [1,2,3,4,-1,10]
   *  1,10 are first and last page
   *  -1 indicates a break (e.g., to show "...")
   *  [1, 2, 3, 4, ..., 10] */
  pages: number[];
}
