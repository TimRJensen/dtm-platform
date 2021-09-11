/**
 * Vendor imports.
 */
import PouchDB from "pouchdb-browser";
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
  comments: GetDocument<PostDocument>[];
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

interface DesignDoc {
  type: "design";
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
  | DesignDoc;

interface PouchDBWrapperOptions {
  adapter?: "idb" | "leveldb" | "http";
  autoCompact?: boolean;
  compareEqualityOnPut?: boolean;
  maps?: {
    id: string;
    map: (doc: GetDocument<AllDocuments>) => void;
  }[];
}

/**
 * PouchDBWrapper - A simple class wrapper for PouchDB.
 */
class PouchDBWrapper {
  private db: PouchDB.Database<GetDocument<AllDocuments>>;
  private defaults = {
    adapter: "idb",
    autoCompact: true,
    compareEqualityOnPut: true,
    maps: [],
  };
  private options;

  constructor(options?: PouchDBWrapperOptions) {
    this.options = { ...this.defaults, ...options };
    this.db = new PouchDB("dnt_database", {
      adapter: this.options.adapter,
      auto_compaction: this.options.autoCompact,
    });

    if (this.options.maps.length)
      for (let map of this.options.maps) this.addMap(map.id, map.map);
  }

  private isEqual(a: any, b: any): boolean {
    let result = true;

    for (let key in a) {
      const t = typeof a[key];

      if (typeof a[key] === "object" && typeof b[key] === "object") {
        if (a[key] === null) result = a[key] === b[key];
        else if (Array.isArray(a[key])) {
          let i = -1;

          result = a[key].length === b[key].length;

          while (++i < a[key].length && result)
            result = this.isEqual(a[key][i], b[key][i]);
        } else result = this.isEqual(a[key], b[key]);
      } else if (typeof a[key] === "function")
        result = a[key].toString() === b[key].toString();
      else result = a[key] === b[key];

      if (!result) break;
    }

    return result;
  }

  public async put(key: string, doc: AllDocuments) {
    try {
      const oldDoc = await this.db.get(key);
      const newDoc = { ...oldDoc, ...doc };

      if (this.options.compareEqualityOnPut && this.isEqual(oldDoc, newDoc))
        return;

      this.db.put({ ...newDoc, lastModified: Date.now() });
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
      console.log(err, this.get.name);
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

  public async find(
    fields: string[],
    selector: {
      selector: { [key: string]: any };
      sort?: string[];
      limit?: number;
    }
  ) {
    try {
      await this.db.createIndex({
        index: {
          fields,
        },
      });

      return this.db.find(selector);
    } catch (err) {
      console.log(err, this.find.name);
    }
  }

  public async addMap(
    key: string,
    map: (doc: GetDocument<AllDocuments>) => void
  ) {
    this.put(`_design/${key}-index`, {
      type: "design",
      views: {
        [key]: {
          map: map.toString(),
        },
      },
    });
  }

  public async query(key: string): Promise<GetDocument<AllDocuments>[]> {
    try {
      const result = await this.db.query(`${key}-index/${key}`);

      return result.rows.map((row) => row.key);
    } catch (err) {
      console.log(err, this.query.name);
      return [];
    }
  }

  public async clearView() {
    try {
      await this.db.viewCleanup();
    } catch (err) {
      console.log(err, this.clearView.name);
    }
  }

  public async info() {
    try {
      return await this.db.info();
    } catch (err) {
      console.log(err, this.info.name);
    }
  }
}

PouchDB.plugin(PouchDbFind);

export { PouchDBWrapper as PouchDB };
