/**
 * Vendor imports.
 */
import { EditorState, RichUtils } from "draft-js";
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { Theme } from "../../themes/dtm";
import { FontIcon } from "../FontIcon/FontIcon";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const { spacing, colors } = theme;

  return {
    textEditorControls: css({
      marginBottom: spacing,
      borderBottom: `1px solid ${colors.primary}`,
    }),
    controlGroup: css({
      display: "inline-flex",
      height: "inherit",
      marginLeft: spacing,
    }),
  };
};

/**
 * TextEditorControls.
 */
const inlineControls = [
  { type: "BOLD", fontIcon: "format_bold" },
  { type: "ITALIC", fontIcon: "format_italic" },
];
const blockControls = [
  { type: "unordered-list-item", fontIcon: "format_list_bulleted" },
  { type: "ordered-list-item", fontIcon: "format_list_numbered" },
];

interface Props {
  editorState: EditorState;
  onToggle: (state: EditorState) => void;
}

export const TextEditorControls = function TextEditorControls({
  editorState,
  onToggle,
}: Props) {
  const css = _css(useTheme() as Theme);

  return (
    <div css={css.textEditorControls}>
      <span css={css.controlGroup}>
        {inlineControls.map((control) => (
          <FontIcon
            key={`text-control-button-${control.type}`}
            type={control.fontIcon}
            active={editorState.getCurrentInlineStyle().has(control.type)}
            onToggle={() =>
              onToggle(RichUtils.toggleInlineStyle(editorState, control.type))
            }
          />
        ))}
      </span>
      <span css={css.controlGroup}>
        {blockControls.map((control) => (
          <FontIcon
            key={`text-control-button-${control.type}`}
            type={control.fontIcon}
            active={
              editorState
                .getCurrentContent()
                .getBlockForKey(editorState.getSelection().getStartKey())
                .getType() === control.type
            }
            onToggle={() =>
              onToggle(RichUtils.toggleBlockType(editorState, control.type))
            }
          />
        ))}
      </span>
    </div>
  );
};
