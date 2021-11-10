/**
 * Vendor imports.
 */
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import arraySort from "array-sort";

/**
 * Custom import.
 */
import { BlogTable, BlogType } from "db";
import { useDB, useEditor, useCSS } from "../../hooks";
import { AppStateContext } from "../../components/App/app-state/context";
import { LoadBox } from "../../components/LoadBox/LoadBox";
import { Artifact } from "../../components/Artifact/Artifact";
import { Post } from "../../components/Post/Post";
import { TextEditor } from "../../components/TextEditor/TextEditor";

/**
 * Types.
 */
interface Props {
  blog: BlogType | undefined;
}

/**
 * blog functonal component.
 */
export default function blog({ blog }: Props) {
  const { css } = useCSS(({ spacing, borderRadius, colors }) => ({
    textEditor: {
      width: `clamp(650px, 40vw, 100%)`,
      margin: `0 auto ${4 * spacing}px auto`,
    },
    input: {
      height: 300,
      border: `1px solid ${colors.primary}`,
      borderRadius,
    },
  }));
  const { blogId } = useParams<{ blogId: string }>();
  const { db, queries } = useDB();
  const { dispatch } = useContext(AppStateContext);
  const { showEditor, handleShowEditor, handleSubmit } = useEditor(blog);

  const fetch = async () => {
    const response = await db.selectExact<BlogType>("blogs", queries.blog, {
      match: { id: blogId },
    });

    if ("error" in response) {
      return; //return 404
    }

    dispatch({
      type: "ANY",
      value: {
        currentBlog: response,
        currentPath: { section: "artifact", label: response.artifact.label },
      },
    });
  };

  useEffect(() => {
    if (!blog) {
      fetch();
      return;
    }

    db.update<BlogTable>("blogs", {
      id: blog.id,
      stats: {
        ...blog.stats,
        views: blog.stats.views + 1,
      },
    });

    return () =>
      dispatch({
        type: "CURRENT_BLOG",
        value: undefined,
      });
  }, [blog]);

  return (
    <LoadBox loadables={[blog]}>
      {blog ? (
        <section>
          <Artifact doc={blog.artifact} onComment={handleShowEditor} />
          <TextEditor
            $css={{ textEditor: css.textEditor, input: css.input }}
            onSubmit={handleSubmit}
            show={showEditor()}
            advanced
          />
          {arraySort(blog.posts, "createdAt", { reverse: true }).map((post) => (
            <Post key={post.id} doc={post} />
          ))}
        </section>
      ) : null}
    </LoadBox>
  );
}
