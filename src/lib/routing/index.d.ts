export type EConfig = {
  parseCookie: boolean;
  auto405: boolean;
  extractRequestParameters: boolean;
  autoContentType: boolean;
}

export type CookieOptions = {
  domain?: string;
  encode?: string;
  expires?: string;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  priority?: "low" | "medium" | "high";
  sameSite?: "strict" | "lax" | "none" | boolean;
  secure?: boolean;
}
