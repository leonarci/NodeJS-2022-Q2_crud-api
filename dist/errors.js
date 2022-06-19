"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldsRequiredError = exports.NoUserError = exports.UuidError = void 0;
class UuidError extends Error {
    constructor(message = "Invalide uuid") {
        super(message);
        this.name = "UuidError";
    }
}
exports.UuidError = UuidError;
class NoUserError extends Error {
    constructor(message = "User with such uuid wasn't found!") {
        super(message);
        this.name = "NoUserError";
    }
}
exports.NoUserError = NoUserError;
class FieldsRequiredError extends Error {
    constructor(message = "invalid data in request") {
        super(message);
        this.name = "FieldsRequiredError";
    }
}
exports.FieldsRequiredError = FieldsRequiredError;
