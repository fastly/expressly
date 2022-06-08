export class ErrorNotFound extends Error {
    public status: number = 404;
    constructor() {
        super("Not Found");
        Object.setPrototypeOf(this, ErrorNotFound.prototype);
    }
}

export class ErrorMethodNotAllowed extends Error {
    public status: number = 405;
    public allow: string = "";

    constructor(allowedMethods: string[]) {
        super("Method Not Allowed");
        Object.setPrototypeOf(this, ErrorMethodNotAllowed.prototype);
        this.allow = [...new Set(allowedMethods)].join(",");
    }
}
