import { Request, Response } from 'express';
import { PermissionsService } from './permissions.service';
import { asyncHandler } from '../utils/error.helper';
import { sendSuccess } from '../utils/response.helper';

export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  // GET /api/permissions
  list = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const permissions = await this.permissionsService.listAll();
    sendSuccess(res, permissions, 'Permissions retrieved successfully');
  });

  // GET /api/permissions/grouped
  listGrouped = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const grouped = await this.permissionsService.listGrouped();
    sendSuccess(res, grouped, 'Permissions grouped by module');
  });
}
