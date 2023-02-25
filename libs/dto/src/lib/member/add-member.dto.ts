import { MemberRole } from "@translate-dashboard/entities";

export type AddMemberDto = {
  role: MemberRole;
  userId: string;
  organisationId: string;
};
