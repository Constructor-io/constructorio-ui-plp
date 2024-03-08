import React from 'react';
import type { ReactNode } from 'react';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import {
  ConstructorClientOptions,
  Facet,
  Group as ApiGroup,
  Result,
  SearchResponse,
  SortOption,
  GetBrowseResultsResponse,
  VariationsMap,
  FilterExpression,
  FmtOptions,
  Nullable,
  SearchRequestType,
  SearchResponseType,
  Redirect,
  SearchParameters,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import { MakeOptional } from './utils/typeHelpers';

export { Nullable, ConstructorIOClient, SearchResponseType, SearchParameters, Redirect };

export type CioClientOptions = Omit<ConstructorClientOptions, 'apiKey' | 'sendTrackingEvents'>;

export interface ItemFieldGetters {
  getPrice: (item: Item) => number;
}

export interface Formatters {
  formatPrice: (price: number) => string;
}

export interface Callbacks {
  onAddToCart?: (event: React.MouseEvent, item: Item) => void;
  onProductCardClick?: (event: React.MouseEvent, item: Item) => void;
}

export interface PlpSearchRedirectResponse {
  resultId: string;
  redirect: Partial<Redirect>;
  rawResponse: SearchResponse;
}

export type SearchResponseState = Nullable<Omit<Partial<PlpSearchResponse>, 'rawResponse'>>;
export type SearchRequestState = Nullable<Partial<SearchRequestType>>;
export type RedirectResponseState = Nullable<
  Omit<Partial<PlpSearchRedirectResponse>, 'rawResponse'>
>;
export type DefaultQueryStringMap = {
  query: 'q';
  page: 'page';
  offset: 'offset';
  resultsPerPage: 'numResults';
  filters: 'f';
  sortBy: 'sortBy';
  sortOrder: 'sortOrder';
  section: 'section';
};

export interface UrlHelpers {
  getUrl: () => string | undefined;
  setUrl: (newUrlWithEncodedState: string) => void;
  getStateFromUrl: (urlString: string) => RequestConfigs;
  getUrlFromState: (state: RequestConfigs, options: QueryParamEncodingOptions) => string;
  defaultQueryStringMap: Readonly<DefaultQueryStringMap>;
}

export interface RequestConfigs {
  // Search
  query?: string;

  // Browse
  filterName?: string;
  filterValue?: string;

  // Others
  filters?: Record<string, any>;
  sortOrder?: SortOrder;
  sortBy?: string;
  resultsPerPage?: number;
  page?: number;
  offset?: number;
  section?: string;
  fmtOptions?: FmtOptions;
  variationsMap?: VariationsMap;
  preFilterExpression?: FilterExpression;
}

export type RequestQueryParams = Omit<RequestConfigs, 'query' | 'filterName' | 'filterValue'>;

export interface QueryParamEncodingOptions {
  baseUrl?: string;
  origin?: string;
  pathname?: string;
}

export interface PlpContextValue {
  cioClient: Nullable<ConstructorIOClient>;
  cioClientOptions: CioClientOptions;
  setCioClientOptions: React.Dispatch<CioClientOptions>;
  staticRequestConfigs: RequestConfigs;
  itemFieldGetters: ItemFieldGetters;
  formatters: Formatters;
  callbacks: Callbacks;
  urlHelpers: UrlHelpers;
}

export interface PrimaryColorStyles {
  '--primary-color-h': string;
  '--primary-color-s': string;
  '--primary-color-l': string;
}

// Transformed API Responses
export type ApiItem = MakeOptional<Result, 'variations | variations_map'>;

export type Variation = Omit<
  Item,
  'variations | matchedTerms | isSlotted | labels | variationsMap'
>;

export type SortOrder = 'ascending' | 'descending';

export interface Item {
  matchedTerms: Array<string>;
  isSlotted: boolean;
  labels: Record<string, unknown>;
  itemName: string;
  variations?: Variation[];
  variationsMap?: VariationsMap;

  // Flattened Data Object
  itemId: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  groupIds?: Array<string>;
  groups?: Array<ApiGroup>;
  facets?: Array<any>;
  variationId?: string;

  // Remaining unmapped metadata fields
  data: Record<string, any>;

  rawResponse?: ApiItem;
}

export type PlpSortOption = {
  sortBy: string;
  sortOrder: SortOrder;
  displayName: string;
  status: string;
};

export interface PlpSearchResponse {
  resultId: string;
  totalNumResults: number;
  numResultsPerPage: number;
  results: Array<Item>;
  facets: Array<Facet>;
  groups: Array<ApiGroup>;
  sortOptions: Array<SortOption>;
  refinedContent: Record<string, any>[];
  rawResponse: SearchResponse;
}

export type PaginationProps = PaginationObject;
export interface PlpBrowseResponse {
  resultId: string;
  totalNumResults: number;
  numResultsPerPage: number;
  results: Array<Item>;
  facets: Array<Facet>;
  groups: Array<ApiGroup>;
  sortOptions: Array<SortOption>;
  refinedContent: Record<string, any>[];
  rawResponse: GetBrowseResultsResponse;
}

export interface CioPlpProviderProps {
  apiKey: string;
  cioClient?: Nullable<ConstructorIOClient>;
  formatters?: Partial<Formatters>;
  callbacks?: Partial<Callbacks>;
  itemFieldGetters?: Partial<ItemFieldGetters>;
  urlHelpers?: Partial<UrlHelpers>;
  staticRequestConfigs?: Partial<RequestConfigs>;
}

export type CioPlpProps = CioPlpProviderProps;

export type UseSortReturn = {
  sortOptions: PlpSortOption[];
  selectedSort: PlpSortOption | null;
  changeSelectedSort: (sortOption: PlpSortOption) => void;
};

/**
 * Represents a function that handles pagination logic.
 * @param searchResponse - The search response data.
 * @param windowSize - The number of pages to display in the pagination window.
 * @returns An object containing pagination information and methods.
 */
export type UsePaginationProps = {
  initialPage?: number;
  totalNumResults?: number;
  resultsPerPage?: number;
  windowSize?: number;
};
export type UsePagination = (props: UsePaginationProps) => PaginationObject;

export interface PaginationObject {
  // Represents the current page number in the pagination
  // It's typically used to highlight the current page in the UI and to determine which set of data to fetch or display
  currentPage: number | undefined;

  // Allows you to navigate to a specific page and takes a page number as an argument
  goToPage: (page: number) => void;

  // Navigate to the next page. Used to implement "Next" button in a pagination control.
  nextPage: () => void;

  // Navigate to the previous page. Used to implement "Previous" button in a pagination control.
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

// Type Extenders
export type PropsWithChildren<P> = P & { children?: ReactNode };

/**
 * Composes a type for a Component that accepts
 * - Props P,
 * - A children function, that takes RenderProps as its argument
 */
export type IncludeRenderProps<ComponentProps, ChildrenFunctionProps> = ComponentProps & {
  children?: ((props: ChildrenFunctionProps) => ReactNode) | React.ReactNode;
};
