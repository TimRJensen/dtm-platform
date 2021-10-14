/**
 * Vendor imports.
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { date, datatype, internet, lorem, name, address } from "faker";
import { v4 as uuidv4 } from "uuid";

/**
 * Custom imports.
 */
import {
  AccountTable,
  CategoryTable,
  SubCategoryTable,
  ArtifactTable,
  CommentTable,
  PostTable,
  BlogTable,
  ProfileTable,
} from "db";

/**
 * mockData - Just a single function that populates a DB with mockdata.
 */
interface MockDataOptions {
  numberOfBlogs?: number;
  numberofUsers?: number;
}

export const mockData = async function mockData(
  client: SupabaseClient,
  userOptions?: MockDataOptions
) {
  const defaults = {
    numberOfBlogs: datatype.number({ min: 50, max: 75 }),
    numberOfUsers: datatype.number({ min: 90, max: 200 }),
  };
  const options = {
    ...defaults,
    ...userOptions,
  };
  const now = new Date();

  /**
   * Create fake users.
   */
  const profiles: ProfileTable[] = [];
  const users: AccountTable[] = [];

  for (let i = 0; i < options.numberOfUsers; i++) {
    const createdAt = date
      .past(datatype.number({ min: 0, max: 8 }), now)
      .toISOString();

    const profile = {
      id: uuidv4(),
      createdAt,
      updatedAt: date.between(createdAt, now).toISOString(),
      firstName: name.firstName(),
      lastName: name.lastName(),
      city: address.city(),
      region: address.state(),
      country: address.country(),
      focus: [],
    };
    profiles.push(profile);

    users.push({
      id: profile.id,
      profileId: profile.id,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      role: "authenticated",
      displayName: `${profile.firstName} ${profile.lastName}`,
      email: internet.email(),
      stats: {
        totalPosts: datatype.number({ min: 1, max: 20 }),
        totalComments: datatype.number({ min: 1, max: 80 }),
        totalUpvotes:
          Math.random() < 0.15 ? datatype.number({ min: 0, max: 50 }) : 0,
        totalDownvotes:
          Math.random() < 0.07 ? datatype.number({ min: 0, max: 20 }) : 0,
        infractions:
          Math.random() < 0.05 ? datatype.number({ min: 0, max: 10 }) : 0,
      },
    });
  }

  /**
   * Create fake categories.
   */
  const mainCategories: CategoryTable[] = [];
  const subCategories: SubCategoryTable[] = [];

  for (let i = 0; i < 15; i++) {
    const mainCategory = {
      id: uuidv4(),
      raw: `${datatype.number({ min: 100, max: 160 })}`,
      label: lorem.words(datatype.number({ min: 1, max: 2 })),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    mainCategories.push(mainCategory);

    for (let i = 0; i < datatype.number({ min: 1, max: 4 }); i++) {
      subCategories.push({
        id: uuidv4(),
        mainCategoryId: mainCategory.id,
        raw: `${datatype.number({ min: 10, max: 50 })}`,
        label: lorem.words(datatype.number({ min: 1, max: 2 })),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
    }
  }

  /**
   * Create fake blogs.
   */
  const blogs: Omit<BlogTable, "artifactId">[] = [];
  const artifacts: ArtifactTable[] = [];
  const posts: PostTable[] = [];
  const comments: CommentTable[] = [];

  for (let i = 0; i < 100; i++) {
    const createdAt = date
      .past(datatype.number({ min: 3, max: 8 }), now)
      .toISOString();
    const mainCategory =
      mainCategories[datatype.number(mainCategories.length - 1)];
    const subCategory = subCategories.filter(
      (category) => category.mainCategoryId === mainCategory.id
    );

    const blog = {
      id: uuidv4(),
      createdAt: createdAt,
      updatedAt: createdAt,
      //artifactId: "",
      stats: {
        posts: datatype.number({ min: 3, max: 10 }),
        views: datatype.number({ min: 100, max: 500 }),
      },
    };
    blogs.push(blog);

    const artifact = {
      id: uuidv4(),
      createdAt: createdAt,
      updatedAt: createdAt,
      mainCategoryId: mainCategory.id,
      subCategoryId: subCategory[datatype.number(subCategory.length - 1)].id,
      blogId: blog.id,
      label: lorem.words(datatype.number({ min: 1, max: 4 })),
      image: `/public/image${datatype.number({ min: 1, max: 53 })}.jpg`,
      content: lorem.sentences(datatype.number({ min: 10, max: 15 })),
      period: ["XXXX", "YYYY"],
      tags: lorem.words(datatype.number({ min: 2, max: 5 })).split(" "),
    };
    artifacts.push(artifact);

    for (let i = 0; i < blog.stats.posts; i++) {
      const createdAt = date.between(blog.createdAt, now).toISOString();

      const post = {
        id: uuidv4(),
        createdAt: createdAt,
        updatedAt:
          Math.random() < 0.15
            ? date.between(createdAt, now).toISOString()
            : createdAt,
        blogId: blog.id,
        userId: profiles[datatype.number(profiles.length - 1)].id,
        content: lorem.sentences(datatype.number({ min: 3, max: 15 })),
        upvotes: profiles.reduce((result, profile) => {
          if (Math.random() < 0.099) result.push(profile.id);

          return result;
        }, [] as string[]),
        downvotes: profiles.reduce((result, profile) => {
          if (Math.random() < 0.033) result.push(profile.id);

          return result;
        }, [] as string[]),
        stats: {
          shadowBanned: false,
          infractions: 0,
          totalUpvotes: 0,
          totalDownvotes: 0,
          totalComments: datatype.number({ min: 3, max: 10 }),
        },
      };
      post.stats.totalUpvotes = post.upvotes.length;
      post.stats.totalDownvotes = post.downvotes.length;
      posts.push(post);

      for (let i = 0; i < post.stats.totalComments; i++) {
        const createdAt = date.between(post.createdAt, now);

        comments.push({
          id: uuidv4(),
          createdAt: createdAt.toISOString(),
          updatedAt:
            Math.random() < 0.15
              ? date.between(createdAt, now).toISOString()
              : createdAt.toISOString(),
          userId: profiles[datatype.number(profiles.length - 1)].id,
          postId: post.id,
          content: lorem.sentences(datatype.number({ min: 3, max: 15 })),
          stats: {
            shadowBanned: false,
            infractions:
              Math.random() < 0.05 ? datatype.number({ min: 0, max: 5 }) : 0,
          },
        });
      }
    }
  }

  const inserts: [string, any[]][] = [
    ["profiles", profiles],
    ["accounts", users],
    ["main_categories", mainCategories],
    ["sub_categories", subCategories],
    ["blogs", blogs],
    ["artifacts", artifacts],
    ["posts", posts],
    ["comments", comments],
  ];

  for (const [table, values] of inserts) {
    const response = await client.from(table).upsert(values);

    console.log(response.error ? response.error : response.statusText);

    if (table === "artifacts") {
      const response = await client.from("blogs").upsert(
        values.map((value) => ({
          id: value.blogId,
          artifactId: value.id,
        }))
      );

      console.log(response.error ? response.error : response.statusText);
    }
  }
};

async function deleteData(client: SupabaseClient) {
  const tables = [
    "comments",
    "posts",
    "artifacts",
    "blogs",
    "sub_categories",
    "main_categories",
    "accounts",
    "profiles",
  ];

  for (const table of tables) {
    if (table === "artifacts") {
      const response = await client.from("blogs").update({ artifactId: null });
      console.log(response.error ? response.error : response.statusText);
    }

    const response = await client.from(table).delete();
    console.log(response.error ? response.error : response.statusText);
  }
}

let client;

if (process.argv[2] === "dev") {
  client = createClient(
    "http://localhost:8000",
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTYwMzk2ODgzNCwiZXhwIjoyNTUwNjUzNjM0LCJyb2xlIjoiYW5vbiJ9.36fUebxgx1mcBo4s19v0SzqmzunP--hm_hep0uLX0ew"
  );
} else if (process.argv[2] === "prod") {
  client = createClient(
    "https://reyohguqhuhpukmdbeva.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMzk4NDk1NCwiZXhwIjoxOTQ5NTYwOTU0fQ.GsSQ3vpMZy5DXESqQOiu0PTBavxX1yN1TNAjncfSID4"
  );
}

mockData(client);
//deleteData(client);
