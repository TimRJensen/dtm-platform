/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { ArtifactType } from "db";
import { useCSS } from "../../../hooks";
import { InfoBox } from "../../Artifact/Panel/InfoBox/InfoBox";

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
      <InfoBox title="Category:">{doc.mainCategory.label}</InfoBox>
      <InfoBox title="Subcategory:">{doc.subCategory.label}</InfoBox>
      <InfoBox title="Period:">{doc.period.join(" - ")}</InfoBox>
    </div>
  );
}
