import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { IAccessTokenService } from "../../domains/access-token/access-token.service";
import { RequestContext } from "./request-context";

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly accessTokenService: IAccessTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const encodedToken = ctx.req.headers["authorization"] as string;
    const validityResult = await this.accessTokenService.isAccessTokenValid(
      encodedToken
    );

    if (validityResult.err) {
      return false;
    }

    const userResult = await this.accessTokenService.getUserFromAccessToken(
      encodedToken
    );

    if (userResult.err) {
      return false;
    }

    ctx[RequestContext.USER] = userResult.val;

    return true;
  }
}
