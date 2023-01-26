import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { IUserRepo, UserRepo } from "./user.repo";
import { HashingModule } from "../hashing/hashing.module";
import { IUserService } from "@translate-dashboard/service-definitions";

@Module({
  imports: [HashingModule],
  providers: [
    { provide: IUserService, useClass: UserService },
    { provide: IUserRepo, useClass: UserRepo },
  ],
  exports: [IUserService],
})
export class UserModule {}
