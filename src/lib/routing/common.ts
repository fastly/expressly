export const setFn =
  <T>(classDefinition: T) =>
  (headerNameOrObject: string | { [key: string]: string }, value?: string) => {
    if (typeof headerNameOrObject === "string") {
      // @ts-expect-error
      classDefinition?.headers.set(headerNameOrObject, value);
    } else {
      Object.keys(headerNameOrObject).forEach((headerName) => {
        // @ts-expect-error
        classDefinition?.headers.set(
          headerName,
          headerNameOrObject[headerName]
        );
      });
    }
  };

export const appendFn =
  <T>(classDefinition: T) =>
  (
    headerNameOrObject: string | { [key: string]: string | string[] },
    value?: string | string[]
  ) => {
    const appendHeader = (
      headerName: string,
      headerValue: string | string[]
    ) => {
      if (typeof headerValue === "string") {
        // @ts-expect-error
        classDefinition.headers.append(headerName, headerValue);
      } else if (Array.isArray(headerValue)) {
        headerValue.forEach((v) => {
          // @ts-expect-error
          classDefinition.headers.append(headerName, v);
        });
      }
    };

    if (typeof headerNameOrObject === "string") {
      appendHeader(headerNameOrObject, value);
    } else {
      Object.keys(headerNameOrObject).forEach((headerName) => {
        appendHeader(headerName, headerNameOrObject[headerName]);
      });
    }
  };
