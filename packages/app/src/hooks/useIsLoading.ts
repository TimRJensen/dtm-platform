/**
 * Vendor imports.
 */
import { useEffect, useState } from "react";

/**
 * Custom imports.
 */
import { ArtifactDocument, BlogDocument } from "db";

/**
 * useOnLoad
 */
export const useIsLoading = function useIsLoading(
  docs: (ArtifactDocument | BlogDocument)[]
) {
  const [isLoading, setIsLoading] = useState(true);
  let loaded = 0;

  return {
    isLoading: (flag?: boolean) => {
      if (flag === undefined) return isLoading;

      setIsLoading(flag);
    },
    onLoad: () => {
      if (++loaded === docs.length) setIsLoading(false);
    },
  };
};
