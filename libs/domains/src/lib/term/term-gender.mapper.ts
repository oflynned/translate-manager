import { Injectable } from "@nestjs/common";
import { Gender as OuterGender } from "@translate-manager/graphql-types";
import { Gender as InnerGender } from "@translate-dashboard/entities";

@Injectable()
export class TermGenderMapper {
  toOuter(gender: InnerGender): OuterGender {
    switch (gender) {
      case InnerGender.FEMALE:
        return OuterGender.Female;
      case InnerGender.MASCULINE:
      default:
        return OuterGender.Male;
    }
  }

  toInner(gender: OuterGender): InnerGender {
    switch (gender) {
      case OuterGender.Female:
        return InnerGender.FEMALE;
      case OuterGender.Male:
      default:
        return InnerGender.MASCULINE;
    }
  }
}
