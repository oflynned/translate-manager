import { Injectable } from "@nestjs/common";
import { TermEntity } from "./term.entity";

export abstract class ITermService {
  abstract getTermsByDomain(domain: string): Promise<TermEntity[]>;
}

@Injectable()
export class TermService implements ITermService {
  async getTermsByDomain(domain: string): Promise<TermEntity[]> {
    return [];
  }
}
