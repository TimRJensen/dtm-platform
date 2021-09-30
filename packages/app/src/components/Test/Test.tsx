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
import * as htmlParser2 from "htmlparser2";

/**
 * Custom imports.
 */
import { TextEditorControls } from "../TextEditorControls/TextEditorControls";
import { SearchResult } from "../SearchResult/SearchResult";
import { TextBox } from "../TextBox/TextBox";
import { CommentDocument } from "db";

/**
 * Test functional component.
 */

export const Test = function Test() {
  const [editorState, setEditorState] = useState(() =>
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
      <SearchResult query="volup" result={comment}></SearchResult>
    </div>
  );
};

const html =
  "<p>Similique molestias quisquam blanditiis dignissimos incidunt. Maiores similique mollitia autem. Voluptatem hic repudiandae laudantium quam nulla enim minima neque repudiandae. Modi aut voluptatem cumque magnam nisi aperiam. Perspiciatis sit eligendi accusamus debitis voluptas blanditiis. Aut eum enim non quaerat. Cupiditate quaerat eum. Expedita aliquid voluptatum quo deserunt delectus atque vel sit. Possimus optio dolor in eius maxime dolor.</p>";
const comment: CommentDocument = {
  type: "comment",
  _id: "test-comment",
  content: html,
  user: {
    name: "abc",
    email: "test",
  },
  stats: {
    infractions: 0,
  },
  timestamp: Date.now(),
  lastModified: Date.now(),
};
