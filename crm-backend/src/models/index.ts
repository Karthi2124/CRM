import { Sequelize } from 'sequelize';
import path from 'path';
import { initRole, Role } from './Role';
import { initPermission, Permission } from './Permission';
import { initUser, User } from './User';
import { initRolePermission, RolePermission } from './RolePermission';
import { initUserSession, UserSession } from './UserSession';
import { initAuditLog, AuditLog } from './AuditLog';
import { initCompany, Company } from './Company';
import { initBranch, Branch } from './Branch';
import { initDepartment, Department } from './Department';
import { initDesignation, Designation } from './Designation';
import { initCustomer, Customer } from './Customer';
import { initCustomerAddress, CustomerAddress } from './CustomerAddress';
import { initCustomerContact, CustomerContact } from './CustomerContact';
import { initCustomerNote, CustomerNote } from './CustomerNote';
import { initLead, Lead } from './Lead';
import { initLeadNote, LeadNote } from './LeadNote';
import { initLeadFollowUp, LeadFollowUp } from './LeadFollowUp';
import { initLeadActivity, LeadActivity } from './LeadActivity';
import { initOpportunityStage, OpportunityStage } from './OpportunityStage';
import { initOpportunity, Opportunity } from './Opportunity';
import { initOpportunityCompetitor, OpportunityCompetitor } from './OpportunityCompetitor';
import { initOpportunityNote, OpportunityNote } from './OpportunityNote';
import { initProductCategory, ProductCategory } from './ProductCategory';
import { initProductBrand, ProductBrand } from './ProductBrand';
import { initProductUnit, ProductUnit } from './ProductUnit';
import { initTax, Tax } from './Tax';
import { initProduct, Product } from './Product';
import { initPriceList, PriceList } from './PriceList';

const env = process.env.NODE_ENV || 'development';
// Resolve the path to the root config/config.js
const dbConfig = require(path.resolve(__dirname, '../../config/config.js'))[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging ?? console.log,
    define: {
      underscored: true,
      freezeTableName: true,
    },
  }
);

// Initialize all models
initRole(sequelize);
initPermission(sequelize);
initUser(sequelize);
initRolePermission(sequelize);
initUserSession(sequelize);
initAuditLog(sequelize);
initCompany(sequelize);
initBranch(sequelize);
initDepartment(sequelize);
initDesignation(sequelize);
initCustomer(sequelize);
initCustomerAddress(sequelize);
initCustomerContact(sequelize);
initCustomerNote(sequelize);
initLead(sequelize);
initLeadNote(sequelize);
initLeadFollowUp(sequelize);
initLeadActivity(sequelize);
initOpportunityStage(sequelize);
initOpportunity(sequelize);
initOpportunityCompetitor(sequelize);
initOpportunityNote(sequelize);
initProductCategory(sequelize);
initProductBrand(sequelize);
initProductUnit(sequelize);
initTax(sequelize);
initProduct(sequelize);
initPriceList(sequelize);

// Define associations

// User <-> Role (One-to-Many)
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

// Role <-> Permission (Many-to-Many)
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'role_id',
  otherKey: 'permission_id',
  as: 'permissions',
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permission_id',
  otherKey: 'role_id',
  as: 'roles',
});

// User <-> UserSession (One-to-Many)
User.hasMany(UserSession, { foreignKey: 'user_id', as: 'sessions' });
UserSession.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> AuditLog (One-to-Many)
User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Company structures
Company.hasMany(Branch, { foreignKey: 'company_id', as: 'branches' });
Branch.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

Branch.hasMany(Department, { foreignKey: 'branch_id', as: 'departments' });
Department.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });

Department.hasMany(Designation, { foreignKey: 'department_id', as: 'designations' });
Designation.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

// Customer Associations
Customer.hasMany(CustomerAddress, { foreignKey: 'customer_id', as: 'addresses' });
CustomerAddress.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Customer.hasMany(CustomerContact, { foreignKey: 'customer_id', as: 'contacts' });
CustomerContact.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Customer.hasMany(CustomerNote, { foreignKey: 'customer_id', as: 'notes' });
CustomerNote.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

User.hasMany(CustomerNote, { foreignKey: 'user_id', as: 'customerNotes' });
CustomerNote.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

User.hasMany(Customer, { foreignKey: 'created_by', as: 'createdCustomers' });
Customer.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Lead Associations
Lead.hasMany(LeadNote, { foreignKey: 'lead_id', as: 'notes' });
LeadNote.belongsTo(Lead, { foreignKey: 'lead_id', as: 'lead' });

Lead.hasMany(LeadFollowUp, { foreignKey: 'lead_id', as: 'followups' });
LeadFollowUp.belongsTo(Lead, { foreignKey: 'lead_id', as: 'lead' });

Lead.hasMany(LeadActivity, { foreignKey: 'lead_id', as: 'activities' });
LeadActivity.belongsTo(Lead, { foreignKey: 'lead_id', as: 'lead' });

User.hasMany(Lead, { foreignKey: 'assigned_to', as: 'assignedLeads' });
Lead.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

User.hasMany(Lead, { foreignKey: 'created_by', as: 'createdLeads' });
Lead.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(LeadNote, { foreignKey: 'user_id', as: 'leadNotes' });
LeadNote.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

User.hasMany(LeadFollowUp, { foreignKey: 'user_id', as: 'leadFollowups' });
LeadFollowUp.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

User.hasMany(LeadActivity, { foreignKey: 'user_id', as: 'leadActivities' });
LeadActivity.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

// Opportunity Associations
Opportunity.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer.hasMany(Opportunity, { foreignKey: 'customer_id', as: 'opportunities' });

Opportunity.belongsTo(Lead, { foreignKey: 'lead_id', as: 'lead' });
Lead.hasMany(Opportunity, { foreignKey: 'lead_id', as: 'opportunities' });

Opportunity.belongsTo(OpportunityStage, { foreignKey: 'stage_id', as: 'stage' });
OpportunityStage.hasMany(Opportunity, { foreignKey: 'stage_id', as: 'opportunities' });

Opportunity.hasMany(OpportunityCompetitor, { foreignKey: 'opportunity_id', as: 'competitors' });
OpportunityCompetitor.belongsTo(Opportunity, { foreignKey: 'opportunity_id', as: 'opportunity' });

Opportunity.hasMany(OpportunityNote, { foreignKey: 'opportunity_id', as: 'notes' });
OpportunityNote.belongsTo(Opportunity, { foreignKey: 'opportunity_id', as: 'opportunity' });

User.hasMany(Opportunity, { foreignKey: 'assigned_to', as: 'assignedOpportunities' });
Opportunity.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

User.hasMany(Opportunity, { foreignKey: 'created_by', as: 'createdOpportunities' });
Opportunity.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(OpportunityNote, { foreignKey: 'user_id', as: 'opportunityNotes' });
OpportunityNote.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

// Product Associations
ProductCategory.hasMany(ProductCategory, { foreignKey: 'parent_id', as: 'children' });
ProductCategory.belongsTo(ProductCategory, { foreignKey: 'parent_id', as: 'parent' });

ProductCategory.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(ProductCategory, { foreignKey: 'category_id', as: 'category' });

ProductBrand.hasMany(Product, { foreignKey: 'brand_id', as: 'products' });
Product.belongsTo(ProductBrand, { foreignKey: 'brand_id', as: 'brand' });

ProductUnit.hasMany(Product, { foreignKey: 'unit_id', as: 'products' });
Product.belongsTo(ProductUnit, { foreignKey: 'unit_id', as: 'unit' });

Tax.hasMany(Product, { foreignKey: 'tax_id', as: 'products' });
Product.belongsTo(Tax, { foreignKey: 'tax_id', as: 'tax' });

Product.hasMany(PriceList, { foreignKey: 'product_id', as: 'priceLists' });
PriceList.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

export {
  sequelize,
  Sequelize,
  Role,
  Permission,
  User,
  RolePermission,
  UserSession,
  AuditLog,
  Company,
  Branch,
  Department,
  Designation,
  Customer,
  CustomerAddress,
  CustomerContact,
  CustomerNote,
  Lead,
  LeadNote,
  LeadFollowUp,
  LeadActivity,
  OpportunityStage,
  Opportunity,
  OpportunityCompetitor,
  OpportunityNote,
  ProductCategory,
  ProductBrand,
  ProductUnit,
  Tax,
  Product,
  PriceList,
};
