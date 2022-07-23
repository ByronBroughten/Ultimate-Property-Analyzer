import { UserJwt } from "../../routes/apiQueries/shared/DbSections/DbUser/userAuthToken";

declare module "express-serve-static-core" {
  interface Request extends Request {
    userJwt: UserJwt;
  }
}
