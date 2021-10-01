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
      ? doc.upvotes.get(state.currentUser?.email) ?? false
      : false
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
