export class EHeaders extends Headers {
    cookies: Map<string, string> = new Map();

    constructor() {
        super();
    }

    private setCookie(value:string): void {
        const [cookieName] = value.split("=");
        this.cookies.set(cookieName, value);
    }

    public set(name: string, value: string): void {
        if(/^Set-Cookie$/i.test(name)) {
            this.cookies.clear();
            this.setCookie(value);
        }
        super.set(name, value);
    }

    public append(name: string, value: string): void {
        if(/^Set-Cookie$/i.test(name)) {
            this.setCookie(value);
        }
        super.append(name, value);
    }

    public delete(name: string): void {
        if(/^Set-Cookie$/i.test(name)) {
            this.cookies.clear();
        }
        super.delete(name);
    }
}
