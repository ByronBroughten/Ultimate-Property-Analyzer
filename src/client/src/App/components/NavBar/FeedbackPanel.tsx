import styled from "styled-components";
import { constants } from "../../Constants";
import theme from "../../theme/Theme";
import { Bullet } from "../general/Bullet";
import { StandardProps } from "../general/StandardProps";
import { NavBarPanel } from "./NavBarPanel";

type Props = StandardProps;
export function FeedbackPanel() {
  return (
    <Styled>
      <div className="FeedbackPanel-welcome">
        <div className="FeedbackPanel-welcomeText">
          Bugs reports and feature
        </div>
        <div className="FeedbackPanel-welcomeText">
          suggestions are welcome!
        </div>
      </div>
      <Bullet
        text={
          <>
            <span className="Bullet-label">Email</span>
            <span>{constants.supportEmail}</span>
          </>
        }
        key="email"
      />
      <Bullet
        text={
          <>
            <span className="Bullet-label">Discord</span>
            <span>{constants.discordLink}</span>
          </>
        }
        key="discord"
      />
    </Styled>
  );
}

const Styled = styled(NavBarPanel)`
  width: 350px;
  border-radius: ${theme.br1};
  background-color: ${theme.loan.light};
  .Bullet-label {
    font-weight: 700;
    margin-right: ${theme.s2};
  }
  .FeedbackPanel-welcomeText {
    margin-bottom: ${theme.s2};
  }
  .FeedbackPanel-welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 18px;
  }

  .FeedbackPanel-Discord {
    margin-top: ${theme.s3};
  }

  .FeedbackPanel-email,
  .FeedbackPanel-Discord {
    margin-left: ${theme.s2};
  }
`;
