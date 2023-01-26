import { Resolver } from "@nestjs/graphql";
import { IMemberService } from "../../domains/member/member.service";

@Resolver()
export class MemberResolver {
  constructor(private readonly memberService: IMemberService) {}
}
