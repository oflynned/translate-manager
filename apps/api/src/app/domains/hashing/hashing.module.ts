import { Module } from "@nestjs/common";
import { HashingService, IHashingService } from "./hashing.service";
import { BcryptAlgorithm, IHashingAlgorithm } from "./bcrypt-algorithm.service";

@Module({
  imports: [],
  providers: [
    { provide: IHashingService, useClass: HashingService },
    { provide: IHashingAlgorithm, useClass: BcryptAlgorithm },
  ],
  exports: [IHashingService],
})
export class HashingModule {}
