/**
 * Vendor imports.
 */
import { useContext, useState } from "react";

/**
 * Custom imports.
 */
import { PostDocument, BlogDocument, PouchDBContext } from "db";
import { AppStateContext } from "../components/App/app-state/context";

/**
 * useIsUpvoted hook.
 */
export const useIsUpvoted = function useUpvotes(doc: PostDocument) {
  const db = useContext(PouchDBContext);
  const { state, dispatch } = useContext(AppStateContext);
  const [isUpvoted, setIsUpvoted] = useState(
    state.currentUser
      ? doc.upvotes.find((user) => user._id === state.currentUser?._id)
        ? true
        : false
      : false
  );

  return {
    isUpvoted,
    handleUpvote: async () => {
      if (!state.currentUser || !state.currentBlog) return;

      if (isUpvoted) {
        const i = doc.upvotes.findIndex(
          (user) => user._id === state.currentUser?._id
        );

        doc.upvotes = [...doc.upvotes.slice(0, i), ...doc.upvotes.slice(i + 1)];
      } else doc.upvotes.push(state.currentUser);

      await db.put(state.currentBlog);

      setIsUpvoted(!isUpvoted);
      dispatch({
        type: "CURRENT_BLOG",
        value: await db.get<BlogDocument>(state.currentBlog._id),
      });
    },
  };
};
