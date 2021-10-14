/**
 * Vendor imports.
 */
import { useState, useEffect, useRef } from "react";
import { useRouteMatch } from "react-router-dom";
import arraySort from "array-sort";

/**
 * Custom imports.
 */
import { GridItemFromCategory, GridItemType } from "db";
import { useDB, useCSS } from "../hooks";
import { LoadBox } from "../components/LoadBox/LoadBox";
import { CategoryList } from "../components/CategoryList/CategoryList";
import { GridBox } from "../components/GridBox/GridBox";

/**
 * Types.
 */
const path = "/categories/:categoryId/:subCategoryIds?";
const docsPerPage = 20;

type Params = {
  categoryId: string;
  subCategoryIds?: string;
};

/**
 * index functional component.
 */
export default function index() {
  const { css } = useCSS(({ sizes: { appHeader, banner } }) => ({
    body: {
      display: "grid",
      gridTemplateColumns: "min-content auto",
      minHeight: `min(100vh - ${appHeader.height}px - ${banner.height}px)`,
    },
    scrollable: {
      gridColumn: 2,
      position: "relative",
      top: `-${window.innerHeight}px`,
      visibility: "hidden",
    },
  }));
  const { db, queries } = useDB();
  const [pageId, setPageId] = useState(0);
  const [docs, setDocs] = useState<GridItemType[]>();

  const { categoryId, subCategoryIds } =
    useRouteMatch<Params>(path)?.params ?? {};

  const scrollObserver = useRef(
    new IntersectionObserver((elements, observer) => {
      if (elements[0].isIntersecting) {
        setPageId((pageId) => ++pageId);
        observer.disconnect();
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

      if (!response) return;

      setDocs(response);
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

      if (!response) return;

      const result = [];

      for (const element of response) result.push(...element.gridItems);

      setDocs(result);
    }
  };

  useEffect(() => {
    return () => {
      setPageId(0);
      setDocs(undefined);
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
    <LoadBox loadables={docs}>
      <section css={css.body}>
        <CategoryList />
        {
          <GridBox
            /*docs={arraySort(docs ?? [], ["stats.views"], {
              reverse: true,
            })}*/
            docs={
              docs
                ? arraySort(docs, ["stats.views"], {
                    reverse: true,
                  })
                : undefined
            }
            columns={3}
            onLoad={() => {
              if (scrollElement.current) {
                scrollObserver.current.observe(scrollElement.current);
              }
            }}
          />
        }
        <div css={css.scrollable} ref={scrollElement} />
      </section>
    </LoadBox>
  );
}
