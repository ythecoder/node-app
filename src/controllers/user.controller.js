import * as userService from '../services/user.service.js';
export const createUser = async (req, res, next) => {
 try {
 const user = await userService.createUser(req.body);
 res.status(201).json(user);
 } catch (err) {
 next(err);
 }
};
export const getUsers = async (req, res, next) => {
 try {
 const users = await userService.getUsers(req.query);
 res.json(users);
 } catch (err) {
 next(err);
 }
};
export const editUser = async (req, res, next) => {
 try {
   const updatedUser = await userService.editUser(req.params.id, req.body);
   res.json(updatedUser);
 } catch (err) {
   next(err);
 }
};
export const deleteUser = async (req, res, next) => {
 try {
   await userService.deleteUser(req.params.id);
   res.status(204).send();
 } catch (err) {
   next(err);
 }
};
