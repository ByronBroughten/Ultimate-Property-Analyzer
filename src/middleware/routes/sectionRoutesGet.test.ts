import Analyzer from "../../client/src/App/sharedWithServer/Analyzer";
import {
  authTokenKey,
  Req,
} from "../../client/src/App/sharedWithServer/User/crudTypes";
import { runApp } from "../../runApp";
import { sectionRoutes } from "./sectionRoutes";
import { serverSideUser, UserModel } from "./shared/severSideUser";
import { serverSideLogin } from "./userRoutes/shared/doLogin";
import request from "supertest";
import { urlPlusParams } from "../../client/src/App/utils/url";
import { config } from "../../client/src/App/Constants";

describe("get section", () => {
  const sectionName = "propertyDefault";
  let analyzer: Analyzer;
  let req: Req<"GetSection">;
  let server: any;
  let token: string;

  const exec = () => {
    const route = urlPlusParams(
      sectionRoutes.route,
      req.params,
      config.url.section.params.get
    );
    return request(server).get(route).set(authTokenKey, token).send();
  };

  async function testStatus(statusNumber: number) {
    const res = await exec();
    expect(res.status).toBe(statusNumber);
  }

  beforeEach(async () => {
    analyzer = Analyzer.initAnalyzer();
    analyzer = analyzer.updateSectionValuesAndSolve("register", {
      email: "testosis@gmail.com",
      password: "testpassword",
      userName: "Testosis",
    }); // I need the dbId, so I must put a section with a dbId into UserModel, first
    const { dbId } = analyzer.section(sectionName);
    req = analyzer.req.getSection(sectionName, dbId);
    server = runApp();
    const registerReq = analyzer.req.register();
    const userDoc = await serverSideUser.full(registerReq.body.payload);
    await userDoc.save();
    const userId = userDoc._id.toHexString();
    token = serverSideLogin.makeUserAuthToken(userId);
  });

  afterEach(async () => {
    await UserModel.deleteMany();
  });

  it("should return 200 if the request is valid", () => {
    testStatus(200);
  });
});
