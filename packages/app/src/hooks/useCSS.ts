/**
 * Vendor imports.
 */
import { CSSProperties } from "react";
import { css, useTheme } from "@emotion/react";

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

type ClassType = {
  [className: string]: CSSType | CSSType[];
};

/**
 * useCSS hook.
 */
export default function useCSS<T extends ClassType>(
  withTheme: (theme: Theme) => ClassType | T
) {
  const theme = useTheme() as Theme;
  const classes = withTheme(theme);

  return {
    css: Object.entries(classes).reduce<{
      [K in keyof T]: ReturnType<typeof css>;
    }>((result, _class) => {
      const [key, value]: [keyof T, CSSType | CSSType[]] = _class;

      result[key] = css(value);

      return result;
    }, {} as any),
    theme,
  };
}
