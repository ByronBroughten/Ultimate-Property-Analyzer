import { Button } from "@material-ui/core";
import { rem } from "polished";
import { AiOutlineMenu } from "react-icons/ai";
import styled, { css } from "styled-components";
import { constants } from "../../Constants";
import { UserPlan } from "../../sharedWithServer/SectionsMeta/baseSections";
import { useAuthStatus } from "../../sharedWithServer/stateClassHooks/useAuthStatus";
import {
  useGetterSection,
  useGetterSectionOnlyOne,
} from "../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../theme/Theme";
import { StandardProps } from "../general/StandardProps";
import NavDropDown from "./NavDropDown";

function BtnDiv({ children, className }: StandardProps) {
  return <div className={`NavUserMenu-btnDiv ${className}`}>{children}</div>;
}

export type NavUserMenuProps = {
  feId: string;
  logout: () => void;
};
export function NavUserMenu({ feId, logout }: NavUserMenuProps) {
  const userInfo = useGetterSection({
    sectionName: "userInfo",
    feId,
  });

  const subInfo = useGetterSectionOnlyOne("subscriptionInfo");
  const subscriptionPlan = subInfo.valueNext("plan") as UserPlan;
  const isFullPlan = subscriptionPlan === "fullPlan";

  const authStatus = useAuthStatus();
  const userName = userInfo.value("userName", "string");
  return (
    <Styled
      {...{ $isFullPlan: isFullPlan }}
      btnText={
        <div className="NavUserMenu-nameDiv">
          {!constants.isBeta && <span>{userName}</span>}
          <AiOutlineMenu className="NavBar-menuIcon" />
        </div>
      }
    >
      <div className="NavUserMenu-dropdown">
        {/* 
          <BtnDiv>
            <Button href="/lists">{`Your lists`}</Button>
          </BtnDiv> */}
        {authStatus === "user" && (
          <>
            <BtnDiv>
              <Button href="/variables">{`Your variables`}</Button>
            </BtnDiv>
            <BtnDiv>
              <Button onClick={logout}>Logout</Button>
            </BtnDiv>
            {/* <BtnDiv>
                <Button href="/account" disabled>
                  Account Info
                </Button>
              </BtnDiv> */}
          </>
        )}
      </div>
    </Styled>
  );
}

const Styled = styled(NavDropDown)<{ $isFullPlan: boolean }>`
  display: flex;
  flex-direction: column;

  text-wrap: nowrap;

  .NavBar-menuIcon {
    margin-left: ${constants.isBeta ? "0px" : theme.s3};
    height: 24px;
    width: 24px;
  }

  .NavUserMenu-nameDiv {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .NavUserMenu-navBtn {
    ${({ $isFullPlan }) =>
      $isFullPlan &&
      !constants.isBeta &&
      false &&
      css`
        background-color: ${theme.property.main};
      `}

    min-height: ${theme.navBar.height};
    min-width: ${rem(50)};
    position: relative;
    z-index: 1;
  }

  .NavUserMenu-dropdown {
    position: relative;
    z-index: 0;
    width: 100%;
    background-color: ${theme.navBar.activeBtn};
    border-radius: 0 0 0 ${theme.br1};
    box-shadow: ${theme.boxShadow4};
  }
  .MuiButton-label {
    white-space: nowrap;
  }
  .NavUserMenu-btnDiv {
    width: 100%;
    .MuiButtonBase-root {
      width: 100%;
      border-radius: 0;

      display: flex;
      justify-content: flex-start;
      padding: ${theme.s3};
      font-size: 1rem;
      :hover,
      :focus {
        background-color: ${theme.error.light};
        color: ${theme.next.dark};
      }

      .MuiTouchRipple-root {
        visibility: hidden;
      }
    }
  }
`;
