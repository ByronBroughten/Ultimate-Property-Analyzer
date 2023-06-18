import React from "react";
import { VarbInfoTextProps } from "../../../varbLabels";
import { SectionVarbNames } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { useVarbInfoText } from "../customHooks/useVarbInfoText";
import { IconProps } from "../Icons";
import { LabelWithInfo } from "./LabelWithInfo";

export interface Props<SN extends SectionName>
  extends Partial<VarbInfoTextProps> {
  names: SectionVarbNames<SN>;
  iconProps?: IconProps;
  label?: React.ReactNode;
}

export function VarbLabel<SN extends SectionName>({
  names,
  iconProps,
  label,
}: Props<SN>) {
  const value = useVarbInfoText(names);
  return (
    <LabelWithInfo
      {...{
        iconProps,
        label: label || value.inputLabel,
        infoTitle: value.title,
        infoText: value.info,
      }}
    />
  );
}
