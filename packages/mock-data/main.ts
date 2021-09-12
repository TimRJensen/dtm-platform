/**
 * Vendor imports.
 */
import faker from "faker";

/**
 * Custom imports.
 */
import {
  PouchDB,
  BaseDocument,
  BlogDocument,
  PostDocument,
  ThreadDocument,
  UserDocument,
  GetDocument,
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
  const users: GetDocument<UserDocument>[] = [];

  for (let i = 0; i < options.numberOfUsers; i++) {
    const email = faker.internet.email();

    users.push({
      type: "user",
      _id: `user-${email}`,
      name: faker.name.findName(),
      email,
      stats: {
        threads: randomNumber(1, 20),
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
    const blog: GetDocument<BlogDocument> = {
      type: "blog",
      _id: `/blog:${i}`,
      threads: {},
      stats: {
        threads: randomNumber(1, 5),
      },
      timestamp,
      lastModified,
    };

    if (blog.stats.threads)
      for (let i = 0; i < blog.stats.threads; i++) {
        const _id = `${blog._id}/thread:${i}`;
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
        const post: GetDocument<PostDocument> = {
          type: "post",
          _id: `${_id}/post`,
          creator: user,
          content: faker.lorem.sentences(randomNumber(3, 15)),
          stats: {
            infractions: 0,
          },
          timestamp,
          lastModified,
        };
        const thread: GetDocument<ThreadDocument> = {
          type: "thread",
          _id,
          creator: user,
          post,
          comments: {},
          stats: {
            comments: randomNumber(1, 7),
            upvotes: Math.random() < 0.15 ? randomNumber(0, 20) : 0,
            downvotes: Math.random() < 0.07 ? randomNumber(0, 5) : 0,
            infractions: Math.random() < 0.05 ? randomNumber(0, 3) : 0,
          },
          timestamp: post.timestamp,
          lastModified: post.lastModified,
        };

        if (thread.stats.comments)
          for (let i = 0; i < thread.stats.comments; i++) {
            const timestamp = generateDate({
              target: new Date(
                thread.comments.length
                  ? thread.comments[i - 1].timestamp
                  : thread.timestamp
              ),
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
            const _id = `${thread._id}/comment:${i}`;

            thread.comments[_id] = {
              type: "post",
              ...{
                _id,
                timestamp,
                lastModified,
              },
              creator: users[randomNumber(0, options.numberOfUsers)],
              content: faker.lorem.sentences(randomNumber(3, 15)),
              stats: {
                infractions: Math.random() < 0.05 ? randomNumber(0, 5) : 0,
              },
            };
          }
        blog.threads[_id] = thread;
      }
    blogs.push(blog);
  }
  await db.putMany(blogs);
};
