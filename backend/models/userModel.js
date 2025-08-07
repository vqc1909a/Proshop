import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const ShippingSchema = new mongoose.Schema({
	address: {
		type: String,
		required: true,
	},
	isSelected: {
		type: Boolean,
		default: false,
	},
	regionId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "GeographicRegion",
	},
});
const UserSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		isSuperAdmin: {
			type: Boolean,
			default: false,
		},
		// En un array el objeto no es obligatorio pero si es obligatorio los campos cuando le pasas los datos según su esquema que definiste
		shippingAddresses: [ShippingSchema],
	},
	{
		// Para crear los campos de updatedAt and createdAt automaticamente sin crearlos en la parte de arriba
		timestamps: true,
		versionKey: false,
		minimize: false,
	}
);

UserSchema.pre("save", function (next) {
	if (!this.isModified("password")) return next();
	const passwordHashed = bcrypt.hashSync(this.password, 10);
	this.password = passwordHashed;
	return next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
	const update = this.getUpdate();
	if (update && update.password) {
		update.password = bcrypt.hashSync(update.password, 10);
		this.setUpdate(update);
	}
	next();
});

UserSchema.methods.verifyPassword = function (password) {
	return bcrypt.compareSync(String(password), this.password);
};

UserSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id;
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.password;
		// delete returnedObject.createdAt
		// delete returnedObject.updatedAt
	},
});
ShippingSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id;
		delete returnedObject._id;
	},
});

const User = mongoose.model("User", UserSchema);
export default User;
