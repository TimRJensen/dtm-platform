/**
 * Vendor imports.
 */
// @ts-ignore
import { date, datatype, internet, lorem, name } from "faker/locale/en_US";

/**
 * Custom imports.
 */
import {
  BlogDocument,
  ArtifactDocument,
  CommentDocument,
  PostDocument,
  PouchDB,
  ThreadDocument,
  UserDocument,
  CategoryDocument,
} from "db";

/**
 * mockData - Just a single function that populates a PouchDB with mockdata.
 */
interface MockDataOptions {
  numberOfBlogs?: number;
  numberofUsers?: number;
}

export const mockData = async function mockData(
  db: PouchDB,
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
  const users: UserDocument[] = [];

  for (let i = 0; i < options.numberOfUsers; i++) {
    const email = internet.email();
    const timestamp = date.past(datatype.number({ min: 0, max: 8 })).getTime();

    users.push({
      type: "user",
      _id: `/users/user=${i}`,
      displayName: name.findName(),
      role: "user",
      email,
      stats: {
        threads: datatype.number({ min: 1, max: 20 }),
        comments: datatype.number({ min: 1, max: 80 }),
        upvotes:
          Math.random() < 0.15 ? datatype.number({ min: 0, max: 50 }) : 0,
        downvotes:
          Math.random() < 0.07 ? datatype.number({ min: 0, max: 20 }) : 0,
        infractions:
          Math.random() < 0.05 ? datatype.number({ min: 0, max: 10 }) : 0,
      },
      timestamp,
      lastModified: date.between(new Date(timestamp), now).getTime(),
    });
  }

  /**
   * Create fake blogs.
   */
  const blogs = [];

  for (let i = 0; i < options.numberOfBlogs; i++) {
    const timestamp = date.past(datatype.number({ min: 5, max: 8 })).getTime();
    const lastModified = date.between(new Date(timestamp), now).getTime();

    const artifact: ArtifactDocument = {
      type: "artifact",
      _id: `/blogs/blog=${i}/artifact`,
      title: lorem.words(datatype.number({ min: 1, max: 4 })),
      image:
        Math.random() < 0.15
          ? "https://picsum.photos/260/520"
          : "https://picsum.photos/260/200",
      content: lorem.sentences(datatype.number({ min: 10, max: 15 })),
      period: "",
      category: {
        raw: "",
        base: { label: "", raw: "" },
        sub: { label: "", raw: "" },
      },
      tags: lorem.words(datatype.number({ min: 2, max: 5 })).split(" "),
      timestamp,
      lastModified,
    };
    const blog: BlogDocument = {
      type: "blog",
      _id: `/blogs/blog=${i}`,
      artifact,
      threads: [],
      stats: {
        threads: datatype.number({ min: 3, max: 10 }),
        views: datatype.number({ min: 100, mnax: 500 }),
        comments: 0,
      },
      timestamp,
      lastModified,
    };

    if (blog.stats.threads)
      for (let i = 0; i < blog.stats.threads; i++) {
        const _id = `${blog._id}/thread=${i}`;
        const user =
          users[datatype.number({ min: 0, max: options.numberOfUsers - 1 })];
        const timestamp = date.between(new Date(blog.timestamp), now).getTime();
        const lastModified = date.between(new Date(timestamp), now).getTime();
        const post: PostDocument = {
          type: "post",
          _id: `${_id}/post`,
          user,
          content: lorem.sentences(datatype.number({ min: 3, max: 15 })),
          upvotes: [],
          downvotes: [],
          stats: {
            infractions: 0,
          },
          timestamp,
          lastModified,
        };

        for (let i = 0; i < 25; i++) {
          if (Math.random() < 0.1)
            post.upvotes.push(
              users[datatype.number({ min: 0, max: users.length - 1 })]
            );
        }

        for (let i = 0; i < 25; i++) {
          if (Math.random() < 0.05)
            post.downvotes.push(
              users[datatype.number({ min: 0, max: users.length - 1 })]
            );
        }

        const thread: ThreadDocument = {
          type: "thread",
          _id,
          user,
          post,
          comments: [],
          stats: {
            comments: datatype.number({ min: 3, max: 7 }),
          },
          timestamp: post.timestamp,
          lastModified: post.lastModified,
        };

        if (thread.stats.comments) {
          let lastTimestamp = thread.timestamp;

          for (let i = 0; i < thread.stats.comments; i++) {
            const user =
              users[datatype.number({ min: 0, max: users.length - 1 })];
            const timestamp = date
              .between(new Date(lastTimestamp), now)
              .getTime();
            const lastModified = date
              .between(new Date(timestamp), now)
              .getTime();
            const comment: CommentDocument = {
              type: "comment",
              _id: `${post._id}/comment=${i}`,
              timestamp,
              lastModified,
              user,
              content: lorem.sentences(datatype.number({ min: 3, max: 15 })),
              stats: {
                infractions:
                  Math.random() < 0.05
                    ? datatype.number({ min: 0, max: 5 })
                    : 0,
              },
            };

            thread.comments.push(comment);
            lastTimestamp = comment.timestamp;
          }
        }
        blog.threads.push(thread);
        blog.stats.comments += thread.comments.length;
      }
    blogs.push(blog);
  }

  /**
   * Create fake categories.
   */
  const categories = [];
  let cursor = 0;

  for (let i = 0; i < 15 && cursor < blogs.length; i++) {
    const end = cursor + datatype.number({ min: 10, max: 20 });
    const category: CategoryDocument = {
      type: "category",
      _id: `/categories/category-${i}`,
      label: lorem.words(datatype.number({ min: 2, max: 3 })),
      raw: datatype.number({ min: 100, max: 160 }),
      blogs: blogs.slice(cursor, end < blogs.length ? end : blogs.length),
      subCategories: [],
      timestamp: now.getTime(),
      lastModified: now.getTime(),
    };

    let _cursor = 0;

    for (let i = 0; _cursor < category.blogs.length; i++) {
      const end = _cursor + datatype.number({ min: 1, max: 9 });
      const subCategory: CategoryDocument = {
        type: "category",
        _id: category._id + `/sub-category-${i}`,
        label: lorem.words(datatype.number({ min: 1, max: 2 })),
        raw: datatype.number({ min: 10, max: 70 }),
        blogs: category.blogs.slice(
          _cursor,
          end < blogs.length ? end : blogs.length
        ),
        timestamp: now.getTime(),
        lastModified: now.getTime(),
      };

      for (const blog of subCategory.blogs) {
        const artifact = blog.artifact;
        artifact.category.base = { label: category.label, raw: category.raw };
        artifact.category.sub = {
          label: subCategory.label,
          raw: subCategory.raw,
        };
        artifact.category.raw = `${category.raw}.${subCategory.raw}`;
      }

      category.subCategories?.push(subCategory);
      _cursor = end;
    }

    categories.push(category);
    cursor = end;
  }

  await db.putMany([...blogs, ...categories, ...users]);
};
