import { constants } from "../../Constants";
import { Id } from "../SectionsMeta/IdS";
import { StoreName, validateStoreName } from "../SectionsMeta/sectionStores";
import { Str } from "../utils/Str";

export const StoreId = {
  get storeIdSplitter() {
    return constants.compoundIdSpliter;
  },
  make(storeName: StoreName, feId: string) {
    return `${storeName}${this.storeIdSplitter}${feId}`;
  },
  split(storeId: string): {
    storeName: StoreName;
    feId: string;
  } {
    const [storeName, feId] = storeId.split(this.storeIdSplitter);
    return { storeName: storeName as StoreName, feId };
  },
  validate(value: any): string {
    const str = Str.validate(value);
    const { storeName, feId } = this.split(str);
    validateStoreName(storeName);
    Id.validate(feId);
    return str;
  },
};
