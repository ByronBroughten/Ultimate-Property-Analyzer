import { ChildName } from "../sectionChildrenDerived/ChildName";
import { SectionName } from "../SectionName";
import { StateValue } from "../values/StateValue";
import {
  LeftRightPropCalcName,
  NumPropCalcName,
} from "../values/StateValue/valuesShared/calculations";
import { valueMetas } from "../values/valueMetas";
import { ValueName } from "../values/ValueName";
import { getUpdateFnNames } from "./updateVarb/UpdateFnName";
import {
  collectUpdateFnSwitchProps,
  UpdateFnProp,
  updateFnPropS,
} from "./updateVarb/UpdateFnProps";
import { collectOverrideSwitchProps } from "./updateVarb/UpdateOverrides";
import { UpdateProps, updatePropsS } from "./updateVarb/UpdateProps";

export interface GeneralUpdateVarb extends UpdateProps {
  valueName: ValueName;
  initValue: StateValue;
}

export interface UpdateVarb<VN extends ValueName>
  extends GeneralUpdateVarb,
    UpdateProps {
  valueName: VN;
  initValue: StateValue<VN>;
}
const checkUpdateVarb = <VN extends ValueName, T extends UpdateVarb<VN>>(
  _: VN,
  value: T
): T => value;

function defaultUpdateVarb<VN extends ValueName>(
  valueName: VN
): UpdateVarb<VN> {
  const valueMeta = valueMetas[valueName];
  return checkUpdateVarb(valueName, {
    valueName,
    initValue: valueMeta.initDefault() as StateValue<VN>,
    updateFnName: getUpdateFnNames(valueName)[0],
    updateFnProps: {},
    updateOverrides: [],
  });
}

export function updateVarb<VN extends ValueName>(
  valueName: VN,
  partial: Partial<UpdateVarb<VN>> = {}
): UpdateVarb<VN> {
  const { updateFnProps, updateOverrides, ...rest }: UpdateVarb<VN> = {
    ...defaultUpdateVarb(valueName),
    ...partial,
  };
  return {
    ...rest,
    updateOverrides: collectOverrideSwitchProps(updateOverrides),
    updateFnProps: collectUpdateFnSwitchProps(updateFnProps),
  };
}

export type UpdateVarbOptions<VN extends ValueName> = Partial<UpdateVarb<VN>>;

export type LeftRightUpdateProps = [UpdateFnProp, UpdateFnProp];
export const updateVarbS = {
  get displayNameEditor() {
    return updateVarb("string", updatePropsS.simple("manualUpdateOnly"));
  },
  one() {
    return updateVarb("number", {
      updateFnName: "numberOne",
      initValue: 1,
    });
  },
  sumNums(
    nums: UpdateFnProp[],
    options?: UpdateVarbOptions<"numObj">
  ): UpdateVarb<"numObj"> {
    return updateVarb("numObj", {
      ...updatePropsS.sumNums(nums),
      ...options,
    });
  },
  sumChildNums<SN extends SectionName, CN extends ChildName<SN>>(
    childName: CN,
    varbName: string
  ) {
    return this.sumNums([
      updateFnPropS.children(childName as ChildName, varbName),
    ]);
  },
  singlePropFn(
    updateFnName: NumPropCalcName,
    num: UpdateFnProp,
    options?: UpdateVarbOptions<"numObj">
  ): UpdateVarb<"numObj"> {
    return updateVarb("numObj", {
      ...updatePropsS.singlePropCalc(updateFnName, num),
      ...options,
    });
  },
  leftRightPropFn(
    updateFnName: LeftRightPropCalcName,
    leftRight: LeftRightUpdateProps,
    options?: UpdateVarbOptions<"numObj">
  ): UpdateVarb<"numObj"> {
    const [left, right] = leftRight;
    return updateVarb("numObj", {
      ...updatePropsS.leftRightPropCalc(updateFnName, left, right),
      ...options,
    });
  },
};
