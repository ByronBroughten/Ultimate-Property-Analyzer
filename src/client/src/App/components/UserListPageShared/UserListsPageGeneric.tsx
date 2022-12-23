import React from "react";
import styled, { css } from "styled-components";
import theme, { ThemeName } from "../../theme/Theme";
import { PageMain } from "../general/PageMain";

type Props = {
  themeName: ThemeName;
  saveWhat: string;
  children: React.ReactNode;
};
export function UserListsPageGeneric({ themeName, children }: Props) {
  return (
    <Styled $themeName={themeName}>
      <div className="UserListsPageGeneric-children">{children}</div>
    </Styled>
  );
}

const Styled = styled(PageMain)<{ $themeName: ThemeName }>`
  ${({ $themeName }) => css`
    background: ${theme[$themeName].light};
  `}

  .UserListsGeneralSection-root {
    :first-child {
      .GeneralSectionTitle-root {
        padding-top: ${theme.s1};
      }
    }
  }

  .UserListsPageGeneric-notLoggedIn {
    display: flex;
    justify-content: center;
    .UserListsPageGeneric-notLoggedInInner {
      margin: ${theme.s3};
    }
  }
  .UserListsPageGeneric-notLoggedInInner {
    color: ${theme.dark};
    padding: ${theme.s3};
    border-radius: ${theme.br0};
    font-size: 18px;
    font-weight: 700;
  }
`;