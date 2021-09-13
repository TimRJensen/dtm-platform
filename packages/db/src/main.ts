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
  stats: {
    infractions: number;
    upvotes: number;
    downvotes: number;
    comments: number;
    threads: number;
  };
}

export interface PostDocument {
  type: "post";
  creator: UserDocument;
  content: string;
  stats: {
    infractions: number;
  };
}

export interface ThreadDocument {
  type: "thread";
  creator: UserDocument;
  post: GetDocument<PostDocument, "post">;
  comments: {
    [key: string]: GetDocument<PostDocument, "post">;
  };
  stats: {
    comments: number;
    upvotes: number;
    downvotes: number;
  };
}

export interface BlogDocument {
  type: "blog";
  threads: {
    [key: string]: GetDocument<AllDocuments, "thread">;
  };
  stats: {
    comments: number;
    threads: number;
  };
}

export type AllDocuments =
  | AppStateDocument
  | UserDocument
  | PostDocument
  | ThreadDocument
  | BlogDocument
  | DesignDocument;

export type GetDocument<D, T> = D extends { type: T }
  ? D & BaseDocument
  : never;

type PutDocument<D, T extends AllDocuments["type"]> = D extends { type: T }
  ? D
  : never;

interface PouchDBWrapperOptions {
  adapter?: "idb" | "leveldb" | "http";
  autoCompact?: boolean;
  compareEqualityOnPut?: boolean;
  maps?: {
    id: string;
    map: (doc: GetDocument<AllDocuments, AllDocuments["type"]>) => void;
  }[];
}

/**
 * PouchDBWrapper - A simple class wrapper for PouchDB.
 */
class PouchDBWrapper {
  private db: PouchDB.Database<GetDocument<AllDocuments, AllDocuments["type"]>>;
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
      if (typeof a[key] === "object" && typeof b[key] === "object")
        if (a[key] === null) result = a[key] === b[key];
        else if (Array.isArray(a[key])) {
          let i = -1;

          result = a[key].length === b[key].length;

          while (++i < a[key].length && result)
            result = this.isEqual(a[key][i], b[key][i]);
        } else result = this.isEqual(a[key], b[key]);
      else if (typeof a[key] === "function")
        result = a[key].toString() === b[key].toString();
      else result = a[key] === b[key];

      if (!result) break;
    }

    return result;
  }

  public createDoc<T extends AllDocuments["type"]>(
    _id: string,
    doc: PutDocument<AllDocuments, T>
  ) {
    return {
      ...doc,
      _id,
      timestamp: Date.now(),
      lastModified: Date.now(),
      stats: {
        ...(doc.type === "post"
          ? { infractions: 0 }
          : doc.type === "thread"
          ? { upvotes: 0, downvotes: 0, comments: 0 }
          : doc.type === "blog"
          ? { threads: 0, comments: 0 }
          : doc.type === "user"
          ? {
              infractions: 0,
              upvotes: 0,
              downvotes: 0,
              comments: 0,
              threads: 0,
            }
          : {}),
      },
    };
  }

  public async put<T extends AllDocuments["type"]>(
    _id: string,
    doc: PutDocument<AllDocuments, T>
  ) {
    try {
      const oldDoc = await this.db.get(_id);
      const newDoc = { ...oldDoc, ...doc };

      if (this.options.compareEqualityOnPut && this.isEqual(oldDoc, newDoc))
        return;

      return this.db.put({ ...newDoc, lastModified: Date.now() });
    } catch (err) {
      if ((err as any).status === 404) {
        return this.db.put(this.createDoc<T>(_id, doc));
      } else if ((err as any).status === 409) {
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

  public async get<T extends AllDocuments["type"]>(
    _id: string
  ): Promise<GetDocument<AllDocuments, T> | undefined> {
    try {
      return await this.db.get(_id);
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
    _id: string,
    map: (doc: GetDocument<AllDocuments, AllDocuments["type"]>) => void
  ) {
    this.put(`_design/${_id}-index`, {
      type: "design",
      views: {
        [_id]: {
          map: map.toString(),
        },
      },
    });
  }

  public async query(_id: string) {
    try {
      const result = await this.db.query(`${_id}-index/${_id}`);

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
