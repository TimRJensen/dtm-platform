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

export type GetDocument<T> = T & BaseDocument;

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
  threads:
    | [
        {
          stats?: {
            infractions: number;
          };
        }
      ]
    | undefined;
}

interface ModelDoc {
  type: "design";
  //_id: string;
  views: {
    [key: string]: {
      map: string;
    };
  };
}

export type AllDocuments =
  | AppStateDocument
  | UserDocument
  | PostDocument
  | ThreadDocument
  | BlogDocument
  | ModelDoc
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
        console.log(err, this.get.name);
      }
    }
  }

  public async putMany(docs: any[]) {
    try {
      this.db.bulkDocs(docs);
    } catch (err) {
      console.log(err, this.putMany.name);
    }
  }

  public async get(key: string) {
    try {
      return await this.db.get(key);
    } catch (err) {
      console.log(err, this.get.name);
    }
  }

  public async addQuery(
    key: string,
    map: string | ((doc: GetDocument<AllDocuments>) => void)
  ) {
    this.put("_design/customIndex", {
      type: "design",
      views: {
        [key]: {
          map: map.toString(),
        },
      },
    });
  }

  public async query(
    key: string,
    map: (doc: GetDocument<AllDocuments>) => void
  ): Promise<GetDocument<AllDocuments>[]> {
    try {
      await this.put("_design/customIndex", {
        type: "design",
        views: {
          [key]: {
            map: map.toString(),
          },
        },
      });

      const result = await this.db.query(`customIndex/${key}`);

      console.log(result);
      return result.rows.map((row) => row.key);
    } catch (err) {
      console.log(err, this.query.name);
      return [];
    }
  }

  public async destroy() {
    try {
      await this.db.destroy();
    } catch (err) {
      console.log(err);
    }
  }

  public async clearView() {
    try {
      await this.db.viewCleanup();
      await this.db.compact();
    } catch (err) {
      console.log(err, this.clearView.name);
    }
  }
}

export { PouchDBWrapper as PouchDB };
