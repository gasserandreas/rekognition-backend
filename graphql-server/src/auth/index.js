import {
  AuthenticationError as AuthenticationErrorLocal,
  UserInputError as UserInputErrorLocal,
  ValidationError as ValidationErrorLocal,
} from 'apollo-server'

import {
  AuthenticationError as AuthenticationErrorLambda,
  UserInputError as UserInputErrorLambda,
  ValidationError as ValidationErrorLambda,
} from 'apollo-server-lambda'

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// load .env vars
dotenv.config();

// jwt token related functions
export function createToken(userId) {
  const obj = {
    userId,
    createdAt: Date.now(),
  };
  return jwt.sign(obj, process.env.APP_SECRET);
}

export function getAuthorizationUserId(authorization) {
  if (!authorization) {
    return null;
  }

  const token = authorization.replace('Bearer ', '');
  return getUserIdFromToken(token);
}

export function getUserIdFromToken(token) {
  const {
    APP_SECRET
  } = process.env;

  try {
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// hash functions
export async function createHash(str) {
  return bcrypt.hash(str, 10);
}

export async function compareHashes(password, hash) {
  return bcrypt.compare(password, hash);
}

export function isAuthenticated(context) {
  const { auth } = context;
  if (!auth) {
    return false;
  }

  const { userId } = auth;
  return !!userId;
}

// general auth functions
export function createAuthError(message) {
  const AuthError = AuthenticationErrorLocal || AuthenticationErrorLambda;
  return new AuthError(message);
}

export function createUserInputError(message) {
  const UserInputError = UserInputErrorLocal || UserInputErrorLambda;
  return new UserInputError(message);
}

export function createValidationError(message) {
  const ValidationError = ValidationErrorLocal || ValidationErrorLambda;
  return new ValidationError(message);
}

export function handleAuth(context) {
  if (!isAuthenticated(context)) {
    throw createAuthError('You must be logged in to query this schema');
  }
}
