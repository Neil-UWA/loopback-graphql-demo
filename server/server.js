'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
const graphqlHTTPServer = require('express-graphql');
const {
  graphql,
  buildSchema ,
  GraphQLNonNull,
  GraphQLList,
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

function getVideoById(id) {
  let model = loopback.getModel('Video');
  return new Promise(resolve=> {
    model.find({where:{ id: id }}, (err, data) => {
      return resolve(data[0]);
    });
  });
}

function getVideos() {
  let model = loopback.getModel('Video');
  return new Promise(resolve=> {
    model.find({}, (err, data) => {
      return resolve(data);
    });
  });
}


const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type',
  fields: {
    video: {
      type: videoType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve: (_, args)=> getVideoById(args.id)
    },
    videos: {
      type: new GraphQLList(videoType),
      resolve: getVideos
    }
  }
});

const schema =  new GraphQLSchema( {
  query: queryType
});

app.use('/graphql', graphqlHTTPServer({
  schema,
  graphiql: true
}))
