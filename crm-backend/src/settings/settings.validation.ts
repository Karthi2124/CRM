import { z } from 'zod';

// Company validation
export const companySettingsSchema = z.object({
  company_name: z.string().min(1, { message: 'company_name is required' }),
  company_email: z.string().email({ message: 'company_email must be a valid email' }),
  company_phone: z.string().optional(),
  company_address: z.string().optional(),
}).strict();

// Email SMTP validation
export const emailSettingsSchema = z.object({
  email_host: z.string().min(1, { message: 'email_host is required' }),
  email_port: z.coerce.number().int().positive({ message: 'email_port must be a positive integer' }),
  email_username: z.string().min(1, { message: 'email_username is required' }),
  email_password: z.string().min(1, { message: 'email_password is required' }),
}).strict();

// SMS validation
export const smsSettingsSchema = z.object({
  sms_provider: z.string().min(1, { message: 'sms_provider is required' }),
  sms_api_key: z.string().min(1, { message: 'sms_api_key is required' }),
}).strict();

// Tax validation
export const taxSettingsSchema = z.object({
  tax_name: z.string().min(1, { message: 'tax_name is required' }),
  tax_rate: z.coerce.number().nonnegative({ message: 'tax_rate must be non-negative' }),
}).strict();

// Currency validation
export const currencySettingsSchema = z.object({
  currency_code: z.string().length(3, { message: 'currency_code must be exactly 3 characters (e.g. USD)' }),
  currency_symbol: z.string().min(1, { message: 'currency_symbol is required' }),
}).strict();

// Localization validation
export const localizationSettingsSchema = z.object({
  timezone: z.string().min(1, { message: 'timezone is required' }),
  date_format: z.string().min(1, { message: 'date_format is required' }),
}).strict();
