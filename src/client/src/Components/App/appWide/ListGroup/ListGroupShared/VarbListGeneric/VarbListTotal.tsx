import { FeVarbInfo } from "../../../../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { useGetterVarb } from "../../../../../../stateHooks/useGetterVarb";

type Props = { varbInfo: FeVarbInfo };
export function VarbListTotal({ varbInfo }: Props) {
  const varb = useGetterVarb(varbInfo);
  return <div className="VarbList-total">{`${varb.displayVarb()}`}</div>;
}