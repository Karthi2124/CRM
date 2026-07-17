import { Router } from 'express';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CustomersRepository } from './customers.repository';
import { authenticate, hasPermission } from '../middleware/auth.middleware';
import {
  listCustomersValidator,
  createCustomerValidator,
  updateCustomerValidator,
  createAddressValidator,
  updateAddressValidator,
  createContactValidator,
  updateContactValidator,
  createNoteValidator,
  updateNoteValidator,
} from './customers.validation';

const router = Router();

// Dependency Injection
const customersRepository = new CustomersRepository();
const customersService = new CustomersService(customersRepository);
const customersController = new CustomersController(customersService);

// Require authentication for all endpoints
router.use(authenticate);

// ─── Customer Profile Routes ────────────────────────────────────────────────
router.get('/', hasPermission('customers', 'view'), listCustomersValidator, customersController.listCustomers);
router.get('/:uuid', hasPermission('customers', 'view'), customersController.getCustomer);
router.post('/', hasPermission('customers', 'create'), createCustomerValidator, customersController.createCustomer);
router.put('/:uuid', hasPermission('customers', 'edit'), updateCustomerValidator, customersController.updateCustomer);
router.delete('/:uuid', hasPermission('customers', 'delete'), customersController.deleteCustomer);

// ─── Customer Timeline Route ────────────────────────────────────────────────
router.get('/:uuid/timeline', hasPermission('customers', 'view_timeline'), customersController.getTimeline);

// ─── Address Routes ─────────────────────────────────────────────────────────
router.post('/:customerUuid/addresses', hasPermission('customers', 'edit'), createAddressValidator, customersController.addAddress);
router.put('/addresses/:uuid', hasPermission('customers', 'edit'), updateAddressValidator, customersController.updateAddress);
router.delete('/addresses/:uuid', hasPermission('customers', 'edit'), customersController.deleteAddress);

// ─── Contact Routes ─────────────────────────────────────────────────────────
router.post('/:customerUuid/contacts', hasPermission('customers', 'edit'), createContactValidator, customersController.addContact);
router.put('/contacts/:uuid', hasPermission('customers', 'edit'), updateContactValidator, customersController.updateContact);
router.delete('/contacts/:uuid', hasPermission('customers', 'edit'), customersController.deleteContact);

// ─── Note Routes ────────────────────────────────────────────────────────────
router.get('/:customerUuid/notes', hasPermission('customers', 'view'), customersController.listNotes);
router.post('/:customerUuid/notes', hasPermission('customers', 'add_note'), createNoteValidator, customersController.addNote);
router.put('/notes/:uuid', hasPermission('customers', 'edit'), updateNoteValidator, customersController.updateNote);
router.delete('/notes/:uuid', hasPermission('customers', 'delete'), customersController.deleteNote);

export default router;
