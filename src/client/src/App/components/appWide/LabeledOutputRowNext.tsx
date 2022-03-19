import styled from "styled-components";

import theme from "../../theme/Theme";
import { StandardProps } from "../general/StandardProps";

export default function LabeledOutputRowNext({
  className,
  children,
}: StandardProps) {
  return (
    <Styled className={`LabeledOutputRow-root ${className}`}>{children}</Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;

  padding-left: ${theme.s1};
  padding-right: ${theme.s1};
  .LabeledVarb-root {
    margin: ${theme.s2} ${theme.s1};
  }
`;