import User from '../models/user.model.js';

export const createUser = async (data) => User.create(data);

export const getUsers = async (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 5);
  const skip = (page - 1) * limit;
  
  return User.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
};

export const editUser = async (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true });
};

export const deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
};





