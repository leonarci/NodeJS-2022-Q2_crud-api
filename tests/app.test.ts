import request from "supertest";
import { server } from "../src/app/app";
import { v4 as uuidV4 } from 'uuid';
import { validateUuid } from "../src/app/utils"

let app = server;
const testUser = {
  "name": "artem",
  "age": 31,
  "hobbies": ["programming"]
};

const updatedTestUser = {
  "name": "Maxim",
  "age": 26,
  "hobbies": ["football", "netflix"]
};

const invalidTestUser = {
  "name": "Alex"
}

const TestUserWithInvalidName = {
  "name": true,
  "age": 26,
  "hobbies": ["football", "netflix"]
};
const TestUserWithInvalidAge = {
  "name": "Maxim",
  "age": "26",
  "hobbies": ["football", "netflix"]
};
const TestUserWithInvalidHobbies = {
  "name": "Maxim",
  "age": 26,
  "hobbies": "football"
};

describe("Scenario 1 (normal app work)", () => {
  it('Should return empty users data', async () => {
    const response = await request(app).get('/api/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([])
  });
  let createdUuid: string;
  it('Should create a user and return created user data', async () => {
    const response = await request(app)
      .post('/api/users')
      .send(testUser)
      .set('Accept', 'application/json');

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toEqual(testUser.name);
    expect(response.body.age).toEqual(testUser.age);
    expect(response.body.hobbies).toEqual(testUser.hobbies);
    createdUuid = response.body.id;
    expect(validateUuid(createdUuid)).toBe(true);
  });
  it('Should return created user data', async () => {
    const response = await request(app).get(`/api/users/${createdUuid}`);

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual(testUser.name);
    expect(response.body.age).toEqual(testUser.age);
    expect(response.body.hobbies).toEqual(testUser.hobbies);
    expect(response.body.id).toEqual(createdUuid);
  });
  it('Should return updated user data', async () => {
    const response = await request(app)
      .put(`/api/users/${createdUuid}`)
      .send(updatedTestUser)
      .set('Accept', 'application/json');

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual(updatedTestUser.name);
    expect(response.body.age).toEqual(updatedTestUser.age);
    expect(response.body.hobbies).toEqual(updatedTestUser.hobbies);
    expect(response.body.id).toEqual(createdUuid);
  });
  it('Should delete previously created user', async () => {
    const response = await request(app)
      .delete(`/api/users/${createdUuid}`)
      .set('Accept', 'application/json');

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(204);
  });
  it('Should return return answer that there is no such user anymore', async () => {
    const response = await request(app).get(`/api/users/${createdUuid}`);

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(`No user with uuid ${createdUuid}`)
  });
});

describe("Scenario 2 (bad requests)", () => {
  it('Requests to non-existing endpoints should return status code 404 and human friendly message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Route not found")
  });
  let createdTestUuid = uuidV4();
  it('Server should answer with status code 404 and corresponding message if record with id === userId doesn\'t exist', async () => {
    const response = await request(app).get(`/api/users/${createdTestUuid}`);

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(`No user with uuid ${createdTestUuid}`)
  });
  it('Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)', async () => {
    const response = await request(app).get(`/api/users/not-uuid-34532`);

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(`Invalide uuid`)
  });
  it('Server should answer with status code 400 and corresponding message if request body does not contain required fields', async () => {
    const response = await request(app)
      .post('/api/users')
      .send(invalidTestUser)
      .set('Accept', 'application/json');

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("invalid data in request");
  });
  it('Server should answer with status code 400 and corresponding message if userId is invalid (not uuid) for PUT request', async () => {
    const response = await request(app)
      .put(`/api/users/not-uuid-34532`)
      .send(updatedTestUser)
      .set('Accept', 'application/json');

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(`Invalide uuid`)
  });
  it('Server should answer with status code 404 and corresponding message if record with id === userId doesn\'t existfor PUT request', async () => {
    const response = await request(app)
      .put(`/api/users/${createdTestUuid}`)
      .send(updatedTestUser)
      .set('Accept', 'application/json');

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(`No user with uuid ${createdTestUuid}`)
  });
  it('Server should answer with status code 404 and corresponding message if record with id === userId doesn\'t existfor DELETE request', async () => {
    const response = await request(app)
      .delete(`/api/users/${createdTestUuid}`)
      .set('Accept', 'application/json');

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(`No user with uuid ${createdTestUuid}`)
  });
  it('Server should answer with status code 400 and corresponding message if userId is invalid (not uuid) for DELETE request', async () => {
    const response = await request(app).get(`/api/users/not-uuid-34532`);

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(`Invalide uuid`)
  });
});

describe("Scenario 3 (invalid data types in POST and PUT requests)", () => {
  it('Should response with "invalid data in request" message due to invalid type of provided name in POST request', async () => {
    const response = await request(app)
      .post('/api/users')
      .send(TestUserWithInvalidName)
      .set('Accept', 'application/json');

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("invalid data in request");

  });
  it('Should response with "invalid data in request" message due to invalid type of provided age in POST request', async () => {
    const response = await request(app)
      .post('/api/users')
      .send(TestUserWithInvalidAge)
      .set('Accept', 'application/json');

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("invalid data in request");

  });
  it('Should response with "invalid data in request" message due to invalid type of provided hoobies in POST request', async () => {
    const response = await request(app)
      .post('/api/users')
      .send(TestUserWithInvalidHobbies)
      .set('Accept', 'application/json');

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("invalid data in request");

  });
  let createdUuid: string;
  it('Should create a user and return created user data', async () => {
    const response = await request(app)
      .post('/api/users')
      .send(testUser)
      .set('Accept', 'application/json');

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(201);
    expect(response.body.name).toEqual(testUser.name);
    expect(response.body.age).toEqual(testUser.age);
    expect(response.body.hobbies).toEqual(testUser.hobbies);
    createdUuid = response.body.id;
    expect(validateUuid(createdUuid)).toBe(true);
  });
  it('Should response with "invalid data in request" message due to invalid type of provided name in PUT request', async () => {
    const response = await request(app)
      .put(`/api/users/${createdUuid}`)
      .send(TestUserWithInvalidName)
      .set('Accept', 'application/json');

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("invalid data in request");

  });
  it('Should response with "invalid data in request" message due to invalid type of provided age in PUT request', async () => {
    const response = await request(app)
      .put(`/api/users/${createdUuid}`)
      .send(TestUserWithInvalidAge)
      .set('Accept', 'application/json');

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("invalid data in request");

  });
  it('Should response with "invalid data in request" message due to invalid type of provided hoobies in PUT request', async () => {
    const response = await request(app)
      .put(`/api/users/${createdUuid}`)
      .send(TestUserWithInvalidHobbies)
      .set('Accept', 'application/json');

    expect(response.type).toBe("application/json");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("invalid data in request");

  });
});

afterAll(() => app.close())
