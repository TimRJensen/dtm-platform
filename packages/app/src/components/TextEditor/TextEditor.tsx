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

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";
import { Controls } from "./Controls/Controls";

/**
 * Types.
 */
interface Props {
  onSubmit: (content: string | undefined, isEdit?: boolean) => void;
  show?: boolean;
  advanced?: boolean;
  content?: string;
  $css?: {
    textEditor?: ReturnType<typeof useCSS>["css"]["string"];
    input?: ReturnType<typeof useCSS>["css"]["string"];
    footer?: ReturnType<typeof useCSS>["css"]["string"];
    buttonSubmit?: ReturnType<typeof useCSS>["css"]["string"];
    buttonCancel?: ReturnType<typeof useCSS>["css"]["string"];
  };
}

/**
 * CommentTextbox functional component - https://draftjs.org/
 */
export function TextEditor({
  $css,
  show = true,
  advanced = false,
  content,
  onSubmit,
}: Props) {
  if (!show) return null;

  const { css } = useCSS(({ spacing, colors, mixins: { button } }) => ({
    textEditor: {},
    input: {
      height: "inherit",
      marginBottom: spacing,
      padding: spacing,
      borderBottom: `1px solid ${colors.primary}`,
      overflow: "auto",
    },
    footer: {
      display: "flex",
      justifyContent: "right",
    },
    buttonCancel: [button, { marginRight: spacing }],
    buttonSubmit: [
      button,
      {
        marginRight: spacing,
        backgroundColor: colors.button.accept,
        "&:hover": { backgroundColor: colors.button.acceptHover },
      },
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
    <section css={[css.textEditor, $css?.textEditor]}>
      <div
        css={[css.input, $css?.input]}
        onClick={() => editorRef.current?.focus()}
      >
        {advanced ? (
          <Controls editorState={editorState} onToggle={setEditorState} />
        ) : null}
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
          ref={editorRef}
        />
      </div>
      <div css={[css.footer, $css?.footer]}>
        <button
          css={[css.buttonSubmit, $css?.buttonSubmit]}
          onClick={() =>
            onSubmit(
              draftParser(convertToRaw(editorState.getCurrentContent())),
              content !== undefined
            )
          }
        >
          submit
        </button>
        <button
          css={[css.buttonCancel, $css?.buttonCancel]}
          onClick={() => onSubmit(undefined)}
        >
          cancel
        </button>
      </div>
    </section>
  );
}
