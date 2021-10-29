import cookie from "cookie";
export default class FPResponse {
    constructor() {
        this._headers = new Headers();
        this._body = "";
        this.status = 0;
        this._cookies = new Map();
    }
    send(body) {
        this._body = body;
    }
    // For better express support
    end(body) {
        this.send(body);
    }
    writeHead(statusCode, headers) {
        this.status = statusCode;
        Object.keys(headers).map((k) => {
            this.setHeader(k, headers[k]);
        });
    }
    get headers() {
        return Object.fromEntries(this._headers.entries());
    }
    setHeader(key, value) {
        this._headers.set(key, value);
    }
    appendHeader(key, value) {
        this._headers.append(key, value);
    }
    cookie(key, value, options = {}) {
        this._cookies.set(key, cookie.serialize(key, value, options));
    }
    get body() {
        return this._body;
    }
    // Set sensible values if things are not set, such as 200 status code if the user doesnt set a status code.
    setDefaults() {
        if (this.status == 0) {
            if (this.body.length == 0) {
                this.status = 404;
                this._body = "Not Found";
            }
            else {
                this.status = 200;
            }
        }
    }
}
