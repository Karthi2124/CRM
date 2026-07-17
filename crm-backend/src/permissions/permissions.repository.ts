import { Permission } from '../models';

export class PermissionsRepository {
  /**
   * Get all permissions grouped by module.
   */
  async findAllGrouped(): Promise<Record<string, Permission[]>> {
    const permissions = await Permission.findAll({
      order: [['module', 'ASC'], ['action', 'ASC']],
    });

    return permissions.reduce((groups, perm) => {
      if (!groups[perm.module]) groups[perm.module] = [];
      groups[perm.module].push(perm);
      return groups;
    }, {} as Record<string, Permission[]>);
  }

  /**
   * Get all permissions as flat list.
   */
  async findAll(): Promise<Permission[]> {
    return Permission.findAll({
      order: [['module', 'ASC'], ['action', 'ASC']],
    });
  }

  /**
   * Find permissions by IDs (for validation when assigning).
   */
  async findByIds(ids: number[]): Promise<Permission[]> {
    return Permission.findAll({
      where: { id: ids },
    });
  }
}
