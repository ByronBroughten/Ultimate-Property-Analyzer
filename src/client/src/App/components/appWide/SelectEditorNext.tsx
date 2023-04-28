import { Box, SxProps } from "@mui/material";
import React from "react";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { UnionValueName } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { nativeTheme } from "../../theme/nativeTheme";
import { arrSx } from "../../utils/mui";
import { MuiSelect, MuiSelectProps } from "./MuiSelect";

type MakeEditor = (props: {
  sx: SxProps;
  labeled: boolean;
  className: string;
}) => React.ReactNode;
export interface SelectEditorPropsNext<
  UVN extends UnionValueName,
  SN extends SectionName
> extends MuiSelectProps<UVN, SN> {
  className?: string;
  makeEditor?: MakeEditor;
  equalsValue?: string;
  rightOfControls?: React.ReactNode;
}

export function SelectEditorNext<
  UVN extends UnionValueName,
  SN extends SectionName
>({
  makeEditor,
  equalsValue,
  rightOfControls,
  label,
  className,
  sx,
  ...rest
}: SelectEditorPropsNext<UVN, SN>) {
  return (
    <Box
      {...{
        className: `SelectEditor-root ${className ?? ""}`,
        sx: [{ display: "flex" }, ...arrSx(sx)],
      }}
    >
      <MuiSelect
        {...{
          label,
          sx: {
            borderTopRightRadius: 0,
            borderRight: "none",
            "& .MuiInputBase-root": {
              borderTopRightRadius: 0,
            },
          },
          ...rest,
        }}
      />
      {makeEditor &&
        makeEditor({
          className: "SelectEditor-editor",
          labeled: false,
          sx: {
            "& .NumObjEditor-materialDraftEditor": {
              "& .MaterialDraftEditor-wrapper": {
                borderTopLeftRadius: 0,
                borderLeftWidth: 0,
              },
              "& .MuiInputBase-root": {
                minWidth: 50,
                borderTopLeftRadius: 0,
                ...(!label && {
                  pt: "8px",
                  pb: "8px",
                }),
                ...(label && {
                  pt: "20px",
                  pb: "4px",
                }),
              },
            },
          },
        })}
      {rightOfControls ?? null}
      {equalsValue && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            fontSize: "18px",
            flexWrap: "nowrap",
            whiteSpace: "nowrap",
            alignItems: "center",
            ml: nativeTheme.s2,
          }}
        >{`= ${equalsValue}`}</Box>
      )}
    </Box>
  );
}
