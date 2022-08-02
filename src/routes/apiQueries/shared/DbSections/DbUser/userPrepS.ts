import bcrypt from "bcrypt";
import { RegisterFormData } from "../../../../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { dbStoreNames } from "../../../../../client/src/App/sharedWithServer/SectionsMeta/childSectionsDerived/DbStoreName";
import { PackBuilderSection } from "../../../../../client/src/App/sharedWithServer/StatePackers.ts/PackBuilderSection";
import { makeMongooseObjectId } from "../../../../../client/src/App/sharedWithServer/utils/mongoose";
import { ResStatusError } from "../../../../../resErrorUtils";
import { DbSectionsModel, RawDbUser } from "../../../../DbSectionsModel";
import { DbSectionsRaw } from "../DbSectionsQuerierTypes";
import { QueryUser } from "../QueryUser";
import {
  initEmptyNames,
  InitEmptyPackArrs,
  InitialUserSectionPackArrs,
  MakeDbUserProps,
  PreppedEmails,
  UserSectionPackArrs,
} from "./userPrepSTypes";

export const userPrepS = {
  async encryptPassword(unencrypted: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(unencrypted, salt);
  },
  processEmail(rawEmail: string): PreppedEmails {
    const emailAsSubmitted = rawEmail.trim();
    const email = emailAsSubmitted.toLowerCase();
    return {
      emailAsSubmitted,
      email,
    };
  },
  async checkThatEmailIsUnique(email: string): Promise<void> {
    if (await QueryUser.existsByEmail(email)) {
      throw new ResStatusError({
        errorMessage: `An account with the email ${email} already exists.`,
        resMessage: "An account with that email already exists",
        status: 400,
      });
    }
  },
  async initUserSectionPacks(
    registerFormData: RegisterFormData
  ): Promise<UserSectionPackArrs> {
    const { email, emailAsSubmitted } = userPrepS.processEmail(
      registerFormData.email
    );
    await userPrepS.checkThatEmailIsUnique(email);
    return {
      userInfo: [
        PackBuilderSection.initSectionPack("userInfo", {
          dbVarbs: {
            userName: registerFormData.userName,
            email,
          },
        }),
      ],
      dbOnlyUserInfo: [
        PackBuilderSection.initSectionPack("dbOnlyUserInfo", {
          dbVarbs: {
            emailAsSubmitted,
            encryptedPassword: await userPrepS.encryptPassword(
              registerFormData.password
            ),
          },
        }),
      ],
      stripeInfoPrivate: [
        PackBuilderSection.initSectionPack("stripeInfoPrivate", {
          dbVarbs: {
            customerId: "",
          },
        }),
      ],
    };
  },
  makeEmptyRawDbUser(): RawDbUser {
    return dbStoreNames.reduce((rawDbUser, dbStoreName) => {
      rawDbUser[dbStoreName] = [];
      return rawDbUser;
    }, {} as RawDbUser);
  },
  initRawDbUser(props: SignUpData): RawDbUser {
    return {
      ...this.makeEmptyRawDbUser(),
      ...this.initUserSectionPackArrs(props),
    };
  },

  async initUserInDb(props: SignUpData) {
    const dbUserModel = new DbSectionsModel(this.initRawDbUser(props));
    await dbUserModel.save();
  },
  initUserSectionPackArrs({
    userId,
    email,
    userName,
    timeJoined,
  }: SignUpData): InitialUserSectionPackArrs {
    return {
      userInfo: [
        PackBuilderSection.initSectionPack("userInfo", {
          dbVarbs: {
            userName,
            email,
            timeJoined,
          },
        }),
      ],
      authInfoPrivate: [
        PackBuilderSection.initSectionPack("authInfoPrivate", {
          dbVarbs: { userId },
        }),
      ],
      stripeInfoPrivate: [
        PackBuilderSection.initSectionPack("stripeInfoPrivate", {
          dbVarbs: {
            customerId: "",
          },
        }),
      ],
    };
  },

  makeDbSectionsRaw({
    _id = makeMongooseObjectId(),
    ...sections
  }: MakeDbUserProps): DbSectionsRaw {
    const emptySectionArrs = initEmptyNames.reduce((packArrs, sectionName) => {
      packArrs[sectionName] = [];
      return packArrs;
    }, {} as InitEmptyPackArrs);

    return new DbSectionsModel({
      _id,
      ...sections,
      ...emptySectionArrs,
    });
  },
};

export type SignUpData = {
  userId: string;
  email: string;
  userName: string;
  timeJoined: number;
};
