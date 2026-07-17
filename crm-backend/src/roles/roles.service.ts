import { RolesRepository } from './roles.repository';
import { CreateRoleDto, UpdateRoleDto, AssignPermissionsDto, RoleListQuery } from './roles.types';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/error.helper';
import { parsePagination, buildPaginationMeta } from '../utils/response.helper';
import logger from '../utils/logger';

export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  // ─── LIST ROLES ───────────────────────────────────────────────────────────
  async list(query: RoleListQuery) {
    const { page, limit, offset } = parsePagination(query);
    const { rows, count } = await this.rolesRepository.findAll({
      limit,
      offset,
      search: query.search,
    });

    const data = rows.map((role) => ({
      id: role.id,
      uuid: role.uuid,
      name: role.name,
      description: role.description,
      permissionCount: ((role as any).permissions || []).length,
      created_at: role.created_at,
    }));

    return { data, meta: buildPaginationMeta(count, page, limit) };
  }

  // ─── GET ROLE BY UUID ─────────────────────────────────────────────────────
  async getByUuid(uuid: string) {
    const role = await this.rolesRepository.findByUuid(uuid);
    if (!role) throw new NotFoundError('Role');

    const userCount = await this.rolesRepository.countUsers(role.id);

    return {
      id: role.id,
      uuid: role.uuid,
      name: role.name,
      description: role.description,
      userCount,
      permissions: ((role as any).permissions || []).map((p: any) => ({
        id: p.id,
        uuid: p.uuid,
        module: p.module,
        action: p.action,
        description: p.description,
      })),
      created_at: role.created_at,
    };
  }

  // ─── CREATE ROLE ──────────────────────────────────────────────────────────
  async create(dto: CreateRoleDto) {
    const exists = await this.rolesRepository.existsByName(dto.name);
    if (exists) throw new ConflictError(`Role "${dto.name}" already exists`);

    const role = await this.rolesRepository.create(dto);
    logger.info(`Role created: "${role.name}" (ID: ${role.id})`);

    return { id: role.id, uuid: role.uuid, name: role.name, description: role.description };
  }

  // ─── UPDATE ROLE ──────────────────────────────────────────────────────────
  async update(uuid: string, dto: UpdateRoleDto) {
    const role = await this.rolesRepository.findByUuid(uuid);
    if (!role) throw new NotFoundError('Role');

    // Protect system roles
    const systemRoles = ['Super Admin'];
    if (systemRoles.includes(role.name) && dto.name && dto.name !== role.name) {
      throw new BadRequestError('Cannot rename system roles');
    }

    if (dto.name) {
      const exists = await this.rolesRepository.existsByName(dto.name, role.id);
      if (exists) throw new ConflictError(`Role "${dto.name}" already exists`);
    }

    await this.rolesRepository.update(role.id, dto);
    logger.info(`Role updated: "${role.name}" → "${dto.name || role.name}"`);

    return this.getByUuid(uuid);
  }

  // ─── DELETE ROLE ──────────────────────────────────────────────────────────
  async delete(uuid: string) {
    const role = await this.rolesRepository.findByUuid(uuid);
    if (!role) throw new NotFoundError('Role');

    const systemRoles = ['Super Admin', 'Admin'];
    if (systemRoles.includes(role.name)) {
      throw new BadRequestError('Cannot delete system roles');
    }

    const userCount = await this.rolesRepository.countUsers(role.id);
    if (userCount > 0) {
      throw new BadRequestError(`Cannot delete role "${role.name}" — it is assigned to ${userCount} user(s). Reassign users first.`);
    }

    await this.rolesRepository.delete(role.id);
    logger.info(`Role deleted: "${role.name}"`);
  }

  // ─── ASSIGN PERMISSIONS ───────────────────────────────────────────────────
  async assignPermissions(uuid: string, dto: AssignPermissionsDto) {
    const role = await this.rolesRepository.findByUuid(uuid);
    if (!role) throw new NotFoundError('Role');

    await this.rolesRepository.syncPermissions(role.id, dto.permissionIds);
    logger.info(`Permissions synced for role "${role.name}": ${dto.permissionIds.length} permissions`);

    return this.getByUuid(uuid);
  }
}
