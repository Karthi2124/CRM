"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setting = exports.UploadedFile = exports.NotificationPreference = exports.NotificationTemplate = exports.Notification = exports.CalendarEvent = exports.TaskAttachment = exports.TaskComment = exports.Task = exports.CreditNote = exports.Payment = exports.InvoiceItem = exports.Invoice = exports.QuotationItem = exports.Quotation = exports.PriceList = exports.Product = exports.Tax = exports.ProductUnit = exports.ProductBrand = exports.ProductCategory = exports.OpportunityNote = exports.OpportunityCompetitor = exports.Opportunity = exports.OpportunityStage = exports.LeadActivity = exports.LeadFollowUp = exports.LeadNote = exports.Lead = exports.CustomerNote = exports.CustomerContact = exports.CustomerAddress = exports.Customer = exports.Designation = exports.Department = exports.Branch = exports.Company = exports.AuditLog = exports.UserSession = exports.RolePermission = exports.User = exports.Permission = exports.Role = exports.Sequelize = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
Object.defineProperty(exports, "Sequelize", { enumerable: true, get: function () { return sequelize_1.Sequelize; } });
const path_1 = __importDefault(require("path"));
const Role_1 = require("./Role");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return Role_1.Role; } });
const Permission_1 = require("./Permission");
Object.defineProperty(exports, "Permission", { enumerable: true, get: function () { return Permission_1.Permission; } });
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const RolePermission_1 = require("./RolePermission");
Object.defineProperty(exports, "RolePermission", { enumerable: true, get: function () { return RolePermission_1.RolePermission; } });
const UserSession_1 = require("./UserSession");
Object.defineProperty(exports, "UserSession", { enumerable: true, get: function () { return UserSession_1.UserSession; } });
const AuditLog_1 = require("./AuditLog");
Object.defineProperty(exports, "AuditLog", { enumerable: true, get: function () { return AuditLog_1.AuditLog; } });
const Company_1 = require("./Company");
Object.defineProperty(exports, "Company", { enumerable: true, get: function () { return Company_1.Company; } });
const Branch_1 = require("./Branch");
Object.defineProperty(exports, "Branch", { enumerable: true, get: function () { return Branch_1.Branch; } });
const Department_1 = require("./Department");
Object.defineProperty(exports, "Department", { enumerable: true, get: function () { return Department_1.Department; } });
const Designation_1 = require("./Designation");
Object.defineProperty(exports, "Designation", { enumerable: true, get: function () { return Designation_1.Designation; } });
const Customer_1 = require("./Customer");
Object.defineProperty(exports, "Customer", { enumerable: true, get: function () { return Customer_1.Customer; } });
const CustomerAddress_1 = require("./CustomerAddress");
Object.defineProperty(exports, "CustomerAddress", { enumerable: true, get: function () { return CustomerAddress_1.CustomerAddress; } });
const CustomerContact_1 = require("./CustomerContact");
Object.defineProperty(exports, "CustomerContact", { enumerable: true, get: function () { return CustomerContact_1.CustomerContact; } });
const CustomerNote_1 = require("./CustomerNote");
Object.defineProperty(exports, "CustomerNote", { enumerable: true, get: function () { return CustomerNote_1.CustomerNote; } });
const Lead_1 = require("./Lead");
Object.defineProperty(exports, "Lead", { enumerable: true, get: function () { return Lead_1.Lead; } });
const LeadNote_1 = require("./LeadNote");
Object.defineProperty(exports, "LeadNote", { enumerable: true, get: function () { return LeadNote_1.LeadNote; } });
const LeadFollowUp_1 = require("./LeadFollowUp");
Object.defineProperty(exports, "LeadFollowUp", { enumerable: true, get: function () { return LeadFollowUp_1.LeadFollowUp; } });
const LeadActivity_1 = require("./LeadActivity");
Object.defineProperty(exports, "LeadActivity", { enumerable: true, get: function () { return LeadActivity_1.LeadActivity; } });
const OpportunityStage_1 = require("./OpportunityStage");
Object.defineProperty(exports, "OpportunityStage", { enumerable: true, get: function () { return OpportunityStage_1.OpportunityStage; } });
const Opportunity_1 = require("./Opportunity");
Object.defineProperty(exports, "Opportunity", { enumerable: true, get: function () { return Opportunity_1.Opportunity; } });
const OpportunityCompetitor_1 = require("./OpportunityCompetitor");
Object.defineProperty(exports, "OpportunityCompetitor", { enumerable: true, get: function () { return OpportunityCompetitor_1.OpportunityCompetitor; } });
const OpportunityNote_1 = require("./OpportunityNote");
Object.defineProperty(exports, "OpportunityNote", { enumerable: true, get: function () { return OpportunityNote_1.OpportunityNote; } });
const ProductCategory_1 = require("./ProductCategory");
Object.defineProperty(exports, "ProductCategory", { enumerable: true, get: function () { return ProductCategory_1.ProductCategory; } });
const ProductBrand_1 = require("./ProductBrand");
Object.defineProperty(exports, "ProductBrand", { enumerable: true, get: function () { return ProductBrand_1.ProductBrand; } });
const ProductUnit_1 = require("./ProductUnit");
Object.defineProperty(exports, "ProductUnit", { enumerable: true, get: function () { return ProductUnit_1.ProductUnit; } });
const Tax_1 = require("./Tax");
Object.defineProperty(exports, "Tax", { enumerable: true, get: function () { return Tax_1.Tax; } });
const Product_1 = require("./Product");
Object.defineProperty(exports, "Product", { enumerable: true, get: function () { return Product_1.Product; } });
const PriceList_1 = require("./PriceList");
Object.defineProperty(exports, "PriceList", { enumerable: true, get: function () { return PriceList_1.PriceList; } });
const Quotation_1 = require("./Quotation");
Object.defineProperty(exports, "Quotation", { enumerable: true, get: function () { return Quotation_1.Quotation; } });
const QuotationItem_1 = require("./QuotationItem");
Object.defineProperty(exports, "QuotationItem", { enumerable: true, get: function () { return QuotationItem_1.QuotationItem; } });
const Invoice_1 = require("./Invoice");
Object.defineProperty(exports, "Invoice", { enumerable: true, get: function () { return Invoice_1.Invoice; } });
const InvoiceItem_1 = require("./InvoiceItem");
Object.defineProperty(exports, "InvoiceItem", { enumerable: true, get: function () { return InvoiceItem_1.InvoiceItem; } });
const Payment_1 = require("./Payment");
Object.defineProperty(exports, "Payment", { enumerable: true, get: function () { return Payment_1.Payment; } });
const CreditNote_1 = require("./CreditNote");
Object.defineProperty(exports, "CreditNote", { enumerable: true, get: function () { return CreditNote_1.CreditNote; } });
const Task_1 = require("./Task");
Object.defineProperty(exports, "Task", { enumerable: true, get: function () { return Task_1.Task; } });
const TaskComment_1 = require("./TaskComment");
Object.defineProperty(exports, "TaskComment", { enumerable: true, get: function () { return TaskComment_1.TaskComment; } });
const TaskAttachment_1 = require("./TaskAttachment");
Object.defineProperty(exports, "TaskAttachment", { enumerable: true, get: function () { return TaskAttachment_1.TaskAttachment; } });
const CalendarEvent_1 = require("./CalendarEvent");
Object.defineProperty(exports, "CalendarEvent", { enumerable: true, get: function () { return CalendarEvent_1.CalendarEvent; } });
const Notification_1 = require("./Notification");
Object.defineProperty(exports, "Notification", { enumerable: true, get: function () { return Notification_1.Notification; } });
const NotificationTemplate_1 = require("./NotificationTemplate");
Object.defineProperty(exports, "NotificationTemplate", { enumerable: true, get: function () { return NotificationTemplate_1.NotificationTemplate; } });
const NotificationPreference_1 = require("./NotificationPreference");
Object.defineProperty(exports, "NotificationPreference", { enumerable: true, get: function () { return NotificationPreference_1.NotificationPreference; } });
const UploadedFile_1 = require("./UploadedFile");
Object.defineProperty(exports, "UploadedFile", { enumerable: true, get: function () { return UploadedFile_1.UploadedFile; } });
const Setting_1 = require("./Setting");
Object.defineProperty(exports, "Setting", { enumerable: true, get: function () { return Setting_1.Setting; } });
const env = process.env.NODE_ENV || 'development';
// Resolve the path to the root config/config.js
const dbConfig = require(path_1.default.resolve(__dirname, '../../config/config.js'))[env];
const sequelize = new sequelize_1.Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging ?? console.log,
    define: {
        underscored: true,
        freezeTableName: true,
    },
});
exports.sequelize = sequelize;
// Initialize all models
(0, Role_1.initRole)(sequelize);
(0, Permission_1.initPermission)(sequelize);
(0, User_1.initUser)(sequelize);
(0, RolePermission_1.initRolePermission)(sequelize);
(0, UserSession_1.initUserSession)(sequelize);
(0, AuditLog_1.initAuditLog)(sequelize);
(0, Company_1.initCompany)(sequelize);
(0, Branch_1.initBranch)(sequelize);
(0, Department_1.initDepartment)(sequelize);
(0, Designation_1.initDesignation)(sequelize);
(0, Customer_1.initCustomer)(sequelize);
(0, CustomerAddress_1.initCustomerAddress)(sequelize);
(0, CustomerContact_1.initCustomerContact)(sequelize);
(0, CustomerNote_1.initCustomerNote)(sequelize);
(0, Lead_1.initLead)(sequelize);
(0, LeadNote_1.initLeadNote)(sequelize);
(0, LeadFollowUp_1.initLeadFollowUp)(sequelize);
(0, LeadActivity_1.initLeadActivity)(sequelize);
(0, OpportunityStage_1.initOpportunityStage)(sequelize);
(0, Opportunity_1.initOpportunity)(sequelize);
(0, OpportunityCompetitor_1.initOpportunityCompetitor)(sequelize);
(0, OpportunityNote_1.initOpportunityNote)(sequelize);
(0, ProductCategory_1.initProductCategory)(sequelize);
(0, ProductBrand_1.initProductBrand)(sequelize);
(0, ProductUnit_1.initProductUnit)(sequelize);
(0, Tax_1.initTax)(sequelize);
(0, Product_1.initProduct)(sequelize);
(0, PriceList_1.initPriceList)(sequelize);
(0, Quotation_1.initQuotation)(sequelize);
(0, QuotationItem_1.initQuotationItem)(sequelize);
(0, Invoice_1.initInvoice)(sequelize);
(0, InvoiceItem_1.initInvoiceItem)(sequelize);
(0, Payment_1.initPayment)(sequelize);
(0, CreditNote_1.initCreditNote)(sequelize);
(0, Task_1.initTask)(sequelize);
(0, TaskComment_1.initTaskComment)(sequelize);
(0, TaskAttachment_1.initTaskAttachment)(sequelize);
(0, CalendarEvent_1.initCalendarEvent)(sequelize);
(0, Notification_1.initNotification)(sequelize);
(0, NotificationTemplate_1.initNotificationTemplate)(sequelize);
(0, NotificationPreference_1.initNotificationPreference)(sequelize);
(0, UploadedFile_1.initUploadedFile)(sequelize);
(0, Setting_1.initSetting)(sequelize);
// Define associations
// User <-> Role (One-to-Many)
Role_1.Role.hasMany(User_1.User, { foreignKey: 'role_id', as: 'users' });
User_1.User.belongsTo(Role_1.Role, { foreignKey: 'role_id', as: 'role' });
// Role <-> Permission (Many-to-Many)
Role_1.Role.belongsToMany(Permission_1.Permission, {
    through: RolePermission_1.RolePermission,
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    as: 'permissions',
});
Permission_1.Permission.belongsToMany(Role_1.Role, {
    through: RolePermission_1.RolePermission,
    foreignKey: 'permission_id',
    otherKey: 'role_id',
    as: 'roles',
});
// User <-> UserSession (One-to-Many)
User_1.User.hasMany(UserSession_1.UserSession, { foreignKey: 'user_id', as: 'sessions' });
UserSession_1.UserSession.belongsTo(User_1.User, { foreignKey: 'user_id', as: 'user' });
// User <-> AuditLog (One-to-Many)
User_1.User.hasMany(AuditLog_1.AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
AuditLog_1.AuditLog.belongsTo(User_1.User, { foreignKey: 'user_id', as: 'user' });
// Company structures
Company_1.Company.hasMany(Branch_1.Branch, { foreignKey: 'company_id', as: 'branches' });
Branch_1.Branch.belongsTo(Company_1.Company, { foreignKey: 'company_id', as: 'company' });
Branch_1.Branch.hasMany(Department_1.Department, { foreignKey: 'branch_id', as: 'departments' });
Department_1.Department.belongsTo(Branch_1.Branch, { foreignKey: 'branch_id', as: 'branch' });
Department_1.Department.hasMany(Designation_1.Designation, { foreignKey: 'department_id', as: 'designations' });
Designation_1.Designation.belongsTo(Department_1.Department, { foreignKey: 'department_id', as: 'department' });
// Customer Associations
Customer_1.Customer.hasMany(CustomerAddress_1.CustomerAddress, { foreignKey: 'customer_id', as: 'addresses' });
CustomerAddress_1.CustomerAddress.belongsTo(Customer_1.Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer_1.Customer.hasMany(CustomerContact_1.CustomerContact, { foreignKey: 'customer_id', as: 'contacts' });
CustomerContact_1.CustomerContact.belongsTo(Customer_1.Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer_1.Customer.hasMany(CustomerNote_1.CustomerNote, { foreignKey: 'customer_id', as: 'notes' });
CustomerNote_1.CustomerNote.belongsTo(Customer_1.Customer, { foreignKey: 'customer_id', as: 'customer' });
User_1.User.hasMany(CustomerNote_1.CustomerNote, { foreignKey: 'user_id', as: 'customerNotes' });
CustomerNote_1.CustomerNote.belongsTo(User_1.User, { foreignKey: 'user_id', as: 'author' });
User_1.User.hasMany(Customer_1.Customer, { foreignKey: 'created_by', as: 'createdCustomers' });
Customer_1.Customer.belongsTo(User_1.User, { foreignKey: 'created_by', as: 'creator' });
// Lead Associations
Lead_1.Lead.hasMany(LeadNote_1.LeadNote, { foreignKey: 'lead_id', as: 'notes' });
LeadNote_1.LeadNote.belongsTo(Lead_1.Lead, { foreignKey: 'lead_id', as: 'lead' });
Lead_1.Lead.hasMany(LeadFollowUp_1.LeadFollowUp, { foreignKey: 'lead_id', as: 'followups' });
LeadFollowUp_1.LeadFollowUp.belongsTo(Lead_1.Lead, { foreignKey: 'lead_id', as: 'lead' });
Lead_1.Lead.hasMany(LeadActivity_1.LeadActivity, { foreignKey: 'lead_id', as: 'activities' });
LeadActivity_1.LeadActivity.belongsTo(Lead_1.Lead, { foreignKey: 'lead_id', as: 'lead' });
User_1.User.hasMany(Lead_1.Lead, { foreignKey: 'assigned_to', as: 'assignedLeads' });
Lead_1.Lead.belongsTo(User_1.User, { foreignKey: 'assigned_to', as: 'assignee' });
User_1.User.hasMany(Lead_1.Lead, { foreignKey: 'created_by', as: 'createdLeads' });
Lead_1.Lead.belongsTo(User_1.User, { foreignKey: 'created_by', as: 'creator' });
User_1.User.hasMany(LeadNote_1.LeadNote, { foreignKey: 'user_id', as: 'leadNotes' });
LeadNote_1.LeadNote.belongsTo(User_1.User, { foreignKey: 'user_id', as: 'author' });
User_1.User.hasMany(LeadFollowUp_1.LeadFollowUp, { foreignKey: 'user_id', as: 'leadFollowups' });
LeadFollowUp_1.LeadFollowUp.belongsTo(User_1.User, { foreignKey: 'user_id', as: 'author' });
User_1.User.hasMany(LeadActivity_1.LeadActivity, { foreignKey: 'user_id', as: 'leadActivities' });
LeadActivity_1.LeadActivity.belongsTo(User_1.User, { foreignKey: 'user_id', as: 'author' });
// Opportunity Associations
Opportunity_1.Opportunity.belongsTo(Customer_1.Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer_1.Customer.hasMany(Opportunity_1.Opportunity, { foreignKey: 'customer_id', as: 'opportunities' });
Opportunity_1.Opportunity.belongsTo(Lead_1.Lead, { foreignKey: 'lead_id', as: 'lead' });
Lead_1.Lead.hasMany(Opportunity_1.Opportunity, { foreignKey: 'lead_id', as: 'opportunities' });
Opportunity_1.Opportunity.belongsTo(OpportunityStage_1.OpportunityStage, { foreignKey: 'stage_id', as: 'stage' });
OpportunityStage_1.OpportunityStage.hasMany(Opportunity_1.Opportunity, { foreignKey: 'stage_id', as: 'opportunities' });
Opportunity_1.Opportunity.hasMany(OpportunityCompetitor_1.OpportunityCompetitor, { foreignKey: 'opportunity_id', as: 'competitors' });
OpportunityCompetitor_1.OpportunityCompetitor.belongsTo(Opportunity_1.Opportunity, { foreignKey: 'opportunity_id', as: 'opportunity' });
Opportunity_1.Opportunity.hasMany(OpportunityNote_1.OpportunityNote, { foreignKey: 'opportunity_id', as: 'notes' });
OpportunityNote_1.OpportunityNote.belongsTo(Opportunity_1.Opportunity, { foreignKey: 'opportunity_id', as: 'opportunity' });
User_1.User.hasMany(Opportunity_1.Opportunity, { foreignKey: 'assigned_to', as: 'assignedOpportunities' });
Opportunity_1.Opportunity.belongsTo(User_1.User, { foreignKey: 'assigned_to', as: 'assignee' });
User_1.User.hasMany(Opportunity_1.Opportunity, { foreignKey: 'created_by', as: 'createdOpportunities' });
Opportunity_1.Opportunity.belongsTo(User_1.User, { foreignKey: 'created_by', as: 'creator' });
User_1.User.hasMany(OpportunityNote_1.OpportunityNote, { foreignKey: 'user_id', as: 'opportunityNotes' });
OpportunityNote_1.OpportunityNote.belongsTo(User_1.User, { foreignKey: 'user_id', as: 'author' });
// Product Associations
ProductCategory_1.ProductCategory.hasMany(ProductCategory_1.ProductCategory, { foreignKey: 'parent_id', as: 'children' });
ProductCategory_1.ProductCategory.belongsTo(ProductCategory_1.ProductCategory, { foreignKey: 'parent_id', as: 'parent' });
ProductCategory_1.ProductCategory.hasMany(Product_1.Product, { foreignKey: 'category_id', as: 'products' });
Product_1.Product.belongsTo(ProductCategory_1.ProductCategory, { foreignKey: 'category_id', as: 'category' });
ProductBrand_1.ProductBrand.hasMany(Product_1.Product, { foreignKey: 'brand_id', as: 'products' });
Product_1.Product.belongsTo(ProductBrand_1.ProductBrand, { foreignKey: 'brand_id', as: 'brand' });
ProductUnit_1.ProductUnit.hasMany(Product_1.Product, { foreignKey: 'unit_id', as: 'products' });
Product_1.Product.belongsTo(ProductUnit_1.ProductUnit, { foreignKey: 'unit_id', as: 'unit' });
Tax_1.Tax.hasMany(Product_1.Product, { foreignKey: 'tax_id', as: 'products' });
Product_1.Product.belongsTo(Tax_1.Tax, { foreignKey: 'tax_id', as: 'tax' });
Product_1.Product.hasMany(PriceList_1.PriceList, { foreignKey: 'product_id', as: 'priceLists' });
PriceList_1.PriceList.belongsTo(Product_1.Product, { foreignKey: 'product_id', as: 'product' });
// Quotation Associations
Customer_1.Customer.hasMany(Quotation_1.Quotation, { foreignKey: 'customer_id', as: 'quotations' });
Quotation_1.Quotation.belongsTo(Customer_1.Customer, { foreignKey: 'customer_id', as: 'customer' });
Lead_1.Lead.hasMany(Quotation_1.Quotation, { foreignKey: 'lead_id', as: 'quotations' });
Quotation_1.Quotation.belongsTo(Lead_1.Lead, { foreignKey: 'lead_id', as: 'lead' });
Opportunity_1.Opportunity.hasMany(Quotation_1.Quotation, { foreignKey: 'opportunity_id', as: 'quotations' });
Quotation_1.Quotation.belongsTo(Opportunity_1.Opportunity, { foreignKey: 'opportunity_id', as: 'opportunity' });
User_1.User.hasMany(Quotation_1.Quotation, { foreignKey: 'created_by', as: 'quotations' });
Quotation_1.Quotation.belongsTo(User_1.User, { foreignKey: 'created_by', as: 'creator' });
Quotation_1.Quotation.hasMany(QuotationItem_1.QuotationItem, { foreignKey: 'quotation_id', as: 'items', onDelete: 'CASCADE' });
QuotationItem_1.QuotationItem.belongsTo(Quotation_1.Quotation, { foreignKey: 'quotation_id', as: 'quotation' });
Product_1.Product.hasMany(QuotationItem_1.QuotationItem, { foreignKey: 'product_id', as: 'quotationItems' });
QuotationItem_1.QuotationItem.belongsTo(Product_1.Product, { foreignKey: 'product_id', as: 'product' });
Tax_1.Tax.hasMany(QuotationItem_1.QuotationItem, { foreignKey: 'tax_id', as: 'quotationItems' });
QuotationItem_1.QuotationItem.belongsTo(Tax_1.Tax, { foreignKey: 'tax_id', as: 'tax' });
// Invoice Associations
Customer_1.Customer.hasMany(Invoice_1.Invoice, { foreignKey: 'customer_id', as: 'invoices' });
Invoice_1.Invoice.belongsTo(Customer_1.Customer, { foreignKey: 'customer_id', as: 'customer' });
Quotation_1.Quotation.hasMany(Invoice_1.Invoice, { foreignKey: 'quotation_id', as: 'invoices' });
Invoice_1.Invoice.belongsTo(Quotation_1.Quotation, { foreignKey: 'quotation_id', as: 'quotation' });
User_1.User.hasMany(Invoice_1.Invoice, { foreignKey: 'created_by', as: 'invoices' });
Invoice_1.Invoice.belongsTo(User_1.User, { foreignKey: 'created_by', as: 'creator' });
Invoice_1.Invoice.hasMany(InvoiceItem_1.InvoiceItem, { foreignKey: 'invoice_id', as: 'items', onDelete: 'CASCADE' });
InvoiceItem_1.InvoiceItem.belongsTo(Invoice_1.Invoice, { foreignKey: 'invoice_id', as: 'invoice' });
Product_1.Product.hasMany(InvoiceItem_1.InvoiceItem, { foreignKey: 'product_id', as: 'invoiceItems' });
InvoiceItem_1.InvoiceItem.belongsTo(Product_1.Product, { foreignKey: 'product_id', as: 'product' });
Tax_1.Tax.hasMany(InvoiceItem_1.InvoiceItem, { foreignKey: 'tax_id', as: 'invoiceItems' });
InvoiceItem_1.InvoiceItem.belongsTo(Tax_1.Tax, { foreignKey: 'tax_id', as: 'tax' });
Invoice_1.Invoice.hasMany(Payment_1.Payment, { foreignKey: 'invoice_id', as: 'payments', onDelete: 'CASCADE' });
Payment_1.Payment.belongsTo(Invoice_1.Invoice, { foreignKey: 'invoice_id', as: 'invoice' });
User_1.User.hasMany(Payment_1.Payment, { foreignKey: 'created_by', as: 'payments' });
Payment_1.Payment.belongsTo(User_1.User, { foreignKey: 'created_by', as: 'creator' });
Invoice_1.Invoice.hasMany(CreditNote_1.CreditNote, { foreignKey: 'invoice_id', as: 'creditNotes', onDelete: 'CASCADE' });
CreditNote_1.CreditNote.belongsTo(Invoice_1.Invoice, { foreignKey: 'invoice_id', as: 'invoice' });
User_1.User.hasMany(CreditNote_1.CreditNote, { foreignKey: 'created_by', as: 'creditNotes' });
CreditNote_1.CreditNote.belongsTo(User_1.User, { foreignKey: 'created_by', as: 'creator' });
// Task Associations
User_1.User.hasMany(Task_1.Task, { foreignKey: 'assigned_to', as: 'assignedTasks' });
Task_1.Task.belongsTo(User_1.User, { foreignKey: 'assigned_to', as: 'assignee' });
User_1.User.hasMany(Task_1.Task, { foreignKey: 'created_by', as: 'createdTasks' });
Task_1.Task.belongsTo(User_1.User, { foreignKey: 'created_by', as: 'creator' });
Customer_1.Customer.hasMany(Task_1.Task, { foreignKey: 'customer_id', as: 'tasks' });
Task_1.Task.belongsTo(Customer_1.Customer, { foreignKey: 'customer_id', as: 'customer' });
Lead_1.Lead.hasMany(Task_1.Task, { foreignKey: 'lead_id', as: 'tasks' });
Task_1.Task.belongsTo(Lead_1.Lead, { foreignKey: 'lead_id', as: 'lead' });
Opportunity_1.Opportunity.hasMany(Task_1.Task, { foreignKey: 'opportunity_id', as: 'tasks' });
Task_1.Task.belongsTo(Opportunity_1.Opportunity, { foreignKey: 'opportunity_id', as: 'opportunity' });
Task_1.Task.hasMany(TaskComment_1.TaskComment, { foreignKey: 'task_id', as: 'comments', onDelete: 'CASCADE' });
TaskComment_1.TaskComment.belongsTo(Task_1.Task, { foreignKey: 'task_id', as: 'task' });
User_1.User.hasMany(TaskComment_1.TaskComment, { foreignKey: 'user_id', as: 'taskComments' });
TaskComment_1.TaskComment.belongsTo(User_1.User, { foreignKey: 'user_id', as: 'author' });
Task_1.Task.hasMany(TaskAttachment_1.TaskAttachment, { foreignKey: 'task_id', as: 'attachments', onDelete: 'CASCADE' });
TaskAttachment_1.TaskAttachment.belongsTo(Task_1.Task, { foreignKey: 'task_id', as: 'task' });
User_1.User.hasMany(TaskAttachment_1.TaskAttachment, { foreignKey: 'uploaded_by', as: 'taskAttachments' });
TaskAttachment_1.TaskAttachment.belongsTo(User_1.User, { foreignKey: 'uploaded_by', as: 'uploader' });
// CalendarEvent Associations
User_1.User.hasMany(CalendarEvent_1.CalendarEvent, { foreignKey: 'assigned_to', as: 'assignedEvents' });
CalendarEvent_1.CalendarEvent.belongsTo(User_1.User, { foreignKey: 'assigned_to', as: 'assignee' });
User_1.User.hasMany(CalendarEvent_1.CalendarEvent, { foreignKey: 'created_by', as: 'createdEvents' });
CalendarEvent_1.CalendarEvent.belongsTo(User_1.User, { foreignKey: 'created_by', as: 'creator' });
Customer_1.Customer.hasMany(CalendarEvent_1.CalendarEvent, { foreignKey: 'customer_id', as: 'events' });
CalendarEvent_1.CalendarEvent.belongsTo(Customer_1.Customer, { foreignKey: 'customer_id', as: 'customer' });
Lead_1.Lead.hasMany(CalendarEvent_1.CalendarEvent, { foreignKey: 'lead_id', as: 'events' });
CalendarEvent_1.CalendarEvent.belongsTo(Lead_1.Lead, { foreignKey: 'lead_id', as: 'lead' });
Opportunity_1.Opportunity.hasMany(CalendarEvent_1.CalendarEvent, { foreignKey: 'opportunity_id', as: 'events' });
CalendarEvent_1.CalendarEvent.belongsTo(Opportunity_1.Opportunity, { foreignKey: 'opportunity_id', as: 'opportunity' });
// Notification Associations
User_1.User.hasMany(Notification_1.Notification, { foreignKey: 'recipient_id', as: 'notifications', onDelete: 'CASCADE' });
Notification_1.Notification.belongsTo(User_1.User, { foreignKey: 'recipient_id', as: 'recipient' });
User_1.User.hasMany(NotificationPreference_1.NotificationPreference, { foreignKey: 'user_id', as: 'notificationPreferences', onDelete: 'CASCADE' });
NotificationPreference_1.NotificationPreference.belongsTo(User_1.User, { foreignKey: 'user_id', as: 'user' });
// UploadedFile Associations
User_1.User.hasMany(UploadedFile_1.UploadedFile, { foreignKey: 'uploaded_by', as: 'uploadedFiles', onDelete: 'SET NULL' });
UploadedFile_1.UploadedFile.belongsTo(User_1.User, { foreignKey: 'uploaded_by', as: 'uploader' });
