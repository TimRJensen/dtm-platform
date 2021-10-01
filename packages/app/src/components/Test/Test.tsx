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
import { Post } from "../Post/Post";
import { CommentDocument, PostDocument } from "db";

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
      <Post doc={comment} onComment={() => false}></Post>
    </div>
  );
};

const html =
  "<p>Similique molestias quisquam blanditiis dignissimos incidunt. Maiores similique mollitia autem. Voluptatem hic repudiandae laudantium quam nulla enim minima neque repudiandae. Modi aut voluptatem cumque magnam nisi aperiam. Perspiciatis sit eligendi accusamus debitis voluptas blanditiis. Aut eum enim non quaerat. Cupiditate quaerat eum. Expedita aliquid voluptatum quo deserunt delectus atque vel sit. Possimus optio dolor in eius maxime dolor.</p>";
const comment: PostDocument = {
  type: "post",
  _id: "test-comment",
  content: html,
  user: {
    name: "abc",
    email: "test",
  },
  stats: {
    infractions: 0,
  },
  upvotes: new Map(),
  downvotes: new Map(),
  timestamp: Date.now(),
  lastModified: Date.now(),
};
