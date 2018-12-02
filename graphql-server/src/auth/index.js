import { AuthenticationError as AuthenticationErrorLocal } from 'apollo-server'
import { AuthenticationError as AuthenticationErrorLambda } from 'apollo-server-lambda'

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// load .env vars
dotenv.config();

// jwt token related functions
export function creatToken(userId) {
  return jwt.sign({ userId }, process.env.APP_SECRET);
}

export function getAuthorizationUserId(authorization) {
  if (!authorization) {
    return null;
  }

  const {
    APP_SECRET
  } = process.env;

  const token = authorization.replace('Bearer ', '');
  try {
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  } catch (error) {
    throw null;
  }
}

// hash functions
export async function createHash(str) {
  return bcrypt.hash(str, 10);
}

export async function compareHashes(hashA, hashB) {
  return bcrypt.compare(hashA, hashB)
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

export function handleAuth(context) {
  if (!isAuthenticated(context)) {
    throw createAuthError('You must be logged in to query this schema');
  }
}
