export type DecodedToken = {
  iat: number;
  exp: number;
  aud: string;
  iss: string;
  sub: string;
  jti: string;
};
