import { Op } from 'sequelize';
import { Customer, CustomerAddress, CustomerContact, CustomerNote, User, AuditLog } from '../models';
import { CreateCustomerDto, UpdateCustomerDto, CreateCustomerAddressDto, UpdateCustomerAddressDto, CreateCustomerContactDto, UpdateCustomerContactDto, CreateCustomerNoteDto, UpdateCustomerNoteDto } from './customers.types';

export class CustomersRepository {
  // ─── Customer Operations ──────────────────────────────────────────────────
  async findAll(options: { limit: number; offset: number; search?: string; type?: string; status?: string }): Promise<{ rows: Customer[]; count: number }> {
    const where: Record<string, any> = {};

    if (options.search) {
      where[Op.or as any] = [
        { name: { [Op.like]: `%${options.search}%` } },
        { email: { [Op.like]: `%${options.search}%` } },
        { phone: { [Op.like]: `%${options.search}%` } },
      ];
    }

    if (options.type) where.type = options.type;
    if (options.status) where.status = options.status;

    return Customer.findAndCountAll({
      where,
      limit: options.limit,
      offset: options.offset,
      order: [['created_at', 'DESC']],
    });
  }

  async findByUuid(uuid: string): Promise<Customer | null> {
    return Customer.findOne({
      where: { uuid },
      include: [
        { model: CustomerAddress, as: 'addresses' },
        { model: CustomerContact, as: 'contacts' },
      ],
    });
  }

  async findById(id: number): Promise<Customer | null> {
    return Customer.findByPk(id);
  }

  async existsByEmail(email: string, excludeId?: number): Promise<boolean> {
    if (!email) return false;
    const where: Record<string, any> = { email };
    if (excludeId) where.id = { [Op.ne]: excludeId };
    return (await Customer.count({ where })) > 0;
  }

  async create(dto: CreateCustomerDto, userId: number): Promise<Customer> {
    return Customer.create({
      ...dto,
      created_by: userId,
    } as any);
  }

  async update(id: number, dto: UpdateCustomerDto): Promise<void> {
    await Customer.update(dto, { where: { id } });
  }

  async delete(id: number): Promise<void> {
    await Customer.destroy({ where: { id } });
  }

  // ─── Address Operations ───────────────────────────────────────────────────
  async findAddressByUuid(uuid: string): Promise<CustomerAddress | null> {
    return CustomerAddress.findOne({ where: { uuid } });
  }

  async createAddress(customerId: number, dto: CreateCustomerAddressDto): Promise<CustomerAddress> {
    return CustomerAddress.create({
      ...dto,
      customer_id: customerId,
    } as any);
  }

  async updateAddress(id: number, dto: UpdateCustomerAddressDto): Promise<void> {
    await CustomerAddress.update(dto, { where: { id } });
  }

  async deleteAddress(id: number): Promise<void> {
    await CustomerAddress.destroy({ where: { id } });
  }

  // ─── Contact Operations ───────────────────────────────────────────────────
  async findContactByUuid(uuid: string): Promise<CustomerContact | null> {
    return CustomerContact.findOne({ where: { uuid } });
  }

  async createContact(customerId: number, dto: CreateCustomerContactDto): Promise<CustomerContact> {
    return CustomerContact.create({
      ...dto,
      customer_id: customerId,
    } as any);
  }

  async updateContact(id: number, dto: UpdateCustomerContactDto): Promise<void> {
    await CustomerContact.update(dto, { where: { id } });
  }

  async deleteContact(id: number): Promise<void> {
    await CustomerContact.destroy({ where: { id } });
  }

  // ─── Note Operations ──────────────────────────────────────────────────────
  async findNoteByUuid(uuid: string): Promise<CustomerNote | null> {
    return CustomerNote.findOne({ where: { uuid } });
  }

  async findNotesByCustomerId(customerId: number): Promise<CustomerNote[]> {
    return CustomerNote.findAll({
      where: { customer_id: customerId },
      include: [{ model: User, as: 'author', attributes: ['uuid', 'first_name', 'last_name'] }],
      order: [['created_at', 'DESC']],
    });
  }

  async createNote(customerId: number, userId: number, dto: CreateCustomerNoteDto): Promise<CustomerNote> {
    return CustomerNote.create({
      ...dto,
      customer_id: customerId,
      user_id: userId,
    } as any);
  }

  async updateNote(id: number, dto: UpdateCustomerNoteDto): Promise<void> {
    await CustomerNote.update(dto, { where: { id } });
  }

  async deleteNote(id: number): Promise<void> {
    await CustomerNote.destroy({ where: { id } });
  }

  // ─── Timeline / Activity queries ──────────────────────────────────────────
  async findAuditLogs(entityId: number): Promise<AuditLog[]> {
    return AuditLog.findAll({
      where: {
        entity_type: 'Customer',
        entity_id: entityId,
      },
      include: [{ model: User, as: 'user', attributes: ['uuid', 'first_name', 'last_name'] }],
      order: [['created_at', 'DESC']],
    });
  }
}
