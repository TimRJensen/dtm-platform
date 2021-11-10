/**
 * Vendor imports.
 */
import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";

/**
 * Custom imports.
 */
import { GridItemType } from "db";
import { useCSS } from "../../../hooks";

/**
 * Types.
 */
interface Props {
  doc: GridItemType;
  show?: boolean;
  onLoad?: () => void;
}

/**
 * GridItem functional component.
 */
export const GridItem = function GridItem({ doc, show = true, onLoad }: Props) {
  if (!doc) return null;

  const { css } = useCSS(({ spacing, colors }) => ({
    artifactCard: {
      display: "none",
      borderRadius: spacing,
      overflow: "hidden",
      "&:hover :first-of-type:last-child": {
        backgroundColor: colors.secondary,
      },
      "&[data-show=true]": {
        display: "initial",
      },
    },
    content: {
      display: "inline-flex",
      flexFlow: "column",
    },
    image: {
      width: "min(300px, 25vw)",
      backgroundColor: "black",
    },
    info: {
      padding: spacing,
      height: "calc(3 * 1rem + 2 * 1.4rem)",
      backgroundColor: colors.primary,
      color: colors.text.secondary,
      "& :first-of-type": {
        fontSize: "1.4rem",
      },
    },
  }));
  const containerElement = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!show) {
      return;
    }

    const element = containerElement.current;
    const child = element?.firstElementChild;
    let parent;

    while (parent !== null) {
      parent = (parent ?? element)?.parentElement;

      if (parent?.localName === "section") {
        break;
      }
    }

    if (!child || !parent) return;

    const rowHeight = parseInt(getComputedStyle(parent).gridAutoRows);
    const rowGap = parseInt(getComputedStyle(parent).rowGap);
    const rowSpan =
      (child.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap);

    element.style.gridRowEnd = `span ${Math.ceil(rowSpan)}`;
  }, [show]);

  return (
    <div css={css.artifactCard} data-show={show} ref={containerElement}>
      <Link to={`/blogs/${doc.id}`} css={css.content}>
        <img
          css={css.image}
          src={doc.artifact.image}
          onLoad={() => {
            if (onLoad) onLoad();
          }}
        />
        <div css={css.info}>
          <div>{doc.artifact.label}</div>
          <div>{doc.artifact.period.join(" - ")}</div>
          <div>{`${doc.artifact.mainCategory.label} - ${doc.artifact.subCategory.label}`}</div>
        </div>
      </Link>
    </div>
  );
};
