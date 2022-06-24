import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {
  GuestAccessSectionsNext,
  RegisterFormData,
  RegisterReqBody,
} from "../../client/src/App/sharedWithServer/apiQueriesShared/register";
import { sectionPackS } from "../../client/src/App/sharedWithServer/SectionPack/SectionPack";
import { BaseSectionsDb } from "../../client/src/App/sharedWithServer/SectionsMeta/baseSectionTypes";
import { SchemaVarbsToDbValues } from "../../client/src/App/sharedWithServer/SectionsMeta/relSections/rel/valueMetaTypes";
import { makeMongooseObjectId } from "../../client/src/App/sharedWithServer/utils/mongoose";
import { DbSectionsModel, UserDbRaw } from "../DbSectionsModel";
import { serverSectionS } from "../ServerSectionName";

export const userServerSide = {
  prepEmail(rawEmail: string): PreppedEmails {
    return {
      emailAsSubmitted: rawEmail.trim(),
      get email() {
        return this.emailAsSubmitted.toLowerCase();
      },
    } as const;
  },
  async makeUserSections(
    registerFormData: RegisterFormData
  ): Promise<UserSections> {
    const { userName, email: rawEmail, password } = registerFormData;
    const { email, emailAsSubmitted } = this.prepEmail(rawEmail);
    return {
      user: {
        userName,
        email,
        apiAccessStatus: "basicStorage",
      },
      serverOnlyUser: {
        emailAsSubmitted,
        encryptedPassword: await encryptPassword(password),
      },
    };
  },
  makeDbUser({
    user,
    serverOnlyUser,
    guestAccessSections,
  }: MakeDbUserProps): UserDbRaw {
    const partial: Partial<UserDbRaw> = {
      ...guestAccessSections,
      user: [sectionPackS.init({ sectionName: "user", dbVarbs: user })],
      serverOnlyUser: [
        sectionPackS.init({
          sectionName: "serverOnlyUser",
          dbVarbs: serverOnlyUser,
        }),
      ],
    };
    for (const storeName of serverSectionS.arrs.all) {
      if (!(storeName in partial)) partial[storeName] = [];
    }

    return partial as UserDbRaw;
  },
  makeMongoUser({ _id, ...makeUserProps }: MakeMongoUserProps) {
    return new DbSectionsModel({
      _id: _id ?? makeMongooseObjectId(),
      ...this.makeDbUser(makeUserProps),
    });
  },
  makeDbAndMongoUser({ _id, ...makeUserProps }: MakeMongoUserProps) {
    const dbUser = this.makeDbUser(makeUserProps);
    const mongoUser = new DbSectionsModel({
      _id: _id ?? makeMongooseObjectId(),
      ...dbUser,
    });
    return {
      dbUser,
      mongoUser,
    };
  },
  async entireMakeUserProcess({
    _id,
    registerFormData,
    guestAccessSections,
  }: RegisterReqBody & { _id?: mongoose.Types.ObjectId }): Promise<
    UserDbRaw & mongoose.Document<any, UserDbRaw>
  > {
    const dbSections = await this.makeUserSections(registerFormData);
    const userDoc = this.makeMongoUser({
      ...dbSections,
      guestAccessSections,
      _id,
    });
    await userDoc.save();
    return userDoc;
  },
};

interface MakeMongoUserProps extends MakeDbUserProps {
  _id?: mongoose.Types.ObjectId;
}

export interface MakeDbUserProps extends UserSections {
  guestAccessSections: GuestAccessSectionsNext;
}
interface UserSections {
  user: SharedUser;
  serverOnlyUser: ServerUser;
}

type SharedUser = SchemaVarbsToDbValues<SharedUserVarbs>;
type ServerUser = SchemaVarbsToDbValues<ServerOnlyUserVarbs>;

type SharedUserVarbs = BaseSectionsDb["user"]["varbSchemas"];
type ServerOnlyUserVarbs = BaseSectionsDb["serverOnlyUser"]["varbSchemas"];

type PreppedEmails = {
  emailAsSubmitted: string;
  email: string;
};

async function encryptPassword(unencrypted: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(unencrypted, salt);
}
