/**
 * Vendor imports.
 */
import { useEffect, useRef } from "react";
import { useRouteMatch } from "react-router-dom";

/**
 * Custom imports.
 */
import { AllDocuments } from "db";

/**
 * useRouteMatch hook.
 */
export const useScrollElement = function useScrollElement(doc: AllDocuments) {
  const match = useRouteMatch();
  const domElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (match.url === doc._id && domElement.current) {
      const rect = domElement.current?.getBoundingClientRect();

      if (rect.top > window.scrollY)
        window.scrollTo(0, rect.bottom - window.innerHeight / 2);
    }
  }, []);

  return {
    domElement,
  };
};
