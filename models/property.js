var mongoose = require("mongoose");

var PropertySchema = new mongoose.Schema({
	zpid: Number,
	address: String,
	cityStateZip: String,
	price: Number,
	yearBuilt: Number,
	lotSize: Number,
	bedrooms: String,
	bathrooms: String,
	lastSoldPrice: Number,
	user: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}]
});

PropertySchema.set("toJSON", {
	transform: function(doc, ret, options) {
		var returnJson = {
			id: ret._id,
			zpid: ret.zpid,
			address: ret.address,
			cityStateZip: ret.cityStateZip,
			yearBuilt: ret.yearBuilt,
			lotSize: ret.lotSize,
			bedrooms: ret.bedrooms,
			bathrooms: ret.bathrooms,
			lastSoldPrice: ret.lastSoldPrice
		};
		return returnJson;
	}
});

module.exports = mongoose.model("Property", PropertySchema);