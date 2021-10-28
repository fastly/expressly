export default class FPRequest {
    constructor(event) {
        this.event = event;
        this.clientInfo = {};
        this.params = {};
        this.clientInfo = event.client;
        this.headers = event.request.headers;
        this.method = event.request.method;
        this.url = new URL(event.request.url);
        this.query = Object.fromEntries(this.url.searchParams.entries());
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
