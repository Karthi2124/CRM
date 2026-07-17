import { Request, Response } from 'express';
import { CompaniesService } from './companies.service';
import { asyncHandler } from '../utils/error.helper';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response.helper';

export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  // ─── Company Handlers ─────────────────────────────────────────────────────
  listCompanies = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { data, meta } = await this.companiesService.listCompanies(req.query as any);
    sendPaginated(res, data, meta, 'Companies retrieved successfully');
  });

  getCompany = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const company = await this.companiesService.getCompanyByUuid(req.params.uuid as string);
    sendSuccess(res, company, 'Company retrieved successfully');
  });

  createCompany = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const company = await this.companiesService.createCompany(req.body);
    sendCreated(res, company, 'Company created successfully');
  });

  updateCompany = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const company = await this.companiesService.updateCompany(req.params.uuid as string, req.body);
    sendSuccess(res, company, 'Company updated successfully');
  });

  deleteCompany = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.companiesService.deleteCompany(req.params.uuid as string);
    sendSuccess(res, null, 'Company deleted successfully');
  });

  // ─── Branch Handlers ──────────────────────────────────────────────────────
  listBranches = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const branches = await this.companiesService.listBranches(req.params.companyUuid as string);
    sendSuccess(res, branches, 'Branches retrieved successfully');
  });

  getBranch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const branch = await this.companiesService.getBranchByUuid(req.params.uuid as string);
    sendSuccess(res, branch, 'Branch retrieved successfully');
  });

  createBranch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const branch = await this.companiesService.createBranch(req.params.companyUuid as string, req.body);
    sendCreated(res, branch, 'Branch created successfully');
  });

  updateBranch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const branch = await this.companiesService.updateBranch(req.params.uuid as string, req.body);
    sendSuccess(res, branch, 'Branch updated successfully');
  });

  deleteBranch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.companiesService.deleteBranch(req.params.uuid as string);
    sendSuccess(res, null, 'Branch deleted successfully');
  });

  // ─── Department Handlers ──────────────────────────────────────────────────
  listDepartments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const departments = await this.companiesService.listDepartments(req.params.branchUuid as string);
    sendSuccess(res, departments, 'Departments retrieved successfully');
  });

  getDepartment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const department = await this.companiesService.getDepartmentByUuid(req.params.uuid as string);
    sendSuccess(res, department, 'Department retrieved successfully');
  });

  createDepartment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const department = await this.companiesService.createDepartment(req.params.branchUuid as string, req.body);
    sendCreated(res, department, 'Department created successfully');
  });

  updateDepartment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const department = await this.companiesService.updateDepartment(req.params.uuid as string, req.body);
    sendSuccess(res, department, 'Department updated successfully');
  });

  deleteDepartment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.companiesService.deleteDepartment(req.params.uuid as string);
    sendSuccess(res, null, 'Department deleted successfully');
  });

  // ─── Designation Handlers ─────────────────────────────────────────────────
  listDesignations = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const designations = await this.companiesService.listDesignations(req.params.deptUuid as string);
    sendSuccess(res, designations, 'Designations retrieved successfully');
  });

  getDesignation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const designation = await this.companiesService.getDesignationByUuid(req.params.uuid as string);
    sendSuccess(res, designation, 'Designation retrieved successfully');
  });

  createDesignation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const designation = await this.companiesService.createDesignation(req.params.deptUuid as string, req.body);
    sendCreated(res, designation, 'Designation created successfully');
  });

  updateDesignation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const designation = await this.companiesService.updateDesignation(req.params.uuid as string, req.body);
    sendSuccess(res, designation, 'Designation updated successfully');
  });

  deleteDesignation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.companiesService.deleteDesignation(req.params.uuid as string);
    sendSuccess(res, null, 'Designation deleted successfully');
  });

  // ─── Org Chart Handler ────────────────────────────────────────────────────
  getOrgStructure = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const structure = await this.companiesService.getOrganizationStructure(req.params.uuid as string);
    sendSuccess(res, structure, 'Organization structure retrieved successfully');
  });
}
