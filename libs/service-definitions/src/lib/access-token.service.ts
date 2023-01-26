import { RefreshTokenEntity, UserEntity } from "@translate-dashboard/entities";
import { Result } from "ts-results";
import {
  InvalidAccessTokenException,
  MalformedAccessTokenException,
  UserNotFoundException,
} from "@translate-dashboard/exceptions";

export abstract class IAccessTokenService {
  abstract createAccessToken(
    user: UserEntity
  ): Promise<Result<string, MalformedAccessTokenException>>;
  abstract isAccessTokenValid(
    encodedToken: string
  ): Promise<Result<boolean, InvalidAccessTokenException>>;
  abstract getUserFromAccessToken(
    encodedToken: string
  ): Promise<
    Result<UserEntity, InvalidAccessTokenException | UserNotFoundException>
  >;
  abstract createAccessTokenFromRefreshToken(
    refreshToken: RefreshTokenEntity
  ): Promise<Result<string, MalformedAccessTokenException>>;
}
