import config from "config";
import jwt from "jsonwebtoken";
import { isObject } from "lodash";
import { ResStatusError } from "../../../../../resErrorUtils";

export type UserJwt = { userId: string };
export function createUserAuthToken(userId: string) {
  const userJwt: UserJwt = { userId };
  const privateKey: string = config.get("jwtPrivateKey");
  try {
    return jwt.sign(userJwt, privateKey);
  } catch (err) {
    throw new Error(
      `JWT failed to be made with userId ${userId} and private key ${privateKey}.`
    );
  }
}
function hasTokenProps(value: any) {
  return (
    "userId" in value &&
    "iat" in value &&
    typeof value.userId === "string" &&
    typeof value.iat === "number"
  );
}
export function checkUserAuthToken(token: any): UserJwt {
  const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
  if (isUserJwt(decoded)) return decoded;
  else
    throw new ResStatusError({
      errorMessage: "Access denied. Invalid token provided.",
      resMessage: "You are not logged in.",
      status: 401,
    });
}
export function isUserJwt(value: any): value is UserJwt {
  return (
    isObject(value) && Object.keys(value).length === 2 && hasTokenProps(value)
  );
}
