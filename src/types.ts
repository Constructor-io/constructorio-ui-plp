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
  Nullable,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import { MakeOptional } from './utils/typeHelpers';

export { Nullable, ConstructorIOClient };

export type CioClientOptions = Omit<ConstructorClientOptions, 'apiKey' | 'sendTrackingEvents'>;

export interface Getters {
  getPrice: (item: Item) => number;
  getSwatches: (item: Item) => SwatchItem[];
}

export interface Formatters {
  formatPrice: (price?: number) => string;
}

export interface Callbacks {
  onAddToCart?: (event: React.MouseEvent, item: Item) => void;
  onProductCardClick?: (event: React.MouseEvent, item: Item) => void;
}

export interface PlpContextValue {
  cioClient: Nullable<ConstructorIOClient>;
  cioClientOptions: CioClientOptions;
  setCioClientOptions: React.Dispatch<CioClientOptions>;
  getters: Getters;
  formatters: Formatters;
  callbacks: Callbacks;
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

export type VariationsMap = Record<string, any> | Record<string, any>[];

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

export interface SwatchItem {
  url?: string;
  itemName?: string;
  imageUrl?: string;
  previewImageUrl?: string;
  previewHexCode?: string;
  price?: number;
  variationId?: string;
}

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

export interface CioPlpProviderProps {
  apiKey: string;
  cioClient?: Nullable<ConstructorIOClient>;
  formatters?: Formatters;
  callbacks?: Callbacks;
  getters?: Getters;
}

export type CioPlpProps = CioPlpProviderProps;

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

export interface ProductSwatchObject {
  swatchList: SwatchItem[] | undefined;
  selectedVariation: SwatchItem | undefined;
  selectVariation: (swatch: SwatchItem) => void;
}

export type UseProductSwatchProps = {
  item: Item;
};

export type UseProductSwatch = (props: UseProductSwatchProps) => ProductSwatchObject;

export interface ProductInfoObject {
  productSwatch: ProductSwatchObject | undefined;
  itemName: string;
  itemPrice: number;
  itemUrl: string | undefined;
  itemImageUrl: string | undefined;
}

export type UseProductInfoProps = {
  item: Item;
};

export type UseProductInfo = (props: UseProductInfoProps) => ProductInfoObject;
