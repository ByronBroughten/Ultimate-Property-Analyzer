import { isEqual } from "lodash";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import { VariableOption } from "../../sharedWithServer/Analyzer/methods/entitiesVariables";
import { InEntityVarbInfo } from "../../sharedWithServer/Analyzer/SectionMetas/relSections/rel/valueMeta/NumObj/entities";
import VarbAutoComplete from "./VarbAutoComplete";

type Props = {
  selectedVarbInfo: InEntityVarbInfo;
  onSelect: (value: VariableOption) => void;
};
export function ControlledVarbAutoComplete({
  selectedVarbInfo,
  ...props
}: Props) {
  const { analyzer } = useAnalyzerContext();
  const options = analyzer.variableOptions();
  const value = options.find((option) =>
    isEqual(option.varbInfo, selectedVarbInfo)
  );
  return (
    <VarbAutoComplete {...{ value, options, clearOnBlur: false, ...props }} />
  );
}
