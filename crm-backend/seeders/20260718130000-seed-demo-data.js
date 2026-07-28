'use strict';
const crypto = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Fetch required base IDs
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'admin@crm.com' LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const adminId = users && users.length > 0 ? users[0].id : null;

    const stagesList = await queryInterface.sequelize.query(
      `SELECT id, name FROM opportunity_stages;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const stagesMap = {};
    stagesList.forEach(s => {
      stagesMap[s.name] = s.id;
    });

    const units = await queryInterface.sequelize.query(
      `SELECT id FROM product_units WHERE name = 'Piece' LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const pieceUnitId = units && units.length > 0 ? units[0].id : null;

    const taxes = await queryInterface.sequelize.query(
      `SELECT id FROM taxes WHERE name = 'GST 18%' LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const gst18TaxId = taxes && taxes.length > 0 ? taxes[0].id : null;

    const exemptTaxes = await queryInterface.sequelize.query(
      `SELECT id FROM taxes WHERE name = 'Tax Exempt' LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const exemptTaxId = exemptTaxes && exemptTaxes.length > 0 ? exemptTaxes[0].id : null;

    // Helper to get past dates
    const getPastDate = (monthsAgo, daysAgo = 0) => {
      const d = new Date();
      d.setMonth(d.getMonth() - monthsAgo);
      d.setDate(d.getDate() - daysAgo);
      return d;
    };

    // 2. Companies and Branches
    await queryInterface.bulkInsert('companies', [
      {
        uuid: crypto.randomUUID(),
        name: 'Nexus Corp',
        legal_name: 'Nexus Corporate Solutions Pvt Ltd',
        email: 'contact@nexuscorp.com',
        phone: '+15550192',
        website: 'https://nexuscorp.com',
        tax_number: 'TX88371900',
        address: '123 Enterprise Way, Suite 500, Tech City',
        created_at: getPastDate(6),
        updated_at: getPastDate(6),
      },
      {
        uuid: crypto.randomUUID(),
        name: 'Vortex Industries',
        legal_name: 'Vortex Heavy Industries Inc',
        email: 'info@vortex.com',
        phone: '+15550293',
        website: 'https://vortexindustries.com',
        tax_number: 'TX99283711',
        address: '456 Industrial Parkway, Sector 4, Manufacturing Hub',
        created_at: getPastDate(5),
        updated_at: getPastDate(5),
      }
    ], {});

    const companies = await queryInterface.sequelize.query(
      `SELECT id, name FROM companies;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const companyMap = {};
    companies.forEach(c => companyMap[c.name] = c.id);

    await queryInterface.bulkInsert('branches', [
      {
        uuid: crypto.randomUUID(),
        company_id: companyMap['Nexus Corp'],
        name: 'Nexus HQ',
        email: 'hq@nexuscorp.com',
        phone: '+15550193',
        address: '123 Enterprise Way, Suite 500, Tech City',
        created_at: getPastDate(6),
        updated_at: getPastDate(6),
      },
      {
        uuid: crypto.randomUUID(),
        company_id: companyMap['Vortex Industries'],
        name: 'Vortex West Coast',
        email: 'west@vortex.com',
        phone: '+15550294',
        address: '889 Pacific Coast Highway, Suite 10, Coastal City',
        created_at: getPastDate(5),
        updated_at: getPastDate(5),
      }
    ], {});

    const branches = await queryInterface.sequelize.query(
      `SELECT id, name FROM branches;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const branchMap = {};
    branches.forEach(b => branchMap[b.name] = b.id);

    await queryInterface.bulkInsert('departments', [
      {
        uuid: crypto.randomUUID(),
        branch_id: branchMap['Nexus HQ'],
        name: 'Sales and Accounts',
        description: 'Handles client acquisitions and key customer relations',
        created_at: getPastDate(6),
        updated_at: getPastDate(6),
      },
      {
        uuid: crypto.randomUUID(),
        branch_id: branchMap['Vortex West Coast'],
        name: 'Procurement',
        description: 'Handles raw materials sourcing and logistics',
        created_at: getPastDate(5),
        updated_at: getPastDate(5),
      }
    ], {});

    const departments = await queryInterface.sequelize.query(
      `SELECT id, name FROM departments;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const deptMap = {};
    departments.forEach(d => deptMap[d.name] = d.id);

    await queryInterface.bulkInsert('designations', [
      {
        uuid: crypto.randomUUID(),
        department_id: deptMap['Sales and Accounts'],
        name: 'Senior Account Manager',
        description: 'Responsible for major enterprise account retention and sales',
        created_at: getPastDate(6),
        updated_at: getPastDate(6),
      },
      {
        uuid: crypto.randomUUID(),
        department_id: deptMap['Procurement'],
        name: 'Procurement Specialist',
        description: 'Coordinates vendor selections and purchase orders',
        created_at: getPastDate(5),
        updated_at: getPastDate(5),
      }
    ], {});

    // 3. Customers
    await queryInterface.bulkInsert('customers', [
      {
        uuid: crypto.randomUUID(),
        name: 'Acme Solutions',
        type: 'company',
        email: 'procurement@acmesolutions.com',
        phone: '+141599818',
        website: 'https://acmesolutions.com',
        gst_number: '29ABCDE1234F1Z5',
        tax_id: 'US-9912837',
        status: 'active',
        created_by: adminId,
        created_at: getPastDate(6),
        updated_at: getPastDate(6),
      },
      {
        uuid: crypto.randomUUID(),
        name: 'Nova Softwares',
        type: 'company',
        email: 'billing@novasoft.com',
        phone: '+141599819',
        website: 'https://novasoft.com',
        gst_number: '29ABCDE5678F1Z6',
        tax_id: 'US-9912838',
        status: 'active',
        created_by: adminId,
        created_at: getPastDate(4),
        updated_at: getPastDate(4),
      },
      {
        uuid: crypto.randomUUID(),
        name: 'Jane Smith',
        type: 'individual',
        email: 'jane.smith@gmail.com',
        phone: '+150599182',
        website: '',
        gst_number: '',
        tax_id: '',
        status: 'active',
        created_by: adminId,
        created_at: getPastDate(2),
        updated_at: getPastDate(2),
      }
    ], {});

    const customers = await queryInterface.sequelize.query(
      `SELECT id, name FROM customers;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const customerMap = {};
    customers.forEach(c => customerMap[c.name] = c.id);

    // Addresses & Contacts
    await queryInterface.bulkInsert('customer_addresses', [
      {
        uuid: crypto.randomUUID(),
        customer_id: customerMap['Acme Solutions'],
        type: 'billing',
        address_line_1: '100 Innovation Way',
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        zip_code: '94105',
        created_at: getPastDate(6),
        updated_at: getPastDate(6),
      },
      {
        uuid: crypto.randomUUID(),
        customer_id: customerMap['Nova Softwares'],
        type: 'billing',
        address_line_1: '200 Tech Boulevard',
        city: 'Austin',
        state: 'Texas',
        country: 'USA',
        zip_code: '78701',
        created_at: getPastDate(4),
        updated_at: getPastDate(4),
      }
    ], {});

    await queryInterface.bulkInsert('customer_contacts', [
      {
        uuid: crypto.randomUUID(),
        customer_id: customerMap['Acme Solutions'],
        first_name: 'Robert',
        last_name: 'Downey',
        email: 'robert@acmesolutions.com',
        phone: '+141599820',
        designation: 'Purchasing Director',
        created_at: getPastDate(6),
        updated_at: getPastDate(6),
      },
      {
        uuid: crypto.randomUUID(),
        customer_id: customerMap['Nova Softwares'],
        first_name: 'Alice',
        last_name: 'Cooper',
        email: 'alice@novasoft.com',
        phone: '+141599821',
        designation: 'IT Infrastructure Head',
        created_at: getPastDate(4),
        updated_at: getPastDate(4),
      }
    ], {});

    // 4. Product Categories and Brands
    await queryInterface.bulkInsert('product_categories', [
      {
        uuid: crypto.randomUUID(),
        name: 'Hardware',
        description: 'Physical equipment and devices',
        created_at: getPastDate(6),
        updated_at: getPastDate(6),
      },
      {
        uuid: crypto.randomUUID(),
        name: 'Cloud Services',
        description: 'SaaS subscriptions and cloud hosting packages',
        created_at: getPastDate(6),
        updated_at: getPastDate(6),
      }
    ], {});

    const categories = await queryInterface.sequelize.query(
      `SELECT id, name FROM product_categories;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const catMap = {};
    categories.forEach(c => catMap[c.name] = c.id);

    await queryInterface.bulkInsert('product_brands', [
      {
        uuid: crypto.randomUUID(),
        name: 'SuperTech',
        logo_url: '',
        created_at: getPastDate(6),
        updated_at: getPastDate(6),
      },
      {
        uuid: crypto.randomUUID(),
        name: 'ApexCloud',
        logo_url: '',
        created_at: getPastDate(6),
        updated_at: getPastDate(6),
      }
    ], {});

    const brands = await queryInterface.sequelize.query(
      `SELECT id, name FROM product_brands;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const brandMap = {};
    brands.forEach(b => brandMap[b.name] = b.id);

    // Products
    await queryInterface.bulkInsert('products', [
      {
        uuid: crypto.randomUUID(),
        name: 'Enterprise Server Pro',
        sku: 'HW-SRV-001',
        description: 'High-performance cloud-ready physical server node',
        category_id: catMap['Hardware'],
        brand_id: brandMap['SuperTech'],
        unit_id: pieceUnitId,
        tax_id: gst18TaxId,
        base_price: 3500.00,
        selling_price: 4200.00,
        status: 'active',
        created_at: getPastDate(6),
        updated_at: getPastDate(6),
      },
      {
        uuid: crypto.randomUUID(),
        name: 'Apex CRM Premium Monthly',
        sku: 'CS-CRM-MTH',
        description: 'Premium CRM seat tier monthly license subscription',
        category_id: catMap['Cloud Services'],
        brand_id: brandMap['ApexCloud'],
        unit_id: pieceUnitId,
        tax_id: exemptTaxId,
        base_price: 45.00,
        selling_price: 60.00,
        status: 'active',
        created_at: getPastDate(6),
        updated_at: getPastDate(6),
      }
    ], {});

    const products = await queryInterface.sequelize.query(
      `SELECT id, name, selling_price FROM products;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const prodMap = {};
    products.forEach(p => prodMap[p.name] = { id: p.id, price: Number(p.selling_price) });

    // 5. Leads
    await queryInterface.bulkInsert('leads', [
      {
        uuid: crypto.randomUUID(),
        first_name: 'John',
        last_name: 'Doe',
        company_name: 'Doe Enterprises',
        email: 'john@doeenterprises.com',
        phone: '+130399120',
        source: 'website',
        status: 'new',
        value: 12000.00,
        assigned_to: adminId,
        created_by: adminId,
        created_at: getPastDate(5, 5),
        updated_at: getPastDate(5, 5),
      },
      {
        uuid: crypto.randomUUID(),
        first_name: 'Sarah',
        last_name: 'Connor',
        company_name: 'Cyberdyne Systems',
        email: 'sconnor@cyberdyne.com',
        phone: '+130399121',
        source: 'referral',
        status: 'contacted',
        value: 45000.00,
        assigned_to: adminId,
        created_by: adminId,
        created_at: getPastDate(4, 10),
        updated_at: getPastDate(4, 10),
      },
      {
        uuid: crypto.randomUUID(),
        first_name: 'Bruce',
        last_name: 'Wayne',
        company_name: 'Wayne Enterprises',
        email: 'bruce@waynecorp.com',
        phone: '+130399122',
        source: 'manual',
        status: 'qualified',
        value: 95000.00,
        assigned_to: adminId,
        created_by: adminId,
        created_at: getPastDate(2, 12),
        updated_at: getPastDate(2, 12),
      },
      {
        uuid: crypto.randomUUID(),
        first_name: 'Peter',
        last_name: 'Parker',
        company_name: 'Daily Bugle',
        email: 'peter.parker@dailybugle.com',
        phone: '+130399123',
        source: 'social_media',
        status: 'lost',
        value: 1500.00,
        assigned_to: adminId,
        created_by: adminId,
        created_at: getPastDate(1, 15),
        updated_at: getPastDate(1, 15),
      }
    ], {});

    const leads = await queryInterface.sequelize.query(
      `SELECT id, email FROM leads;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const leadMap = {};
    leads.forEach(l => leadMap[l.email] = l.id);

    // 6. Opportunities
    await queryInterface.bulkInsert('opportunities', [
      {
        uuid: crypto.randomUUID(),
        name: 'Acme Solutions - Server Upgrade',
        customer_id: customerMap['Acme Solutions'],
        lead_id: null,
        stage_id: stagesMap['Value Proposition'],
        value: 16800.00,
        probability: 40,
        expected_revenue: 6720.00,
        close_date: getPastDate(-1),
        assigned_to: adminId,
        created_by: adminId,
        created_at: getPastDate(3, 5),
        updated_at: getPastDate(3, 5),
      },
      {
        uuid: crypto.randomUUID(),
        name: 'Nova Softwares - 200 CRM Licenses',
        customer_id: customerMap['Nova Softwares'],
        lead_id: null,
        stage_id: stagesMap['Closed Won'],
        value: 12000.00,
        probability: 100,
        expected_revenue: 12000.00,
        close_date: getPastDate(1),
        assigned_to: adminId,
        created_by: adminId,
        created_at: getPastDate(4, 2),
        updated_at: getPastDate(1),
      },
      {
        uuid: crypto.randomUUID(),
        name: 'Wayne Enterprises Corp Partnership',
        customer_id: customerMap['Acme Solutions'],
        lead_id: leadMap['bruce@waynecorp.com'],
        stage_id: stagesMap['Negotiation/Review'],
        value: 84000.00,
        probability: 90,
        expected_revenue: 75600.00,
        close_date: getPastDate(-2),
        assigned_to: adminId,
        created_by: adminId,
        created_at: getPastDate(2, 10),
        updated_at: getPastDate(2, 10),
      }
    ], {});

    const opportunities = await queryInterface.sequelize.query(
      `SELECT id, name FROM opportunities;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const oppMap = {};
    opportunities.forEach(o => oppMap[o.name] = o.id);

    // 7. Quotations & Items
    await queryInterface.bulkInsert('quotations', [
      {
        uuid: crypto.randomUUID(),
        quotation_number: 'QT-2026-0001',
        customer_id: customerMap['Nova Softwares'],
        lead_id: null,
        opportunity_id: oppMap['Nova Softwares - 200 CRM Licenses'],
        subject: 'Apex CRM Premium Seating Offer',
        date: getPastDate(4, 2).toISOString().slice(0, 10),
        expiry_date: getPastDate(3, 2).toISOString().slice(0, 10),
        subtotal: 12000.00,
        discount_type: 'percentage',
        discount_value: 0.00,
        discount_amount: 0.00,
        tax_amount: 0.00,
        adjustment: 0.00,
        total: 12000.00,
        status: 'accepted',
        terms_conditions: 'Standard terms apply. Net 30 payment terms.',
        customer_notes: 'Thank you for choosing Apex CRM.',
        created_by: adminId,
        created_at: getPastDate(4, 2),
        updated_at: getPastDate(4, 2),
      }
    ], {});

    const quotations = await queryInterface.sequelize.query(
      `SELECT id, quotation_number FROM quotations;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const qMap = {};
    quotations.forEach(q => qMap[q.quotation_number] = q.id);

    await queryInterface.bulkInsert('quotation_items', [
      {
        uuid: crypto.randomUUID(),
        quotation_id: qMap['QT-2026-0001'],
        product_id: prodMap['Apex CRM Premium Monthly'].id,
        description: 'CRM premium license seats - 200 Users',
        quantity: 200.00,
        unit_price: prodMap['Apex CRM Premium Monthly'].price,
        discount_type: 'percentage',
        discount_value: 0.00,
        discount_amount: 0.00,
        tax_id: exemptTaxId,
        tax_rate: 0.00,
        tax_amount: 0.00,
        subtotal: 12000.00,
        total: 12000.00,
        created_at: getPastDate(4, 2),
        updated_at: getPastDate(4, 2),
      }
    ], {});

    // 8. Invoices, Invoice Items & Payments (6-month Revenue Trend)
    const invoiceSeeds = [];
    const invoiceItemSeeds = [];
    const paymentSeeds = [];

    // Invoice 1 (5 months ago)
    const invDate5 = getPastDate(5, 10);
    invoiceSeeds.push({
      id: 1,
      uuid: crypto.randomUUID(),
      invoice_number: 'INV-2026-0001',
      customer_id: customerMap['Acme Solutions'],
      quotation_id: null,
      subject: 'Physical Server Node Deployment',
      date: invDate5.toISOString().slice(0, 10),
      due_date: getPastDate(4, 10).toISOString().slice(0, 10),
      subtotal: 4200.00,
      discount_type: 'percentage',
      discount_value: 0.00,
      discount_amount: 0.00,
      tax_amount: 756.00,
      adjustment: 0.00,
      total: 4956.00,
      amount_paid: 4956.00,
      balance_due: 0.00,
      status: 'paid',
      terms_conditions: 'Net 30. Payment received.',
      created_by: adminId,
      created_at: invDate5,
      updated_at: invDate5,
    });
    invoiceItemSeeds.push({
      uuid: crypto.randomUUID(),
      invoice_id: 1,
      product_id: prodMap['Enterprise Server Pro'].id,
      description: 'Enterprise Server Pro hardware node',
      quantity: 1.00,
      unit_price: 4200.00,
      discount_type: 'percentage',
      discount_value: 0.00,
      discount_amount: 0.00,
      tax_id: gst18TaxId,
      tax_rate: 18.00,
      tax_amount: 756.00,
      subtotal: 4200.00,
      total: 4956.00,
      created_at: invDate5,
      updated_at: invDate5,
    });
    paymentSeeds.push({
      uuid: crypto.randomUUID(),
      invoice_id: 1,
      payment_number: 'PMT-2026-0001',
      amount: 4956.00,
      payment_date: invDate5.toISOString().slice(0, 10),
      payment_method: 'bank_transfer',
      transaction_reference: 'TXN-BANK-100293',
      notes: 'Received bank transfer.',
      created_by: adminId,
      created_at: invDate5,
      updated_at: invDate5,
    });

    // Invoice 2 (4 months ago)
    const invDate4 = getPastDate(4, 5);
    invoiceSeeds.push({
      id: 2,
      uuid: crypto.randomUUID(),
      invoice_number: 'INV-2026-0002',
      customer_id: customerMap['Nova Softwares'],
      quotation_id: qMap['QT-2026-0001'],
      subject: 'Apex CRM Licensing Invoice',
      date: invDate4.toISOString().slice(0, 10),
      due_date: getPastDate(3, 5).toISOString().slice(0, 10),
      subtotal: 12000.00,
      discount_type: 'percentage',
      discount_value: 0.00,
      discount_amount: 0.00,
      tax_amount: 0.00,
      adjustment: 0.00,
      total: 12000.00,
      amount_paid: 12000.00,
      balance_due: 0.00,
      status: 'paid',
      terms_conditions: 'Net 30. Payment received.',
      created_by: adminId,
      created_at: invDate4,
      updated_at: invDate4,
    });
    invoiceItemSeeds.push({
      uuid: crypto.randomUUID(),
      invoice_id: 2,
      product_id: prodMap['Apex CRM Premium Monthly'].id,
      description: 'Apex CRM Licensing - 200 seats',
      quantity: 200.00,
      unit_price: 60.00,
      discount_type: 'percentage',
      discount_value: 0.00,
      discount_amount: 0.00,
      tax_id: exemptTaxId,
      tax_rate: 0.00,
      tax_amount: 0.00,
      subtotal: 12000.00,
      total: 12000.00,
      created_at: invDate4,
      updated_at: invDate4,
    });
    paymentSeeds.push({
      uuid: crypto.randomUUID(),
      invoice_id: 2,
      payment_number: 'PMT-2026-0002',
      amount: 12000.00,
      payment_date: invDate4.toISOString().slice(0, 10),
      payment_method: 'bank_transfer',
      transaction_reference: 'TXN-BANK-100294',
      notes: 'Received license payment.',
      created_by: adminId,
      created_at: invDate4,
      updated_at: invDate4,
    });

    // Invoice 3 (3 months ago)
    const invDate3 = getPastDate(3, 15);
    invoiceSeeds.push({
      id: 3,
      uuid: crypto.randomUUID(),
      invoice_number: 'INV-2026-0003',
      customer_id: customerMap['Acme Solutions'],
      quotation_id: null,
      subject: 'Enterprise Server Node Maintenance',
      date: invDate3.toISOString().slice(0, 10),
      due_date: getPastDate(2, 15).toISOString().slice(0, 10),
      subtotal: 8400.00,
      discount_type: 'percentage',
      discount_value: 5.00,
      discount_amount: 420.00,
      tax_amount: 1436.40,
      adjustment: 0.00,
      total: 9416.40,
      amount_paid: 5000.00,
      balance_due: 4416.40,
      status: 'partially_paid',
      terms_conditions: 'Net 30.',
      created_by: adminId,
      created_at: invDate3,
      updated_at: invDate3,
    });
    invoiceItemSeeds.push({
      uuid: crypto.randomUUID(),
      invoice_id: 3,
      product_id: prodMap['Enterprise Server Pro'].id,
      description: 'Enterprise Server Pro hardware node x2',
      quantity: 2.00,
      unit_price: 4200.00,
      discount_type: 'percentage',
      discount_value: 5.00,
      discount_amount: 420.00,
      tax_id: gst18TaxId,
      tax_rate: 18.00,
      tax_amount: 1436.40,
      subtotal: 7980.00,
      total: 9416.40,
      created_at: invDate3,
      updated_at: invDate3,
    });
    paymentSeeds.push({
      uuid: crypto.randomUUID(),
      invoice_id: 3,
      payment_number: 'PMT-2026-0003',
      amount: 5000.00,
      payment_date: invDate3.toISOString().slice(0, 10),
      payment_method: 'bank_transfer',
      transaction_reference: 'TXN-BANK-100295',
      notes: 'Initial deposit.',
      created_by: adminId,
      created_at: invDate3,
      updated_at: invDate3,
    });

    // Invoice 4 (1 month ago)
    const invDate1 = getPastDate(1, 2);
    invoiceSeeds.push({
      id: 4,
      uuid: crypto.randomUUID(),
      invoice_number: 'INV-2026-0004',
      customer_id: customerMap['Jane Smith'],
      quotation_id: null,
      subject: 'Consulting and Cloud Setup',
      date: invDate1.toISOString().slice(0, 10),
      due_date: getPastDate(0, 2).toISOString().slice(0, 10),
      subtotal: 180.00,
      discount_type: 'percentage',
      discount_value: 0.00,
      discount_amount: 0.00,
      tax_amount: 0.00,
      adjustment: 0.00,
      total: 180.00,
      amount_paid: 0.00,
      balance_due: 180.00,
      status: 'unpaid',
      terms_conditions: 'Immediate payment requested.',
      created_by: adminId,
      created_at: invDate1,
      updated_at: invDate1,
    });
    invoiceItemSeeds.push({
      uuid: crypto.randomUUID(),
      invoice_id: 4,
      product_id: prodMap['Apex CRM Premium Monthly'].id,
      description: 'Apex CRM Premium Monthly x3 seats',
      quantity: 3.00,
      unit_price: 60.00,
      discount_type: 'percentage',
      discount_value: 0.00,
      discount_amount: 0.00,
      tax_id: exemptTaxId,
      tax_rate: 0.00,
      tax_amount: 0.00,
      subtotal: 180.00,
      total: 180.00,
      created_at: invDate1,
      updated_at: invDate1,
    });

    await queryInterface.bulkInsert('invoices', invoiceSeeds, {});
    await queryInterface.bulkInsert('invoice_items', invoiceItemSeeds, {});
    await queryInterface.bulkInsert('payments', paymentSeeds, {});

    // 9. Tasks
    await queryInterface.bulkInsert('tasks', [
      {
        uuid: crypto.randomUUID(),
        title: 'Follow up with Bruce Wayne on Negotiation status',
        description: 'Discuss discount terms for the bulk purchase of 20 server nodes.',
        status: 'in_progress',
        priority: 'high',
        due_date: getPastDate(-2).toISOString().slice(0, 10),
        assigned_to: adminId,
        customer_id: customerMap['Acme Solutions'],
        lead_id: leadMap['bruce@waynecorp.com'],
        opportunity_id: oppMap['Wayne Enterprises Corp Partnership'],
        created_by: adminId,
        created_at: getPastDate(0, 5),
        updated_at: getPastDate(0, 5),
      },
      {
        uuid: crypto.randomUUID(),
        title: 'Review server delivery for Acme Solutions',
        description: 'Verify shipping tracking and setup instructions are sent.',
        status: 'todo',
        priority: 'medium',
        due_date: getPastDate(-5).toISOString().slice(0, 10),
        assigned_to: adminId,
        customer_id: customerMap['Acme Solutions'],
        lead_id: null,
        opportunity_id: oppMap['Acme Solutions - Server Upgrade'],
        created_by: adminId,
        created_at: getPastDate(0, 1),
        updated_at: getPastDate(0, 1),
      },
      {
        uuid: crypto.randomUUID(),
        title: 'Complete license onboarding for Nova Softwares',
        description: 'Setup admin console panel for Cooper Cooper and enable billing.',
        status: 'completed',
        priority: 'critical',
        due_date: getPastDate(1).toISOString().slice(0, 10),
        assigned_to: adminId,
        customer_id: customerMap['Nova Softwares'],
        lead_id: null,
        opportunity_id: oppMap['Nova Softwares - 200 CRM Licenses'],
        created_by: adminId,
        created_at: getPastDate(4, 2),
        updated_at: getPastDate(1),
      }
    ], {});

    // 10. Calendar Events
    await queryInterface.bulkInsert('calendar_events', [
      {
        uuid: crypto.randomUUID(),
        title: 'Wayne Enterprises Negotiation Call',
        description: 'Zoom call to finalize server deployment pricing.',
        start_date: getPastDate(-1, -10),
        end_date: getPastDate(-1, -11),
        location: 'Zoom',
        is_all_day: false,
        status: 'scheduled',
        created_by: adminId,
        created_at: getPastDate(0, 3),
        updated_at: getPastDate(0, 3),
      },
      {
        uuid: crypto.randomUUID(),
        title: 'Onboarding session with Nova Softwares IT',
        description: 'Walkthrough of CRM settings and custom integrations.',
        start_date: getPastDate(2, -14),
        end_date: getPastDate(2, -15),
        location: 'Microsoft Teams',
        is_all_day: false,
        status: 'scheduled',
        created_by: adminId,
        created_at: getPastDate(4, 1),
        updated_at: getPastDate(4, 1),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('calendar_events', null, {});
    await queryInterface.bulkDelete('tasks', null, {});
    await queryInterface.bulkDelete('payments', null, {});
    await queryInterface.bulkDelete('invoice_items', null, {});
    await queryInterface.bulkDelete('invoices', null, {});
    await queryInterface.bulkDelete('quotation_items', null, {});
    await queryInterface.bulkDelete('quotations', null, {});
    await queryInterface.bulkDelete('opportunities', null, {});
    await queryInterface.bulkDelete('leads', null, {});
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('product_brands', null, {});
    await queryInterface.bulkDelete('product_categories', null, {});
    await queryInterface.bulkDelete('customer_contacts', null, {});
    await queryInterface.bulkDelete('customer_addresses', null, {});
    await queryInterface.bulkDelete('customers', null, {});
    await queryInterface.bulkDelete('designations', null, {});
    await queryInterface.bulkDelete('departments', null, {});
    await queryInterface.bulkDelete('branches', null, {});
    await queryInterface.bulkDelete('companies', null, {});
  }
};
