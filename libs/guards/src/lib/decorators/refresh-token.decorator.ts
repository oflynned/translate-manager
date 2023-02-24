import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { RefreshTokenEntity } from "@translate-dashboard/entities";
import { RequestContext } from "../request-context";

export const RefreshToken = createParamDecorator(
  (data: unknown, req: ExecutionContext) => {
    const context = GqlExecutionContext.create(req).getContext();
    const token = context[RequestContext.REFRESH_TOKEN];

    if (!token) {
      throw new BadRequestException(
        "Refresh token is missing from context, make sure you provide a valid refresh token in the `x-refresh-token` header"
      );
    }

    return token as RefreshTokenEntity;
  }
);
