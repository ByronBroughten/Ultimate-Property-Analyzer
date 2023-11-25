import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FinancingMode } from "../SectionsMeta/values/StateValue/financingMode";
import { numObj } from "../SectionsMeta/values/StateValue/NumObj";
import { PackBuilderSection } from "../StatePackers/PackBuilderSection";

export function makeDefaultLoanPack(
  financingMode?: FinancingMode
): SectionPack<"loan"> {
  const loan = PackBuilderSection.initAsOmniChild("loan", {
    sectionValues: {
      interestRatePercentPeriodicSwitch: "yearly",
      loanTermSpanSwitch: "years",
      ...(financingMode && { financingMode }),
    },
  });

  loan.addChild("prepaidInterest");
  (["prepaidTaxes", "prepaidHomeIns"] as const).forEach((childName) => {
    const child = loan.addAndGetChild(childName);
    child.addChild("timespanEditor");
  });

  financingMode = loan.get.valueNext("financingMode");
  const baseValue = loan.addAndGetChild("loanBaseValue", {
    sectionValues: {
      financingMode,
      valueSourceName:
        financingMode === "purchase" ? "purchaseLoanValue" : "arvLoanValue",
    },
  });

  baseValue.addChild("purchaseLoanValue");
  baseValue.addChild("repairLoanValue");
  baseValue.addChild("arvLoanValue");

  const loanExtra = baseValue.addAndGetChild("loanBaseExtra");
  loanExtra.addChild("onetimeList");
  const customBase = baseValue.addAndGetChild("customLoanBase");
  customBase.addChild("onetimeList");

  const closingCostValue = loan.addAndGetChild("closingCostValue");
  closingCostValue.addChild("onetimeList");

  loan.addChild("mortgageInsUpfrontValue");
  const mortIns = loan.addAndGetChild("mortgageInsPeriodicValue", {
    sectionValues: { valueSourceName: "percentEditor" },
  });
  mortIns.addChild("dollarsEditor");
  mortIns.addChild("percentEditor", {
    sectionValues: {
      valueEditorFrequency: "yearly",
      valueEditor: numObj(0),
    },
  });
  return loan.makeSectionPack();
}
