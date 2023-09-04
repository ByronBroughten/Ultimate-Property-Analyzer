import { Box, SxProps } from "@mui/material";
import { unstable_batchedUpdates } from "react-dom";
import { dealModeLabels } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useActionNoSave } from "../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { HollowBtn } from "../appWide/HollowBtn";
import { MuiSelect } from "../appWide/MuiSelect";
import { VarbStringLabel } from "../appWide/VarbStringLabel";
import { MuiRow } from "../general/MuiRow";

type Props = { sx?: SxProps };
export function NewDealSelector(props: Props) {
  return <NewDealSelectorAddDeal {...props} />;
}

function NewDealSelectorAddDeal({ sx }: Props) {
  const newDealMenu = useGetterSectionOnlyOne("newDealMenu");
  const session = useGetterSectionOnlyOne("sessionStore");
  const updateValue = useActionNoSave("updateValue");
  const setCreateDeal = () => {
    unstable_batchedUpdates(() => {
      updateValue({
        ...session.varbInfo("isCreatingDeal"),
        value: true,
      });
    });
  };

  return (
    <Box sx={sx}>
      <MuiRow sx={{ paddingLeft: nativeTheme.s25 }}>
        {/* <MuiRadioSelect
          {...{
            value: newDealMenu.valueNext("dealMode"),
            onChange: (e) => {
              updateValue({
                ...newDealMenu.varbInfo("dealMode"),
                value: validateStateValue(e.target.value, "dealMode"),
              });
            },
            items: [
              ["homeBuyer", dealModeLabels.homeBuyer],
              ["buyAndHold", dealModeLabels.buyAndHold],
              ["fixAndFlip", dealModeLabels.fixAndFlip],
              ["brrrr", dealModeLabels.brrrr],
            ],
          }}
        /> */}
        <MuiSelect
          {...{
            sx: { width: "100%", mt: nativeTheme.s3 },
            selectProps: { sx: { width: "100%" } },
            label: (
              <VarbStringLabel
                {...{
                  names: { sectionName: "deal", varbName: "dealMode" },
                  id: "new-deal-select-deal-type",
                }}
              />
            ),
            unionValueName: "dealMode",
            feVarbInfo: {
              ...newDealMenu.feInfo,
              varbName: "dealMode",
            },
            items: [
              ["homeBuyer", dealModeLabels.homeBuyer],
              ["buyAndHold", dealModeLabels.buyAndHold],
              ["fixAndFlip", dealModeLabels.fixAndFlip],
              ["brrrr", dealModeLabels.brrrr],
            ],
          }}
        />
        <HollowBtn
          sx={{
            mt: nativeTheme.s4,
            width: "100%",
            height: "50px",
            fontSize: nativeTheme.fs20,
          }}
          middle={"Create Deal"}
          onClick={setCreateDeal}
        />
      </MuiRow>
    </Box>
  );
}
