import { CompaniesRepository } from './companies.repository';
import { CreateCompanyDto, UpdateCompanyDto, CompanyListQuery, CreateBranchDto, UpdateBranchDto, CreateDepartmentDto, UpdateDepartmentDto, CreateDesignationDto, UpdateDesignationDto } from './companies.types';
import { NotFoundError } from '../utils/error.helper';
import { parsePagination, buildPaginationMeta } from '../utils/response.helper';
import logger from '../utils/logger';

export class CompaniesService {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  // ─── Company Service Methods ──────────────────────────────────────────────
  async listCompanies(query: CompanyListQuery) {
    const { page, limit, offset } = parsePagination(query);
    const { rows, count } = await this.companiesRepository.findCompanyAll({
      limit,
      offset,
      search: query.search,
    });

    const data = rows.map((c) => ({
      id: c.id,
      uuid: c.uuid,
      name: c.name,
      legal_name: c.legal_name,
      email: c.email,
      phone: c.phone,
      website: c.website,
      tax_number: c.tax_number,
      logo_url: c.logo_url,
      address: c.address,
      created_at: c.created_at,
    }));

    return { data, meta: buildPaginationMeta(count, page, limit) };
  }

  async getCompanyByUuid(uuid: string) {
    const company = await this.companiesRepository.findCompanyByUuid(uuid);
    if (!company) throw new NotFoundError('Company');
    return company;
  }

  async createCompany(dto: CreateCompanyDto) {
    const company = await this.companiesRepository.createCompany(dto);
    logger.info(`Company created: "${company.name}" (ID: ${company.id})`);
    return company;
  }

  async updateCompany(uuid: string, dto: UpdateCompanyDto) {
    const company = await this.getCompanyByUuid(uuid);
    await this.companiesRepository.updateCompany(company.id, dto);
    logger.info(`Company updated: "${company.name}" (ID: ${company.id})`);
    return this.getCompanyByUuid(uuid);
  }

  async deleteCompany(uuid: string) {
    const company = await this.getCompanyByUuid(uuid);
    await this.companiesRepository.deleteCompany(company.id);
    logger.info(`Company deleted: "${company.name}" (ID: ${company.id})`);
  }

  // ─── Branch Service Methods ───────────────────────────────────────────────
  async listBranches(companyUuid: string) {
    const company = await this.getCompanyByUuid(companyUuid);
    const branches = await this.companiesRepository.findBranchAll(company.id);
    return branches;
  }

  async getBranchByUuid(uuid: string) {
    const branch = await this.companiesRepository.findBranchByUuid(uuid);
    if (!branch) throw new NotFoundError('Branch');
    return branch;
  }

  async createBranch(companyUuid: string, dto: Omit<CreateBranchDto, 'company_id'>) {
    const company = await this.getCompanyByUuid(companyUuid);
    const branch = await this.companiesRepository.createBranch({
      ...dto,
      company_id: company.id,
    });
    logger.info(`Branch created: "${branch.name}" (ID: ${branch.id}) for Company ID: ${company.id}`);
    return branch;
  }

  async updateBranch(uuid: string, dto: UpdateBranchDto) {
    const branch = await this.getBranchByUuid(uuid);
    await this.companiesRepository.updateBranch(branch.id, dto);
    logger.info(`Branch updated: "${branch.name}" (ID: ${branch.id})`);
    return this.getBranchByUuid(uuid);
  }

  async deleteBranch(uuid: string) {
    const branch = await this.getBranchByUuid(uuid);
    await this.companiesRepository.deleteBranch(branch.id);
    logger.info(`Branch deleted: "${branch.name}" (ID: ${branch.id})`);
  }

  // ─── Department Service Methods ───────────────────────────────────────────
  async listDepartments(branchUuid: string) {
    const branch = await this.getBranchByUuid(branchUuid);
    const departments = await this.companiesRepository.findDepartmentAll(branch.id);
    return departments;
  }

  async getDepartmentByUuid(uuid: string) {
    const dept = await this.companiesRepository.findDepartmentByUuid(uuid);
    if (!dept) throw new NotFoundError('Department');
    return dept;
  }

  async createDepartment(branchUuid: string, dto: Omit<CreateDepartmentDto, 'branch_id'>) {
    const branch = await this.getBranchByUuid(branchUuid);
    const dept = await this.companiesRepository.createDepartment({
      ...dto,
      branch_id: branch.id,
    });
    logger.info(`Department created: "${dept.name}" (ID: ${dept.id}) for Branch ID: ${branch.id}`);
    return dept;
  }

  async updateDepartment(uuid: string, dto: UpdateDepartmentDto) {
    const dept = await this.getDepartmentByUuid(uuid);
    await this.companiesRepository.updateDepartment(dept.id, dto);
    logger.info(`Department updated: "${dept.name}" (ID: ${dept.id})`);
    return this.getDepartmentByUuid(uuid);
  }

  async deleteDepartment(uuid: string) {
    const dept = await this.getDepartmentByUuid(uuid);
    await this.companiesRepository.deleteDepartment(dept.id);
    logger.info(`Department deleted: "${dept.name}" (ID: ${dept.id})`);
  }

  // ─── Designation Service Methods ──────────────────────────────────────────
  async listDesignations(deptUuid: string) {
    const dept = await this.getDepartmentByUuid(deptUuid);
    const designations = await this.companiesRepository.findDesignationAll(dept.id);
    return designations;
  }

  async getDesignationByUuid(uuid: string) {
    const desig = await this.companiesRepository.findDesignationByUuid(uuid);
    if (!desig) throw new NotFoundError('Designation');
    return desig;
  }

  async createDesignation(deptUuid: string, dto: Omit<CreateDesignationDto, 'department_id'>) {
    const dept = await this.getDepartmentByUuid(deptUuid);
    const desig = await this.companiesRepository.createDesignation({
      ...dto,
      department_id: dept.id,
    });
    logger.info(`Designation created: "${desig.name}" (ID: ${desig.id}) for Department ID: ${dept.id}`);
    return desig;
  }

  async updateDesignation(uuid: string, dto: UpdateDesignationDto) {
    const desig = await this.getDesignationByUuid(uuid);
    await this.companiesRepository.updateDesignation(desig.id, dto);
    logger.info(`Designation updated: "${desig.name}" (ID: ${desig.id})`);
    return this.getDesignationByUuid(uuid);
  }

  async deleteDesignation(uuid: string) {
    const desig = await this.getDesignationByUuid(uuid);
    await this.companiesRepository.deleteDesignation(desig.id);
    logger.info(`Designation deleted: "${desig.name}" (ID: ${desig.id})`);
  }

  // ─── Organization Structure Chart ─────────────────────────────────────────
  async getOrganizationStructure(companyUuid: string) {
    const company = await this.getCompanyByUuid(companyUuid);
    const structure = await this.companiesRepository.getOrgStructure(company.id);
    if (!structure) throw new NotFoundError('Organization structure');
    return structure;
  }
}
