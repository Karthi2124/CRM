import bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { CreateUserDto, UpdateUserDto, UserListQuery, UserResponse, BulkDeleteDto, AdminResetPasswordDto } from './users.types';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/error.helper';
import { parsePagination, buildPaginationMeta } from '../utils/response.helper';
import logger from '../utils/logger';

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  // ─── Format user for response ─────────────────────────────────────────────
  private formatUser(user: any): UserResponse {
    return {
      id: user.id,
      uuid: user.uuid,
      employee_id: user.employee_id,
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      phone: user.phone,
      avatar_url: user.avatar_url,
      address: user.address,
      date_of_birth: user.date_of_birth,
      gender: user.gender,
      status: user.status,
      role: user.role ? { id: user.role.id, uuid: user.role.uuid, name: user.role.name } : null,
      last_login_at: user.last_login_at,
      created_at: user.created_at,
    };
  }

  // ─── LIST ─────────────────────────────────────────────────────────────────
  async list(query: UserListQuery) {
    const { page, limit, offset } = parsePagination(query);
    const { rows, count } = await this.usersRepository.findAll({ ...query, limit, offset } as any);
    return { data: rows.map(this.formatUser), meta: buildPaginationMeta(count, page, limit) };
  }

  // ─── GET ONE ──────────────────────────────────────────────────────────────
  async getByUuid(uuid: string): Promise<UserResponse> {
    const user = await this.usersRepository.findByUuid(uuid);
    if (!user) throw new NotFoundError('User');
    return this.formatUser(user);
  }

  // ─── CREATE ───────────────────────────────────────────────────────────────
  async create(dto: CreateUserDto): Promise<UserResponse> {
    const emailExists = await this.usersRepository.existsByEmail(dto.email);
    if (emailExists) throw new ConflictError(`Email "${dto.email}" is already registered`);

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.usersRepository.create({
      employee_id: dto.employee_id ?? null,
      first_name: dto.first_name,
      last_name: dto.last_name,
      email: dto.email,
      phone: dto.phone ?? null,
      password_hash: passwordHash,
      role_id: dto.role_id,
      status: dto.status ?? 'active',
      address: dto.address ?? null,
      date_of_birth: dto.date_of_birth ?? null,
      gender: dto.gender ?? null,
    } as any);

    logger.info(`User created: ${user.email} (ID: ${user.id})`);
    return this.getByUuid(user.uuid);
  }

  // ─── UPDATE ───────────────────────────────────────────────────────────────
  async update(uuid: string, dto: UpdateUserDto): Promise<UserResponse> {
    const user = await this.usersRepository.findByUuid(uuid);
    if (!user) throw new NotFoundError('User');

    await this.usersRepository.update(user.id, {
      ...(dto.first_name && { first_name: dto.first_name }),
      ...(dto.last_name && { last_name: dto.last_name }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.role_id && { role_id: dto.role_id }),
      ...(dto.status && { status: dto.status }),
      ...(dto.employee_id !== undefined && { employee_id: dto.employee_id }),
      ...(dto.address !== undefined && { address: dto.address }),
      ...(dto.date_of_birth !== undefined && { date_of_birth: dto.date_of_birth }),
      ...(dto.gender !== undefined && { gender: dto.gender }),
    } as any);

    logger.info(`User updated: ${user.email}`);
    return this.getByUuid(uuid);
  }

  // ─── DELETE ───────────────────────────────────────────────────────────────
  async delete(uuid: string, requestingUserId: number): Promise<void> {
    const user = await this.usersRepository.findByUuid(uuid);
    if (!user) throw new NotFoundError('User');

    if (user.id === requestingUserId) {
      throw new BadRequestError('You cannot delete your own account');
    }

    await this.usersRepository.delete(user.id);
    logger.info(`User soft-deleted: ${user.email}`);
  }

  // ─── BULK DELETE ──────────────────────────────────────────────────────────
  async bulkDelete(dto: BulkDeleteDto, requestingUserId: number): Promise<number> {
    if (!dto.uuids?.length) throw new BadRequestError('No UUIDs provided');

    const users = await this.usersRepository.findByUuids(dto.uuids);
    const ids = users.map((u) => u.id).filter((id): id is number => id !== requestingUserId);

    if (ids.length === 0) throw new BadRequestError('No valid users to delete');

    const count = await this.usersRepository.bulkDelete(ids);
    logger.info(`Bulk deleted ${count} users`);
    return count;
  }

  // ─── CHANGE STATUS ────────────────────────────────────────────────────────
  async changeStatus(uuid: string, status: 'active' | 'inactive' | 'suspended', requestingUserId: number): Promise<UserResponse> {
    const user = await this.usersRepository.findByUuid(uuid);
    if (!user) throw new NotFoundError('User');

    if (user.id === requestingUserId) throw new BadRequestError('You cannot change your own status');

    await this.usersRepository.toggleStatus(user.id, status);
    logger.info(`User status changed: ${user.email} → ${status}`);
    return this.getByUuid(uuid);
  }

  // ─── ADMIN PASSWORD RESET ─────────────────────────────────────────────────
  async adminResetPassword(uuid: string, dto: AdminResetPasswordDto): Promise<void> {
    const user = await this.usersRepository.findByUuid(uuid);
    if (!user) throw new NotFoundError('User');

    const hash = await bcrypt.hash(dto.newPassword, 12);
    await this.usersRepository.updatePassword(user.id, hash);
    logger.info(`Admin reset password for user: ${user.email}`);
  }

  // ─── UPDATE AVATAR ────────────────────────────────────────────────────────
  async updateAvatar(uuid: string, avatarUrl: string): Promise<UserResponse> {
    const user = await this.usersRepository.findByUuid(uuid);
    if (!user) throw new NotFoundError('User');

    await this.usersRepository.updateAvatar(user.id, avatarUrl);
    return this.getByUuid(uuid);
  }

  // ─── EXPORT CSV ───────────────────────────────────────────────────────────
  async exportCsv(): Promise<string> {
    const { rows } = await this.usersRepository.findAll({ limit: 10000, offset: 0 } as any);
    const header = 'Employee ID,First Name,Last Name,Email,Phone,Role,Status,Last Login,Created At\n';
    const rows_csv = rows.map((u) => {
      const role = (u as any).role?.name || '';
      return [
        u.employee_id || '',
        u.first_name,
        u.last_name,
        u.email,
        u.phone || '',
        role,
        u.status,
        u.last_login_at?.toISOString() || '',
        u.created_at.toISOString(),
      ].join(',');
    });
    return header + rows_csv.join('\n');
  }
}
