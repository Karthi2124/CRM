import { Request, Response } from 'express';
import { CustomersService } from './customers.service';
import { asyncHandler } from '../utils/error.helper';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response.helper';

export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // ─── Customer Handlers ────────────────────────────────────────────────────
  listCustomers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { data, meta } = await this.customersService.listCustomers(req.query as any);
    sendPaginated(res, data, meta, 'Customers retrieved successfully');
  });

  getCustomer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const customer = await this.customersService.getCustomerByUuid(req.params.uuid as string);
    sendSuccess(res, customer, 'Customer retrieved successfully');
  });

  createCustomer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authUser = (req as any).user;
    const customer = await this.customersService.createCustomer(req.body, authUser.id);
    sendCreated(res, customer, 'Customer created successfully');
  });

  updateCustomer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const customer = await this.customersService.updateCustomer(req.params.uuid as string, req.body);
    sendSuccess(res, customer, 'Customer updated successfully');
  });

  deleteCustomer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.customersService.deleteCustomer(req.params.uuid as string);
    sendSuccess(res, null, 'Customer deleted successfully');
  });

  // ─── Address Handlers ─────────────────────────────────────────────────────
  addAddress = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const address = await this.customersService.addAddress(req.params.customerUuid as string, req.body);
    sendCreated(res, address, 'Address added successfully');
  });

  updateAddress = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const address = await this.customersService.updateAddress(req.params.uuid as string, req.body);
    sendSuccess(res, address, 'Address updated successfully');
  });

  deleteAddress = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.customersService.deleteAddress(req.params.uuid as string);
    sendSuccess(res, null, 'Address deleted successfully');
  });

  // ─── Contact Handlers ─────────────────────────────────────────────────────
  addContact = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const contact = await this.customersService.addContact(req.params.customerUuid as string, req.body);
    sendCreated(res, contact, 'Contact added successfully');
  });

  updateContact = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const contact = await this.customersService.updateContact(req.params.uuid as string, req.body);
    sendSuccess(res, contact, 'Contact updated successfully');
  });

  deleteContact = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.customersService.deleteContact(req.params.uuid as string);
    sendSuccess(res, null, 'Contact deleted successfully');
  });

  // ─── Note Handlers ────────────────────────────────────────────────────────
  listNotes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const notes = await this.customersService.listNotes(req.params.customerUuid as string);
    sendSuccess(res, notes, 'Notes retrieved successfully');
  });

  addNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authUser = (req as any).user;
    const note = await this.customersService.addNote(req.params.customerUuid as string, authUser.id, req.body);
    sendCreated(res, note, 'Note added successfully');
  });

  updateNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const note = await this.customersService.updateNote(req.params.uuid as string, req.body);
    sendSuccess(res, note, 'Note updated successfully');
  });

  deleteNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.customersService.deleteNote(req.params.uuid as string);
    sendSuccess(res, null, 'Note deleted successfully');
  });

  // ─── Timeline Handler ─────────────────────────────────────────────────────
  getTimeline = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const timeline = await this.customersService.getTimeline(req.params.uuid as string);
    sendSuccess(res, timeline, 'Customer timeline retrieved successfully');
  });
}
