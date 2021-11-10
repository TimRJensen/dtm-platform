/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { LoadBox } from "../../components/LoadBox/LoadBox";

/**
 * Types.
 */
interface Props {}

/**
 * pending functional component.
 */
export default function pending({}: Props) {
  return <LoadBox loadables={undefined}>{null}</LoadBox>;
}
