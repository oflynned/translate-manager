import { Injectable } from "@nestjs/common";
import { OrganisationEntity, TermEntity } from "@translate-dashboard/entities";
import { ITermRepo } from "./term.repo";
import { Err, Ok, Result } from "ts-results";
import {
  MalformedTermException,
  OrganisationNotFoundException,
  TermAlreadyExistsException,
  TermNotFoundException,
} from "@translate-dashboard/exceptions";
import {
  CreateNewTermDto,
  GetDomainsByOrganisationIdDto,
  GetTermByIdDto,
  GetTermsDto,
} from "@translate-dashboard/dto";
import { IOrganisationService } from "@translate-dashboard/service-definitions";

export abstract class ITermService {
  abstract createNewTerm(
    dto: CreateNewTermDto,
    organisation: OrganisationEntity
  ): Promise<
    Result<TermEntity, TermAlreadyExistsException | MalformedTermException>
  >;
  abstract getDomains(
    dto: GetDomainsByOrganisationIdDto
  ): Promise<Result<string[], never>>;
  abstract getTerms(
    dto: GetTermsDto
  ): Promise<Result<TermEntity[], OrganisationNotFoundException>>;
  abstract getTermById(
    dto: GetTermByIdDto
  ): Promise<Result<TermEntity, TermNotFoundException>>;
  abstract getMissingLanguageCodes(
    dto: GetTermByIdDto
  ): Promise<Result<string[], TermNotFoundException>>;
}

@Injectable()
export class TermService implements ITermService {
  constructor(
    private readonly repo: ITermRepo,
    private readonly organisationService: IOrganisationService
  ) {}

  async getDomains(
    dto: GetDomainsByOrganisationIdDto
  ): Promise<Result<string[], never>> {
    const domains = await this.repo.getDomains(dto.organisationId);

    return Ok(domains);
  }

  async getTerms(
    dto: GetTermsDto
  ): Promise<Result<TermEntity[], OrganisationNotFoundException>> {
    const organisation = await this.organisationService.getOrganisationById({
      id: dto.organisationId,
    });

    if (organisation.err) {
      return Err(new OrganisationNotFoundException());
    }

    const terms = await this.repo.getTerms(
      organisation.val,
      dto.translated,
      dto.domain
    );

    return Ok(terms);
  }

  async getTermById(
    dto: GetTermByIdDto
  ): Promise<Result<TermEntity, TermNotFoundException>> {
    const term = await this.repo.getTermById(dto.id);

    if (!term) {
      return Err(new TermNotFoundException());
    }

    return Ok(term);
  }

  async getMissingLanguageCodes(
    dto: GetTermByIdDto
  ): Promise<Result<string[], TermNotFoundException>> {
    const term = await this.repo.getTermById(dto.id);

    if (!term) {
      return Err(new TermNotFoundException());
    }

    return Ok([]);
  }

  async createNewTerm(
    dto: CreateNewTermDto,
    organisation: OrganisationEntity
  ): Promise<
    Result<TermEntity, TermAlreadyExistsException | MalformedTermException>
  > {
    return Err(new TermNotFoundException());
  }
}
