import { Gender } from "@translate-dashboard/entities";

export type CreateNewTermDto = {
  title: string;
  gender: Gender;
  declension: number;
  domain: string;
};
