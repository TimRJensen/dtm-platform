/**
 * Vendor imports.
 */
import { createContext } from "react";

/**
 * Custom imports.
 */
import { PouchDB } from "./db";

/**
 * PouchDB context.
 */
export const PouchDBContext = createContext({} as PouchDB);
export const PouchDBProvider = PouchDBContext.Provider;
