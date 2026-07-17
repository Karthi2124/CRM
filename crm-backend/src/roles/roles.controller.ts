import { Request, Response } from 'express';
import { RolesService } from './roles.service';
import { asyncHandler } from '../utils/error.helper';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response.helper';

export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // GET /api/roles
  list = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { data, meta } = await this.rolesService.list(req.query as Record<string, string>);
    sendPaginated(res, data, meta, 'Roles retrieved successfully');
  });

  // GET /api/roles/:uuid
  getOne = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const role = await this.rolesService.getByUuid(req.params.uuid as string);
    sendSuccess(res, role, 'Role retrieved successfully');
  });

  // POST /api/roles
  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const role = await this.rolesService.create(req.body);
    sendCreated(res, role, 'Role created successfully');
  });

  // PUT /api/roles/:uuid
  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const role = await this.rolesService.update(req.params.uuid as string, req.body);
    sendSuccess(res, role, 'Role updated successfully');
  });

  // DELETE /api/roles/:uuid
  remove = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.rolesService.delete(req.params.uuid as string);
    sendSuccess(res, null, 'Role deleted successfully');
  });

  // PUT /api/roles/:uuid/permissions
  assignPermissions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const role = await this.rolesService.assignPermissions(req.params.uuid as string, req.body);
    sendSuccess(res, role, 'Permissions assigned successfully');
  });
}
