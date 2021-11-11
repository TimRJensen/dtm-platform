/**
 * Vendor imports.
 */
import { useContext, useState } from "react";

/**
 * Custom imports.
 */
import { AppStateContext } from "../components/App/app-state/context";

/**
 * useShowEditor hook.
 */
export default function useShowEditor() {
  const { state, dispatch } = useContext(AppStateContext);
  const [showEditor, setShowEditor] = useState(false);

  return {
    showEditor: (flag?: boolean) => {
      if (flag === undefined) return showEditor;

      setShowEditor(flag);
    },
    handleShowEditor: () => {
      if (state.showEditor) {
        state.showEditor(false);
      }

      setShowEditor(true);
      dispatch({ type: "SHOW_EDITOR", value: setShowEditor });
    },
  };
}
