/**
 * Vendor imports.
 */
import { createContext } from "react";

/**
 * Custom imports.
 */
import Supabase from "./main";

/**
 * DB context.
 */
export const SupabaseContext = createContext<Supabase>({} as Supabase);
export const SupabaseProvider = SupabaseContext.Provider;
