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
  type: string;
  timestamp: number;
  lastModified: number;
}

interface AppStateDocument extends BaseDocument {
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

export interface CommentDocument extends BaseDocument {
  type: "comment";
  user: {
    name: string;
    email: string;
  };
  content: string;
  stats: {
    infractions: number;
  };
}

export interface PostDocument extends BaseDocument {
  type: "post";
  user: {
    name: string;
    email: string;
  };
  content: string;
  upvotes: Map<string, boolean>;
  downvotes: Map<string, boolean>;
  stats: {
    infractions: number;
  };
}

export interface ThreadDocument extends BaseDocument {
  type: "thread";
  user: string;
  post: PostDocument;
  comments: Map<string, CommentDocument>;
  stats: {
    comments: number;
  };
}

export interface BlogDocument extends BaseDocument {
  type: "blog";
  threads: Map<string, ThreadDocument>;
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
  | CommentDocument;

type ExcludeKey<K> = K extends "timestamp" | "lastModified" | "key" ? never : K;
type PutDocument<D extends AllDocuments> = D extends { type: D["type"] }
  ? { [K in ExcludeKey<keyof D>]: D[K] }
  : never;

interface PouchDBWrapperOptions {
  adapter?: "idb" | "leveldb" | "http";
  autoCompact?: boolean;
}

/**
 * PouchDBWrapper - A simple class wrapper for PouchDB.
 */
class PouchDBWrapper {
  private db: PouchDB.Database<AllDocuments>;
  private defaults = {
    adapter: "idb",
    autoCompact: true,
  };
  private options;

  constructor(options?: PouchDBWrapperOptions) {
    this.options = { ...this.defaults, ...options };
    this.db = new PouchDB("dnt_database", {
      adapter: this.options.adapter,
      auto_compaction: this.options.autoCompact,
    });
  }

  public async put(doc: PutDocument<AllDocuments>) {
    try {
      await this.db.put(
        Object.create({
          ...(await this.db.get(doc._id)),
          ...doc,
          lastModified: Date.now(),
        })
      );
    } catch (err: any) {
      if (err.status === 404)
        this.db.put({
          ...doc,
          timestamp: Date.now(),
          lastModified: Date.now(),
        });
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
