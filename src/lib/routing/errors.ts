export class EErr extends Error {
    public status: number = 500;
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, EErr.prototype);
    }
}

export class ErrorNotFound extends EErr {
    public status: number = 404;
    constructor() {
        super("Not Found");
        Object.setPrototypeOf(this, ErrorNotFound.prototype);
    }
}

export class ErrorMethodNotAllowed extends EErr {
    public status: number = 405;
    public allow: string = "";

    constructor(allowedMethods: string[]) {
        super("Method Not Allowed");
        Object.setPrototypeOf(this, ErrorMethodNotAllowed.prototype);
        this.allow = [...new Set(allowedMethods)].join(",");
    }
}
