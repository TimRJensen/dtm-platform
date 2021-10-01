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
  db.put({
    type: "app-state",
    _id: "app-state",
    isPopulated: true,
  });
}
createMockData();

// @ts-ignore
if (module.hot)
  // @ts-ignore
  module.hot.accept("./components/App/App.tsx", () => {
    hotRender();
  });

function hotRender() {
  const { App } = require("./components/App/App");

  render(<App db={db} />, document.getElementById("app"));
}
hotRender();
