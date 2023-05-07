import { BasicFixAndFlipInfo } from "./ViewChunks/BasicFixAndFlipInfo";
import { PropertyEditorBody } from "./ViewChunks/PropertyEditorBody";
import { PropertyHoldingCosts } from "./ViewChunks/PropertyHoldingCosts";
import { RehabSection } from "./ViewChunks/PropertyRehab";

export function PropertyFixAndFlipView({ feId }: { feId: string }) {
  return (
    <PropertyEditorBody
      {...{ feId, sectionTitle: "Property", titleAppend: "Fix & Flip" }}
    >
      <BasicFixAndFlipInfo {...{ feId }} />
      <PropertyHoldingCosts {...{ feId }} />
      <RehabSection {...{ feId, dealMode: "fixAndFlip" }} />
    </PropertyEditorBody>
  );
}
