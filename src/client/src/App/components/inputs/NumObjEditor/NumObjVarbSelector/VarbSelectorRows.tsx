import styled from "styled-components";
import { SetEditorState } from "../../../../modules/draftjs/draftUtils";
import {
  getVarbPathExtras,
  VarbPathName,
} from "../../../../sharedWithServer/SectionsMeta/SectionInfo/VarbPathNameInfo";
import ccs from "../../../../theme/cssChunks";
import theme from "../../../../theme/Theme";
import { insertVarbEntity } from "./insertVarbEntity";
import { VarbSelectorRow } from "./VarbSelectorRow";

type Props = { setEditorState: SetEditorState; varbPathNames: VarbPathName[] };
export function VarbSelectorRows({ setEditorState, varbPathNames }: Props) {
  return (
    <Styled className="VarbSelectorRows-root">
      {varbPathNames.map((varbPathName) => {
        const { displayName, varbInfo } = getVarbPathExtras(varbPathName);
        return (
          <VarbSelectorRow
            {...{
              displayName,
              onClick: () =>
                insertVarbEntity({ setEditorState, displayName, varbInfo }),
            }}
          />
        );
      })}
    </Styled>
  );
}

const Styled = styled.div`
  display: block;
  z-index: 2; // 2 beats editor title labels
  background: ${theme.light};
  border: 1px solid ${theme.primary.light};
  border-radius: ${theme.br0};
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  ${ccs.dropdown.scrollbar};
`;