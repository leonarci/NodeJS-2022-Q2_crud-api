import { v4 as uuidv4 } from 'uuid';
import { data, User, UserWithUuid } from './data';
import { NoUserError, FieldsRequiredError } from './errors';

export class Controller {
  async getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      try {
        resolve(data);
      } catch (error) {
        reject()
      }
    });
  }

  async getUser(uuid: string): Promise<User> {
    return new Promise((resolve, reject) => {
      let user = data.find(user => user.id === uuid);
      if (user) {
        resolve(user)
      } else {
        reject(new NoUserError(`No user with uuid ${uuid}`))
      }
    })
  }

  async createUser(user: User): Promise<UserWithUuid> {
    return new Promise((resolve, reject) => {
      const { name, age, hobbies } = user;
      if (typeof name !== "string" ||
        typeof age !== "number" ||
        !Array.isArray(hobbies)) {
        reject(new Error("all fields are required"))
      }
      else {
        let newUser = {
          id: uuidv4(),
          ...user
        }
        data.push(newUser)
        resolve(newUser);
      }
    })
  }

  async updateUser(id: string, user: User): Promise<UserWithUuid> {
    return new Promise((resolve, reject) => {
      let foundUser = data.find((user) => user.id === id);
      if (!foundUser) {
        reject(new NoUserError(`No user with uuid ${id}`))
      } else {
        const { name, age, hobbies } = user;
        if (typeof name !== "string" ||
          typeof age !== "number" ||
          !Array.isArray(hobbies)) {
          reject(new FieldsRequiredError())
        }
        foundUser.name = user.name;
        foundUser.age = user.age;
        foundUser.hobbies = user.hobbies;
        resolve(foundUser);
      }
    })
  }

  async deleteUser(id: string) {
    return new Promise((resolve, reject) => {
      let userIndex: number = data.findIndex(user => (user.id === id));
      if (userIndex === -1) {
        reject(new NoUserError(`No user with uuid ${id}`));
      } else {
        data.splice(userIndex, 1);
        resolve("success");
      }
    })
  }
}
