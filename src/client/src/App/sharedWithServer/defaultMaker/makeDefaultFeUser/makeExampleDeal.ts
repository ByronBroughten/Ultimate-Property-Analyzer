import { stringObj } from "../../SectionsMeta/values/StateValue/StringObj";
import { PackBuilderSection } from "../../StatePackers.ts/PackBuilderSection";
import { makeDefaultDealPack } from "../makeDefaultDealPack";
import { dealExampleLoan } from "./makeExampleLoan";
import { exampleDealMgmt } from "./makeExampleMgmt";
import { makeExampleDealProperty } from "./makeExampleProperty";

export const exampleStoreDeal = makeExampleDeal();

function makeExampleDeal() {
  const deal = PackBuilderSection.initAsOmniChild("deal");
  deal.loadSelf(makeDefaultDealPack());
  deal.updateValues({ displayName: stringObj("Example Deal") });

  const property = deal.onlyChild("property");
  property.loadSelf(makeExampleDealProperty());

  const financing = deal.onlyChild("financing");
  financing.updateValues({
    financingMode: "useLoan",
  });
  const loan = financing.onlyChild("loan");
  loan.loadSelf(dealExampleLoan);

  const mgmt = deal.onlyChild("mgmt");
  mgmt.loadSelf(exampleDealMgmt);

  return deal.makeSectionPack();
}