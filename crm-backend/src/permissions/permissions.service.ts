import { PermissionsRepository } from './permissions.repository';

export class PermissionsService {
  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  /**
   * Get all permissions as flat list.
   */
  async listAll() {
    const permissions = await this.permissionsRepository.findAll();
    return permissions.map((p) => ({
      id: p.id,
      uuid: p.uuid,
      module: p.module,
      action: p.action,
      key: `${p.module}.${p.action}`,
      description: p.description,
    }));
  }

  /**
   * Get permissions grouped by module (for permission matrix UI).
   */
  async listGrouped() {
    const grouped = await this.permissionsRepository.findAllGrouped();

    return Object.entries(grouped).map(([module, permissions]) => ({
      module,
      permissions: permissions.map((p) => ({
        id: p.id,
        uuid: p.uuid,
        action: p.action,
        key: `${p.module}.${p.action}`,
        description: p.description,
      })),
    }));
  }
}
