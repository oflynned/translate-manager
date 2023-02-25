import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { IUserRepo, UserRepo } from "./user.repo";
import { HashingModule } from "../hashing";
import { IUserService } from "@translate-dashboard/service-definitions";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserEntity } from "@translate-dashboard/entities";
import { CreateUserSchema } from "@translate-dashboard/schema-validator";

@Module({
  imports: [HashingModule, MikroOrmModule.forFeature([UserEntity])],
  providers: [
    { provide: IUserService, useClass: UserService },
    { provide: IUserRepo, useClass: UserRepo },
    CreateUserSchema,
  ],
  exports: [IUserService],
})
export class UserModule {}
