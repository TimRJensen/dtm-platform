/**
 * Vendor imports.
 */
import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import arraySort from "array-sort";

/**
 * Custom imports.
 */
import { GridItemFromCategory, GridItemType } from "db";
import { useDB, useCSS } from "../hooks";
import { AppStateContext } from "../components/App/app-state/main";
import GridBox from "../components/GridBox/GridBox";

/**
 * Types.
 */
const docsPerPage = 20;

type Params = {
  categoryId: string;
  subCategoryIds?: string;
};

interface Props {}

/**
 * name functional component.
 */
export default function name({}: Props) {
  const { css } = useCSS(({}) => ({
    scrollable: {
      position: "relative",
      top: `-${window.innerHeight}px`,
      visibility: "hidden",
    },
  }));
  const { categoryId, subCategoryIds } = useParams<Params>();
  const { db, queries } = useDB();
  const { dispatch } = useContext(AppStateContext);
  const [pageId, setPageId] = useState(0);
  const [docs, setDocs] = useState<GridItemType[]>();
  const scrollObserver = useRef(
    new IntersectionObserver((elements) => {
      if (elements[0].isIntersecting) {
        setPageId((pageId) => ++pageId);
      }
    })
  );
  const scrollElement = useRef<HTMLDivElement>(null);

  const fetch = async () => {
    const currentRange = pageId * docsPerPage;

    if (categoryId === "popular" || !categoryId) {
      const response = await db.select<GridItemType>(
        "blogs",
        queries.gridItem,
        {
          range: { from: currentRange, to: currentRange + docsPerPage },
        }
      );

      if ("error" in response) {
        return;
      }

      dispatch({
        type: "CURRENT_PATH",
        value: {
          section: "category",
          label: categoryId,
        },
      });

      setDocs(
        arraySort(response, ["stats.views"], {
          reverse: true,
        })
      );
    } else {
      const response = await db.selectMany<GridItemFromCategory>(
        subCategoryIds ? "sub_categories" : "main_categories",
        queries.gridItemFromCategory,
        {
          range: { from: currentRange, to: currentRange + docsPerPage },
          filter: {
            values: subCategoryIds ? subCategoryIds?.split("+") : [categoryId],
          },
        }
      );

      if ("error" in response) {
        return; //return 404
      }

      if (!response[0]) {
        return;
      }

      const result = [];

      for (const element of response) {
        result.push(...element.gridItems);
      }

      dispatch({
        type: "CURRENT_PATH",
        value: {
          section: "category",
          label: response.map((element) => element.label).join(" & "),
        },
      });

      setDocs(result);
    }
  };

  useEffect(() => {
    return () => {
      scrollObserver.current.disconnect();
      setDocs(undefined);
      setPageId(0);
    };
  }, [categoryId, subCategoryIds]);

  useEffect(() => {
    if (!docs) {
      fetch();
    }
  }, [docs]);

  useEffect(() => {
    if (docs) {
      fetch();
    }
  }, [pageId]);

  return (
    <section>
      <GridBox
        docs={docs}
        columns={3}
        onLoad={() => scrollObserver.current.observe(scrollElement.current!)}
      />
      <div css={css.scrollable} ref={scrollElement} />
    </section>
  );
}
