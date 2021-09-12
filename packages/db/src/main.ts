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
  stats: {
    infractions?: number;
    upvotes?: number;
    downvotes?: number;
    comments?: number;
    threads?: number;
  };
}

interface DesignDocument {
  type: "design";
  views: {
    [key: string]: {
      map: string;
    };
  };
}

interface AppStateDocument {
  type: "app-state";
  isPopulated?: boolean;
}

export interface UserDocument {
  type: "user";
  name: string;
  email: string;
}

export interface PostDocument {
  type: "post";
  creator: UserDocument;
  content: string;
}

export interface ThreadDocument {
  type: "thread";
  creator: UserDocument;
  post: GetDocument<PostDocument>;
  comments: {
    [key: string]: GetDocument<PostDocument>;
  };
  stats: {
    upvotes: number;
    downvotes: number;
    infractions: number;
    comments: number;
  };
}

export interface BlogDocument {
  type: "blog";
  threads: {
    [key: string]: GetDocument<ThreadDocument>;
  };
}

export type AllDocuments =
  | AppStateDocument
  | UserDocument
  | PostDocument
  | ThreadDocument
  | BlogDocument
  | DesignDocument;

type PutDocument<D> = D extends { type: AllDocuments["type"] } ? D : never;

export type GetDocument<D> = D extends { type: AllDocuments["type"] }
  ? D & BaseDocument
  : never;

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
  public db: PouchDB.Database<GetDocument<AllDocuments>>;
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

  public createDoc<T extends AllDocuments>(key: string, doc: PutDocument<T>) {
    return {
      ...doc,
      _id: key,
      timestamp: Date.now(),
      lastModified: Date.now(),
      stats: {
        ...(doc.type === "user"
          ? {
              infractions: 0,
              upvotes: 0,
              downvotes: 0,
              threads: 0,
              comments: 0,
            }
          : doc.type === "post"
          ? {
              infractions: 0,
            }
          : doc.type === "thread"
          ? {
              infractions: 0,
              upvotes: 0,
              downvotes: 0,
              comments: 0,
            }
          : doc.type === "blog"
          ? {
              threads: 0,
              comments: 0,
            }
          : {}),
      },
    };
  }

  public async put(key: string, doc: PutDocument<AllDocuments>) {
    try {
      const oldDoc = await this.db.get(key);
      const newDoc = { ...oldDoc, ...doc };

      this.isEqual(oldDoc, newDoc);
      if (this.options.compareEqualityOnPut && this.isEqual(oldDoc, newDoc))
        return;

      this.db.put({ ...newDoc, lastModified: Date.now() });
    } catch (err) {
      if ((err as any).status === 404) this.db.put(this.createDoc(key, doc));
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
      return undefined;
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

  public async query(key: string) {
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
export { PouchDBContext, PouchDBProvider } from "./context";
