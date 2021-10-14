/**
 * Vendor imports.
 */
import { render } from "react-dom";

/**
 * Custom imports.
 */
import { DB } from "db";
import { App } from "./components/App/App";

/**
 * App initialization.
 */
const db = new DB();
render(<App db={db} />, document.getElementById("app"));
