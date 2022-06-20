export interface User {
  name: string,
  age: number,
  hobbies: number[]
}

export interface UserWithUuid extends User {
  id: string,
}

export const data: UserWithUuid[] = [];
