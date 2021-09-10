/**
 * Vendor imports.
 */
import { render } from "react-dom";
import { mockData } from "mock-data";

/**
 * Custom imports.
 */
import { App } from "./components/App/App";
import { PouchDB } from "db";
import { GetDocument, AllDocuments } from "db/src/db";

/**
 * App initialization.
 */
const db = new PouchDB();

(async function fetchData() {
  const doc = await db.get("app-state");

  if (doc && doc.type === "app-state" && doc.isPopulated) return;

  mockData(db);
  db.put("app-state", {
    type: "app-state",
    isPopulated: true,
  });
})();

async function test() {
  const docs = await db.query(
    "find-upvotes",
    (doc: GetDocument<AllDocuments>) => {
      if (doc.type === "blog")
        for (let thread of doc.threads)
          if (thread.stats.upvotes > 0) emit(thread);
    }
  );

  console.log(
    docs.length
      ? docs[0].type === "thread"
        ? docs[0].stats.upvotes
        : "nay"
      : ""
  );
}

render(<App db={db} />, document.getElementById("app"));
db.clearView();
//test();
