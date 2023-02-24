import { Module } from "@nestjs/common";
import { HashingService } from "./hashing.service";
import { BcryptAlgorithm } from "./bcrypt-algorithm.service";
import {
  IHashingAlgorithm,
  IHashingService,
} from "@translate-dashboard/service-definitions";

@Module({
  imports: [],
  providers: [
    { provide: IHashingService, useClass: HashingService },
    { provide: IHashingAlgorithm, useClass: BcryptAlgorithm },
  ],
  exports: [IHashingService],
})
export class HashingModule {}
