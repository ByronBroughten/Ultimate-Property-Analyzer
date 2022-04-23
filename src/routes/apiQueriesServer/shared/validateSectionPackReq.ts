import { Request, Response } from "express";
import { SectionPack } from "../../../client/src/App/sharedWithServer/Analyzer/SectionPack";
import { ServerSectionPack } from "../../../client/src/App/sharedWithServer/Analyzer/SectionPackRaw";
import {
  SectionPackArrReq,
  SectionPackReq,
} from "../../../client/src/App/sharedWithServer/apiQueriesShared/makeGeneralReqs";
import { DbStoreName } from "../../../client/src/App/sharedWithServer/SectionMetas/baseSectionTypes/dbStoreNames";
import { resHandledError } from "../../../middleware/error";
import { validateDbStoreName } from "./validateDbSectionInfoReq";
import { LoggedIn, validateLoggedInUser } from "./validateLoggedInUser";

export function validateSectionPackArrReq(
  req: Request,
  res: Response
): LoggedIn<SectionPackArrReq> {
  const { sectionPackArr, user, dbStoreName } = req.body;
  return {
    body: {
      user: validateLoggedInUser(user, res),
      dbStoreName: validateDbStoreName(dbStoreName, res, "arr"),
      sectionPackArr: validateServerSectionPackArr({
        value: sectionPackArr,
        dbStoreName,
        res,
      }),
    },
  };
}

export function validateSectionPackReq(
  req: Request,
  res: Response
): LoggedIn<SectionPackReq> {
  const { user, sectionPack } = req.body;
  return {
    body: {
      user: validateLoggedInUser(user, res),
      sectionPack: validateServerSectionPack(sectionPack, res),
    },
  };
}

type ValidateServerSectionPackArrProps = {
  value: any;
  res: Response;
  dbStoreName: DbStoreName;
};
function validateServerSectionPackArr({
  value,
  res,
  dbStoreName,
}: ValidateServerSectionPackArrProps): ServerSectionPack[] {
  if (
    Array.isArray(value) &&
    value.every((v) => SectionPack.isServer(v) && v.sectionName === dbStoreName)
  ) {
    return value as ServerSectionPack[];
  } else
    throw resHandledError(
      res,
      500,
      "Payload is not a valid server section array."
    );
}

function validateServerSectionPack(
  value: any,
  res: Response
): ServerSectionPack {
  if (SectionPack.isServer(value)) return value;
  else {
    throw resHandledError(
      res,
      500,
      "Payload is not a valid server section pack."
    );
  }
}
