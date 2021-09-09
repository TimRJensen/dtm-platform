/**
 * Vendor imports.
 */
import PouchDB from "pouchdb";
import PouchDbFind from "pouchdb-find";

/**
 * Types.
 */
export interface BaseDocument {
  _id: string;
  timestamp: number;
  lastModified: number;
}

type GetDocument<T> = T & BaseDocument;

interface DocumentStats {
  posts: number;
  upvotes: number;
  downvotes: number;
  infractions: number;
}

interface AppStateDocument {
  type: "app-state";
  isPopulated?: boolean;
}

export interface UserDocument {
  type: "user";
  name: string;
  email: string;
  stats: DocumentStats;
}

export interface PostDocument {
  type: "post";
  creator: UserDocument;
  content: string;
  stats: Pick<DocumentStats, "infractions">;
}

export interface ThreadDocument {
  type: "thread";
  creator: UserDocument;
  post: GetDocument<PostDocument>;
  posts: GetDocument<PostDocument>[];
  stats: DocumentStats;
}

export interface BlogDocument {
  type: "blog";
  threads: GetDocument<ThreadDocument>[];
  stats: {
    threads: number;
    posts: number;
  };
}

interface TestDocument {
  type: "test";
  nested: {
    value: string;
  };
  threads: [
    {
      stats?: {
        infractions: number;
      };
    }
  ];
}

type AllDocuments =
  | AppStateDocument
  | UserDocument
  | PostDocument
  | ThreadDocument
  | BlogDocument
  | TestDocument;

/**
 * PouchDBWrapper - A simple class wrapper for PouchDB.
 */
class PouchDBWrapper {
  private db: PouchDB.Database<GetDocument<AllDocuments>>;

  constructor() {
    PouchDB.plugin(PouchDbFind);
    this.db = new PouchDB("dnt_database", { adapter: "idb" });
  }

  public async put(key: string, doc: AllDocuments) {
    try {
      this.db.put({
        ...(await this.db.get(key)),
        ...doc,
        lastModified: Date.now(),
      });
    } catch (err) {
      if ((err as any).status === 404)
        this.db.put({
          ...doc,
          _id: key,
          timestamp: Date.now(),
          lastModified: Date.now(),
        });
      else if ((err as any).status === 409) {
      }
    }
  }

  public async putMany(docs: any[]) {
    try {
      this.db.bulkDocs(docs);
    } catch (err) {
      console.log(err);
    }
  }

  public async get(key: string) {
    try {
      return await this.db.get(key);
    } catch (err) {}
  }

  public async find(fields: string | string[]) {
    const test = await this.db.createIndex({
      index: {
        //fields: Array.isArray(fields) ? fields : [fields],
        fields: ["threads.stats.posts"],
      },
    });
    const docs = await this.db.find({
      selector: {
        "threads.stats.posts": { $gte: 0 },
      },
    });
    console.log(docs, test);
  }

  public async destroy() {
    try {
      await this.db.destroy();
    } catch (err) {
      console.log(err);
    }
  }
}

export { PouchDBWrapper as PouchDB };
