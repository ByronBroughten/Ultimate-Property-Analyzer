import bcrypt from "bcrypt";
import { Response } from "express";
import mongoose from "mongoose";
import { constants } from "../../../../client/src/App/Constants";
import { FeUserSolver } from "../../../../client/src/App/modules/SectionSolvers/FeUserSolver";
import { LoginData } from "../../../../client/src/App/sharedWithServer/apiQueriesShared/getUserData";
import { SubscriptionValues } from "../../../../client/src/App/sharedWithServer/apiQueriesShared/SubscriptionValues";
import { makeDefaultFeUserTables } from "../../../../client/src/App/sharedWithServer/defaultMaker/makeDefaultFeUserTables";
import { SectionPack } from "../../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { FeSectionInfo } from "../../../../client/src/App/sharedWithServer/SectionsMeta/Info";
import {
  FeUserDbIndex,
  FeUserTableName,
  relChildSections,
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/relChildSections";
import {
  FeStoreNameByType,
  feStoreNameS,
} from "../../../../client/src/App/sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/feStoreNameArrs";
import { sectionNameS } from "../../../../client/src/App/sharedWithServer/SectionsMeta/SectionNameByType";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../../../client/src/App/sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../../../client/src/App/sharedWithServer/StateGetters/GetterSection";
import { PackBuilderSection } from "../../../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { Arr } from "../../../../client/src/App/sharedWithServer/utils/Arr";
import { timeS } from "../../../../client/src/App/sharedWithServer/utils/date";
import { stripeS } from "../../../../client/src/App/sharedWithServer/utils/stripe";
import { HandledResStatusError } from "../../../../utils/resError";
import { isProEmail } from "../../../routeUtils/proList";
import { DbSections } from "./DbSections";
import { DbUser } from "./DbUser";
import { DbSectionsRaw, DbUserSpecifierType } from "./DbUserTypes";
import {
  checkUserAuthToken,
  createUserInfoToken,
} from "./LoadedDbUser/userAuthToken";

interface DbUserProps extends GetterSectionProps<"dbStore"> {
  dbSections: DbSections;
}

export class LoadedDbUser extends GetterSectionBase<"dbStore"> {
  readonly dbSections: DbSections;
  constructor({ dbSections, ...rest }: DbUserProps) {
    super(rest);
    this.dbSections = dbSections;
  }
  get dbSectionsRaw(): DbSectionsRaw {
    return this.dbSections.dbSectionsRaw;
  }
  get userId(): string {
    const userId = this.dbSectionsRaw._id as mongoose.Types.ObjectId;
    if (!(userId instanceof mongoose.Types.ObjectId))
      throw new Error(`userId "${userId}" is not valid.`);
    return userId.toHexString();
  }
  get authId(): string {
    const authInfo = this.get.onlyChild("authInfoPrivate");
    return authInfo.value("authId", "string");
  }
  get customerId(): string {
    const stripeInfoPrivate = this.get.onlyChild("stripeInfoPrivate");
    return stripeInfoPrivate.value("customerId", "string");
  }
  get email(): string {
    return this.userInfo.value("email", "string");
  }
  static async getBy(
    specifierType: DbUserSpecifierType,
    specifier: string
  ): Promise<LoadedDbUser> {
    const dbUser = await DbUser.initBy(specifierType, specifier);
    return dbUser.loadedDbUser();
  }
  static async queryByEmail(email: string): Promise<LoadedDbUser> {
    const dbUser = await DbUser.initByEmail(email);
    return dbUser.loadedDbUser();
  }
  get get(): GetterSection<"dbStore"> {
    return new GetterSection(this.getterSectionProps);
  }
  get userInfo(): GetterSection<"userInfo"> {
    return this.get.onlyChild("userInfo");
  }
  get subscriptionValues(): SubscriptionValues {
    if (isProEmail(this.email)) {
      return {
        subscriptionPlan: "fullPlan",
        planExp: timeS.now() + timeS.oneDay,
      };
    }

    const subscriptions = this.get.children("stripeSubscription");
    let subscriptionValues: SubscriptionValues = {
      subscriptionPlan: "basicPlan",
      planExp: timeS.hundredsOfYearsFromNow,
    };

    const now = timeS.now();
    for (const sub of subscriptions) {
      const values = sub.values({
        subId: "string",
        status: "string",
        priceIds: "stringArray",
        currentPeriodEnd: "number",
      });
      const { priceIds, currentPeriodEnd } = values;
      if (
        stripeS.isActiveSubStatus(values.status) &&
        currentPeriodEnd > now &&
        currentPeriodEnd > subscriptionValues.planExp
      ) {
        const actives = Arr.findAll(constants.stripePrices, (subConfig) => {
          return priceIds.includes(subConfig.priceId);
        });
        const activePro = actives.find((active) => {
          active.product === "proPlan";
        });
        if (activePro) {
          subscriptionValues = {
            subscriptionPlan: "fullPlan",
            planExp: values.currentPeriodEnd,
          };
        }
      }
    }
    return subscriptionValues;
  }
  get userInfoPrivate(): GetterSection<"userInfoPrivate"> {
    return this.get.onlyChild("userInfoPrivate");
  }
  async validatePassword(attemptedPassword: string): Promise<void> {
    const encryptedPassword = this.userInfoPrivate.value(
      "encryptedPassword",
      "string"
    );
    const isValid = await bcrypt.compare(attemptedPassword, encryptedPassword);
    if (!isValid) {
      throw new HandledResStatusError({
        resMessage: "That password is incorrect.",
        status: 400,
      });
    }
  }
  makeFeUserTablePack(tableName: FeUserTableName): SectionPack<"compareTable"> {
    const tables = makeDefaultFeUserTables();
    const tablePack = tables[tableName]();
    const table = PackBuilderSection.loadAsOmniChild(tablePack);
    const { dbIndexName } = relChildSections.feUser[tableName];

    const sources = this.get.children(dbIndexName);
    const columns = table.get.children("column");
    for (const source of sources) {
      const displayName = source.valueNext("displayName").mainText;
      const row = table.addAndGetChild("tableRow", {
        dbId: source.dbId,
        dbVarbs: { displayName },
      });
      for (const column of columns) {
        const varb = source.varbByFocalMixed(column.valueInEntityInfo());
        row.addChild("cell", {
          dbId: column.dbId,
          dbVarbs: {
            displayVarb: varb.displayVarb(),
            valueEntityInfo: column.valueInEntityInfo(),
          },
        });
      }
    }
    return table.makeSectionPack();
  }
  makeLoginUser(activeDealPack: SectionPack<"deal">): LoginData {
    const feUser = FeUserSolver.initDefault();
    for (const feStoreName of feUser.get.childNames) {
      if (feStoreNameS.is(feStoreName, "displayStoreName")) {
        const dbIndexName = this.displayToDbStoreName(feStoreName);
        const sources = this.get.children(dbIndexName);
        feUser.loadDisplayStoreList(feStoreName, sources);
      } else if (feStoreNameS.is(feStoreName, "fullIndex")) {
        feUser.packBuilder.loadChildren({
          childName: feStoreName,
          sectionPacks: this.dbSections.sectionPackArr(feStoreName),
        });
      } else if (feStoreName === "subscriptionInfo") {
        const { subscriptionPlan, planExp } = this.subscriptionValues;
        feUser.loadSubscriptionInfo({
          plan: subscriptionPlan,
          planExp,
        });
      }
    }
    this.initActiveAsSaved(feUser, activeDealPack);
    return {
      feUser: [feUser.packBuilder.makeSectionPack()],
    };
  }
  displayToDbStoreName<SN extends FeStoreNameByType<"displayStoreName">>(
    sectionName: SN
  ): FeUserDbIndex<SN> {
    const relFeUser = relChildSections.feUser;
    const { dbIndexName } = relFeUser[sectionName];
    return dbIndexName;
  }
  initActiveAsSaved(feUser: FeUserSolver, activeDealPack: SectionPack<"deal">) {
    const headSection = PackBuilderSection.loadAsOmniChild(activeDealPack);
    const { sections } = headSection;
    let sectionInfos: FeSectionInfo[] = [headSection.feInfo];
    while (sectionInfos.length > 0) {
      const nextInfos: FeSectionInfo[] = [];
      for (const { sectionName, feId } of sectionInfos) {
        const section = sections.section({ sectionName, feId });
        if (sectionNameS.is(sectionName, "hasDisplayIndex")) {
          const { displayIndexName } =
            headSection.sectionsMeta.get(sectionName);
          const displayIndexSolver =
            feUser.displayIndexSolver(displayIndexName);
          if (displayIndexSolver.hasByDbId(section.get.dbId)) {
            const child = this.get.childByDbId({
              childName: this.displayToDbStoreName(displayIndexName),
              dbId: section.get.dbId,
            });
            displayIndexSolver.addAsSavedIfNot(
              child.packMaker.makeSectionPack()
            );
          }
        }
        for (const childName of section.get.childNames) {
          for (const child of section.children(childName)) {
            nextInfos.push(child.feInfo);
          }
        }
      }
      sectionInfos = nextInfos;
    }
  }

  createUserInfoToken(subscriptionValues?: SubscriptionValues): string {
    return createUserInfoToken({
      userId: this.userId,
      ...this.subscriptionValues,
      ...subscriptionValues,
    });
  }
  setResTokenHeader(res: Response): void {
    const token = this.createUserInfoToken();
    LoadedDbUser.setResTokenHeader(res, token);
  }
  static setResTokenHeader(res: Response, token: string): void {
    res.header(constants.tokenKey.apiUserAuth, token);
  }

  sendLogin(res: Response, activeDealPack: SectionPack<"deal">): void {
    const loggedInUser = this.makeLoginUser(activeDealPack);
    this.setResTokenHeader(res);
    res.status(200).send(loggedInUser);
  }
  static checkUserAuthToken = checkUserAuthToken;
}
