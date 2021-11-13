/**
 * Vendor imports.
 */
import { CSSProperties } from "react";
import { useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { Theme } from "../themes/dtm";

/**
 * Types.
 */
type CSSType = {
  [K in keyof CSSProperties]: CSSProperties[K];
};

export type PropertyValueType =
  | CSSType
  | CSSType[]
  | ((...value: any) => CSSType)
  | {};

type ClassType = {
  [className: string]: PropertyValueType;
};

/**
 * useCSS hook.
 */
export default function useCSS<T extends ClassType>(
  withTheme: (theme: Theme) => T
) {
  const theme = useTheme() as Theme;

  return {
    css: withTheme(theme),
    theme,
  };
}
