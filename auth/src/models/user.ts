import { Schema, model, Model, Document } from "mongoose";
import { Password } from "../services/password";
/*
    An interface that describes the properties
    that are required to create a new User
*/
export interface UserAttributes {
	email: string;
	password: string;
}
/*
    An interface that the describes the properties
    that a User model has
*/
export interface UserModel extends Model<UserDoc> {
	build(attrs: UserAttributes): UserDoc;
}
/*
    An interface that describes the properties
    that a User Document has
*/
export interface UserDoc extends Document {
	email: string;
	password: string;
}

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.password;
				delete ret.__v;
			},
		},
	}
);

userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		const hashed = await Password.toHash(this.get("password"));
		this.set("password", hashed);
	}
	next();
});

userSchema.statics.build = (attrs: UserAttributes) => {
	return new User(attrs);
};

const User = model<UserDoc, UserModel>("User", userSchema);

export { User };
