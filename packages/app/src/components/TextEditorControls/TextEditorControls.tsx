/**
 * Vendor imports.
 */
import { EditorState, RichUtils } from "draft-js";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";
import Button from "../Button/Button";
import FontIcon from "../FontIcon/FontIcon";

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
 * TextEditorControls functional component.
 */
export default function TextEditorControls({ editorState, onToggle }: Props) {
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
    button: {
      width: "auto",
      color: colors.secondary,
      "&[data-disabled=false]:hover": {
        color: colors.secondaryDarker,
      },
      ":not(:last-of-type)": {
        margin: `0 ${spacing / 4}px 0 0`,
      },
    },
  }));

  return (
    <div css={css.textEditorControls}>
      <span css={css.controlGroup}>
        {inlineControls.map((control) => (
          <Button
            key={`text-control-button-${control.type}`}
            $css={{ button: css.button }}
            type="transparent"
            toggled={editorState.getCurrentInlineStyle().has(control.type)}
            onToggle={() =>
              onToggle(RichUtils.toggleInlineStyle(editorState, control.type))
            }
          >
            <FontIcon
              key={`text-control-button-${control.type}`}
              type={control.fontIcon}
            />
          </Button>
        ))}
      </span>
      <span css={css.controlGroup}>
        {blockControls.map((control) => (
          <Button
            key={`text-control-button-${control.type}`}
            $css={{ button: css.button }}
            type="transparent"
            toggled={
              editorState
                .getCurrentContent()
                .getBlockForKey(editorState.getSelection().getStartKey())
                .getType() === control.type
            }
            onToggle={() =>
              onToggle(RichUtils.toggleBlockType(editorState, control.type))
            }
          >
            <FontIcon type={control.fontIcon} />
          </Button>
        ))}
      </span>
    </div>
  );
}
