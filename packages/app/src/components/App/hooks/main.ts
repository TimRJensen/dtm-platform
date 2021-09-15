/**
 * Vendor imports.
 */
import { useContext, useState } from "react";

/**
 * Custom imports.
 */
import { AppStateContext } from "../app-state/context";

/**
 * useShowEditor hook.
 */
export const useShowEditor = function useShowEditor(
  onClick?: (flag: boolean) => void
) {
  const { state, dispatch } = useContext(AppStateContext);
  const [showEditor, setShowEditor] = useState(false);

  return {
    showEditor: (flag?: boolean) => {
      if (flag === undefined) return showEditor;

      setShowEditor(flag);
    },
    handleClick: () => {
      if (state.showEditor) {
        state.showEditor(false);
      }

      if (onClick) {
        onClick(true);
        dispatch({ type: "showEditor", value: onClick });
      } else {
        setShowEditor(true);
        dispatch({ type: "showEditor", value: setShowEditor });
      }
    },
  };
};
