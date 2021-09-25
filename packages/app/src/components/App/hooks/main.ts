/**
 * Vendor imports.
 */
import { useContext, useState, FormEvent, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";

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
import { docIncludes } from "../../../util/main";
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
export const useEditor = function useEditor(
  doc:
    | CommentDocument
    | PostDocument
    | ThreadDocument
    | BlogDocument
    | undefined
) {
  const db = useContext(PouchDBContext);
  const { state, dispatch } = useContext(AppStateContext);
  const { showEditor, handleShowEditor } = useShowEditor();

  return {
    showEditor,
    handleShowEditor,
    handleSubmit: async (content?: string) => {
      if (!doc || !content || !state.currentBlog || !state.currentUser) {
        showEditor(false);
        return;
      }

      // Update/mutate the model.
      if (doc.type === "blog") {
        doc.threads.set(`thread-${doc.stats.threads}`, {
          type: "thread",
          _id: `${doc._id}/thread-${doc.stats.threads}`,
          user: {
            name: state.currentUser.name,
            email: state.currentUser.email,
          },
          post: {
            type: "post",
            _id: `${doc._id}/thread-${doc.stats.threads}/post`,
            user: {
              name: state.currentUser.name,
              email: state.currentUser.email,
            },
            content,
            upvotes: new Map(),
            downvotes: new Map(),
            stats: { infractions: 0 },
            timestamp: Date.now(),
            lastModified: Date.now(),
          },
          comments: new Map(),
          stats: {
            comments: 0,
          },
          timestamp: Date.now(),
          lastModified: Date.now(),
        });
        doc.stats.threads++;
      } else if (doc.type === "thread") {
        doc.comments.set(`comment-${doc.stats.comments}`, {
          type: "comment",
          _id: `${doc._id}/comment-${doc.stats.comments}`,
          content,
          user: {
            name: state.currentUser.name,
            email: state.currentUser.email,
          },
          stats: { infractions: 0 },
          timestamp: Date.now(),
          lastModified: Date.now(),
        });
        doc.stats.comments++;
      } else doc.content = content;

      //Update the db.
      await db.put(state.currentBlog);

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

      await db.put(state.currentBlog);

      setIsUpvoted(!isUpvoted);
      dispatch({
        type: "CURRENT_BLOG",
        value: await db.get<BlogDocument>(state.currentBlog._id),
      });
    },
  };
};

/**
 * useSearch hook.
 */
export const useSearch = function useSearch() {
  const history = useHistory();
  const [input, setInput] = useState("");
  const domElement = useRef<HTMLInputElement>(null);

  return {
    domElement,
    input: (value?: string) => {
      if (value === undefined) return input;

      setInput(value);
    },
    handleSubmit: (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setInput("");
      domElement.current?.blur();
      history.push("/search/" + input.trim().split(" ").join("+") + "/page=0");
    },
  };
};

/**
 * useQuery hook.
 */
export const useQuery = function useQuery() {
  const db = useContext(PouchDBContext);
  const { query } = useParams<{ query: string }>();
  const [results, setResults] = useState(
    undefined as (PostDocument | CommentDocument)[] | undefined
  );

  const fetch = async () => {
    const response = await db.find(["type"], {
      selector: {
        type: "blog",
      },
    });

    if (!response) return;

    const queries = query.toLowerCase().split("+");
    const includeKeys = [
      "content",
      "comments",
      "creator",
      "user",
      "name",
      "timestamp",
    ];

    setResults(
      response.docs.reduce((result, doc) => {
        if (doc.type === "blog") {
          doc.threads.forEach((thread) => {
            if (docIncludes(thread.post, includeKeys, queries))
              result.push(thread.post);

            thread.comments.forEach((comment) => {
              if (docIncludes(comment, includeKeys, queries))
                result.push(comment);
            });
          });
        }

        return result;
      }, [] as (CommentDocument | PostDocument)[])
    );
  };

  useEffect(() => {
    fetch();

    return () => setResults(undefined);
  }, [query]);

  return {
    results,
    test: new RegExp(query.split("&").join("|"), "gi"),
  };
};
