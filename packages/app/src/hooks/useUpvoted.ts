/**
 * Vendor imports.
 */
import { useContext, useState } from "react";

/**
 * Custom imports.
 */
import { PostTable, PostType } from "db";
import { AppStateContext } from "../components/App/app-state/context";
import { useDB } from ".";

/**
 * Types.
 */

/**
 * useIsUpvoted hook.
 */
export default function useIsUpvoted(doc: PostType) {
  const { db } = useDB();
  const { state } = useContext(AppStateContext);
  const [upvoted, setUpvoted] = useState(
    state.currentUser
      ? doc.upvotes.indexOf(state.currentUser.id) > -1
        ? true
        : false
      : false
  );

  return {
    isUpvoted: upvoted,
    handleUpvote: async () => {
      if (!state.currentUser || !state.currentBlog) return;

      if (upvoted) {
        const i = doc.upvotes.indexOf(state.currentUser.id);

        db.update<PostTable>("posts", {
          id: doc.id,
          upvotes: [...doc.upvotes.slice(0, i), ...doc.upvotes.slice(i + 1)],
          stats: {
            ...doc.stats,
            totalUpvotes: doc.stats.totalUpvotes - 1,
          },
        });
      } else
        db.update<PostTable>("posts", {
          id: doc.id,
          upvotes: [...doc.upvotes, state.currentUser.id],
          stats: {
            ...doc.stats,
            totalUpvotes: doc.stats.totalUpvotes + 1,
          },
        });

      setUpvoted(!upvoted);
    },
  };
}
