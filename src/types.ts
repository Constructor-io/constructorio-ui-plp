import React from 'react';
import type { ReactNode } from 'react';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import {
  ConstructorClientOptions,
  Group as ApiGroup,
  Facet as ApiFacet,
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
  FacetOption as ApiFacetOption,
} from '@constructor-io/constructorio-client-javascript/lib/types';

export {
  Nullable,
  ConstructorIOClient,
  SearchResponseType,
  SearchParameters,
  Redirect,
  ApiFacet,
  ApiFacetOption,
  ApiGroup,
};

export interface ApiHierarchicalFacetOption extends ApiFacetOption {
  options: Array<ApiHierarchicalFacetOption>;
  data: Record<string, any> & { parent_value: string | null };
}

export type CioClientOptions = Omit<ConstructorClientOptions, 'apiKey' | 'sendTrackingEvents'>;

export interface ItemFieldGetters {
  getPrice: (item: Item | Variation) => number;
  getSalePrice: (item: Item | Variation) => number | undefined;
  getRolloverImage: (item: Item | Variation) => string | undefined;
  getSwatchPreview: (variation: Variation) => string;
  getSwatches: (
    item: Item,
    retrievePrice: ItemFieldGetters['getPrice'],
    retrieveSwatchPreview: ItemFieldGetters['getSwatchPreview'],
    retrieveSalePrice: ItemFieldGetters['getSalePrice'],
    retrieveRolloverImage: ItemFieldGetters['getRolloverImage'],
  ) => SwatchItem[] | undefined;
}

export interface Formatters {
  formatPrice: (price?: number) => string;
}

export interface Callbacks {
  onAddToCart?: (event: React.MouseEvent, item: Item, selectedVariation?: Variation) => void;
  onProductCardClick?: (event: React.MouseEvent, item: Item) => void;
  onProductCardMouseEnter?: (event: React.MouseEvent, item: Item) => void;
  onProductCardMouseLeave?: (event: React.MouseEvent, item: Item) => void;
  onSwatchClick?: (event: React.MouseEvent, swatch: SwatchItem) => void;
  onRedirect?: (url: string) => void;
}

interface ProductCardBaseProps {
  /**
   * Constructor's Transformed API Item Object.
   */
  item: Item;
}

/**
 * Props that will be passed to the renderProps function
 */
export interface ProductCardRenderProps extends ProductCardProps {
  /**
   * Function to format the price. Defaults to "$0.00".
   * Set globally at the CioPlp provider level.
   */
  formatPrice: (price: number) => string;
  /**
   * Object containing information about the current product, variation
   */
  productInfo: ProductInfoObject;
  /**
   * Callback to run on add-to-cart event.
   * Set globally at the CioPlp provider level.
   */
  onAddToCart: (
    event: React.MouseEvent,
    item: Item,
    revenue: number,
    selectedVariation: string,
  ) => void;
  /**
   * Callback to run on Product Card Click.
   * Set globally at the CioPlp provider level.
   */
  onClick: (event: React.MouseEvent, item: Item) => void;
  /**
   * Callback to run on Product Card Mouse Enter.
   * Set globally at the CioPlp provider level.
   */
  onMouseEnter: (event: React.MouseEvent, item: Item) => void;
  /**
   * Callback to run on Product Card Mouse Leave.
   * Set globally at the CioPlp provider level.
   */
  onMouseLeave: (event: React.MouseEvent, item: Item) => void;
  /**
   * Boolean to show/hide the rollover image.
   */
  isRolloverImageShown: boolean;
  /**
   * Data Attributes to surface on parent div of product card.
   */
  productCardCnstrcDataAttributes: CnstrcDataAttrs;
}

export type ProductCardProps = IncludeRenderProps<ProductCardBaseProps, ProductCardRenderProps>;

export interface RenderOverrides {
  productCard?: {
    renderHtml?: (props: ProductCardRenderProps) => HTMLElement | ReactNode;
  };
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
  redirect: Redirect['redirect'];
}

export interface PlpSearchResponse {
  totalNumResults: number;
  numResultsPerPage: number;
  results: Array<Item>;
  facets: Array<PlpFacet>;
  groups: Array<PlpItemGroup>;
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
  getUrlFromState: (state: RequestConfigs, urlString: string) => string;
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

export interface PlpContextValue {
  cioClient: Nullable<ConstructorIOClient>;
  cioClientOptions: CioClientOptions;
  setCioClientOptions: React.Dispatch<CioClientOptions>;
  staticRequestConfigs: RequestConfigs;
  itemFieldGetters: ItemFieldGetters;
  formatters: Formatters;
  callbacks: Callbacks;
  urlHelpers: UrlHelpers;
  renderOverrides: RenderOverrides;
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
  salePrice?: number;
  swatchPreview: string;
  variationId?: string;
  rolloverImage?: string;
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
  cioClientOptions?: Omit<ConstructorClientOptions, 'apiKey' | 'version'>;
  formatters?: Partial<Formatters>;
  callbacks?: Partial<Callbacks>;
  itemFieldGetters?: Partial<ItemFieldGetters>;
  renderOverrides?: Partial<RenderOverrides>;
  urlHelpers?: Partial<UrlHelpers>;
  initialSearchResponse?: SearchResponse;
  initialBrowseResponse?: GetBrowseResultsResponse;
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
  productSwatch?: ProductSwatchObject;
  itemName: string;
  itemId: string;
  itemPrice?: number;
  salePrice?: number;
  itemUrl?: string;
  itemImageUrl?: string;
  variationId?: string;
  rolloverImage?: string;
  hasSalePrice?: boolean;
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

export interface PlpSingleFacet extends PlpFacet {
  type: 'single';
  options: Array<PlpFacetOption>;
}

export interface PlpHierarchicalFacet extends PlpFacet {
  type: 'hierarchical';
  options: Array<PlpHierarchicalFacetOption>;
}

export type PlpFilterValue = string | number | boolean | Array<string | boolean | number> | null;
export interface PlpFacetOption {
  status: string;
  count: number;
  displayName: string;
  value: string;
  data: object;
  range?: ['-inf' | number, 'inf' | number];
  options?: Array<PlpHierarchicalFacetOption>;
}

export interface PlpHierarchicalFacetOption extends PlpFacetOption {
  options: Array<PlpHierarchicalFacetOption>;
  data: object & { parentValue: string | null };
}

export interface PlpItemGroup {
  groupId: string;
  displayName: string;
  count: number;
  data: object | null;
  children: Array<PlpItemGroup>;
  parents: Pick<PlpItemGroup, 'groupId' | 'displayName'>[];
}

export type CnstrcDataAttrs = Record<`data-cnstrc-${string}` | string, string | number | boolean>;

// Type Extenders
export type PropsWithChildren<P> = P & { children?: ReactNode };
export type RenderPropsChildren<RenderProps> = ((props: RenderProps) => ReactNode) | ReactNode;

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

/**
 * Given a Type T and a set of keys K (pipe-delimited string), make those keys optional.
 */
export type MakeOptional<Type, Keys extends string & keyof Partial<Type>> = Omit<Type, Keys> &
  Partial<Pick<Type, Keys>>;
