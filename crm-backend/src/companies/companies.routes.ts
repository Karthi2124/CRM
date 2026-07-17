import { Router } from 'express';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CompaniesRepository } from './companies.repository';
import { authenticate, hasPermission } from '../middleware/auth.middleware';
import {
  listCompaniesValidator,
  createCompanyValidator,
  updateCompanyValidator,
  createBranchValidator,
  updateBranchValidator,
  createDepartmentValidator,
  updateDepartmentValidator,
  createDesignationValidator,
  updateDesignationValidator,
} from './companies.validation';

const router = Router();

// Dependency Injection
const companiesRepository = new CompaniesRepository();
const companiesService = new CompaniesService(companiesRepository);
const companiesController = new CompaniesController(companiesService);

// Require authentication for all routes
router.use(authenticate);

// ─── Company Routes ─────────────────────────────────────────────────────────
router.get('/', hasPermission('companies', 'view'), listCompaniesValidator, companiesController.listCompanies);
router.get('/:uuid', hasPermission('companies', 'view'), companiesController.getCompany);
router.post('/', hasPermission('companies', 'create'), createCompanyValidator, companiesController.createCompany);
router.put('/:uuid', hasPermission('companies', 'edit'), updateCompanyValidator, companiesController.updateCompany);
router.delete('/:uuid', hasPermission('companies', 'delete'), companiesController.deleteCompany);

// ─── Organization structure chart ────────────────────────────────────────────
router.get('/:uuid/structure', hasPermission('companies', 'view'), companiesController.getOrgStructure);

// ─── Branch Routes ──────────────────────────────────────────────────────────
router.get('/:companyUuid/branches', hasPermission('companies', 'view'), companiesController.listBranches);
router.post('/:companyUuid/branches', hasPermission('companies', 'manage_branches'), createBranchValidator, companiesController.createBranch);
router.get('/branches/:uuid', hasPermission('companies', 'view'), companiesController.getBranch);
router.put('/branches/:uuid', hasPermission('companies', 'manage_branches'), updateBranchValidator, companiesController.updateBranch);
router.delete('/branches/:uuid', hasPermission('companies', 'manage_branches'), companiesController.deleteBranch);

// ─── Department Routes ───────────────────────────────────────────────────────
router.get('/branches/:branchUuid/departments', hasPermission('companies', 'view'), companiesController.listDepartments);
router.post('/branches/:branchUuid/departments', hasPermission('companies', 'manage_departments'), createDepartmentValidator, companiesController.createDepartment);
router.get('/departments/:uuid', hasPermission('companies', 'view'), companiesController.getDepartment);
router.put('/departments/:uuid', hasPermission('companies', 'manage_departments'), updateDepartmentValidator, companiesController.updateDepartment);
router.delete('/departments/:uuid', hasPermission('companies', 'manage_departments'), companiesController.deleteDepartment);

// ─── Designation Routes ──────────────────────────────────────────────────────
router.get('/departments/:deptUuid/designations', hasPermission('companies', 'view'), companiesController.listDesignations);
router.post('/departments/:deptUuid/designations', hasPermission('companies', 'manage_designations'), createDesignationValidator, companiesController.createDesignation);
router.get('/designations/:uuid', hasPermission('companies', 'view'), companiesController.getDesignation);
router.put('/designations/:uuid', hasPermission('companies', 'manage_designations'), updateDesignationValidator, companiesController.updateDesignation);
router.delete('/designations/:uuid', hasPermission('companies', 'manage_designations'), companiesController.deleteDesignation);

export default router;
