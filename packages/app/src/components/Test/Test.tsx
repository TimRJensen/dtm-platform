/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { SearchResult } from "../SearchResult/SearchResult";
import { PostDocument } from "db";

/**
 * Test functional component.
 */

export const Test = function Test() {
  return (
    <div style={{ width: 400, marginLeft: 50 }}>
      <SearchResult result={comment} queries={["volup"]}></SearchResult>
    </div>
  );
};

const html = `<p>Cupiditate omnis voluptas consectetur nihil ab rerum. Aliquam id aspernatur ipsam fuga voluptatem voluptas dolor quis. Vel quia illo tenetur alias et consequatur voluptas repellendus. Est veniam qui rerum. Nisi voluptas autem. Distinctio ipsum autem et ea praesentium. Ipsa ea ut sequi earum unde hic. Fuga quidem delectus architecto facere ut. Dolor porro harum accusamus at ad iste voluptatem facilis. Ea officiis facilis consectetur recusandae vel est facilis. Minus harum repellendus et debitis. Quae repellat quo provident. Laborum expedita eum omnis ipsum doloremque. Sed ab magni repellat totam.</p>`;
const comment: PostDocument = {
  type: "post",
  _id: "test-comment",
  content: html,
  user: {
    type: "user",
    _id: "users/user=0",
    role: "user",
    displayName: "Arthur Fonzarelli",
    email: "fonz@gmail.com",
    stats: {
      upvotes: 0,
      downvotes: 0,
      comments: 0,
      threads: 0,
      infractions: 0,
    },
    timestamp: Date.now(),
    lastModified: Date.now(),
  },
  stats: {
    infractions: 0,
  },
  upvotes: [],
  downvotes: [],
  timestamp: Date.now(),
  lastModified: Date.now(),
};
