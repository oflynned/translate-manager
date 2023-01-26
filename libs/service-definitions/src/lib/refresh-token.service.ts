import { Result } from "ts-results";
import { RefreshTokenEntity, UserEntity } from "@translate-dashboard/entities";
import {
  ExpiredRefreshTokenException,
  InvalidRefreshTokenException,
  MalformedRefreshTokenException,
  MissingRefreshTokenException,
  RevokedRefreshTokenException,
} from "@translate-dashboard/exceptions";
import { RefreshToken } from "../../../../apps/api/src/app/domains/authentication/refresh-token/refresh-token";
import { LongLivedToken } from "../../../../apps/api/src/app/domains/authentication/refresh-token/refresh-token.service";

export abstract class IRefreshTokenService {
  abstract isRefreshTokenValid(
    encodedToken: string
  ): Promise<Result<boolean, never>>;
  abstract createRefreshToken(
    user: UserEntity
  ): Promise<Result<string, MalformedRefreshTokenException>>;
  abstract resolveRefreshToken(
    encodedToken: string
  ): Promise<
    Result<
      LongLivedToken,
      | InvalidRefreshTokenException
      | MissingRefreshTokenException
      | RevokedRefreshTokenException
      | ExpiredRefreshTokenException
      | MalformedRefreshTokenException
    >
  >;
  abstract getStoredTokenFromRefreshTokenPayload(
    payload: RefreshToken
  ): Promise<
    Result<
      RefreshTokenEntity,
      InvalidRefreshTokenException | MissingRefreshTokenException
    >
  >;
  abstract revokeToken(
    refreshToken: RefreshTokenEntity
  ): Promise<Result<RefreshTokenEntity, never>>;
}
