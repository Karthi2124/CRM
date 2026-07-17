import { Op, Order } from 'sequelize';
import { User, Role } from '../models';
import { UserListQuery } from './users.types';

const USER_SAFE_ATTRIBUTES = {
  exclude: ['password_hash', 'password_reset_token', 'password_reset_expires_at'],
};

export class UsersRepository {
  private get includeRole() {
    return [{ model: Role, as: 'role', attributes: ['id', 'uuid', 'name'] }];
  }

  async findAll(options: UserListQuery & { limit: number; offset: number }): Promise<{ rows: User[]; count: number }> {
    const where: Record<string, any> = {};

    if (options.search) {
      where[Op.or as any] = [
        { first_name: { [Op.like]: `%${options.search}%` } },
        { last_name: { [Op.like]: `%${options.search}%` } },
        { email: { [Op.like]: `%${options.search}%` } },
        { employee_id: { [Op.like]: `%${options.search}%` } },
      ];
    }

    if (options.status) where.status = options.status;
    if (options.role_id) where.role_id = Number(options.role_id);

    const allowedSortFields = ['first_name', 'last_name', 'email', 'created_at', 'last_login_at', 'status'];
    const sortField = allowedSortFields.includes(options.sort as string) ? (options.sort as string) : 'created_at';
    const sortOrder = options.order === 'ASC' ? 'ASC' : 'DESC';
    const order: Order = [[sortField, sortOrder]];

    return User.findAndCountAll({
      where,
      include: this.includeRole,
      attributes: USER_SAFE_ATTRIBUTES,
      limit: options.limit,
      offset: options.offset,
      order,
      distinct: true,
    });
  }

  async findByUuid(uuid: string): Promise<User | null> {
    return User.findOne({
      where: { uuid },
      include: this.includeRole,
      attributes: USER_SAFE_ATTRIBUTES,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  async existsByEmail(email: string, excludeId?: number): Promise<boolean> {
    const where: any = { email };
    if (excludeId) where.id = { [Op.ne]: excludeId };
    return (await User.count({ where })) > 0;
  }

  async findByUuids(uuids: string[]): Promise<User[]> {
    return User.findAll({ where: { uuid: uuids } });
  }

  async create(data: Partial<User>): Promise<User> {
    return User.create(data as any);
  }

  async update(id: number, data: Partial<User>): Promise<void> {
    await User.update(data as any, { where: { id } });
  }

  async delete(id: number): Promise<void> {
    await User.destroy({ where: { id } });
  }

  async bulkDelete(ids: number[]): Promise<number> {
    return User.destroy({ where: { id: ids } });
  }

  async updateAvatar(id: number, avatarUrl: string): Promise<void> {
    await User.update({ avatar_url: avatarUrl }, { where: { id } });
  }

  async updatePassword(id: number, passwordHash: string): Promise<void> {
    await User.update({ password_hash: passwordHash }, { where: { id } });
  }

  async toggleStatus(id: number, status: 'active' | 'inactive' | 'suspended'): Promise<void> {
    await User.update({ status }, { where: { id } });
  }
}
