/**
 * Vendor imports.
 */
import { useContext, useState } from "react";

/**
 * Custom imports.
 */
// @ts-ignore
import { DBContext, PostTable, BlogType, PostType } from "db";
import { AppStateContext } from "../components/App/app-state/context";
import { useDB } from ".";

/**
 * Types.
 */

/**
 * useIsUpvoted hook.
 */
export function useIsUpvoted(doc: PostType) {
  // @ts-ignore
  const { db, queries } = useDB();
  // @ts-ignore
  const { state, dispatch } = useContext(AppStateContext);
  const [isUpvoted, setIsUpvoted] = useState(
    state.currentUser
      ? doc.upvotes.indexOf(state.currentUser.id) > -1
        ? true
        : false
      : false
  );

  return {
    isUpvoted,
    handleUpvote: async () => {
      if (!state.currentUser || !state.currentBlog) return;

      if (isUpvoted) {
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

      setIsUpvoted(!isUpvoted);
      // N.B. I don't think I need this.
      /*dispatch({
        type: "CURRENT_BLOG",
        value: (await db.selectExact<BlogType>("blogs", queries.blog, {
          match: { id: state.currentBlog.id },
        }))![0],
      });*/
    },
  };
}
