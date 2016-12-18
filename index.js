'use strict';
const { graphql, buildSchema }  = require('graphql');

const schema =  buildSchema(
  `
  type Video {
    id: ID,
    title: String,
    duration: Int,
    watched: Boolean
  }
  type Query {
    video: Video,
    videos: [Video]
  }
  type Schema {
    query: Query
  }
  `
);

const videoA = {
    id: 'a',
    title: 'bar',
    duration: 1131,
    watched: false
};

const videoB = {
    id: 'b',
    title: 'bar',
    duration: 1131,
    watched: true
};
const resolvers = {
  video: ()=>({
    id: '1',
    title: 'bar',
    duration: 1131,
    watched: false
  }),
  videos: () => [videoA, videoB]
};

const query = `
query myFristQuery {
  videos {
    id,
    title,
    duration,
    duration
  }
}
`;

graphql(schema, query, resolvers)
.then(data => {
  console.dir(data, {depth: null});
})
.catch(console.log);
