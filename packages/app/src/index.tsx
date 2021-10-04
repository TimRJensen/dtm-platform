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

async function createMockData() {
  const doc = await db.get("app-state");

  if (doc && doc.type === "app-state" && doc.isPopulated) {
    render(<App db={db} />, document.getElementById("app"));
    return;
  }

  const { mockData } = await import("mock-data");

  await mockData(db);
  await db.put({
    type: "app-state",
    _id: "app-state",
    isPopulated: true,
  });
  render(<App db={db} />, document.getElementById("app"));
}
createMockData();
