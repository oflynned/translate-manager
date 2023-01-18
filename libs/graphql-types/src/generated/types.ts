export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type DeletedJwt = {
  __typename?: "DeletedJwt";
  deletedAt: Scalars["DateTime"];
};

export type DeletedOrganisation = {
  __typename?: "DeletedOrganisation";
  deletedAt: Scalars["DateTime"];
  id: Scalars["ID"];
};

export type DeletedUser = {
  __typename?: "DeletedUser";
  deletedAt: Scalars["DateTime"];
  id: Scalars["ID"];
};

export type ExpiredJwt = {
  __typename?: "ExpiredJwt";
  expiredAt: Scalars["DateTime"];
};

export enum Gender {
  Female = "FEMALE",
  Male = "MALE",
}

export type InvalidUser = {
  __typename?: "InvalidUser";
  message: Scalars["String"];
};

export type InvitedMember = {
  __typename?: "InvitedMember";
  invitedAt: Scalars["DateTime"];
  user?: Maybe<UserResult>;
};

export type Jwt = {
  __typename?: "Jwt";
  accessToken: Scalars["String"];
  refreshToken?: Maybe<Scalars["String"]>;
};

export type JwtNotFound = {
  __typename?: "JwtNotFound";
  message: Scalars["String"];
};

export type JwtResult =
  | ExpiredJwt
  | Jwt
  | JwtNotFound
  | MalformedJwt
  | RevokedJwt;

export type MalformedJwt = {
  __typename?: "MalformedJwt";
  message: Scalars["String"];
};

export type Member = {
  __typename?: "Member";
  addedAt: Scalars["DateTime"];
  role: Role;
  user?: Maybe<UserResult>;
};

export type MemberResult = InvitedMember | Member;

export type Mutation = {
  __typename?: "Mutation";
  addMember: MemberResult;
  addTranslation: TermResult;
  createOrganisation: OrganisationResult;
  createRefreshToken: JwtResult;
  createUser: UserResult;
  deleteOrganisation: OrganisationResult;
  deleteUser: UserResult;
  inviteMember: MemberResult;
  refreshAccessToken: JwtResult;
  removeMember: MemberResult;
  removeTranslation: TermResult;
  revokeRefreshToken: JwtResult;
  setTime: Scalars["DateTime"];
};

export type MutationAddMemberArgs = {
  organisationId: Scalars["ID"];
  userId: Scalars["ID"];
};

export type MutationAddTranslationArgs = {
  languageCode: Scalars["String"];
  termId: Scalars["ID"];
  translation: Scalars["String"];
};

export type MutationCreateOrganisationArgs = {
  name: Scalars["String"];
};

export type MutationCreateRefreshTokenArgs = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type MutationCreateUserArgs = {
  email: Scalars["String"];
  name: Scalars["String"];
  password: Scalars["String"];
};

export type MutationDeleteOrganisationArgs = {
  organisationId: Scalars["ID"];
};

export type MutationDeleteUserArgs = {
  userId: Scalars["ID"];
};

export type MutationInviteMemberArgs = {
  email: Scalars["String"];
  organisationId: Scalars["ID"];
};

export type MutationRemoveMemberArgs = {
  organisationId: Scalars["ID"];
  userId: Scalars["ID"];
};

export type MutationRemoveTranslationArgs = {
  languageCode: Scalars["String"];
  termId: Scalars["ID"];
};

export type MutationSetTimeArgs = {
  time: Scalars["DateTime"];
};

export type Organisation = {
  __typename?: "Organisation";
  createdAt: Scalars["DateTime"];
  creator?: Maybe<MemberResult>;
  deletedAt?: Maybe<Scalars["DateTime"]>;
  id: Scalars["ID"];
  lastUpdatedAt?: Maybe<Scalars["DateTime"]>;
  members?: Maybe<Array<MemberResult>>;
};

export type OrganisationNotFound = {
  __typename?: "OrganisationNotFound";
  message: Scalars["String"];
};

export type OrganisationResult =
  | DeletedOrganisation
  | Organisation
  | OrganisationNotFound;

export type Query = {
  __typename?: "Query";
  getMe: UserResult;
  getTermsByDomain?: Maybe<Array<TermResult>>;
  getTime: Scalars["DateTime"];
  getUntranslatedTerms?: Maybe<Array<TermResult>>;
  getUserById: UserResult;
};

export type QueryGetTermsByDomainArgs = {
  domain?: InputMaybe<Scalars["String"]>;
};

export type QueryGetUserByIdArgs = {
  userId: Scalars["ID"];
};

export type RevokedJwt = {
  __typename?: "RevokedJwt";
  message: Scalars["String"];
};

export enum Role {
  Admin = "ADMIN",
  Contributor = "CONTRIBUTOR",
  Viewer = "VIEWER",
}

export type Term = {
  __typename?: "Term";
  declension: Scalars["Int"];
  domain: Scalars["String"];
  gender: Gender;
  id: Scalars["ID"];
  languageCode: Scalars["String"];
  term: Scalars["String"];
  translations?: Maybe<Array<Translation>>;
};

export type TermNotFound = {
  __typename?: "TermNotFound";
  message: Scalars["String"];
};

export type TermResult = Term | TermNotFound;

export type Translation = {
  __typename?: "Translation";
  languageCode: Scalars["String"];
  terms?: Maybe<Array<Scalars["String"]>>;
};

export type User = {
  __typename?: "User";
  createdAt: Scalars["DateTime"];
  email: Scalars["String"];
  id: Scalars["ID"];
  lastUpdatedAt?: Maybe<Scalars["DateTime"]>;
  name: Scalars["String"];
};

export type UserNotFound = {
  __typename?: "UserNotFound";
  message: Scalars["String"];
};

export type UserResult = DeletedUser | InvalidUser | User | UserNotFound;
