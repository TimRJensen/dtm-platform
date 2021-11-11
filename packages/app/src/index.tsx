/**
 * Vendor imports.
 */
import { render } from "react-dom";

/**
 * Custom imports.
 */
import Supabase from "db";
import App from "./components/App/App";

/**
 * App initialization.
 */
render(<App db={new Supabase()} />, document.getElementById("app"));
