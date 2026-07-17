import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { asyncHandler } from '../utils/error.helper';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response.helper';

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /api/users
  list = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { data, meta } = await this.usersService.list(req.query as any);
    sendPaginated(res, data, meta, 'Users retrieved successfully');
  });

  // GET /api/users/:uuid
  getOne = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await this.usersService.getByUuid(req.params.uuid as string);
    sendSuccess(res, user, 'User retrieved successfully');
  });

  // POST /api/users
  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await this.usersService.create(req.body);
    sendCreated(res, user, 'User created successfully');
  });

  // PUT /api/users/:uuid
  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await this.usersService.update(req.params.uuid as string, req.body);
    sendSuccess(res, user, 'User updated successfully');
  });

  // DELETE /api/users/:uuid
  remove = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authUser = (req as any).user;
    await this.usersService.delete(req.params.uuid as string, authUser.id);
    sendSuccess(res, null, 'User deleted successfully');
  });

  // POST /api/users/bulk-delete
  bulkDelete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authUser = (req as any).user;
    const count = await this.usersService.bulkDelete(req.body, authUser.id);
    sendSuccess(res, { deletedCount: count }, `${count} user(s) deleted successfully`);
  });

  // PATCH /api/users/:uuid/status
  changeStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authUser = (req as any).user;
    const user = await this.usersService.changeStatus(req.params.uuid as string, req.body.status, authUser.id);
    sendSuccess(res, user, 'User status updated successfully');
  });

  // POST /api/users/:uuid/reset-password
  adminResetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.usersService.adminResetPassword(req.params.uuid as string, req.body);
    sendSuccess(res, null, 'Password reset successfully');
  });

  // GET /api/users/export
  exportCsv = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const csv = await this.usersService.exportCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
    res.send(csv);
  });
}
