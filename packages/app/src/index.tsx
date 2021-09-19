/**
 * Vendor imports.
 */
import { render } from "react-dom";

/**
 * Custom imports.
 */
import { PouchDB } from "db";
import { App } from "./components/App/App";

/**
 * App initialization.
 */
const db = new PouchDB();

db.clearView();

async function createMockData() {
  const doc = await db.get("app-state");

  if (doc && doc.type === "app-state" && doc.isPopulated) return;

  const { mockData } = await import("mock-data");

  mockData(db);
  db.put(
    "app-state",
    db.createDoc("app-state", "app-state", {
      isPopulated: true,
    })
  );
}
createMockData();

render(<App db={db} />, document.getElementById("app"));
