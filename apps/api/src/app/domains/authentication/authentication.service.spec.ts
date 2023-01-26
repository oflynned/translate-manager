import { mock } from "jest-mock-extended";
import { AuthenticationService } from "./authentication.service";
import { GetUserByCredentialsDto } from "@translate-dashboard/dto";
import { Err, Ok } from "ts-results";
import { getFakeUser } from "@translate-dashboard/entities";
import {
  IHashingService,
  IUserService,
} from "@translate-dashboard/service-definitions";

const userService = mock<IUserService>();
const hashingService = mock<IHashingService>();
const authenticationService = new AuthenticationService(
  userService,
  hashingService
);

const dto: GetUserByCredentialsDto = {
  email: "email",
  passwordAttempt: "password",
};

const user = getFakeUser();

describe("Authentication service", () => {
  describe("isMatchingPassword", () => {
    it("should return error result when user does not exist", async () => {
      userService.getUserByEmail.mockResolvedValue(Err(new Error()));

      const result = await authenticationService.getUserByCredentials(dto);

      expect(result.err).toBeTruthy();
    });

    it("should return error on user hash not matching password attempt", async () => {
      userService.getUserByEmail.mockResolvedValue(Ok(user));
      hashingService.isValid.mockResolvedValue(false);

      const result = await authenticationService.getUserByCredentials(dto);

      expect(result.err).toBeTruthy();
    });

    it("should return ok result on user hash matching password attempt", async () => {
      userService.getUserByEmail.mockResolvedValue(Ok(user));
      hashingService.isValid.mockResolvedValue(true);

      const result = await authenticationService.getUserByCredentials(dto);

      expect(result.ok).toBeTruthy();
      expect(result.val).toBe(user);
    });
  });
});
