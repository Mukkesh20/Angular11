var mongoose = require('mongoose');

var AssetDataSchema = new mongoose.Schema({
  id: String,
  type: String,
  name: String,
  invested: Number,
  value: Number
});

module.exports = mongoose.model('AssetData', AssetDataSchema);
