/**
 * Vendor imports.
 */
import { EditorState, RichUtils } from "draft-js";

/**
 * Custom imports.
 */
import { FontIcon } from "../FontIcon/FontIcon";
import styles from "./styles.module.scss";

/**
 * TextEditorControls.
 */
interface Props {
  editorState: EditorState;
  onToggle: (state: EditorState) => void;
}

export const TextEditorControls = function TextEditorControls({
  editorState,
  onToggle,
}: Props) {
  const inlineControls = [
    { type: "BOLD", fontIcon: "format_bold" },
    { type: "ITALIC", fontIcon: "format_italic" },
  ];
  const blockControls = [
    { type: "unordered-list-item", fontIcon: "format_list_bulleted" },
    { type: "ordered-list-item", fontIcon: "format_list_numbered" },
  ];

  return (
    <div className={styles.textEditorControls}>
      <span className={styles.inlineControls}>
        {inlineControls.map((control) => (
          <FontIcon
            key={`text-control-button-${control.type}`}
            //styles={styles}
            type={control.fontIcon}
            active={editorState.getCurrentInlineStyle().has(control.type)}
            onToggle={() =>
              onToggle(RichUtils.toggleInlineStyle(editorState, control.type))
            }
          />
        ))}
      </span>
      <span className={styles.blockControls}>
        {blockControls.map((control) => (
          <FontIcon
            key={`text-control-button-${control.type}`}
            styles={styles}
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
