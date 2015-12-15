var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var UserSchema = new mongoose.Schema({
	name: String,
	email: {type: String, required: true, unique: true},
	password: String,
	cash: Number,
	created_at: Date,
	updated_at: Date
});

UserSchema.set("toJSON", {
	transform: function(doc, ret, options) {
		var returnJson = {
			id: ret._id,
			email: ret.email,
			name: ret.name,
			cash: ret.cash
		};
		return returnJson;
	}
});

UserSchema.methods.authenticated = function(password, callback) {
	bcrypt.compare(password, this.password, function(err, res) {
		if (err) {
			callback(err);
		}
		else {
			callback(null, res ? this : false);
		}
	});
}

UserSchema.pre("save", function(next) {
	var user = this;
	if (!user.isModified("password")) return next();
	user.password = bcrypt.hashSync(user.password, 10);

	next();
});

var User = mongoose.model("User", UserSchema);

module.exports = User;