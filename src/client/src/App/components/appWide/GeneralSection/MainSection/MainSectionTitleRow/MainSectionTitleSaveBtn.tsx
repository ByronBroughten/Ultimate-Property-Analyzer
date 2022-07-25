import { AiOutlineSave } from "react-icons/ai";
import { auth } from "../../../../../modules/services/authService";
import TooltipIconBtn from "../../../TooltipIconBtn";

type Props = { onClick: () => void };
export default function MainSectionTitleSaveBtn({ onClick }: Props) {
  const props = {
    onClick,
    className: "MainSectionTitleRow-flexUnit",
    ...(auth.isToken
      ? { title: "Save" }
      : { title: "Login to save", disabled: true }),
  };
  return (
    <TooltipIconBtn {...props}>
      <AiOutlineSave />
    </TooltipIconBtn>
  );
}
