/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { PostType, CommentType } from "db";
import { useCSS } from "../../hooks";
import { formatDate } from "../../util/main";
import { Dropdown } from "./Dropdown/Dropdown";

/**
 * Types.
 */
interface Props {
  doc: PostType | CommentType;
  onEdit: () => void;
}

/**
 * MessageHeader functional component.
 */
export function MessageHeader({ doc, onEdit }: Props) {
  const { css } = useCSS(({ spacing, borderRadius, colors }) => ({
    messageHeader: {
      display: "flex",
      height: `calc(1rem + ${2 * spacing}px)`,
      overflow: "hidden",
      padding: `0 0 0 ${spacing}px`,
      borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
      backgroundColor: colors.primary,
      lineHeight: `calc(1rem + ${2 * spacing}px)`,
      color: colors.text.secondary,
    },
    link: {
      cursor: "pointer",
    },
    linkDisabled: {
      cursor: "default",
      color: colors.text.disabled,
    },
    info: { marginRight: "auto" },
  }));

  return (
    <div css={css.messageHeader}>
      <div css={css.info}>
        {`${formatDate(doc.createdAt)} by `}
        <span>{doc.user.displayName}</span>
      </div>
      <Dropdown onEdit={onEdit} />
    </div>
  );
}
