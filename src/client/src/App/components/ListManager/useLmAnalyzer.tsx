import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import usePropertyAnalyzer from "../../modules/usePropertyAnalyzer";
import { useSectionQueryActions } from "../../modules/useQueryActions/useSectionQueryActions";
import Analyzer from "../../sharedWithServer/Analyzer";
import { FeInfo } from "../../sharedWithServer/SectionMetas/Info";
import { SectionName } from "../../sharedWithServer/SectionMetas/SectionName";
import array from "../../sharedWithServer/utils/Arr";
import useDidChange from "../appWide/customHooks/useDidChange";

type SectionsToDelete = FeInfo[];
type Props = {
  sectionName: SectionName<"userList">;
  mainAnalyzer: Analyzer;
  setMainAnalyzer: React.Dispatch<React.SetStateAction<Analyzer>>;
};
export default function useLmAnalyzer({
  sectionName,
  mainAnalyzer,
  setMainAnalyzer,
}: Props) {
  const lmContext = usePropertyAnalyzer({
    prePopulatedState: mainAnalyzer,
  });

  const store = useSectionQueryActions();

  const { analyzer: lmAnalyzer, setAnalyzer: setLmAnalyzer } = lmContext;
  const [sectionsToDelete, setSectionsToDelete] = React.useState(
    [] as SectionsToDelete
  );
  const disableUndo = sectionsToDelete.length === 0;

  let nextLmAnalyzer = lmAnalyzer.eraseSectionsAndSolve(sectionsToDelete);

  const mainUserLists = mainAnalyzer.dbEntryArr(sectionName);
  const nextUserLists = nextLmAnalyzer.dbEntryArr(sectionName);
  const didChange = useDidChange(mainUserLists, nextUserLists);

  const handlers = {
    handleRemoveSection(feInfo: FeInfo) {
      setSectionsToDelete([...sectionsToDelete, feInfo]);
    },
    undoEraseSection() {
      setSectionsToDelete(array.removeLastClone(sectionsToDelete));
    },
    async saveUserLists() {
      unstable_batchedUpdates(() => {
        setLmAnalyzer(nextLmAnalyzer);
        setMainAnalyzer(nextLmAnalyzer);
        setSectionsToDelete([]);
      });
      // this should work if used where analyzer === nextLmAnalyzer
      await store.postEntryArr(sectionName);
    },
    discardChanges() {
      unstable_batchedUpdates(() => {
        setLmAnalyzer(mainAnalyzer);
        setSectionsToDelete([]);
      });
    },
  };

  return {
    ...lmContext,
    ...handlers,
    disableUndo,
    didChange,
    analyzer: nextLmAnalyzer,
  };
}
