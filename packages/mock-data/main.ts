/**
 * Vendor imports.
 */
import faker from "faker";

/**
 * Custom imports.
 */
import {
  BaseDocument,
  BlogDocument,
  CommentDocument,
  PostDocument,
  PouchDB,
  ThreadDocument,
  UserDocument,
} from "db";

/**
 * randomNumber - Generates a random (int) number within user specified confines.
 */
function randomNumber(min = 0, max = 10) {
  return min + Math.floor(Math.random() * max);
}

/**
 * generateDate - Generates a random (past) date within user specified confines.
 */
interface GenerateDateOptions {
  target?: Date;
  past?: boolean;
  year?: {
    min: number;
    max: number;
  };
  month?: {
    min: number;
    max: number;
  };
  date?: {
    min: number;
    max: number;
  };
}

function generateDate(userOptions?: GenerateDateOptions) {
  const defaults = {
    target: new Date(),
    past: true,
    year: { min: 0, max: 4 },
    month: { min: 0, max: 5 },
    date: { min: 0, max: 14 },
  };
  const options = {
    ...defaults,
    ...userOptions,
  };

  if (options.past)
    return new Date(
      options.target.getFullYear() -
        randomNumber(options.year.min, options.year.max),
      options.target.getMonth() -
        randomNumber(options.month.min, options.month.max),
      options.target.getDate() -
        randomNumber(options.date.min, options.date.max)
    ).getTime();
  else {
    const result = new Date(
      options.target.getFullYear() +
        randomNumber(options.year.min, options.year.max),
      options.target.getMonth() +
        Math.abs(
          options.target.getMonth() -
            randomNumber(options.month.min, options.month.max)
        ),
      options.target.getDate() +
        Math.abs(
          options.target.getDate() -
            randomNumber(options.date.min, options.date.max)
        )
    );
    const thisYear = defaults.target.getFullYear();

    if (result.getFullYear() > thisYear) result.setFullYear(thisYear);

    return result.getTime();
  }
}

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
    numberOfBlogs: randomNumber(10, 12),
    numberOfUsers: randomNumber(90, 120),
  };
  const options = {
    ...defaults,
    ...userOptions,
  };
  const blogs = [];
  const users: UserDocument[] = [];

  for (let i = 0; i < options.numberOfUsers; i++) {
    const email = faker.internet.email();

    users.push({
      type: "user",
      _id: `/users/user=${email}`,
      key: email,
      name: faker.name.findName(),
      email,
      stats: {
        threads: randomNumber(1, 20),
        comments: randomNumber(1, 80),
        upvotes: Math.random() < 0.15 ? randomNumber(0, 75) : 0,
        downvotes: Math.random() < 0.07 ? randomNumber(0, 30) : 0,
        infractions: Math.random() < 0.05 ? randomNumber(0, 10) : 0,
      },
      timestamp: generateDate({
        year: { min: 0, max: 2 },
        month: { min: 0, max: 11 },
        date: { min: 0, max: 31 },
      }),
      lastModified: generateDate({
        past: false,
        year: { min: 0, max: 0 },
        month: { min: 0, max: 11 },
        date: { min: 0, max: 31 },
      }),
    });
  }

  for (let i = 0; i < options.numberOfBlogs; i++) {
    const timestamp = generateDate({
      year: { min: 0, max: 10 },
      month: { min: 0, max: 11 },
      date: { min: 0, max: 31 },
    });
    const lastModified = generateDate({
      target: new Date(timestamp),
      past: false,
      year: { min: 0, max: 0 },
      month: { min: 0, max: 11 },
      date: { min: 0, max: 31 },
    });
    const blog: BlogDocument = {
      type: "blog",
      _id: `/blogs/blog=${i}`,
      key: `blog-${i}`,
      threads: new Map<string, ThreadDocument>(),
      stats: {
        threads: randomNumber(1, 5),
        comments: 0,
      },
      timestamp,
      lastModified,
    };

    if (blog.stats.threads)
      for (let i = 0; i < blog.stats.threads; i++) {
        const _id = `${blog._id}/thread=${i}`;
        const user = users[randomNumber(0, options.numberOfUsers - 1)];
        const timestamp = generateDate({
          target: new Date(blog.timestamp),
          past: false,
          year: { min: 0, max: 2 },
          month: { min: 0, max: 11 },
          date: { min: 0, max: 31 },
        });
        const lastModified = generateDate({
          target: new Date(timestamp),
          past: false,
          year: { min: 0, max: 2 },
          month: { min: 0, max: 11 },
          date: { min: 0, max: 31 },
        });
        const post: PostDocument = {
          type: "post",
          _id: `${_id}/post`,
          key: "post",
          user: {
            name: user.name,
            email: user.email,
          },
          content: faker.lorem.sentences(randomNumber(3, 15)),
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
              users[randomNumber(0, options.numberOfUsers)].email,
              true
            );
        }

        for (let i = 0; i < 25; i++) {
          if (Math.random() < 0.05)
            post.upvotes.set(
              users[randomNumber(0, options.numberOfUsers)].email,
              true
            );
        }

        const thread: ThreadDocument = {
          type: "thread",
          _id,
          key: `thread=${i}`,
          user: user.name,
          post,
          comments: new Map<string, CommentDocument>(),
          stats: {
            comments: randomNumber(1, 7),
          },
          timestamp: post.timestamp,
          lastModified: post.lastModified,
        };

        if (thread.stats.comments) {
          let lastTimestamp = thread.timestamp;

          for (let i = 0; i < thread.stats.comments; i++) {
            const user = users[randomNumber(0, options.numberOfUsers)];
            const timestamp = generateDate({
              target: new Date(lastTimestamp),
              past: false,
              year: { min: 0, max: 2 },
              month: { min: 0, max: 11 },
              date: { min: 0, max: 31 },
            });
            const lastModified = generateDate({
              target: new Date(timestamp),
              past: false,
              year: { min: 0, max: 0 },
              month: { min: 0, max: 11 },
              date: { min: 0, max: 31 },
            });
            const comment: CommentDocument = {
              type: "comment",
              _id: `${post._id}/comment=${i}`,
              key: `comment=${i}`,
              timestamp,
              lastModified,
              user: {
                name: user.name,
                email: user.email,
              },
              content: faker.lorem.sentences(randomNumber(3, 15)),
              stats: {
                infractions: Math.random() < 0.05 ? randomNumber(0, 5) : 0,
              },
            };

            thread.comments.set(comment.key, comment);
            lastTimestamp = comment.timestamp;
          }
        }
        blog.threads.set(thread._id, thread);
      }
    blogs.push(blog);
  }
  await db.putMany(blogs);
};
