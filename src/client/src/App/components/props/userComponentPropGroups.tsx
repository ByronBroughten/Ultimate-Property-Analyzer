import React from "react";
import { AiOutlineFieldTime } from "react-icons/ai";
import { FaFaucet, FaHandHoldingUsd, FaMoneyCheckAlt } from "react-icons/fa";
import {
  MdAttachMoney,
  MdOutlineHomeRepairService,
  MdOutlineRoofing,
} from "react-icons/md";
import { VscOutput } from "react-icons/vsc";
import { StoreName } from "./../../sharedWithServer/SectionsMeta/sectionStores";

type Props = {
  title: string;
  loadWhat: string;
  makeIcon: () => React.ReactNode;
};

const props = (
  title: string,
  loadWhat: string,
  makeIcon: () => React.ReactNode
): Props => ({
  title,
  loadWhat,
  makeIcon,
});

type ComponentProps = Record<StoreName, Props>;

const iconProps = { size: 27 } as const;
export const componentProps: ComponentProps = {
  repairsListMain: props("Repairs", "repairs", () => (
    <MdOutlineHomeRepairService {...iconProps} />
  )),
  utilitiesListMain: props("Utilities", "utilities", () => (
    <FaFaucet {...iconProps} />
  )),
  holdingCostsListMain: props("Holding Costs", "holding costs", () => (
    <FaHandHoldingUsd {...iconProps} />
  )),
  capExListMain: props("Capital Expenses", "Cap Ex", () => (
    <MdOutlineRoofing {...iconProps} />
  )),
  closingCostsListMain: props("Closing Costs", "closing costs", () => (
    <FaMoneyCheckAlt {...iconProps} />
  )),

  singleTimeListMain: props(
    "Custom One-time Costs",
    "custom one-time costs",
    () => <MdAttachMoney {...iconProps} />
  ),
  ongoingListMain: props("Custom Ongoing Costs", "custom ongoing costs", () => (
    <AiOutlineFieldTime {...iconProps} />
  )),

  dealMain: props("Deals", "deal", () => ""),
  propertyMain: props("Properties", "property", () => ""),
  loanMain: props("Loans", "loan", () => ""),
  mgmtMain: props("Managements", "management", () => ""),

  boolVarbListMain: props("Pass or fail variables", "variables", () => ""),
  numVarbListMain: props("Numeric variables", "variables", () => ""),
  outputListMain: props("Outputs collections", "outputs", () => (
    <VscOutput {...iconProps} />
  )),

  outputSection: props("Output sections", "output sections", () => ""),
};