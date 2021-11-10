/**
 * Vendor imports.
 */
import {
  createClient,
  SupabaseClient,
  AuthChangeEvent,
  Session,
  PostgrestError,
} from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

/**
 * Types.
 */
export type ErrorType = PostgrestError | { message: string; status: number };

/* BaseTable. */
interface BaseTable {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/* ProfileTable. */
export interface ProfileTable extends BaseTable {
  firstName: string;
  lastName: string;
  city: string;
  region: string;
  country: string;
  interests: string[];
}

/* UserTable & UserType. */
export interface AccountTable extends BaseTable {
  profileId: string;
  role: "anon" | "authenticated";
  email: string;
  verified: boolean;
  displayName: string;
  stats: {
    infractions: number;
    totalPosts: number;
    totalComments: number;
    totalUpvotes: number;
    totalDownvotes: number;
  };
}
export type AccountType = AccountTable;
export type UserType = Omit<
  AccountTable,
  "createdAt" | "updatedAt" | "profileId"
>;

/* CategoryTable & CategoryType. */
export interface CategoryTable extends BaseTable {
  label: string;
  raw: string;
}
export type CategoryType = Pick<CategoryTable, "id" | "label"> & {
  subCategories: SubCategoryType[];
};

/* SubCategoryTable & SubCategoryType. */
export interface SubCategoryTable extends BaseTable {
  mainCategoryId: string;
  label: string;
  raw: string;
}
export type SubCategoryType = Pick<SubCategoryTable, "id" | "label"> & {
  mainCategory: Pick<CategoryType, "id">;
};

/* BlogTable & BlogType. */
export interface BlogTable extends BaseTable {
  artifactId: string;
  stats: {
    views: number;
    posts: number;
  };
}
export type BlogType = Pick<BlogTable, "id" | "createdAt" | "stats"> & {
  artifact: ArtifactType;
  posts: PostType[];
};

/* GridItemType & GridItemFromCategory. */
export type GridItemType = Pick<
  BlogType,
  "id" | "createdAt" | "stats" | "artifact"
>;
export type GridItemFromCategory = {
  id: string;
  label: string;
  gridItems: GridItemType[];
};

/* ArtifactTable & ArtifactType. */
export interface ArtifactTable extends BaseTable {
  blogId: string;
  mainCategoryId: string;
  subCategoryId: string;
  label: string;
  content: string;
  image: string;
  period: string[];
  tags: string[];
}
export type ArtifactType = Pick<
  ArtifactTable,
  "id" | "createdAt" | "label" | "image" | "content" | "period" | "tags"
> & {
  blog: Pick<BlogType, "id">;
  mainCategory: Pick<CategoryTable, "id" | "label">;
  subCategory: Pick<SubCategoryTable, "id" | "label">;
};

/* PostTable & PostType. */
export interface PostTable extends BaseTable {
  blogId: string;
  accountId: string;
  content: string;
  upvotes: string[];
  downvotes: string[];
  stats: {
    shadowBanned: boolean;
    infractions: number;
    totalUpvotes: number;
    totalDownvotes: number;
    totalComments: number;
  };
}
export type PostType = Pick<
  PostTable,
  "id" | "createdAt" | "content" | "upvotes" | "stats"
> & { user: Pick<AccountTable, "id" | "displayName">; comments: CommentType[] };

/* CommentTable & CommentType. */
export interface CommentTable extends BaseTable {
  postId: string;
  accountId: string;
  content: string;
  stats: {
    shadowBanned: boolean;
    infractions: number;
  };
}
export type CommentType = Pick<
  CommentTable,
  "id" | "content" | "createdAt" | "stats"
> & { user: Pick<AccountTable, "id" | "displayName"> };

/* AllTables. */
export type AllTables =
  | ProfileTable
  | AccountTable
  | CategoryTable
  | SubCategoryTable
  | ArtifactTable
  | CommentTable
  | PostTable
  | BlogTable;

/* AllTableNames. */
export type AllTableNames =
  | "profiles"
  | "accounts"
  | "main_categories"
  | "sub_categories"
  | "artifacts"
  | "comments"
  | "posts"
  | "blogs";

/**
 * SupabaBaseWrapper - A simple class wrapper for DB.
 */
const host =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://reyohguqhuhpukmdbeva.supabase.co";
const key =
  process.env.NODE_ENV === "development"
    ? process.env.SUPABASE_DEV_ANON_KEY
    : process.env.SUPABASE_PROD_ANON_KEY;
const redirectURL = `${
  process.env.NODE_ENV === "development"
    ? "http://localhost:1234"
    : /*"https://dtmplatform.vercel.app/"*/ process.env.BASE_URL
}/account/verified`;

// N.B. Remove this eventually
if (process.env.NODE_ENV === "development") {
  console.log("dev");
}

class SupabaBaseWrapper {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(host, key ?? "");
  }

  async select<T>(
    table: AllTableNames,
    query: string,
    {
      range = { from: 0, to: 100 },
    }: {
      range?: { from: number; to: number };
    }
  ) {
    const response = await this.supabase
      .from<T>(table)
      .select(query)
      .order("createdAt" as keyof T, {
        ascending: false,
      })
      .range(range.from, range.to - 1);

    if (response.error) {
      return response;
    }

    return response.data;
  }

  async selectExact<T>(
    table: AllTableNames,
    query: string,
    { match }: { match: { [column: string]: string } }
  ) {
    const response = await this.supabase
      .from<T>(table)
      .select(query)
      .match(match)
      .limit(1)
      .single();

    if (response.error) {
      return response;
    }

    return response.data;
  }

  async selectMany<T>(
    table: AllTableNames,
    query: string,
    {
      filter,
      range = { from: 0, to: 100 },
    }: {
      filter: { values: string[]; foreignTable?: string };
      range?: { from: number; to: number };
    }
  ) {
    const response = await this.supabase
      .from<T>(table)
      .select(query)
      .or(
        filter.values.map((value) => "id.eq." + value).join(","),
        filter.foreignTable ? { foreignTable: filter.foreignTable } : undefined
      )
      .range(range.from, range.to);

    if (response.error) {
      return response;
    }

    return response.data;
  }

  async selectFuzzy<T>(
    table: AllTableNames,
    query: string,
    {
      filter,
      count,
      range = { from: 0, to: 100 },
    }: {
      filter: {
        column: string;
        values: string[];
        type?: "plain" | "phrase" | "websearch";
        config?: string;
      };
      count?: "exact";
      range?: { from: number; to: number };
    }
  ) {
    const response = await this.supabase
      .from<T>(table)
      .select(query, { count: count ?? null })
      .or(
        filter.values
          .map((value) => `${filter.column}.ilike.%${value}%`)
          .join(",")
      )
      .range(range?.from, range?.to - 1);

    if (!response.error) {
      // @ts-ignore
      delete response.error;
    }

    return response;
  }

  async has<T extends AllTables>(
    table: AllTableNames,
    query: string,
    match: Partial<T>
  ) {
    const response = await this.supabase
      .from<T>(table)
      .select(query, { head: true, count: "exact" })
      .match(match);

    if (response.error) {
      return response;
    }

    return response.count! > 0;
  }

  async insert<T extends AllTables>(
    table: AllTableNames,
    values: Omit<T, keyof BaseTable>[]
  ) {
    const now = new Date().toISOString();

    const response = await this.supabase
      .from<Omit<T, keyof BaseTable> & BaseTable>(table)
      .insert(
        values.map((value) => ({
          ...value,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
        }))
      );

    if (response.error) {
      return response;
    }

    return response.data;
  }

  async update<T extends AllTables>(
    table: AllTableNames,
    value: Omit<Partial<T>, keyof BaseTable> & { id: string },
    match?: Partial<T>
  ) {
    const response = await this.supabase
      .from<typeof value & Partial<BaseTable>>(table)
      .update({ ...value, updatedAt: new Date().toISOString() })
      .match(match ?? { id: value.id });

    if (response.error) {
      return response;
    }

    return response.data;
  }

  async signUp(
    email: string,
    password: string,
    {
      firstName,
      lastName,
      city,
      region,
      country,
    }: {
      firstName: string;
      lastName: string;
      city: string;
      region: string;
      country: string;
    }
  ) {
    const { user, error } = await this.supabase.auth.signUp(
      { email, password },
      {
        redirectTo: redirectURL,
      }
    );

    if (error) {
      console.log(error);
      return { error };
    }

    const profileInsert = await this.insert<ProfileTable>("profiles", [
      {
        firstName,
        lastName,
        region,
        city,
        country,
        interests: [],
      },
    ]);

    if ("error" in profileInsert) {
      return profileInsert;
    }

    const [profile] = profileInsert;
    const accountInsert = await this.supabase
      .from<AccountTable>("accounts")
      .insert([
        {
          id: user?.id,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
          profileId: profile.id,
          role: user?.role as AccountTable["role"],
          email,
          displayName: `${profile.firstName} ${profile.lastName}`,
          stats: {
            infractions: 0,
            totalComments: 0,
            totalPosts: 0,
            totalDownvotes: 0,
            totalUpvotes: 0,
          },
        },
      ]);

    if (accountInsert.error) {
      console.log(accountInsert.error);
      return accountInsert;
    }

    return accountInsert.data[0];
  }

  onAuthChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    this.supabase.auth.onAuthStateChange(callback);
  }

  currentUser() {
    return this.supabase.auth.user();
  }
}

export { SupabaBaseWrapper as DB };
export { DBContext, DBProvider } from "./context";
