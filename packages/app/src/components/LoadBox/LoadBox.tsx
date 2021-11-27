/**
 * Vendor imports
 */

import {
  useState,
  useEffect,
  cloneElement,
  Children,
  useRef,
  ReactElement,
} from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

/**
 * Custom imports.
 */
import { useCSS } from "../../hooks";

/**
 * Types.
 */
interface Props {
  data: any[] | any;
  loadable?: boolean;
  children: ReactElement | ReactElement[] | null;
}

/**
 * LoadBox functional component.
 */
export default function LoadBox({ data, loadable = false, children }: Props) {
  const { css, theme } = useCSS(({}) => ({
    loader: {
      display: "none",
      height: "min(100%)",
      "&[data-toggled=true]": {
        display: "flex",
        justifyContent: "center",
        padding: "30vh 0 0 0",
      },
    },
    child: {
      display: "none",
    },
  }));
  const [loading, setLoading] = useState(true);
  const loaded = useRef(0);

  useEffect(() => {
    if (!loadable && data) {
      setLoading(false);
      return;
    }

    if (!data) {
      setLoading(true);
    }
  }, [data]);

  const handleLoad = () => {
    if (!data) {
      return;
    }

    loaded.current++;

    if (loaded.current === data.length) {
      setLoading(false);
      loaded.current = 0;
    }
  };

  return (
    <section onLoad={loadable ? handleLoad : undefined}>
      <div css={css.loader} data-toggled={loading}>
        <PacmanLoader color={theme.colors.secondary} />
      </div>
      {Children.map(children, (child) =>
        child
          ? cloneElement(child, {
              css: loading ? css.child : child.props.css,
            })
          : null
      )}
    </section>
  );
}
