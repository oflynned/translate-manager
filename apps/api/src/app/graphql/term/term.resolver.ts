import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import {
  ITermService,
  MemberRoleMapper,
  TermGenderMapper,
} from "@translate-dashboard/domains";
import {
  Gender,
  MemberResult,
  Term,
  TermResult,
} from "@translate-manager/graphql-types";
import { CurrentUser } from "@translate-dashboard/guards";
import { UserEntity } from "@translate-dashboard/entities";
import { OrganisationService } from "@translate-dashboard/domains";
import { ApolloError } from "apollo-server-express";
import { CreateNewTermDto } from "@translate-dashboard/dto";

@Resolver("Term")
export class TermResolver {
  constructor(
    private readonly termService: ITermService,
    private readonly organisationService: OrganisationService,
    private readonly genderMapper: TermGenderMapper,
    private readonly roleMapper: MemberRoleMapper
  ) {}

  @Query("getTerms")
  async getTerms(
    @Args("organisationId") organisationId: string,
    @Args("domain") domain?: string,
    @Args("translated") translated?: boolean
  ): Promise<TermResult[]> {
    const terms = await this.termService.getTerms({
      translated,
      domain,
      organisationId,
    });

    if (terms.err) {
      return [];
    }

    return terms.val.map((term) => ({
      __typename: "Term",
      id: term.id,
      title: term.title,
      domain: term.domain,
      declension: term.declension,
      languageCode: term.languageCode,
      gender: this.genderMapper.toOuter(term.gender),
      addedBy: null,
    }));
  }

  @Query("getDomains")
  async getDomains(
    @Args("organisationId") organisationId: string
  ): Promise<string[]> {
    const domains = await this.termService.getDomains({ organisationId });

    return domains.val;
  }

  @Mutation("createNewTerm")
  async createNewTerm(
    @Args("organisationId") organisationId: string,
    @Args("title") title: string,
    @Args("domain") domain: string,
    @Args("gender") gender: Gender,
    @Args("declension") declension: number
  ): Promise<TermResult> {
    const organisation = await this.organisationService.getOrganisationById({
      id: organisationId,
    });

    if (organisation.)

    const dto: CreateNewTermDto = {
      title,
      domain,
      declension,
      gender: this.genderMapper.toInner(gender),
    };

    const term = await this.termService.createNewTerm(dto, organisation.val);
  }

  @Mutation("setTranslations")
  async setTranslations(
    @Args("termId") termId: string,
    @Args("organisationId") organisationId: string,
    @Args("translations") translations: string[],
    @Args("languageCode") languageCode: string,
    @CurrentUser() user: UserEntity
  ): Promise<TermResult> {
    const organisation = await this.organisationService.getOrganisationById({
      id: organisationId,
    });

    if (organisation.err) {
      throw new ApolloError(organisation.val.name);
    }

    const term = await this.termService.createNewTerm();
  }

  @Mutation("removeTranslations")
  async createNewTerm(): Promise<TermResult> {}

  @ResolveField("missingLanguageCodes")
  async missingLanguageCodes(@Parent() parent: Term): Promise<string[]> {
    const codes = await this.termService.getMissingLanguageCodes({
      id: parent.id,
    });

    if (codes.err) {
      return [];
    }

    return codes.val;
  }

  @ResolveField("addedBy")
  async addedBy(@Parent() parent: Term): Promise<MemberResult> {
    const term = await this.termService.getTermById({ id: parent.id });

    if (term.err) {
      return {
        __typename: "MemberNotFound",
        message: "Member does not exist",
      };
    }

    const member = term.val.addedBy;

    return {
      __typename: "Member",
      id: member.id,
      addedAt: member.createdAt,
      role: this.roleMapper.toOuter(member.role),
    };
  }
}
