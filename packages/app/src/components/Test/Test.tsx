/**
 * Vendor imports.
 */
import { useState } from "react";
import {
  Editor,
  EditorState,
  ContentState,
  convertToRaw,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";

/**
 * Custom imports.
 */
import { TextEditorControls } from "../TextEditorControls/TextEditorControls";
import { TextBox } from "../TextBox/TextBox";

/**
 * Test functional component.
 */

export const Test = function Test() {
  const [editorState, setEditorState] = useState(
    () =>
      // @ts-ignore
      console.log(convertFromHTML(html).entityMap) ||
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(html).contentBlocks,
          convertFromHTML(html).entityMap
        )
      )
  );
  const [text, setText] = useState(html);

  return (
    <div style={{ width: 400, marginLeft: 50 }}>
      <TextEditorControls editorState={editorState} onToggle={setEditorState} />
      <Editor editorState={editorState} onChange={setEditorState} />
      <button
        onClick={() =>
          setText(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }
      >
        Test
      </button>
    </div>
  );
};

const html =
  "<ol><li>A</li><li>B</li><li>C</li></ol><p>Lorem ipsum dolor sit amet,</p><p>consectetur adipiscing elit, sed do eiusmod tempor <span style='color: red; font-size: 1.5rem'>incididunt</span> ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>";
