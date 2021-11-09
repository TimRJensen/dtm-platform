/**
 * Vendor imports.
 */
import { useContext } from "react";

/**
 * Custom imports.
 */
import {
  DBContext,
  BlogTable,
  PostTable,
  CommentTable,
  BlogType,
  PostType,
  CommentType,
} from "db";
import { AppStateContext } from "../components/App/app-state/context";
import { useShowEditor, useDB } from ".";

/**
 * useEditor hook.
 */
export function useEditor(doc: BlogType | PostType | CommentType | undefined) {
  const { db, queries } = useDB();
  const { state, dispatch } = useContext(AppStateContext);
  const { showEditor, handleShowEditor } = useShowEditor();

  return {
    showEditor,
    handleShowEditor,
    handleSubmit: async (content: string | undefined, isEdit?: boolean) => {
      if (!content || !doc || !state.currentBlog || !state.currentUser) {
        showEditor(false);
        return;
      }
      // Update the db.
      if (isEdit && "content" in doc) {
        const response = await db.update<PostTable | CommentTable>(
          "comments" in doc ? "posts" : "comments",
          {
            id: doc.id,
            content,
          }
        );
      } else {
        if ("comments" in doc) {
          const response = await Promise.all([
            db.insert<CommentTable>("comments", [
              {
                postId: doc.id,
                accountId: state.currentUser.id,
                content,
                stats: {
                  shadowBanned: false,
                  infractions: 0,
                },
              },
            ]),
            db.update<PostTable>("posts", {
              id: doc.id,
              stats: {
                ...doc.stats,
                totalComments: doc.stats.totalComments + 1,
              },
            }),
          ]);
        } else if ("posts" in doc) {
          const response = await Promise.all([
            db.insert<PostTable>("posts", [
              {
                blogId: doc.id,
                accountId: state.currentUser.id,
                content,
                upvotes: [],
                downvotes: [],
                stats: {
                  shadowBanned: false,
                  infractions: 0,
                  totalUpvotes: 0,
                  totalDownvotes: 0,
                  totalComments: 0,
                },
              },
            ]),
            db.update<BlogTable>("blogs", {
              id: doc.id,
              stats: {
                ...doc.stats,
                posts: doc.stats.posts + 1,
              },
            }),
          ]);
        }
      }

      // Update the view.
      dispatch({
        type: "CURRENT_BLOG",
        value: (await db.selectExact<BlogType>("blogs", queries.blog, {
          match: { id: state.currentBlog.id },
        }))![0],
      });
      showEditor(false);
    },
  };
}
