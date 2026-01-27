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
