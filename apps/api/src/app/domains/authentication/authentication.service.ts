import { Injectable } from "@nestjs/common";
import { IUserService } from "../user/service/user.service";
import { IHashingService } from "../hashing/hashing.service";
import { IsMatchingPasswordDto } from "./dto/is-matching-password.dto";

export abstract class IAuthenticationService {
  abstract isMatchingPassword(dto: IsMatchingPasswordDto): Promise<boolean>;
}

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    private readonly userService: IUserService,
    private readonly hashingService: IHashingService
  ) {}

  async isMatchingPassword(dto: IsMatchingPasswordDto): Promise<boolean> {
    const result = await this.userService.getUserByEmail({ email: dto.email });

    if (result.err) {
      return false;
    }

    const hash = result.val.hash;

    return this.hashingService.isValid(dto.passwordAttempt, hash);
  }
}
