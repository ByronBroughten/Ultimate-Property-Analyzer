import { Box, SxProps } from "@mui/material";
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { nativeTheme } from "../../theme/nativeTheme";
import { StyledActionBtn } from "../appWide/GeneralSection/MainSection/StyledActionBtn";
import { MuiRow } from "../general/MuiRow";
import { useConfirmationModal } from "./ConfirmationModalProvider";
import { ModalSection } from "./ModalSection";

interface Props {
  modalWrapperProps?: { sx?: SxProps };
}
export function ConfirmationModal(props: Props) {
  const { modalState, setModal } = useConfirmationModal();
  const closeModal = () => setModal(null);
  // if (timeSet && timeSet < timeS.now() - 200) {
  //   setModal(null);
  // }

  return (
    <ModalSection
      {...{
        ...props,
        modalSectionProps: {
          sx: { border: `solid 2px ${nativeTheme.notice.dark}` },
        },
        titleSx: { color: nativeTheme.notice.dark },
        title: modalState?.title,
        show: Boolean(modalState),
        closeModal,
      }}
    >
      <Box sx={{ fontSize: nativeTheme.fs20 }}>{modalState?.description}</Box>
      <MuiRow
        sx={{
          fontSize: 20,
          paddingTop: nativeTheme.s3,
          justifyContent: "flex-end",
        }}
      >
        {modalState && (
          <StyledActionBtn
            {...{
              sx: { fontSize: nativeTheme.fs22 },
              middle: "Yes",
              isDangerous: true,
              ...(modalState && {
                onClick: () => {
                  unstable_batchedUpdates(() => {
                    modalState.handleSubmit();
                    closeModal();
                  });
                },
              }),
            }}
          />
        )}
        {modalState && (
          <StyledActionBtn
            {...{
              sx: {
                fontSize: nativeTheme.fs22,
                paddingLeft: nativeTheme.s5,
              },
              middle: "Cancel",
              onClick: closeModal,
            }}
          />
        )}
      </MuiRow>
    </ModalSection>
  );
}
