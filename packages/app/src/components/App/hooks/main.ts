/**
 * Vendor imports.
 */
import { useContext, useState, FormEvent } from "react";
import { useHistory } from "react-router-dom";

/**
 * Custom imports.
 */
import {
  PouchDBContext,
  BlogDocument,
  PostDocument,
  ThreadDocument,
  CommentDocument,
} from "db";
import { formatString, docIncludes } from "../../../util/main";
import { AppStateContext } from "../app-state/context";

/**
 * useShowEditor hook.
 */
export const useShowEditor = function useShowEditor() {
  const { state, dispatch } = useContext(AppStateContext);
  const [showEditor, setShowEditor] = useState(false);

  return {
    showEditor: (flag?: boolean) => {
      if (flag === undefined) return showEditor;

      setShowEditor(flag);
    },
    handleShowEditor: () => {
      if (state.showEditor) {
        state.showEditor(false);
      }

      setShowEditor(true);
      dispatch({ type: "SHOW_EDITOR", value: setShowEditor });
    },
  };
};

/**
 * useEditor hook.
 */
export const useEditor = function useSubmit(
  doc: CommentDocument | PostDocument | ThreadDocument
) {
  const db = useContext(PouchDBContext);
  const { state, dispatch } = useContext(AppStateContext);
  const { showEditor, handleShowEditor } = useShowEditor();

  return {
    showEditor,
    handleShowEditor,
    handleSubmit: async (content?: string) => {
      if (!content || !state.currentBlog || !state.currentUser) {
        showEditor(false);
        return;
      }

      // Update/mutate the model.
      if (doc.type === "thread") {
        const post = db.createDoc(
          "comment",
          `${doc._id}/comment-${doc.stats.comments}`,
          {
            content,
            creator: state.currentUser,
            stats: { infractions: 0 },
          }
        );
        doc.comments.set(post.key, post);
        doc.stats.comments++;
      } else doc.content = content;

      //Update the db.
      await db.put(state.currentBlog._id, state.currentBlog);

      // Update the view.
      dispatch({
        type: "CURRENT_BLOG",
        value: await db.get<BlogDocument>(state.currentBlog._id),
      });
      showEditor(false);
    },
  };
};

/**
 * useIsUpvoted hook.
 */
export const useIsUpvoted = function useUpvotes(doc: PostDocument) {
  const db = useContext(PouchDBContext);
  const { state, dispatch } = useContext(AppStateContext);
  const [isUpvoted, setIsUpvoted] = useState(
    state.currentUser ? doc.upvotes.get(state.currentUser?.email) : false
  );

  return {
    isUpvoted,
    handleUpvote: async () => {
      if (!state.currentUser || !state.currentBlog) return;

      if (isUpvoted) doc.upvotes.delete(state.currentUser?.email);
      else doc.upvotes.set(state.currentUser?.email, true);

      await db.put(state.currentBlog._id, state.currentBlog);

      setIsUpvoted(!isUpvoted);
      dispatch({
        type: "CURRENT_BLOG",
        value: await db.get<BlogDocument>(state.currentBlog._id),
      });
    },
  };
};

/**
 * useQuery hook.
 */
export const useQuery = function useQuery() {
  const db = useContext(PouchDBContext);
  const { dispatch } = useContext(AppStateContext);
  const history = useHistory();
  const [query, setQuery] = useState("");

  return {
    query,
    setQuery,
    handleQuery: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const response = await db.find(["type"], {
        selector: {
          type: "blog",
        },
      });

      if (!response) return;

      const queries = formatString(query).split(" ");
      const includeKeys = [
        "content",
        "comments",
        "creator",
        "name",
        "timestamp",
      ];

      const result = response.docs.reduce(
        (result: (CommentDocument | PostDocument)[], doc) => {
          if (doc.type === "blog") {
            doc.threads.forEach((thread, key) => {
              if (docIncludes(thread.post, includeKeys, queries))
                result.push(thread.post);

              thread.comments.forEach((comment) => {
                if (docIncludes(comment, includeKeys, queries))
                  result.push(comment);
              });
            });
          }

          return result;
        },
        []
      );

      console.log(result);
      history.push("/query/" + queries.join("&"));
      setQuery("");
      dispatch({ type: "CURRENT_QUERY", value: result });
    },
  };
};
