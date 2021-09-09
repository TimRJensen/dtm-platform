/**
 * Vendor imports.
 */
import faker from "faker";

/**
 * Custom imports.
 */
import { PouchDB } from "db";
import {
  BaseDocument,
  BlogDocument,
  PostDocument,
  ThreadDocument,
  UserDocument,
} from "db/src/db";

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

function generateDate(options?: GenerateDateOptions) {
  const now = new Date();
  const defaults = {
    past: true,
    year: { min: 1, max: 5 },
    month: { min: 1, max: 6 },
    date: { min: 1, max: 15 },
    ...options,
  };

  if (defaults.past)
    now.setFullYear(
      now.getFullYear() - randomNumber(defaults.year.min, defaults.year.max),
      now.getMonth() - randomNumber(defaults.month.min, defaults.month.max),
      now.getDate() - randomNumber(defaults.date.min, defaults.date.max)
    );
  else
    now.setFullYear(
      now.getFullYear() + randomNumber(defaults.year.min, defaults.year.max),
      now.getMonth() + randomNumber(defaults.month.min, defaults.month.max),
      now.getDate() + randomNumber(defaults.date.min, defaults.date.max)
    );

  return now.getTime();
}

/**
 * mockData - Just a single function that populates a PouchDB with mockdata.
 */
interface MockDataOptions {
  numberOfBlogs?: number;
}

export const mockData = async function mockData(
  db: PouchDB,
  options?: MockDataOptions
) {
  const defaults = {
    numberOfBlogs: 10,
    ...options,
  };
  const blogs = [];

  for (let i = 0; i < defaults.numberOfBlogs; i++) {
    const blog: BlogDocument & BaseDocument = {
      type: "blog",
      _id: `blog:${i}`,
      threads: [],
      stats: {
        threads: faker.random.number({ min: 1, max: 5 }),
        posts: 0,
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
    };

    for (let i = 0; i < blog.stats.threads; i++) {
      const email = faker.internet.email();
      const key = `${blog._id}#thread:${i}`;
      const creator: UserDocument & BaseDocument = {
        type: "user",
        _id: `user-${email}`,
        name: faker.name.findName(),
        email,
        stats: {
          posts: faker.random.number({ min: 1, max: 20 }),
          upvotes:
            Math.random() < 0.15 ? faker.random.number({ min: 0, max: 75 }) : 0,
          downvotes:
            Math.random() < 0.07 ? faker.random.number({ min: 0, max: 75 }) : 0,
          infractions:
            Math.random() < 0.05 ? faker.random.number({ min: 0, max: 10 }) : 0,
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
      };
      const content: PostDocument & BaseDocument = {
        type: "post",
        _id: `${key}#post:main`,
        creator,
        content: faker.lorem.sentences(
          faker.random.number({ min: 3, max: 15 })
        ),
        stats: {
          infractions: 0,
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
      };
      const thread: ThreadDocument & BaseDocument = {
        type: "thread",
        _id: key,
        creator,
        post: content,
        posts: [],
        stats: {
          posts: faker.random.number({ min: 1, max: 7 }),
          upvotes:
            Math.random() < 0.15 ? faker.random.number({ min: 0, max: 75 }) : 0,
          downvotes:
            Math.random() < 0.07 ? faker.random.number({ min: 0, max: 75 }) : 0,
          infractions:
            Math.random() < 0.05 ? faker.random.number({ min: 0, max: 10 }) : 0,
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
      };

      for (let i = 0; i < thread.stats.posts; i++)
        thread.posts.push({
          type: "post",
          ...{
            _id: `${key}#post:${i}`,
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
          },
          creator,
          content: faker.lorem.sentences(
            faker.random.number({ min: 3, max: 15 })
          ),
          stats: {
            infractions:
              Math.random() < 0.05
                ? faker.random.number({ min: 0, max: 10 })
                : 0,
          },
        });

      blog.threads.push(thread);
    }

    blogs.push(blog);
  }

  await db.putMany(blogs);
  console.log("data created");
};
