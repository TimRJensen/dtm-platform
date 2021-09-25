/**
 * Vendor imports.
 */
import { date, datatype, internet, lorem, name, image } from "faker";

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
    numberOfBlogs: datatype.number({ min: 10, max: 15 }),
    numberOfUsers: datatype.number({ min: 90, max: 200 }),
  };
  const options = {
    ...defaults,
    ...userOptions,
  };
  const now = new Date();
  const blogs = [];
  const users: UserDocument[] = [];

  const response = await fetch("https://picsum.photos/v2/list?limit=100");
  const images = await response.json();

  for (let i = 0; i < options.numberOfUsers; i++) {
    const email = internet.email();
    const timestamp = date.past(datatype.number({ min: 0, max: 8 })).getTime();

    users.push({
      type: "user",
      _id: `/users/user=${email}`,
      name: name.findName(),
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

  for (let i = 0; i < options.numberOfBlogs; i++) {
    const timestamp = date.past(datatype.number({ min: 5, max: 8 })).getTime();
    const lastModified = date.between(new Date(timestamp), now).getTime();

    const artifact: ArtifactDocument = {
      type: "artifact",
      _id: `/blogs/blog=${i}/artifact`,
      title: lorem.words(datatype.number({ min: 1, max: 4 })),
      // @ts-ignore
      image: images[datatype.number({ min: 0, max: 99 })]["download_url"],
      content: lorem.sentences(datatype.number({ min: 10, max: 15 })),
      period: "",
      tags: lorem.words(datatype.number({ min: 2, max: 5 })).split(" "),
      timestamp,
      lastModified,
    };
    const blog: BlogDocument = {
      type: "blog",
      _id: `/blogs/blog=${i}`,
      artifact,
      threads: new Map<string, ThreadDocument>(),
      stats: {
        threads: datatype.number({ min: 3, max: 10 }),
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
          user: {
            name: user.name,
            email: user.email,
          },
          content: lorem.sentences(datatype.number({ min: 3, max: 15 })),
          upvotes: new Map(),
          downvotes: new Map(),
          stats: {
            infractions: 0,
          },
          timestamp,
          lastModified,
        };

        for (let i = 0; i < 25; i++) {
          if (Math.random() < 0.1)
            post.upvotes.set(
              users[datatype.number({ min: 0, max: options.numberOfUsers - 1 })]
                .email,
              true
            );
        }

        for (let i = 0; i < 25; i++) {
          if (Math.random() < 0.05)
            post.downvotes.set(
              users[datatype.number({ min: 0, max: options.numberOfUsers - 1 })]
                .email,
              true
            );
        }

        const thread: ThreadDocument = {
          type: "thread",
          _id,
          user: {
            name: user.name,
            email: user.email,
          },
          post,
          comments: new Map<string, CommentDocument>(),
          stats: {
            comments: datatype.number({ min: 5, max: 15 }),
          },
          timestamp: post.timestamp,
          lastModified: post.lastModified,
        };

        if (thread.stats.comments) {
          let lastTimestamp = thread.timestamp;

          for (let i = 0; i < thread.stats.comments; i++) {
            const user =
              users[
                datatype.number({ min: 0, max: options.numberOfUsers - 1 })
              ];
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
              user: {
                name: user.name,
                email: user.email,
              },
              content: lorem.sentences(datatype.number({ min: 3, max: 15 })),
              stats: {
                infractions:
                  Math.random() < 0.05
                    ? datatype.number({ min: 0, max: 5 })
                    : 0,
              },
            };

            thread.comments.set(`comment=${i}`, comment);
            lastTimestamp = comment.timestamp;
          }
        }
        blog.threads.set(thread._id, thread);
      }
    blogs.push(blog);
  }
  await db.putMany(blogs);
};
