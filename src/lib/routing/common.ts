export function addCommonMethods<T extends  new (...args: any[]) => any>(Base: T) {
  return class extends Base {
    // Header helpers.
    set(headerNameOrObject: string | { [key: string]: string }, value?: string) {
      if (typeof headerNameOrObject === "string") {
        this.headers.set(headerNameOrObject, value);
      } else {
        Object.keys(headerNameOrObject).forEach((headerName) => {
          this.headers.set(headerName, headerNameOrObject[headerName]);
        });
      }
    }

    append(headerNameOrObject: string | { [key: string]: string | string[] }, value?: string | string[]) {
      const appendHeader = (headerName: string, headerValue: string | string[]) => {
        if (typeof headerValue === "string") {
          this.headers.append(headerName, headerValue);
        } else if (Array.isArray(headerValue)) {
          headerValue.forEach((v) => {
            this.headers.append(headerName, v);
          });
        }
      }

      if (typeof headerNameOrObject === "string") {
        appendHeader(headerNameOrObject, value);
      } else {
        Object.keys(headerNameOrObject).forEach((headerName) => {
          appendHeader(headerName, headerNameOrObject[headerName]);
        });
      }
    }
  }
}
