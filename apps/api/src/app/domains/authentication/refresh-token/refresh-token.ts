import { DecodedToken } from "./decoded-token";

export type RefreshToken = Pick<DecodedToken, "jti" | "sub">;
