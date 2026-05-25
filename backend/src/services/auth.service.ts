import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";
import User from "../models/user.model";
import config from "../config/env";
import AppError from "../utils/AppError";

interface UserInstance {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
}

const generateToken = (user: UserInstance): string => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret as string,
    { expiresIn: (config.jwt.expiresIn || '7d') as StringValue }
  );
};

const formatUser = (user: UserInstance) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

const register = async ({ name, email, password }: { name: string; email: string; password: string }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new AppError('Email is already registered.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });

  const u = user as unknown as UserInstance;
  return {
    token: generateToken(u),
    user: formatUser(u),
  };
};

const login = async ({ email, password }: { email: string; password: string }) => {
  const user = await User.findOne({ where: { email } });

  if (!user) throw new AppError('Invalid email or password.', 401);

  const u = user as unknown as UserInstance;
  const isMatch = await bcrypt.compare(password, u.password);
  if (!isMatch) throw new AppError('Invalid email or password.', 401);

  return {
    token: generateToken(u),
    user: formatUser(u),
  };
};

export { register, login };
