import { model } from "mongoose";
import { urlSchema } from "./Url";
import { userSchema } from "./user";

const URLSchema = model('Url', urlSchema);
const UserSchema = model('User', userSchema)

export { URLSchema, UserSchema}