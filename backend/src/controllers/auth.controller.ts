import * as authService from "../services/auth.service";
import {  sendSuccess  } from "../utils/response";
import config from "../config/env";
import asyncHandler from "../utils/asyncHandler";

const setTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };
  res.cookie('token', token, cookieOptions);
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { token, user } = await authService.register({ name, email, password });
  setTokenCookie(res, token);
  return sendSuccess(res, 201, 'User registered successfully.', { user });
});

const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.login(req.body);
  setTokenCookie(res, token);
  return sendSuccess(res, 200, 'Login successful.', { user });
});

const logout = (req, res) => {
  res.cookie('token', 'loggedout', {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'strict',
    expires: new Date(Date.now() + 10 * 1000),
  });
  return sendSuccess(res, 200, 'Logout successful.');
};

export {  register, login, logout  };

