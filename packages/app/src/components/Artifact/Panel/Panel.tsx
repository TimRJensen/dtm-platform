/**
 * Vendor imports.
 */
import { useContext } from "react";

/**
 * Custom imports.
 */
import { useCSS } from "../../../hooks";
import { ArtifactType } from "db";
import { AppStateContext } from "../../App/app-state/main";
import { InfoBox } from "./InfoBox/InfoBox";
import { Tag } from "./Tag/Tag";
import { FontIcon } from "../../FontIcon/FontIcon";

/**
 * Types.
 */
interface Props {
  doc: ArtifactType;
  onComment?: () => void;
}

/**
 * Panel functional component.
 */
export function Panel({ doc, onComment }: Props) {
  const { state } = useContext(AppStateContext);
  const { css } = useCSS(({ spacing, colors }) => ({
    panel: {
      gridArea: "panel",
      display: "flex",
      flexFlow: "column",
      height: "fit-content",
      borderLeft: `1px solid ${colors.primary}`,
      padding: spacing,
    },
    fontIcon: {
      paddingTop: spacing,
      borderTop: `1px solid ${colors.primary}`,
    },
  }));

  return (
    <div css={css.panel}>
      <InfoBox title="Category:">{doc.mainCategory.label}</InfoBox>
      <InfoBox title="Subcategory:">{doc.subCategory.label}</InfoBox>
      <InfoBox title="Period:">{doc.period.join(" - ")}</InfoBox>
      <InfoBox title="Tags:">
        {doc.tags.map((tag, i) => (
          <Tag key={`${doc.id}-${tag}-${i}`}>{tag}</Tag>
        ))}
      </InfoBox>
      <FontIcon
        $css={{ fontIcon: css.fontIcon }}
        type="chat_bubble"
        onClick={onComment}
        disabled={!state.currentUser}
      >
        comment
      </FontIcon>
    </div>
  );
}
