import { Op } from 'sequelize';
import { Role, Permission, RolePermission, User } from '../models';
import { CreateRoleDto, UpdateRoleDto } from './roles.types';

export class RolesRepository {
  /**
   * Find all roles with optional search, pagination.
   */
  async findAll(options: {
    limit: number;
    offset: number;
    search?: string;
  }): Promise<{ rows: Role[]; count: number }> {
    const where: any = {};
    if (options.search) {
      where.name = { [Op.like]: `%${options.search}%` };
    }

    return Role.findAndCountAll({
      where,
      include: [
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] },
          attributes: ['id', 'uuid', 'module', 'action', 'description'],
        },
      ],
      limit: options.limit,
      offset: options.offset,
      order: [['created_at', 'DESC']],
      distinct: true,
    });
  }

  /**
   * Find a single role by ID with full permissions.
   */
  async findById(id: number): Promise<Role | null> {
    return Role.findByPk(id, {
      include: [
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] },
          attributes: ['id', 'uuid', 'module', 'action', 'description'],
        },
      ],
    });
  }

  /**
   * Find a role by UUID.
   */
  async findByUuid(uuid: string): Promise<Role | null> {
    return Role.findOne({
      where: { uuid },
      include: [
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] },
        },
      ],
    });
  }

  /**
   * Check if a role name already exists.
   */
  async existsByName(name: string, excludeId?: number): Promise<boolean> {
    const where: any = { name };
    if (excludeId) where.id = { [Op.ne]: excludeId };
    const count = await Role.count({ where });
    return count > 0;
  }

  /**
   * Create a new role.
   */
  async create(dto: CreateRoleDto): Promise<Role> {
    return Role.create({ name: dto.name, description: dto.description ?? null });
  }

  /**
   * Update an existing role.
   */
  async update(id: number, dto: UpdateRoleDto): Promise<void> {
    await Role.update(
      { ...(dto.name && { name: dto.name }), ...(dto.description !== undefined && { description: dto.description }) },
      { where: { id } }
    );
  }

  /**
   * Soft-delete a role.
   */
  async delete(id: number): Promise<void> {
    await Role.destroy({ where: { id } });
  }

  /**
   * Replace all permissions for a role (assign).
   */
  async syncPermissions(roleId: number, permissionIds: number[]): Promise<void> {
    // Remove existing
    await RolePermission.destroy({ where: { role_id: roleId } });
    // Insert new
    if (permissionIds.length > 0) {
      const records = permissionIds.map((pid) => ({
        role_id: roleId,
        permission_id: pid,
      }));
      await RolePermission.bulkCreate(records);
    }
  }

  /**
   * Count users assigned to a role.
   */
  async countUsers(roleId: number): Promise<number> {
    return User.count({ where: { role_id: roleId } });
  }
}
