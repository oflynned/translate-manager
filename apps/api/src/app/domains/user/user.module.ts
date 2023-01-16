import { Module } from "@nestjs/common";
import { IUserService, UserService } from "./service/user.service";
import { IUserRepo, UserRepo } from "./repo/user.repo";
import { HashingModule } from "../hashing/hashing.module";

@Module({
  imports: [HashingModule],
  providers: [
    { provide: IUserService, useClass: UserService },
    { provide: IUserRepo, useClass: UserRepo },
  ],
  exports: [IUserService],
})
export class UserModule {}
