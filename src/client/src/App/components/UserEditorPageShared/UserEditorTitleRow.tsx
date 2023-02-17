import React from "react";
import { AiOutlineSave } from "react-icons/ai";
import { VscDiscard } from "react-icons/vsc";
import styled from "styled-components";
import { SnFeUserChildNames } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/FeStoreName";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";
import { useAuthStatus } from "../../sharedWithServer/stateClassHooks/useAuthStatus";
import { ExclaimBlurb } from "../appWide/ExclaimBlurb";
import { SectionTitleRow } from "../appWide/GeneralSection/MainSection/SectionTitleRow";
import { ListMenuBtn } from "../appWide/ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";
import { SectionTitle } from "../appWide/SectionTitle";
import theme from "./../../theme/Theme";
import { useSaveEditorToDb } from "./useSaveEditorToDb";

type Props<SN extends SectionName> = {
  titleText: React.ReactNode;
  sectionName: SN;
  childNames: SnFeUserChildNames<SN>[];
};
export function UserEditorTitleRow<SN extends SectionName>({
  titleText,
  sectionName,
  childNames,
}: Props<SN>) {
  const authStatus = useAuthStatus();
  const { saveChanges, discardChanges, areSaved } = useSaveEditorToDb(
    sectionName,
    childNames
  );
  return (
    <Styled className="UserEditorTitleRow-root">
      <SectionTitleRow
        className="UserListMainSection-sectionTitle"
        leftSide={
          <div className="UserListMainSection-btnsRow">
            <SectionTitle
              className="UserEditorTitleRow-sectionTitle"
              text={titleText}
            />
            <ListMenuBtn
              {...{
                text: "Save and Apply Changes",
                onClick: saveChanges,
                icon: <AiOutlineSave size="25" />,
                disabled: authStatus === "guest" || areSaved,
                className: "UserListMainSection-saveBtn",
              }}
            />
            <ListMenuBtn
              text="Discard Changes"
              onClick={discardChanges}
              icon={<VscDiscard />}
              disabled={areSaved}
              className="UserListMainSection-discardChanges"
            />
          </div>
        }
      />
      {authStatus === "guest" && (
        <ExclaimBlurb className="UserListMainSection-infoBlurb">
          Log in to save and apply changes.
        </ExclaimBlurb>
      )}
    </Styled>
  );
}

const Styled = styled.div`
  .UserListMainSection-infoBlurb {
    margin-top: ${theme.s3};
    margin-bottom: ${theme.s2};
  }
  .UserListMainSection-btnsRow {
    display: flex;
    align-items: center;
    .ListMenuBtn-root {
      height: 33px;
      margin: 0 ${theme.s2};
    }
  }
  .UserListMainSection-discardChanges {
    width: 150px;
  }

  .UserEditorTitleRow-sectionTitle {
    margin-right: ${theme.s2};
  }

  .UserListMainSection-saveBtn {
    width: 250px;
  }
`;
