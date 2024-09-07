import { SxProps } from "@mui/material";
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { FeVarbInfo } from "../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { useAction } from "../../../stateHooks/useAction";
import { useGetterVarb } from "../../../stateHooks/useGetterVarb";
import { Toggler } from "../../general/Toggler";

export interface TogglerBooleanVarbProps {
  feVarbInfo: FeVarbInfo;

  label: React.ReactNode;
  name?: string;
  onChange?: (nextValue?: boolean) => void;
  editorMargins?: boolean;
  className?: string;
  sx?: SxProps;
}

export function TogglerBooleanVarb({
  feVarbInfo,
  onChange,
  editorMargins,
  ...rest
}: TogglerBooleanVarbProps) {
  const updateValue = useAction("updateValue");
  const boolVarb = useGetterVarb(feVarbInfo);
  const checked = boolVarb.value("boolean");
  return (
    <Toggler
      {...{
        ...rest,
        editorMargins,
        checked,
        onChange: () => {
          unstable_batchedUpdates(() => {
            const nextValue = !checked;
            updateValue({
              ...feVarbInfo,
              value: nextValue,
            });
            onChange && onChange(nextValue);
          });
        },
      }}
    />
  );
}