import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { IRefreshTokenService } from "../../domains/access-token/refresh-token.service";
import { GqlExecutionContext } from "@nestjs/graphql";
import { RequestContext } from "./request-context";

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly refreshTokenService: IRefreshTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const encodedToken = ctx.req.headers["x-refresh-token"] as string;
    const token = await this.refreshTokenService.resolveRefreshToken(
      encodedToken
    );

    if (token.err) {
      return false;
    }

    const { user, refreshToken } = token.val;

    ctx[RequestContext.USER] = user;
    ctx[RequestContext.REFRESH_TOKEN] = refreshToken;

    return true;
  }
}
