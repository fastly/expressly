export default class FPRequest {
  readonly clientInfo: {} = {};
  headers: Headers;
  readonly method: string;
  readonly url: URL;
  params: {} = {};

  constructor(private event: FetchEvent) {
    this.clientInfo = event.client;
    this.headers = event.request.headers;
    this.method = event.request.method;
    this.url = new URL(event.request.url);
  }

  async json() {
    await this.event.request.json();
  }

  async text() {
    await this.event.request.text();
  }

  async arrayBuffer() {
    await this.event.request.arrayBuffer();
  }
}
