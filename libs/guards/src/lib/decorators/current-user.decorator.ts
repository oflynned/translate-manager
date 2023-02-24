import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { UserEntity } from "@translate-dashboard/entities";
import { RequestContext } from "../request-context";

export const CurrentUser = createParamDecorator(
  (data: unknown, req: ExecutionContext) => {
    const context = GqlExecutionContext.create(req).getContext();
    const user = context[RequestContext.USER];

    if (!user) {
      throw new BadRequestException(
        "User is missing from context, make sure you provide a valid jwt in the `authorization` header"
      );
    }

    return user as UserEntity;
  }
);
