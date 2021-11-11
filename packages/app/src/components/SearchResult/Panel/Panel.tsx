/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { ArtifactType } from "db";
import { useCSS } from "../../../hooks";
import InfoPanelItem from "../../InfoPanelItem/InfoPanelItem";

/**
 * Types.
 */
interface Props {
  doc: ArtifactType;
}

/**
 * Panel functional component
 */
export function Panel({ doc }: Props) {
  const { css } = useCSS(({ spacing, colors, sizes: { blog } }) => ({
    panel: {
      gridArea: "panel",
      display: "flex",
      flexFlow: "column",
      height: "fit-content",
      width: `${blog.width * 0.1}vw`,
      borderLeft: `1px solid ${colors.primary}`,
      padding: spacing,
    },
  }));

  return (
    <div css={css.panel}>
      <InfoPanelItem title="Category:">{doc.mainCategory.label}</InfoPanelItem>
      <InfoPanelItem title="Subcategory:">
        {doc.subCategory.label}
      </InfoPanelItem>
      <InfoPanelItem title="Period:">{doc.period.join(" - ")}</InfoPanelItem>
    </div>
  );
}
