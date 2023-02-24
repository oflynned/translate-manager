import { Resolver } from "@nestjs/graphql";
import { IMemberService } from "@translate-dashboard/service-definitions";

@Resolver()
export class MemberResolver {
  constructor(private readonly memberService: IMemberService) {}
}
