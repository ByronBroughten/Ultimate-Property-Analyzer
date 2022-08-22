import { FaList } from "react-icons/fa";
import { FeInfoByType } from "../../sharedWithServer/SectionsMeta/Info";
import { useAuthStatus } from "../../sharedWithServer/stateClassHooks/useAuthStatus";
import { DropdownList } from "./DropdownList";
import { RowIndexRows } from "./RowIndexRows";

type Props = {
  feInfo: FeInfoByType<"hasDisplayIndex">;
  pluralName: string;
  disabled: boolean;
  className?: string;
  dropTop?: boolean;
};

export default function DisplayNameSectionList({
  feInfo,
  dropTop = false,
  className,
  pluralName,
}: Props) {
  const authStatus = useAuthStatus();
  const noEntriesMessage =
    authStatus === "guest"
      ? `Sign in to access saved ${pluralName}`
      : "None saved";
  return (
    <DropdownList
      {...{
        className: "MainsectionTitleRow-dropdownList " + className ?? "",
        title: `Saved`,
        dropTop,
        icon: <FaList className="DisplayNameSectionList-listIcon" />,
      }}
    >
      <RowIndexRows feInfo={feInfo} noEntriesMessage={noEntriesMessage} />
    </DropdownList>
  );
}