import React from 'react';
import type { ReactNode } from 'react';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import {
  ConstructorClientOptions,
  Facet,
  Group,
  Result,
  SearchResponse,
  SortOption,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import usePagination from './hooks/usePagination';

export type CioClientOptions = Omit<ConstructorClientOptions, 'apiKey' | 'sendTrackingEvents'>;

export interface PlpContext {
  cioClient: ConstructorIOClient;
  cioClientOptions: CioClientOptions;
  setCioClientOptions: React.Dispatch<CioClientOptions>;
}

export interface PrimaryColorStyles {
  '--primary-color-h': string;
  '--primary-color-s': string;
  '--primary-color-l': string;
}

// Transformed API Responses
export interface PlpSearchResponse {
  resultId: string;
  totalNumResults: number;
  results: Array<Result>;
  facets: Array<Facet>;
  groups: Array<Group>;
  sortOptions: Array<SortOption>;
  refinedContent: Record<string, any>[];
  rawResponse: SearchResponse;
}

export type PaginationProps = ReturnType<typeof usePagination>;

// Type Extenders
export type PropsWithChildren<P> = P & { children?: ReactNode };
