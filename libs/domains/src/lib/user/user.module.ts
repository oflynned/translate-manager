import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { IUserRepo, UserRepo } from "./user.repo";
import { HashingModule } from "../hashing/hashing.module";
import { IUserService } from "@translate-dashboard/service-definitions";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserEntity } from "@translate-dashboard/entities";
import { CreateUserSchema } from "../../../../schema-validator/src/lib/create-user.schema";

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
