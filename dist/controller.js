"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const uuid_1 = require("uuid");
const data_1 = require("./data");
const errors_1 = require("./errors");
class Controller {
    async getUsers() {
        return new Promise((resolve, reject) => {
            try {
                resolve(data_1.data);
            }
            catch (error) {
                reject();
            }
        });
    }
    async getUser(uuid) {
        return new Promise((resolve, reject) => {
            let user = data_1.data.find(user => user.id === uuid);
            if (user) {
                resolve(user);
            }
            else {
                reject(new errors_1.NoUserError(`No user with uuid ${uuid}`));
            }
        });
    }
    async createUser(user) {
        return new Promise((resolve, reject) => {
            const { name, age, hobbies } = user;
            if (name === undefined || age === undefined || hobbies === undefined) {
                reject(new errors_1.FieldsRequiredError);
            }
            if (typeof name !== "string" ||
                typeof age !== "number" ||
                !Array.isArray(hobbies)) {
                reject(new errors_1.FieldsRequiredError("invalid data in request"));
            }
            else {
                let newUser = {
                    id: (0, uuid_1.v4)(),
                    ...user
                };
                data_1.data.push(newUser);
                resolve(newUser);
            }
        });
    }
    async updateUser(id, user) {
        return new Promise((resolve, reject) => {
            let foundUser = data_1.data.find((user) => user.id === id);
            if (!foundUser) {
                reject(new errors_1.NoUserError(`No user with uuid ${id}`));
            }
            else {
                const { name, age, hobbies } = user;
                if (name === undefined && age === undefined && hobbies === undefined) {
                    reject(new errors_1.FieldsRequiredError);
                }
                if (typeof name === "string") {
                    foundUser.name = name;
                }
                else if (name != undefined) {
                    reject(new errors_1.FieldsRequiredError);
                }
                if (typeof age === "number") {
                    foundUser.age = age;
                }
                else if (age != undefined) {
                    reject(new errors_1.FieldsRequiredError);
                }
                if (Array.isArray(hobbies)) {
                    foundUser.hobbies = hobbies;
                }
                else if (hobbies != undefined) {
                    reject(new errors_1.FieldsRequiredError);
                }
                resolve(foundUser);
            }
        });
    }
    async deleteUser(id) {
        return new Promise((resolve, reject) => {
            let userIndex = data_1.data.findIndex(user => (user.id === id));
            if (userIndex === -1) {
                reject(new errors_1.NoUserError(`No user with uuid ${id}`));
            }
            else {
                data_1.data.splice(userIndex, 1);
                resolve("success");
            }
        });
    }
}
exports.Controller = Controller;
