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
} from '@constructor-io/constructorio-client-javascript/lib/types';
import { MakeOptional } from './utils/typeHelpers';

export type CioClientOptions = Omit<ConstructorClientOptions, 'apiKey' | 'sendTrackingEvents'>;

export interface Getters {
  getPrice: (item: Item) => number;
}

export interface Formatters {
  formatPrice: (price: number) => string;
}

export interface Callbacks {
  onAddToCart?: (event: React.MouseEvent, item: Item) => void;
  onProductCardClick?: (event: React.MouseEvent, item: Item) => void;
}

export interface PlpContext {
  cioClient: ConstructorIOClient;
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

export interface PlpSearchResponse {
  resultId: string;
  totalNumResults: number;
  results: Array<Item>;
  facets: Array<Facet>;
  groups: Array<ApiGroup>;
  sortOptions: Array<SortOption>;
  refinedContent: Record<string, any>[];
  rawResponse: SearchResponse;
}

export interface PlpBrowseResponse {
  resultId: string;
  totalNumResults: number;
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
export type IncludeRenderProps<P, RenderProps> = P & {
  children?: (props: RenderProps) => ReactNode;
};
