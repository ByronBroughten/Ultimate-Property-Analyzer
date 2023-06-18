import { unstable_batchedUpdates } from "react-dom";
import { useGoToPage } from "../../components/customHooks/useGoToPage";
import { QuerierSections } from "../../modules/SectionActors/QuerierSections";
import { useLogout } from "../../modules/SectionActors/UserDataActor";
import { userTokenS } from "../../modules/services/userTokenS";
import { makeReq } from "../apiQueriesShared/makeReqAndRes";
import { useDispatchAndSave } from "./useAction";
import { useGetterSections } from "./useGetterSections";
import { SectionsAction } from "./useSections/sectionsReducer";

const queryActionNames = [
  "loadUserData",
  "trySave",
  "showArchivedDeals",
] as const;

type QueryActionName = (typeof queryActionNames)[number];
type DefaultActionMap = {
  [AN in QueryActionName]: {
    type: AN;
  };
};

type QueryAction = DefaultActionMap[QueryActionName];

type QueryActionsMap = {
  [ST in QueryActionName]: Extract<SectionsAction, { type: ST }>;
};
type ActionPropsMap = {
  [AN in QueryActionName]: Omit<QueryActionsMap[AN], "type">;
};
export type ActionProps<T extends QueryActionName> = ActionPropsMap[T];

export function useQueryAction() {
  const getterSections = useGetterSections();
  const sections = getterSections.stateSections;

  const dispatch = useDispatchAndSave();
  const logout = useLogout();
  const goToAccountPage = useGoToPage("account");

  return async (action: QueryAction) => {
    const querierSections = QuerierSections.init({
      sectionsShare: { sections },
    });
    const { apiQueries } = querierSections;
    let success: boolean = true;
    switch (action.type) {
      case "loadUserData": {
        try {
          const res = await apiQueries.getUserData(makeReq({}));
          userTokenS.setTokenFromHeaders(res.headers);
          unstable_batchedUpdates(async () => {
            dispatch({
              type: "loadUserData",
              userData: res.data,
            });
            goToAccountPage();
          });
        } catch (error) {
          const count = querierSections.feStore.get.valueNext(
            "userDataFetchTryCount"
          );
          if (count > 5) {
            console.log("logging out");
            await logout();
            throw error;
          } else {
            setTimeout(
              () => dispatch({ type: "incrementGetUserDataTry" }),
              3000
            );
          }
        }
        break;
      }
      case "trySave": {
        try {
          success = await querierSections.feStore.trySave();
          dispatch({
            type: "finishSave",
            success,
          });
        } catch (error) {
          dispatch({
            type: "finishSave",
            success: false,
          });
          throw error;
        }
        break;
      }
      case "showArchivedDeals": {
        const { main } = getterSections;
        const sessionVarbs = main.onlyChild("sessionVarbs");
        if (sessionVarbs.valueNext("archivedAreLoaded")) {
          const menu = main.onlyChild("mainDealMenu");
          dispatch({
            type: "updateValue",
            ...menu.feInfo,
            varbName: "showArchived",
            value: true,
          });
        } else {
          const res = await apiQueries.getArchivedDeals(makeReq({}));
          dispatch({
            type: "loadArchivedDeals",
            archivedDeals: res.data,
          });
        }
      }
    }
  };
}
