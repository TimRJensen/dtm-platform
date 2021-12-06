/**
 * Vendor imports.
 */
import {
  useState,
  useEffect,
  useRef,
  memo,
  ComponentProps,
  MouseEvent,
  FocusEvent,
  MutableRefObject,
  Dispatch,
  SetStateAction,
} from "react";
import { generatePath, Link } from "react-router-dom";

/**
 * Custom imports.
 */
import { CategoryType } from "db";
import { useCSS } from "../../hooks";
import CategoryListItem from "../CategoryListItem/CategoryListItem";

/**
 * Types.
 */
const path = "/categories/:categoryId/:subCategoryIds?";

interface Props extends ComponentProps<any> {
  doc: CategoryType;
  toggle: MutableRefObject<Dispatch<SetStateAction<boolean>> | undefined>;
}

/**
 * CategoryFoldout functional component.u
 */
export default memo(function ListItem({ doc, toggle }: Props) {
  const { css } = useCSS(({ spacing, colors }) => ({
    mainCategory: {
      width: "inherit",
      transition: "opacity 0.5s ease",
    },
    label: {
      display: "block",
      height: "auto",
      width: "inherit",
      borderRadius: 0,
      padding: `${spacing}px 0 ${spacing}px ${spacing}px`,
      color: colors.text.secondary,
      cursor: "default",
      textAlign: "left",
      fontSize: "1rem",
      "&:hover, &[data-toggled=true]": {
        backgroundColor: colors.secondary,
      },
    },
    box: {
      maxHeight: 0,
      margin: 0,
      padding: 0,
      overflow: "hidden",
      listStyleType: "none",
      transition: "max-height 0.25s ease", //collapse
      "&[data-toggled=true]": {
        maxHeight: 1024,
        transition: "max-height 1s ease", //show
      },
    },
  }));
  const [toggled, setToggled] = useState<boolean>(false);
  const toggleElement = useRef<HTMLAnchorElement>(null);
  const focusType = useRef<"tab" | "click" | "none">("none");
  const nextPath = useRef(
    generatePath(path, {
      categoryId: doc.id,
    })
  );

  const handleToggle = (event: MouseEvent | FocusEvent) => {
    event.preventDefault();

    if (focusType.current !== "none") {
      return;
    }

    focusType.current = event.type === "mousedown" ? "click" : "tab";
    toggleElement.current?.focus();
  };

  const handleClick = () => {
    toggleOn();
  };

  const handleFocus = () => {
    if (focusType.current === "tab") {
      toggleOn();
    }
  };

  const handleBlur = () => {
    const subCategoryIds = window.location.pathname.split("/").slice(1)[2];

    nextPath.current = generatePath(path, {
      categoryId: doc.id,
      subCategoryIds: subCategoryIds ?? undefined,
    });
    focusType.current = "none";
  };

  const toggleOn = () => {
    if (toggle.current) {
      toggle.current(false);
    }
    toggle.current = setToggled;
    setToggled(true);
  };

  useEffect(() => {
    const id = window.location.pathname.split("/").slice(1)[1];

    if (id === doc.id) {
      toggleOn();
    }
  }, []);

  return (
    <div
      css={css.mainCategory}
      onMouseDown={handleToggle}
      onFocusCapture={handleToggle}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <Link
        css={css.label}
        to={nextPath.current}
        data-toggled={toggled ? true : undefined}
        ref={toggleElement}
        onClick={handleClick}
      >
        {doc.label}
      </Link>
      <ul css={css.box} data-toggled={toggled ? true : undefined}>
        {doc.subCategories.map((subCategory) => (
          <CategoryListItem
            key={`category-list-${subCategory.id}`}
            doc={subCategory}
          />
        ))}
      </ul>
    </div>
  );
});
