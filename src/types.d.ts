declare module "@theme/searchByWorker" {
  export function fetchIndexesByWorker(
    baseUrl: string,
    searchContext: string,
  ): Promise<void>;

  export function searchByWorker(
    baseUrl: string,
    searchContext: string,
    input: string,
    limit: number,
  ): Promise<SearchResult[]>;

  export interface SearchResultDocument {
    i: number;
    t: string;
    s?: string;
    u: string;
    h?: string;
    b: string[];
  }

  export interface SearchResultPage {
    i: number;
    t: string;
    b: string[];
  }

  export interface SearchResult {
    document: SearchResultDocument;
    page?: SearchResultPage;
    type: number;
    tokens: string[];
    metadata: Record<string, unknown>;
  }
}

declare module "@docusaurus/useGlobalData" {
  export default function useGlobalData(): Record<
    string,
    Record<string, unknown>
  >;
  export function usePluginData(
    pluginName: string,
    pluginId?: string,
  ): unknown;
  export function useAllPluginInstancesData(
    pluginName: string,
  ): Record<string, unknown> | undefined;
}

declare module "lodash/kebabCase" {
  export default function kebabCase(str?: string): string;
}

declare module "*.css" {}
declare module "*.scss" {}
