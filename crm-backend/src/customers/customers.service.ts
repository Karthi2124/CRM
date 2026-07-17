import { CustomersRepository } from './customers.repository';
import { CreateCustomerDto, UpdateCustomerDto, CustomerListQuery, CreateCustomerAddressDto, UpdateCustomerAddressDto, CreateCustomerContactDto, UpdateCustomerContactDto, CreateCustomerNoteDto, UpdateCustomerNoteDto, TimelineEvent } from './customers.types';
import { NotFoundError, ConflictError } from '../utils/error.helper';
import { parsePagination, buildPaginationMeta } from '../utils/response.helper';
import logger from '../utils/logger';

export class CustomersService {
  constructor(private readonly customersRepository: CustomersRepository) {}

  // ─── Customer Profile Logic ────────────────────────────────────────────────
  async listCustomers(query: CustomerListQuery) {
    const { page, limit, offset } = parsePagination(query);
    const { rows, count } = await this.customersRepository.findAll({
      limit,
      offset,
      search: query.search,
      type: query.type,
      status: query.status,
    });

    const data = rows.map((c) => ({
      id: c.id,
      uuid: c.uuid,
      name: c.name,
      type: c.type,
      email: c.email,
      phone: c.phone,
      website: c.website,
      gst_number: c.gst_number,
      tax_id: c.tax_id,
      status: c.status,
      created_at: c.created_at,
    }));

    return { data, meta: buildPaginationMeta(count, page, limit) };
  }

  async getCustomerByUuid(uuid: string) {
    const customer = await this.customersRepository.findByUuid(uuid);
    if (!customer) throw new NotFoundError('Customer');
    return customer;
  }

  async createCustomer(dto: CreateCustomerDto, userId: number) {
    if (dto.email) {
      const emailExists = await this.customersRepository.existsByEmail(dto.email);
      if (emailExists) throw new ConflictError(`Customer email "${dto.email}" is already registered`);
    }

    const customer = await this.customersRepository.create(dto, userId);
    logger.info(`Customer created: "${customer.name}" (ID: ${customer.id}) by User ID: ${userId}`);
    return customer;
  }

  async updateCustomer(uuid: string, dto: UpdateCustomerDto) {
    const customer = await this.getCustomerByUuid(uuid);

    if (dto.email && dto.email !== customer.email) {
      const emailExists = await this.customersRepository.existsByEmail(dto.email, customer.id);
      if (emailExists) throw new ConflictError(`Customer email "${dto.email}" is already registered`);
    }

    await this.customersRepository.update(customer.id, dto);
    logger.info(`Customer updated: "${customer.name}" (ID: ${customer.id})`);
    return this.getCustomerByUuid(uuid);
  }

  async deleteCustomer(uuid: string) {
    const customer = await this.getCustomerByUuid(uuid);
    await this.customersRepository.delete(customer.id);
    logger.info(`Customer deleted: "${customer.name}" (ID: ${customer.id})`);
  }

  // ─── Address Logic ────────────────────────────────────────────────────────
  async addAddress(customerUuid: string, dto: CreateCustomerAddressDto) {
    const customer = await this.getCustomerByUuid(customerUuid);
    const address = await this.customersRepository.createAddress(customer.id, dto);
    logger.info(`Address added to Customer ID: ${customer.id} (Address ID: ${address.id})`);
    return address;
  }

  async updateAddress(addressUuid: string, dto: UpdateCustomerAddressDto) {
    const address = await this.customersRepository.findAddressByUuid(addressUuid);
    if (!address) throw new NotFoundError('Address');

    await this.customersRepository.updateAddress(address.id, dto);
    logger.info(`Address updated (ID: ${address.id})`);
    return this.customersRepository.findAddressByUuid(addressUuid);
  }

  async deleteAddress(addressUuid: string) {
    const address = await this.customersRepository.findAddressByUuid(addressUuid);
    if (!address) throw new NotFoundError('Address');

    await this.customersRepository.deleteAddress(address.id);
    logger.info(`Address deleted (ID: ${address.id})`);
  }

  // ─── Contact Logic ────────────────────────────────────────────────────────
  async addContact(customerUuid: string, dto: CreateCustomerContactDto) {
    const customer = await this.getCustomerByUuid(customerUuid);
    const contact = await this.customersRepository.createContact(customer.id, dto);
    logger.info(`Contact added to Customer ID: ${customer.id} (Contact ID: ${contact.id})`);
    return contact;
  }

  async updateContact(contactUuid: string, dto: UpdateCustomerContactDto) {
    const contact = await this.customersRepository.findContactByUuid(contactUuid);
    if (!contact) throw new NotFoundError('Contact');

    await this.customersRepository.updateContact(contact.id, dto);
    logger.info(`Contact updated (ID: ${contact.id})`);
    return this.customersRepository.findContactByUuid(contactUuid);
  }

  async deleteContact(contactUuid: string) {
    const contact = await this.customersRepository.findContactByUuid(contactUuid);
    if (!contact) throw new NotFoundError('Contact');

    await this.customersRepository.deleteContact(contact.id);
    logger.info(`Contact deleted (ID: ${contact.id})`);
  }

  // ─── Note Logic ───────────────────────────────────────────────────────────
  async listNotes(customerUuid: string) {
    const customer = await this.getCustomerByUuid(customerUuid);
    return this.customersRepository.findNotesByCustomerId(customer.id);
  }

  async addNote(customerUuid: string, userId: number, dto: CreateCustomerNoteDto) {
    const customer = await this.getCustomerByUuid(customerUuid);
    const note = await this.customersRepository.createNote(customer.id, userId, dto);
    logger.info(`Note added to Customer ID: ${customer.id} (Note ID: ${note.id}) by User: ${userId}`);
    return note;
  }

  async updateNote(noteUuid: string, dto: UpdateCustomerNoteDto) {
    const note = await this.customersRepository.findNoteByUuid(noteUuid);
    if (!note) throw new NotFoundError('Note');

    await this.customersRepository.updateNote(note.id, dto);
    logger.info(`Note updated (ID: ${note.id})`);
    return note;
  }

  async deleteNote(noteUuid: string) {
    const note = await this.customersRepository.findNoteByUuid(noteUuid);
    if (!note) throw new NotFoundError('Note');

    await this.customersRepository.deleteNote(note.id);
    logger.info(`Note deleted (ID: ${note.id})`);
  }

  // ─── Customer Timeline ────────────────────────────────────────────────────
  async getTimeline(customerUuid: string): Promise<TimelineEvent[]> {
    const customer = await this.getCustomerByUuid(customerUuid);

    const notes = await this.customersRepository.findNotesByCustomerId(customer.id);
    const auditLogs = await this.customersRepository.findAuditLogs(customer.id);

    const timeline: TimelineEvent[] = [];

    // Map Notes to TimelineEvents
    notes.forEach((note) => {
      timeline.push({
        id: note.id,
        type: 'note',
        event_name: 'Note Created',
        description: note.note,
        user: note.author ? {
          uuid: (note.author as any).uuid,
          first_name: (note.author as any).first_name,
          last_name: (note.author as any).last_name,
        } : null,
        date: note.created_at,
      });
    });

    // Map AuditLogs to TimelineEvents
    auditLogs.forEach((log) => {
      timeline.push({
        id: log.id,
        type: 'audit_log',
        event_name: `Customer ${log.action.toUpperCase()}`,
        description: `Customer profile was ${log.action}d.`,
        user: log.user ? {
          uuid: (log.user as any).uuid,
          first_name: (log.user as any).first_name,
          last_name: (log.user as any).last_name,
        } : null,
        date: log.created_at,
      });
    });

    // Sort descending by date
    return timeline.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
