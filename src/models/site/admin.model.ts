import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface IAdmin {
  _id?: string,
  username?: string, 
  email?: string,
  password?: string, 
  isBlocked?: Boolean,
  picture?: string,
}

const Admin = new Schema({
  email: String,
  username: String, 
  password: String, 
  isBlocked: {type: Boolean, default: false},
  picture: String,
}, { timestamps: true, id: true });

// Model name => collection
export default mongoose.model('Admin', Admin, 'admins');