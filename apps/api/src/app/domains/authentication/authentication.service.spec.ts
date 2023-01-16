import { mock } from "jest-mock-extended";
import { IUserService } from "../user/service/user.service";
import { IHashingService } from "../hashing/hashing.service";
import { AuthenticationService } from "./authentication.service";
import { IsMatchingPasswordDto } from "./dto/is-matching-password.dto";
import { Err, Ok } from "ts-results";
import { getFakeUser } from "../user/repo/user.factory";

const userService = mock<IUserService>();
const hashingService = mock<IHashingService>();
const authenticationService = new AuthenticationService(
  userService,
  hashingService
);

const dto: IsMatchingPasswordDto = {
  email: "email",
  passwordAttempt: "password",
};

const user = getFakeUser();

describe("Authentication service", () => {
  describe("isMatchingPassword", () => {
    it("should return false on an error from the user service", async () => {
      userService.getUserByEmail.mockResolvedValue(Err(new Error()));

      await expect(
        authenticationService.isMatchingPassword(dto)
      ).resolves.toEqual(false);
    });

    it("should return false on user hash not matching password attempt", async () => {
      userService.getUserByEmail.mockResolvedValue(Ok(user));
      hashingService.isValid.mockResolvedValue(false);

      await expect(
        authenticationService.isMatchingPassword(dto)
      ).resolves.toEqual(false);
    });

    it("should return true on user hash matching password attempt", async () => {
      userService.getUserByEmail.mockResolvedValue(Ok(user));
      hashingService.isValid.mockResolvedValue(true);

      await expect(
        authenticationService.isMatchingPassword(dto)
      ).resolves.toEqual(true);
    });
  });
});
