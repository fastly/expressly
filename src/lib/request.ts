export default class FPRequest {
  readonly clientInfo: {} = {};
  headers: Headers;
  readonly method: string;
  readonly url: URL;
  params: {} = {};
  query: {};

  constructor(private event: FetchEvent) {
    this.clientInfo = event.client;
    this.headers = event.request.headers;
    this.method = event.request.method;
    this.url = new URL(event.request.url);

    this.query = Object.fromEntries(this.url.searchParams.entries())
  }

  async json() {
    return await this.event.request.json();
  }

  async text() {
    return await this.event.request.text();
  }

  async arrayBuffer() {
    return await this.event.request.arrayBuffer();
  }
}
