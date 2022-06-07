import cookie from "cookie";

export class CookieMap extends Map {
    constructor(private headers: Headers) {
        super();

        if (Boolean(this.headers.get("Cookie"))) {
            for (const [key, value] of Object.entries(cookie.parse(this.headers.get("Cookie")))) {
                if (typeof value === "string") {
                    super.set(key, value);
                }
            }
        }
    }

    public clear(): void {
        this.headers.delete("Cookie");
        super.clear();
    }

    public set(key: string, value: string): this {
        super.set(key, value);
        this.serialize();
        return this;
    }

    public delete(key: string): boolean {
        const deleteResult = super.delete(key);
        this.serialize();
        return deleteResult;
    }

    private serialize(): void {
        if (this.size) {
            const cookies = [];
            for (const [key, value] of this.entries()) {
                cookies.push(cookie.serialize(key, value));
            }
            this.headers.set("Cookie", cookies.join("; "));
        }
    }
}