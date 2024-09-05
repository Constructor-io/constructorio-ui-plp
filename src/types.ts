import React from 'react';
import type { ReactNode } from 'react';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import {
  ConstructorClientOptions,
  Group as ApiGroup,
  Result,
  SearchResponse,
  GetBrowseResultsResponse,
  VariationsMap,
  FilterExpression,
  FmtOptions,
  Nullable,
  SearchRequestType,
  SearchResponseType,
  Redirect,
  SearchParameters,
  BrowseRequestType,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import { MakeOptional } from './utils/typeHelpers';

export { Nullable, ConstructorIOClient, SearchResponseType, SearchParameters, Redirect };

export type CioClientOptions = Omit<ConstructorClientOptions, 'apiKey' | 'sendTrackingEvents'>;

export interface ItemFieldGetters {
  getPrice: (item: Item | Variation) => number;
  getSwatchPreview: (variation: Variation) => string;
  getSwatches: (
    item: Item,
    retrievePrice: ItemFieldGetters['getPrice'],
    retrieveSwatchPreview: ItemFieldGetters['getSwatchPreview'],
  ) => SwatchItem[] | undefined;
}

export interface Formatters {
  formatPrice: (price?: number) => string;
}

export interface Callbacks {
  onAddToCart?: (event: React.MouseEvent, item: Item) => void;
  onProductCardClick?: (event: React.MouseEvent, item: Item) => void;
  onSwatchClick?: (event: React.MouseEvent, swatch: SwatchItem) => void;
  onRedirect?: (url: string) => void;
}

export type PlpSearchData = PlpSearchDataResults | PlpSearchDataRedirect;

export interface PlpSearchDataResults {
  resultId: string;
  request: SearchRequestType;
  rawApiResponse: SearchResponse;
  response: PlpSearchResponse;
}

export interface PlpSearchDataRedirect {
  resultId: string;
  request: SearchRequestType;
  rawApiResponse: SearchResponse;
  redirect: Redirect;
}

export interface PlpSearchResponse {
  totalNumResults: number;
  numResultsPerPage: number;
  results: Array<Item>;
  facets: Array<PlpFacet>;
  groups: Array<ApiGroup>;
  sortOptions: Array<PlpSortOption>;
  refinedContent: Record<string, any>[];
}

export interface PlpSearchRedirectResponse {
  resultId: string;
  redirect: Partial<Redirect>;
}

export type DefaultQueryStringMap = {
  query: 'q';
  page: 'page';
  offset: 'offset';
  resultsPerPage: 'numResults';
  filters: 'filters';
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
  filters?: Record<string, PlpFilterValue>;
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
  'variations' | 'matchedTerms' | 'isSlotted' | 'labels' | 'variationsMap' | 'itemId'
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
  facets?: Array<PlpFacet>;
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

export interface SwatchItem {
  url?: string;
  itemName?: string;
  imageUrl?: string;
  price?: number;
  swatchPreview: string;
  variationId?: string;
}

export interface PlpBrowseData {
  resultId: string;
  request: BrowseRequestType;
  rawApiResponse: GetBrowseResultsResponse;
  response: PlpBrowseResponse;
}

export interface PlpBrowseResponse extends PlpSearchResponse {}

export interface CioPlpProviderProps {
  apiKey: string;
  cioClient?: Nullable<ConstructorIOClient>;
  formatters?: Partial<Formatters>;
  callbacks?: Partial<Callbacks>;
  itemFieldGetters?: Partial<ItemFieldGetters>;
  urlHelpers?: Partial<UrlHelpers>;
  initialResponse?: SearchResponse;
  staticRequestConfigs?: Partial<RequestConfigs>;
}

export type UseSortReturn = {
  sortOptions: PlpSortOption[];
  selectedSort: PlpSortOption | null;
  changeSelectedSort: (sortOption: PlpSortOption) => void;
};

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
  itemPrice: number | undefined;
  itemUrl: string | undefined;
  itemImageUrl: string | undefined;
}

export type UseProductInfoProps = {
  item: Item;
};

export type UseProductInfo = (props: UseProductInfoProps) => ProductInfoObject;

export interface PlpFacet {
  displayName: string;
  name: string;
  type: 'multiple' | 'range' | 'single' | 'hierarchical';
  data: any;
  hidden: boolean;
}

export interface PlpRangeFacet extends PlpFacet {
  type: 'range';
  min: number;
  max: number;
  status: any;
}

export interface PlpMultipleFacet extends PlpFacet {
  type: 'multiple';
  options: Array<PlpFacetOption>;
}

export type PlpFilterValue = string | number | boolean | Array<string | boolean | number>;

export interface PlpFacetOption {
  status: string;
  count: number;
  displayName: string;
  value: string;
  data: object;
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

/**
 * Composes a type includes the original untransformed type, in the transformed one
 * - Transformed Type T,
 * - OriginalType from which T was derived
 */
export type IncludeRawResponse<TransformedType, OriginalType> = TransformedType & {
  rawResponse?: OriginalType;
};
