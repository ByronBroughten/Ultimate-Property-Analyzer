import styled from "styled-components";
import { useSetterSection } from "../../../../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { useUpdateVarbCurrentTarget } from "../../../../../../../../sharedWithServer/stateClassHooks/useUpdateVarbCurrentTarget";
import { listOperators } from "../../../../../../../../sharedWithServer/StateSolvers/ValueUpdaterVarb/ConditionalValueSolver";
import { MuiSelectOnChange } from "../../../../../../../../utils/mui";
import MaterialSelect from "../../../../../../../inputs/MaterialSelect";
import { NumObjEntityEditor } from "../../../../../../../inputs/NumObjEntityEditor";
import { StringArrEditor } from "../../../../../../../inputs/StringArrEditor";
import LogicOperators from "../../../../../../LogicOperators";

export default function IfLogic({ rowId }: { rowId: string }) {
  const sectionName = "conditionalRow";
  const updateVarbCurrentTarget = useUpdateVarbCurrentTarget();
  const row = useSetterSection({
    sectionName,
    feId: rowId,
  });

  const operatorVarb = row.get.varb("operator");
  const operatorVal = operatorVarb.value("string");

  let logicType: string;
  if (listOperators.includes(operatorVal as any)) {
    logicType = "listLogic";
  } else {
    logicType = "valueLogic";
  }

  const onChange: MuiSelectOnChange = (event) => {
    updateVarbCurrentTarget({ currentTarget: event.target });
  };

  return (
    <Styled>
      <NumObjEntityEditor
        feVarbInfo={row.varbInfo("left")}
        className="logic-left"
        bypassNumeric={true}
      />
      <MaterialSelect
        {...{
          name: operatorVarb.varbId,
          value: operatorVal,
          onChange,
          className: "select-operator",
        }}
      >
        {LogicOperators()}
      </MaterialSelect>
      {logicType === "listLogic" && (
        <StringArrEditor
          className="logic-right"
          feVarbInfo={row.varbInfo("rightList")}
        />
      )}
      {logicType === "valueLogic" && (
        <NumObjEntityEditor
          className="logic-right"
          feVarbInfo={row.varbInfo("rightValue")}
          labeled={false}
        />
      )}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  .select-operator {
    margin: 0 0.25rem;
  }
`;
