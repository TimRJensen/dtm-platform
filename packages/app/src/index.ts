/**
 * Vendor imports.
 */
import { render } from "react-dom";
import { mockData } from "mock-data";
//import * as axios from "axios";

/**
 * Custom imports.
 */
import { App } from "./components/App/App";
import { PouchDB } from "db";

/**
 * App initialization.
 */
const db = new PouchDB();

(async function fetchData() {
  const doc = await db.get("app-state");

  if (doc && doc.type === "app-state" && doc.isPopulated) return;

  await mockData(db, { numberOfBlogs: 25 });
  await db.put("app-state", {
    type: "app-state",
    isPopulated: true,
  });
})();

(async function putTestData() {
  await db.put("test-1", {
    type: "test",
    nested: { value: "Ave Terra!" },
    threads: [{ stats: { infractions: 1 } }],
  });
  await db.put("test-2", {
    type: "test",
    nested: { value: "Hello World!" },
    threads: undefined,
  });
})();

render(App({ db: db }), document.getElementById("app"));
db.find("type");
