var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql').GraphQLDate;
var AssetDataModel = require('../models/assetData');

var assetDataType = new GraphQLObjectType({
  name: 'AssetData',
  fields: function () {
    return {
      _id: {
        type: GraphQLString
      },
      type: {
        type: GraphQLString
      },
      name: {
        type: GraphQLString
      },
      invested: {
        type: GraphQLString
      },
      value: {
        type: GraphQLString
      }
    }
  }
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      AssetDatas: {
        type: new GraphQLList(assetDataType),
        resolve: function () {
          const AssetData = AssetDataModel.find().exec()
          if (!AssetData) {
            throw new Error('Error')
          }
          return AssetData
        }
      },
      AssetData: {
        type: assetDataType,
        args: {
          id: {
            name: '_id',
            type: GraphQLString
          }
        },
        resolve: function (root, params) {
          const assetDataDetails = AssetDataModel.findById(params.id).exec()
          if (!assetDataDetails) {
            throw new Error('Error')
          }
          return assetDataDetails
        }
      }
    }
  }
});


var mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function () {
    return {
      addAssetData: {
        type: assetDataType,
        args: {
          type: {
            type: new GraphQLNonNull(GraphQLString)
          },
          name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          invested: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          value: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve: function (root, params) {
          const assetDataModel = new AssetDataModel(params);
          const newAssetData = assetDataModel.save();
          if (!newAssetData) {
            throw new Error('Error');
          }
          return newAssetData
        }
      },
      updateAssetData: {
        type: assetDataType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          },
          type: {
            type: new GraphQLNonNull(GraphQLString)
          },
          name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          invested: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          value: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve(root, params) {
          return AssetDataModel.findByIdAndUpdate(params.id, { type: params.type, name: params.name, invested: params.invested, value: params.value}, function (err) {
            if (err) return next(err);
          });
        }
      },
      removeAssetData: {
        type: assetDataType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, params) {
          const remAssetData = AssetDataModel.findByIdAndRemove(params.id).exec();
          if (!remAssetData) {
            throw new Error('Error')
          }
          return remAssetData;
        }
      }
    }
  }
});
module.exports = new GraphQLSchema({query: queryType, mutation: mutation});
