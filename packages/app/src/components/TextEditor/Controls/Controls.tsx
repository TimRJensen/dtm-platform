/**
 * Vendor imports.
 */
import { EditorState, RichUtils } from "draft-js";

/**
 * Custom imports.
 */
import { FontIcon } from "../../FontIcon/FontIcon";
import { useCSS } from "../../../hooks";

/**
 * Types.
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

/**
 * Controls functional component.
 */
export function Controls({ editorState, onToggle }: Props) {
  const { css } = useCSS(({ spacing, colors }) => ({
    textEditorControls: {
      marginBottom: spacing,
      borderBottom: `1px solid ${colors.primary}`,
    },
    controlGroup: {
      display: "inline-flex",
      height: "inherit",
      marginLeft: spacing,
    },
  }));

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
}
