export class ECommonObject {
  headers: Headers = new Headers();

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

  private appendHeader(headerName: string, headerValue: string | string[]) {
    if (typeof headerValue === "string") {
      this.headers.append(headerName, headerValue);
    } else if (Array.isArray(headerValue)) {
      headerValue.forEach((v) => {
        this.headers.append(headerName, v);
      });
    }
  }

  append(headerNameOrObject: string | { [key: string]: string | string[] }, value?: string | string[]) {
    if (typeof headerNameOrObject === "string") {
      this.appendHeader(headerNameOrObject, value);
    } else {
      Object.keys(headerNameOrObject).forEach((headerName) => {
        this.appendHeader(headerName, headerNameOrObject[headerName]);
      });
    }
  }
}
