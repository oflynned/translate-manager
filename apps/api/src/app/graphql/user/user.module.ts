import { Module } from "@nestjs/common";
import { UserModule } from "../../domains/user/user.module";

@Module({
  imports: [UserModule],
  providers: [UserResolver],

})