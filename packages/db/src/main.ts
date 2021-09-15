/**
 * Vendor imports.
 */
import PouchDB from "pouchdb-browser";
import PouchDbFind from "pouchdb-find";
import { pathToRegexp } from "path-to-regexp";

/**
 * Types.
 */
export interface BaseDocument {
  _id: string;
  key: string;
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
  isPopulated: boolean;
}

export interface UserDocument extends BaseDocument {
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

export interface PostDocument extends BaseDocument {
  type: "post";
  creator: UserDocument;
  content: string;
  stats: {
    infractions: number;
  };
}

export interface ThreadDocument extends BaseDocument {
  type: "thread";
  creator: UserDocument;
  post: PostDocument;
  comments: {
    [key: string]: PostDocument;
  };
  stats: {
    comments: number;
    upvotes: number;
    downvotes: number;
  };
}

export interface BlogDocument extends BaseDocument {
  type: "blog";
  threads: {
    [key: string]: ThreadDocument;
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

type ExcludeKey<K> = K extends keyof BaseDocument ? never : K;
type PutDocument<T, D = AllDocuments> = D extends {
  type: T;
}
  ? { [K in ExcludeKey<keyof D>]: D[K] }
  : never;

interface PouchDBWrapperOptions {
  adapter?: "idb" | "leveldb" | "http";
  autoCompact?: boolean;
  compareEqualityOnPut?: boolean;
  maps?: {
    id: string;
    map: (doc: DesignDocument) => void;
  }[];
}

/**
 * PouchDBWrapper - A simple class wrapper for PouchDB.
 */
class PouchDBWrapper {
  private db: PouchDB.Database<AllDocuments>;
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
    type: T,
    _id: string,
    doc: PutDocument<T>
  ) {
    return {
      ...doc,
      _id,
      type,
      key: pathToRegexp("/:typeid/:name/:thread?/:post?")
        .exec(_id)!
        .slice(-1)[0],
      timestamp: Date.now(),
      lastModified: Date.now(),
    };
  }

  public async put(_id: string, doc: AllDocuments) {
    try {
      await this.db.put({
        ...(await this.db.get(_id)),
        ...doc,
        lastModified: Date.now(),
      });
    } catch (err: any) {
      if (err.status === 404)
        return this.db.put(this.createDoc(doc.type, _id, doc));

      if ((err as any).status === 409) {
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

  public async get<D extends AllDocuments>(
    _id: string
  ): Promise<D | undefined> {
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

  public async addMap(_id: string, map: (doc: DesignDocument) => void) {
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
