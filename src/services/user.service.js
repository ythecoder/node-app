import User from '../models/user.model.js';
export const createUser = async (data) => User.create(data);
export const getUsers = async (query) => {
 const page = Number(query.page) || 1;
 const limit = Number(query.limit) || 5;
 const skip = (page - 1) * limit;
 return User.find().skip(skip).limit(limit);
};

export const editUser = async (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true });
};

export const deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
};





