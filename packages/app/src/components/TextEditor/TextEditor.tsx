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
  RawDraftContentState,
  convertFromHTML,
} from "draft-js";
import { css, useTheme } from "@emotion/react";

/**
 * Custom imports.
 */
import { Theme, button } from "../../themes/dtm";
import { TextEditorControls } from "../TextEditorControls/TextEditorControls";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const { spacing, colors } = theme;

  return {
    textEditor: css({
      //marginBottom: spacing,
    }),
    input: css({
      height: "inherit",
      marginBottom: spacing,
      padding: spacing,
      borderBottom: `1px solid ${colors.primary}`,
      overflow: "auto",
    }),
    footer: css({
      display: "flex",
      justifyContent: "right",
    }),
    buttonCancel: css([button, { marginRight: spacing }]),
    buttonSubmit: css([
      button,
      {
        marginRight: spacing,
        backgroundColor: colors.button.accept,
        "&:hover": { backgroundColor: colors.button.acceptHover },
      },
    ]),
  };
};

/**
 * CommentTextbox functional component - https://draftjs.org/
 */
interface Props {
  show?: boolean;
  advanced?: boolean;
  content?: string;
  onSubmit?: (content?: RawDraftContentState) => void;
  $css?: Partial<ReturnType<typeof _css>>;
}

export const TextEditor = function TextEditor({
  $css,
  show = true,
  advanced = false,
  content,
  onSubmit,
}: Props) {
  if (!show) return null;

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
  const css = _css(useTheme() as Theme);

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
      <div css={[css.footer, $css?.footer]}>
        <button
          css={[css.buttonSubmit, $css?.buttonSubmit]}
          onClick={() => {
            if (onSubmit)
              onSubmit(convertToRaw(editorState.getCurrentContent()));
          }}
        >
          submit
        </button>
        <button
          css={[css.buttonCancel, $css?.buttonCancel]}
          onClick={() => {
            if (onSubmit) onSubmit(undefined);
          }}
        >
          cancel
        </button>
      </div>
    </section>
  );
};
