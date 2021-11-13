/**
 * Vendor imports.
 */
import { useState, useEffect, useRef } from "react";
import {
  ContentState,
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromHTML,
} from "draft-js";
import draftParser from "draftjs-to-html";
import { SerializedStyles } from "@emotion/react";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";
import Button from "../Button/Button";
import TextEditorControls from "../TextEditorControls/TextEditorControls";

/**
 * Types.
 */
interface Props {
  $css?: Partial<{
    [key in
      | "textEditor"
      | "input"
      | "footer"
      | "buttonSubmit"
      | "buttonCancel"]: SerializedStyles | {};
  }>;
  content?: string;
  toggle?: boolean;
  advanced?: boolean;
  onSubmit: (content: string | undefined, isEdit?: boolean) => void;
}

/**
 * TextEditor functional component - https://draftjs.org/
 */
export default function TextEditor({
  $css = {},
  toggle = true,
  advanced = false,
  content,
  onSubmit,
}: Props) {
  if (!toggle) return null;

  const { css } = useCSS(({ spacing, colors }) => ({
    textEditor: [{}, $css.textEditor],
    input: [
      {
        height: "inherit",
        marginBottom: spacing,
        padding: spacing,
        borderBottom: `1px solid ${colors.primary}`,
        overflow: "auto",
      },
      $css.input,
    ],
    footer: {
      display: "flex",
      justifyContent: "right",
    },
    buttonCancel: [{}, $css.buttonCancel],
    buttonSubmit: [
      {
        marginRight: spacing,
      },
      $css.buttonSubmit,
    ],
  }));
  const editorRef = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(() =>
    !content
      ? EditorState.createEmpty()
      : EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(content).contentBlocks
          )
        )
  );

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  useEffect(() => {
    editorRef.current?.focus();
  }, []);

  return (
    <section css={css.textEditor}>
      <div css={css.input} onClick={() => editorRef.current?.focus()}>
        {advanced ? (
          <TextEditorControls
            editorState={editorState}
            onToggle={setEditorState}
          />
        ) : null}
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
          ref={editorRef}
        />
      </div>
      <div css={css.footer}>
        <Button
          $css={{ button: css.buttonSubmit }}
          type="accept"
          onClick={() =>
            onSubmit(
              draftParser(convertToRaw(editorState.getCurrentContent())),
              content !== undefined
            )
          }
        >
          submit
        </Button>
        <Button
          $css={{ button: css.buttonCancel }}
          onClick={() => onSubmit(undefined)}
        >
          cancel
        </Button>
      </div>
    </section>
  );
}
