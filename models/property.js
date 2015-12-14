var mongoose = require("mongoose");

var PropertySchema = new mongoose.Schema({
	address: String,
	propertyValue: Number,
	zpid: Number,
	user: [{type: Schema.Types.ObjectId, ref: 'user'}]
});

module.exports = mongoose.model("Property", PropertySchema);