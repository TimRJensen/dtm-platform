/**
 * Vendor imports.
 */
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { css, useTheme } from "@emotion/react";

/**
 * Custom import.
 */
import { BlogDocument, PouchDBContext } from "db";
import { Theme } from "../../themes/dtm";
import { useEditor } from "../../hooks";
import { AppStateContext } from "../App/app-state/context";
import { AppHeader } from "../AppHeader/AppHeader";
import { Artifact } from "../Artifact/Artifact";
import { Thread } from "../Thread/Thread";
import { TextEditor } from "../TextEditor/TextEditor";

/**
 * Css.
 */
const _css = (theme: Theme) => {
  const {
    spacing,
    borderRadius,
    colors,
    sizes: { thread, blog },
  } = theme;

  return {
    banner: css({
      height: "20vh",
      backgroundColor: "#000",
    }),
    blog: css({
      minWidth: blog.width,
    }),
    textEditor: css({
      width: `${thread.width}vw`,
      margin: `0 auto ${4 * spacing}px auto`,
    }),
    input: css({
      height: 300,
      border: `1px solid ${colors.primary}`,
      borderRadius,
    }),
  };
};

/**
 * Blog functonal component.
 */
interface Props {
  blog: BlogDocument | undefined;
}

export const BlogView = function BlogView({ blog }: Props) {
  const db = useContext(PouchDBContext);
  const css = _css(useTheme() as Theme);
  const { dispatch } = useContext(AppStateContext);
  const { showEditor, handleShowEditor, handleSubmit } = useEditor(blog);
  const { blogId } = useParams<{ blogId: string }>();

  const fetch = async () => {
    const response = await db.get<BlogDocument>(`/blogs/${blogId}`);

    if (response) dispatch({ type: "CURRENT_BLOG", value: response });
  };

  useEffect(() => {
    if (!blog) fetch();

    return () => dispatch({ type: "CURRENT_BLOG", value: undefined });
  }, []);

  if (!blog) return null;

  return (
    <section>
      <div css={css.banner}></div>
      <AppHeader />
      <Artifact doc={blog.artifact} onComment={handleShowEditor} />
      <TextEditor
        $css={{ textEditor: css.textEditor, input: css.input }}
        onSubmit={handleSubmit}
        show={showEditor()}
        advanced
      ></TextEditor>
      {blog.threads.map((thread, i) => {
        return <Thread key={thread._id} doc={thread} />;
      })}
    </section>
  );
};
