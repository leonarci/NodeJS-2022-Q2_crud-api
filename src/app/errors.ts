class UuidError extends Error {
  constructor(message = "Invalide uuid") {
    super(message);
    this.name = "UuidError"
  }
}

class NoUserError extends Error {
  constructor(message = "User with such uuid wasn't found!") {
    super(message);
    this.name = "NoUserError"
  }
}

class FieldsRequiredError extends Error {
  constructor(message = "invalid data in request") {
    super(message);
    this.name = "FieldsRequiredError"
  }
}

export { UuidError, NoUserError, FieldsRequiredError }
