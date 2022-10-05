import config from "config";
import jwt from "jsonwebtoken";
import { isObject } from "lodash";
import { SubscriptionValues } from "../../../../../client/src/App/sharedWithServer/apiQueriesShared/SubscriptionValues";
import { isUserPlan } from "../../../../../client/src/App/sharedWithServer/SectionsMeta/baseSectionsVarbs";
import { StrictOmit } from "../../../../../client/src/App/sharedWithServer/utils/types";
import { ResStatusError } from "../../../../../utils/resError";

export interface UserInfoJwt extends SubscriptionValues {
  userId: string;
  iat: number;
}

export type UserJwtProps = StrictOmit<UserInfoJwt, "iat">;
export function createUserInfoToken(userJwt: UserJwtProps): string {
  const privateKey: string = config.get("jwtPrivateKey");
  try {
    return jwt.sign(userJwt, privateKey);
  } catch (err) {
    throw new Error(
      `JWT failed to be made with userJwt ${JSON.stringify(
        userJwt
      )} and private key ${privateKey}.`
    );
  }
}

export function isUserJwt(value: any): value is UserInfoJwt {
  return (
    isObject(value) && Object.keys(value).length === 4 && hasTokenProps(value)
  );
}

function hasTokenProps(value: any) {
  return (
    "userId" in value &&
    "subscriptionPlan" in value &&
    "planExp" in value &&
    "iat" in value &&
    typeof value.userId === "string" &&
    typeof value.iat === "number" &&
    typeof value.planExp === "number" &&
    isUserPlan(value.subscriptionPlan)
  );
}
export function checkUserAuthToken(token: any): UserInfoJwt {
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  if (isUserJwt(decoded)) return decoded;
  else
    throw new ResStatusError({
      errorMessage: "Access denied. Invalid token provided.",
      resMessage: "You are not logged in.",
      status: 401,
    });
}