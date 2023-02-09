import { BsLightningFill } from "react-icons/bs";
import styled from "styled-components";
import { useToggleViewNext } from "../../../../modules/customHooks/useToggleView";
import { useMainSectionActor } from "../../../../modules/sectionActorHooks/useMainSectionActor";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import theme from "../../../../theme/Theme";
import { DropdownList } from "../../DropdownList";
import { ActionMenuBtn } from "./StoreSectionActionMenu/ActionMenuBtn";
import {
  useActionMenuBtns,
  useDefaultActionLists,
} from "./StoreSectionActionMenu/ActionMenuButtons";
import {
  ActionMenuProps,
  MenuActionName,
} from "./StoreSectionActionMenu/ActionMenuTypes";

interface Props<SN extends SectionNameByType<"hasIndexStore">>
  extends ActionMenuProps {
  dropTop?: boolean;
  sectionName: SN;
  feId: string;
  className?: string;
  loadWhat: string;
}

export function StoreSectionActionMenu<
  SN extends SectionNameByType<"hasIndexStore">
>({
  dropTop,
  className,
  sectionName,
  feId,
  loadWhat,
  ...menuListProps
}: Props<SN>) {
  const feInfo = { sectionName, feId };
  const mainSection = useMainSectionActor(feInfo);

  const controller = useToggleViewNext("list", false);
  const buttons = useActionMenuBtns({
    ...feInfo,
    loadWhat,
    onLoad: controller.closeList,
  });

  function btnProps(actionName: MenuActionName) {
    return {
      ...feInfo,
      loadWhat,
      onLoad: controller.closeList,
      actionName,
      key: actionName,
    };
  }

  const defaultActionLists = useDefaultActionLists();
  const { alwaysArr, isNotSavedArr, isSavedArr } = {
    ...defaultActionLists,
    ...menuListProps,
  };
  return (
    <Styled
      {...{
        className: `StoreSectionActionMenu-root ${className ?? ""}`,
        title: `Actions`,
        icon: <BsLightningFill className="StoreActionMenu-dropdownBtnIcon" />,
        dropTop,
        controller: controller,
      }}
    >
      {!mainSection.isSaved &&
        isNotSavedArr.map((actionName) => (
          <ActionMenuBtn {...btnProps(actionName)} />
        ))}
      {mainSection.isSaved &&
        isSavedArr.map((actionName) => (
          <ActionMenuBtn {...btnProps(actionName)} />
        ))}
      {alwaysArr.map((actionName) => (
        <ActionMenuBtn {...btnProps(actionName)} />
      ))}
    </Styled>
  );
}

const Styled = styled(DropdownList)`
  position: relative;
  .ActionMenuButtons-signInToSave {
    color: ${theme["gray-700"]};
    background-color: ${theme.info.light};
  }
  .DropdownList-dropDownBtn {
    height: 25px;
    width: 152px;
  }

  .LabeledIconBtn-root {
    border-top: 1px solid ${theme["gray-500"]};
  }
`;
