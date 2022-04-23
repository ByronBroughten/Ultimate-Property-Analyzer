import { isEqual } from "lodash";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import { VariableOption } from "../../sharedWithServer/Analyzer/methods/get/variableOptions";
import { InEntityVarbInfo } from "../../sharedWithServer/SectionMetas/baseSections/baseValues/entities";
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
