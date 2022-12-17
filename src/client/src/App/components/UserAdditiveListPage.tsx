import React from "react";
import styled from "styled-components";
import theme from "../theme/Theme";
import { VarbListSingleTime } from "./appWide/ListGroup/ListGroupSingleTime/VarbListSingleTime";
import { VarbListOngoing } from "./appWide/VarbLists/VarbListOngoing";
import { NavContainer } from "./general/NavContainer";
import { UserListsPageGeneric } from "./UserListPageShared/UserListsPageGeneric";
import { UserListsGeneralSection } from "./UserVarbListPage/UserListsGeneralSection";

// Can this page be reduced to one state?
export function UserAdditiveListPage() {
  return (
    <NavContainer activeBtnName="lists">
      <Styled themeName="userOngoingList" saveWhat="custom lists">
        <UserListsGeneralSection
          themeName="userSingleList"
          storeName="singleTimeListMain"
          title="One time cost lists"
          makeListNode={(nodeProps) => (
            <VarbListSingleTime {...{ ...nodeProps, menuType: "simple" }} />
          )}
        />
        <UserListsGeneralSection
          themeName="userOngoingList"
          storeName="ongoingListMain"
          title="Ongoing cost lists"
          makeListNode={(nodeProps) => (
            <VarbListOngoing {...{ ...nodeProps, menuType: "simple" }} />
          )}
        />
      </Styled>
    </NavContainer>
  );
}

const Styled = styled(UserListsPageGeneric)`
  .UserListMainSection-root {
    .SectionTitle-root {
      color: ${theme.loan.dark};
    }
  }
`;
