import React from "react";
import styled from "styled-components";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../../../../theme/Theme";
import BasicSectionInfo from "../../../../appWide/GeneralSection/MainSection/MainSectionBody/BasicSectionInfo";
import { MainSectionTitleEditor } from "../../../../appWide/GeneralSection/MainSection/MainSectionTitleRow/MainSectionTitleEditor";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";

type Props = { feId: string; className?: string };
export default function BasicPropertyInfo({ feId, className }: Props) {
  const property = useSetterSection({ sectionName: "property", feId });
  const varbNames = ["price", "taxesYearly", "homeInsYearly", "sqft"] as const;
  return (
    <Styled
      {...{
        className: `BasicPropertyInfo-root ${className}`,
        sectionName: "property",
      }}
    >
      <div className="BasicSectionInfo-viewable">
        <div className="BasicSectionInfo-subSections">
          <div className="BasicSectionInfo-subSection">
            <MainSectionTitleEditor
              className="MainSectionTitleRow-title"
              feInfo={{ feId, sectionName: "property" }}
            />
            {varbNames.map((varbName) => (
              <NumObjEntityEditor
                key={varbName}
                className="BasicPropertyInfo-numObjEditor"
                feVarbInfo={property.varbInfo(varbName)}
              />
            ))}
          </div>
        </div>
      </div>
    </Styled>
  );
}

const Styled = styled(BasicSectionInfo)`
  .BasicPropertyInfo-numObjEditor {
    margin-top: ${theme.s25};
  }
  .MuiFormControl-root.labeled {
    min-width: 127px;
  }
`;