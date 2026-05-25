import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { Op } from "sequelize";
import AppError from "../utils/AppError";

interface UserInstance {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const formatUser = (user: UserInstance) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const notFound = (): never => {
  throw new AppError('User not found.', 404);
};

const getMe = async (userId: string) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
  });
  if (!user) notFound();
  return formatUser(user as unknown as UserInstance);
};

const getAllUsers = async ({
  page = 1,
  limit = 20,
  search,
  role,
  sortBy = 'createdAt',
  order = 'DESC',
}: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: string;
  order?: string;
}) => {
  const offset = (page - 1) * limit;
  const where: Record<string, any> = {};

  if (search) {
    where[Op.or as unknown as string] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (role) {
    where['role'] = role;
  }

  const allowedSortFields = ['createdAt', 'name', 'email', 'role'];
  const sanitizedSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const orderUpper = typeof order === 'string' ? order.toUpperCase() : 'DESC';
  const sanitizedOrder = ['ASC', 'DESC'].includes(orderUpper) ? orderUpper : 'DESC';

  const { count, rows } = await User.findAndCountAll({
    where,
    attributes: { exclude: ['password'] },
    order: [[sanitizedSortBy, sanitizedOrder]],
    limit,
    offset,
  });

  return {
    users: rows.map((u) => formatUser(u as unknown as UserInstance)),
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};

const getUserById = async (id: string) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
  });
  if (!user) notFound();
  return formatUser(user as unknown as UserInstance);
};

const createUser = async ({
  name,
  email,
  password,
  role,
}: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new AppError('Email is already registered.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword, role: role || 'user' });
  return formatUser(user as unknown as UserInstance);
};

const updateUser = async (id: string, { name, email, role }: { name?: string; email?: string; role?: string }) => {
  const user = await User.findByPk(id);
  if (!user) notFound();

  const u = user as unknown as UserInstance;
  if (email && email !== u.email) {
    const taken = await User.findOne({ where: { email } });
    if (taken) {
      throw new AppError('Email is already in use by another account.', 409);
    }
  }

  const updates: Record<string, any> = {};
  if (name !== undefined) updates['name'] = name;
  if (email !== undefined) updates['email'] = email;
  if (role !== undefined) updates['role'] = role;

  await user!.update(updates);
  return formatUser(user as unknown as UserInstance);
};

const updateMe = async (userId: string, { name, email }: { name?: string; email?: string }) => {
  const user = await User.findByPk(userId);
  if (!user) notFound();

  const u = user as unknown as UserInstance;
  if (email && email !== u.email) {
    const taken = await User.findOne({ where: { email } });
    if (taken) {
      throw new AppError('Email is already in use by another account.', 409);
    }
  }

  const updates: Record<string, any> = {};
  if (name !== undefined) updates['name'] = name;
  if (email !== undefined) updates['email'] = email;

  await user!.update(updates);
  return formatUser(user as unknown as UserInstance);
};

const changePassword = async (
  userId: string,
  { currentPassword, newPassword }: { currentPassword: string; newPassword: string }
) => {
  const user = await User.findByPk(userId);
  if (!user) notFound();

  const u = user as unknown as UserInstance;
  const isMatch = await bcrypt.compare(currentPassword, u.password);
  if (!isMatch) {
    throw new AppError('Current password is incorrect.', 401);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await user!.update({ password: hashedPassword });
};

const deleteUser = async (id: string) => {
  const user = await User.findByPk(id);
  if (!user) notFound();
  await user!.destroy();
};

export { getMe, getAllUsers, getUserById, createUser, updateUser, updateMe, changePassword, deleteUser };
