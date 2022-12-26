import { TextField } from "@material-ui/core";
import { transparentize } from "polished";
import React from "react";
import styled from "styled-components";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import ccs from "../../theme/cssChunks";
import theme, { ThemeName, themeSectionNameOrDefault } from "../../theme/Theme";
import { useMainSectionActor } from "./../../modules/sectionActorHooks/useMainSectionActor";
import useHowMany from "./customHooks/useHowMany";
import { RowIndexListRow, StyledRowIndexRow } from "./RowIndexListRow";

type Props<SN extends SectionNameByType<"hasIndexStore">> = {
  feInfo: FeSectionInfo<SN>;
  className?: string;
  noEntriesMessage: string;
  noAccessMessage?: string;
};

type ScenarioKey = "areNone" | "isAtLeastOne";
function useScenarioKey(rows: any[]): ScenarioKey {
  const { areNone } = useHowMany(rows);
  if (areNone) return "areNone";
  else return "isAtLeastOne";
}

export function RowIndexRows<SN extends SectionNameByType<"hasIndexStore">>({
  feInfo,
  className,
  noEntriesMessage,
  noAccessMessage,
}: Props<SN>) {
  const [filter, setFilter] = React.useState("");
  const section = useMainSectionActor(feInfo);
  const rows = section.alphabeticalDisplayItems();
  const scenarioKey = useScenarioKey(rows);
  const scenarios = {
    get areNone() {
      return <Message message={noEntriesMessage} />;
    },
    get isAtLeastOne() {
      return (
        <>
          <TextField
            {...{
              className: "RowIndexRows-filter",
              placeholder: "filter",
              value: filter,
              onChange: ({ currentTarget }) => {
                setFilter(currentTarget.value);
              },
            }}
          />
          <div>
            {rows.map(
              ({ dbId, displayName }) =>
                displayName.includes(filter) && (
                  <RowIndexListRow
                    {...{
                      displayName,
                      load: () => section.loadFromIndex(dbId),
                      del: noAccessMessage
                        ? undefined
                        : () => section.deleteFromIndex(dbId),
                      key: dbId,
                    }}
                  />
                )
            )}
          </div>
        </>
      );
    },
  };

  return (
    <Styled
      className={`RowIndexRows-root ${className}`}
      tabIndex={0}
      sectionName={themeSectionNameOrDefault(feInfo.sectionName)}
    >
      {scenarios[scenarioKey]}
    </Styled>
  );
}

function Message({ message }: { message: string }) {
  return (
    <StyledRowIndexRow className={"RowIndexRows-noEntriesRow"}>
      <span className="RowIndexRows-noEntriesMessage">{message}</span>
    </StyledRowIndexRow>
  );
}

const Styled = styled.div<{ sectionName: ThemeName }>`
  display: block;
  position: relative;
  z-index: 2; // 2 beats editor title labels
  background: ${theme.light};
  border-radius: 0 0 ${theme.br0} ${theme.br0};
  border: 1px solid ${theme["gray-500"]};
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  ${ccs.dropdown.scrollbar};

  .RowIndexRows-filter {
    padding: 0 ${theme.s3} 0 ${theme.s3};
  }

  .RowIndexRows-noEntriesRow {
    white-space: nowrap;
    color: ${transparentize(0.4, theme.softDark)};
    background-color: ${transparentize(0.05, theme.error.light)};
  }
  .RowIndexRows-noEntriesMessage {
    padding: ${theme.s25} ${theme.s3};
  }

  .RowIndexRows-trashBtn {
    width: 20px;
    height: auto;
  }

  .RowIndexListRow-root {
    :not(:first-child) {
      border-top: 1px solid ${theme.primaryBorder};
    }
  }

  .RowIndexListRow-root {
    display: flex;
    justify-content: space-between;
    min-height: 33px;
  }
`;
