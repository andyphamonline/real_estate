var mongoose = require("mongoose");

var PropertySchema = new mongoose.Schema({
	zpid: Number,
	address: String,
	price: Number,
	city: String,
	state: String,
	zip: String,
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
			price: ret.price,
			city: ret.city,
			state: ret.state,
			zip: ret.zip,
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