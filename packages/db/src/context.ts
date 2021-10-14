/**
 * Vendor imports.
 */
import { createContext } from "react";

/**
 * Custom imports.
 */
import { DB } from "./main";

/**
 * DB context.
 */
export const DBContext = createContext<DB>({} as DB);
export const DBProvider = DBContext.Provider;
