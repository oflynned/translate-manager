import { MemberRole } from "@translate-dashboard/entities";
import { Role } from "@translate-manager/graphql-types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MemberRoleMapper {
  toInner = (role: Role): MemberRole => {
    switch (role) {
      case Role.Admin:
        return MemberRole.ADMIN;
      case Role.Contributor:
        return MemberRole.CONTRIBUTOR;
      case Role.Viewer:
      default:
        return MemberRole.VIEWER;
    }
  };

  toOuter = (role: MemberRole): Role => {
    switch (role) {
      case MemberRole.ADMIN:
        return Role.Admin;
      case MemberRole.CONTRIBUTOR:
        return Role.Contributor;
      case MemberRole.VIEWER:
      default:
        return Role.Viewer;
    }
  };
}
