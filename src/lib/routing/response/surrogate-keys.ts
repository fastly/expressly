export class SurrogateKeys extends Set {
    constructor(private headers: Headers) {
        super();
    }

    public clear(): void {
        this.headers.delete("Surrogate-Key");
        super.clear();
    }

    public add(key: string): this {
        super.add(key);
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
            const keys = [];
            for (const [key] of this.entries()) {
                keys.push(key);
            }
            this.headers.set("Surrogate-Key", keys.join(" "));
        }
    }
}