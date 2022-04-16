import { Server } from "http";
import request from "supertest";
import { config } from "../../client/src/App/Constants";
import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import { NumObj } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/baseSections/baseValues/NumObj";
import { Id } from "../../client/src/App/sharedWithServer/Analyzer/SectionMetas/relSections/baseSections/id";
import {
  apiEndpoints,
  NextReq,
} from "../../client/src/App/sharedWithServer/apiQueriesShared";
import { RegisterReqPayloadNext } from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { runApp } from "../../runApp";
import { UserModelNext } from "../shared/UserModelNext";
import { userServerSideNext } from "../shared/userServerSideNext";
import { serverSideLogin } from "../userRoutes/shared/doLogin";
import { loginUtils } from "./nextLogin/loginUtils";

const sectionName = "property";
function makeRegisterPayload(): RegisterReqPayloadNext {
  let next = Analyzer.initAnalyzer();
  next = next.updateSectionValuesAndSolve("register", {
    email: "testosis@gmail.com",
    password: "testPassword",
    userName: "Testosis",
  });
  return next.req.nextRegister().body.payload;
}

const originalValues = {
  title: "Original title",
  price: NumObj.init(100000),
} as const;

const updatedValues = {
  title: "Updated title",
  price: NumObj.init(500000),
} as const;

type TestReqs = {
  addSection: NextReq<"addSection">;
  updateSection: NextReq<"updateSection">;
};
function makeReqs(): TestReqs {
  let next = Analyzer.initAnalyzer();
  const { feInfo } = next.lastSection(sectionName);
  next = next.updateSectionValuesAndSolve(feInfo, originalValues);
  const addSectionReq = next.req.addIndexStoreSection(feInfo);
  next = next.updateSectionValuesAndSolve(feInfo, updatedValues);
  return {
    addSection: addSectionReq,
    updateSection: next.req.addIndexStoreSection(feInfo),
  };
}

describe(apiEndpoints.addSection.pathRoute, () => {
  let reqs: TestReqs;
  let server: Server;
  let token: string;

  beforeEach(async () => {
    reqs = makeReqs();
    server = runApp();
    token = loginUtils.dummyUserAuthToken();
  });

  const exec = async () => {
    await request(server)
      .post(apiEndpoints.addSection.pathRoute)
      .set(config.tokenKey.apiUserAuth, token)
      .send(reqs.addSection.body);

    return await request(server)
      .post(apiEndpoints.updateSection.pathRoute)
      .set(config.tokenKey.apiUserAuth, token)
      .send(reqs.updateSection.body);
  };

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }

  afterEach(async () => {
    await UserModelNext.deleteMany();
    server.close();
  });

  it("should return 401 if client is not logged in", async () => {
    token = null as any;
    await testStatus(401);
  });
  it("should return 500 if payload is not an object", async () => {
    reqs.updateSection.body.payload = null as any;
    await testStatus(500);
  });
  describe("entering data", () => {
    beforeEach(async () => {
      const userDoc = await userServerSideNext.entireMakeUserProcess(
        makeRegisterPayload()
      );
      await userDoc.save();
      token = serverSideLogin.makeUserAuthToken(userDoc._id.toHexString());
    });
    it("should return 200 if everything is ok", async () => {
      await testStatus(200);
    });
    it("should return 404 if there is not an entry in the db with the payload's dbId", async () => {
      reqs.updateSection.body.payload.dbId = Id.make();
      await testStatus(404);
    });
  });
});
