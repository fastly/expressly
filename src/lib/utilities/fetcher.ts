export class Fetcher {
  constructor(private sources: FetchSourceMap) {}

  public async fetch(): Promise<FetchResultMap> {
    let results: FetchResultMap = {};

    await Promise.all(
      Object.keys(this.sources).map(async (sourceName) => {
        results[sourceName] = await this.getSourceData(
          this.sources[sourceName]
        );
      })
    );

    return results;
  }

  private async getSourceData(source: FetchSource): Promise<FetchResult> {
    let request = await fetch(source.url, {
      backend: source.backend,
      method: source.method,
      body: source.body,
      headers: source.headers,
      cacheOverride: source.cache,
    });

    return {
      source: source,
      data: await request.text(),
    };
  }
}

type FetchSourceMap = { [key: string]: FetchSource };

type FetchResultMap = { [key: string]: FetchResult };

type FetchResult = {
  source: FetchSource;
  data: string;
};

type FetchSource = {
  url: string;
  backend: string;
  method?: string;
  body?: string;
  headers?: Headers;
  cache?: CacheOverride;
};
