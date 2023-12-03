import type { ParsedUrlQuery } from 'querystring';
import type { IncomingMessage, ServerResponse } from 'http';

// Types copied from next
/** The MIT License (MIT)

* Copyright (c) 2023 Vercel, Inc.

* Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation files (the "Software"),
* to deal in the Software without restriction,
* including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
* The above copyright notice and this permission notice shall be included in all copies
* or substantial portions of the Software.

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
* IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
* DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * Context object passed into `getServerSideProps`.
 * @link https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props#context-parameter
 */
export type PreviewData = string | false | object | undefined;
export type NextApiRequestCookies = Partial<{ [key: string]: string }>;

export type GetServerSidePropsContext<
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> = {
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  };
  res: ServerResponse;
  params?: Params;
  query: ParsedUrlQuery;
  preview?: boolean;
  previewData?: Preview;
  draftMode?: boolean;
  resolvedUrl: string;
  locale?: string;
  locales?: string[];
  defaultLocale?: string;
};

/**
 * Static Site Generation feature for Next.js.
 * @link https://nextjs.org/docs/basic-features/data-fetching/get-static-props
 * @link https://nextjs.org/docs/basic-features/typescript#static-generation-and-server-side-rendering
 * @example
 * ```ts
 * export const getStaticProps: GetStaticProps = async (context) => {
 *   // ...
 * }
 * ```
 */
export type GetServerSideProps<
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> = (
  context: GetServerSidePropsContext<Params, Preview>,
) => Promise<GetServerSidePropsResult<Props>>;

/**
 * The return type of `getServerSideProps`.
 * @link https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props#getserversideprops-return-values
 */
export type GetServerSidePropsResult<Props> =
  | { props: Props | Promise<Props> }
  | { redirect: Redirect }
  | { notFound: true };

export type Redirect =
  | {
      statusCode: 301 | 302 | 303 | 307 | 308;
      destination: string;
      basePath?: false;
    }
  | {
      permanent: boolean;
      destination: string;
      basePath?: false;
    };

// Types copied from remix
// MIT License

// Copyright (c) Remix Software Inc. 2020-2021 Copyright (c) Shopify Inc. 2022-2023

// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall
// be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 * The parameters that were parsed from the URL path.
 */
export type Params<Key extends string = string> = {
  readonly [key in Key]: string | undefined;
};
interface DataFunctionArgsGeneric<Context> {
  request: Request;
  params: Params;
  context?: Context;
}

interface LoaderFunctionArgs<Context = any> extends DataFunctionArgsGeneric<Context> {}

export interface AppLoadContext {
  [key: string]: unknown;
}

export type DataFunctionArgs = LoaderFunctionArgs<AppLoadContext> & {
  context: AppLoadContext;
};
