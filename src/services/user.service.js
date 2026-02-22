import User from '../models/user.model.js';
export const createUser = async (data) => User.create(data);
export const getUsers = async (query) => {
 const page = Number(query.page) || 1;
 const limit = Number(query.limit) || 5;
 const skip = (page - 1) * limit;
 return User.find().skip(skip).limit(limit);
};

// Updates an existing user by their ID with the provided 
// data and returns the updated user document
export const editUser = async (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true });
};

// Deletes a user by their ID and returns 
// the deleted user document
export const deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
};





