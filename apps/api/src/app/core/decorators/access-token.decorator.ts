import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { RequestContext } from "../guards/request-context";

export const AccessToken = createParamDecorator(
  (data: unknown, req: ExecutionContext) => {
    const context = GqlExecutionContext.create(req).getContext();
    const token = context[RequestContext.ACCESS_TOKEN];

    if (!token) {
      throw new BadRequestException(
        "Access token is missing from context, make sure you provide a valid jwt in the `authorization` header"
      );
    }

    return token as string;
  }
);
