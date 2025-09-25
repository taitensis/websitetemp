import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '962db1a52a5b3a17da5226d3f161624aa437da04', queries,  });
export default client;
  