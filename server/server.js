'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
const graphqlHTTPServer = require('express-graphql');
const {
  graphql,
  buildSchema ,
  GraphQLSchema,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLBoolean
}  = require('graphql');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'video',
  fields: {
    id: {
      type: GraphQLID,
      description: 'id of video'
    },
    title: {
      type: GraphQLString,
    },
    duration: {
      type: GraphQLInt
    },
    watched: {
      type: GraphQLBoolean
    }
  }
});

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type',
  fields: {
    video: {
      type: videoType,
      resolve: ()=> new Promise(resolve=>resolve({
        id: 'a',
        title: 'Graphql a',
        duration: 100,
        watched:false
      }))
    }
  }
});

const schema =  new GraphQLSchema( {
  query: queryType
});

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

app.use('/graphql', graphqlHTTPServer({
  schema,
  graphiql: true,
  rootValue: resolvers
}))
