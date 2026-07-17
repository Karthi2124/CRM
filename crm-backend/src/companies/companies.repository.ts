import { Op } from 'sequelize';
import { Company, Branch, Department, Designation } from '../models';
import { CreateCompanyDto, UpdateCompanyDto, CreateBranchDto, UpdateBranchDto, CreateDepartmentDto, UpdateDepartmentDto, CreateDesignationDto, UpdateDesignationDto } from './companies.types';

export class CompaniesRepository {
  // ─── Company operations ───────────────────────────────────────────────────
  async findCompanyAll(options: { limit: number; offset: number; search?: string }): Promise<{ rows: Company[]; count: number }> {
    const where: Record<string, any> = {};
    if (options.search) {
      where[Op.or as any] = [
        { name: { [Op.like]: `%${options.search}%` } },
        { legal_name: { [Op.like]: `%${options.search}%` } },
        { email: { [Op.like]: `%${options.search}%` } },
      ];
    }
    return Company.findAndCountAll({
      where,
      limit: options.limit,
      offset: options.offset,
      order: [['created_at', 'DESC']],
    });
  }

  async findCompanyByUuid(uuid: string): Promise<Company | null> {
    return Company.findOne({ where: { uuid } });
  }

  async findCompanyById(id: number): Promise<Company | null> {
    return Company.findByPk(id);
  }

  async createCompany(dto: CreateCompanyDto): Promise<Company> {
    return Company.create(dto as any);
  }

  async updateCompany(id: number, dto: UpdateCompanyDto): Promise<void> {
    await Company.update(dto, { where: { id } });
  }

  async deleteCompany(id: number): Promise<void> {
    await Company.destroy({ where: { id } });
  }

  // ─── Branch operations ────────────────────────────────────────────────────
  async findBranchAll(companyId: number): Promise<Branch[]> {
    return Branch.findAll({
      where: { company_id: companyId },
      order: [['created_at', 'DESC']],
    });
  }

  async findBranchByUuid(uuid: string): Promise<Branch | null> {
    return Branch.findOne({ where: { uuid } });
  }

  async findBranchById(id: number): Promise<Branch | null> {
    return Branch.findByPk(id);
  }

  async createBranch(dto: CreateBranchDto): Promise<Branch> {
    return Branch.create(dto as any);
  }

  async updateBranch(id: number, dto: UpdateBranchDto): Promise<void> {
    await Branch.update(dto, { where: { id } });
  }

  async deleteBranch(id: number): Promise<void> {
    await Branch.destroy({ where: { id } });
  }

  // ─── Department operations ────────────────────────────────────────────────
  async findDepartmentAll(branchId: number): Promise<Department[]> {
    return Department.findAll({
      where: { branch_id: branchId },
      order: [['created_at', 'DESC']],
    });
  }

  async findDepartmentByUuid(uuid: string): Promise<Department | null> {
    return Department.findOne({ where: { uuid } });
  }

  async findDepartmentById(id: number): Promise<Department | null> {
    return Department.findByPk(id);
  }

  async createDepartment(dto: CreateDepartmentDto): Promise<Department> {
    return Department.create(dto as any);
  }

  async updateDepartment(id: number, dto: UpdateDepartmentDto): Promise<void> {
    await Department.update(dto, { where: { id } });
  }

  async deleteDepartment(id: number): Promise<void> {
    await Department.destroy({ where: { id } });
  }

  // ─── Designation operations ───────────────────────────────────────────────
  async findDesignationAll(departmentId: number): Promise<Designation[]> {
    return Designation.findAll({
      where: { department_id: departmentId },
      order: [['created_at', 'DESC']],
    });
  }

  async findDesignationByUuid(uuid: string): Promise<Designation | null> {
    return Designation.findOne({ where: { uuid } });
  }

  async findDesignationById(id: number): Promise<Designation | null> {
    return Designation.findByPk(id);
  }

  async createDesignation(dto: CreateDesignationDto): Promise<Designation> {
    return Designation.create(dto as any);
  }

  async updateDesignation(id: number, dto: UpdateDesignationDto): Promise<void> {
    await Designation.update(dto, { where: { id } });
  }

  async deleteDesignation(id: number): Promise<void> {
    await Designation.destroy({ where: { id } });
  }

  // ─── Hierarchy / Organization Structure ────────────────────────────────────
  async getOrgStructure(companyId: number): Promise<Company | null> {
    return Company.findByPk(companyId, {
      include: [
        {
          model: Branch,
          as: 'branches',
          include: [
            {
              model: Department,
              as: 'departments',
              include: [
                {
                  model: Designation,
                  as: 'designations',
                },
              ],
            },
          ],
        },
      ],
    });
  }
}
