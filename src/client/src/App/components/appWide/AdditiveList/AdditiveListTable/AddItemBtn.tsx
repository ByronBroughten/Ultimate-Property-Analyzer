import { StandardBtnProps } from "../../../general/StandardProps";
import PlusBtn from "../../PlusBtn";

export default function AddItemBtn({ className, ...props }: StandardBtnProps) {
  return (
    <PlusBtn
      className={`AdditiveListTable-addItemBtn ${className ?? ""}`}
      {...props}
    >
      +
    </PlusBtn>
  );
}
