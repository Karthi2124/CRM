import { sequelize, Setting } from '../models';
import { AppError } from '../utils/error.helper';
import { UpdateSettingDto } from './settings.types';

export async function getAllSettings() {
  const settings = await Setting.findAll();
  
  // Group settings by their category group
  const grouped: Record<string, Record<string, string | null>> = {};
  
  settings.forEach((s) => {
    if (!grouped[s.group]) {
      grouped[s.group] = {};
    }
    grouped[s.group][s.key] = s.value;
  });

  return grouped;
}

export async function updateSettingsGroup(group: string, updates: UpdateSettingDto) {
  const transaction = await sequelize.transaction();
  
  try {
    // 1. Verify that all keys exist under the specified group
    const keys = Object.keys(updates);
    const existing = await Setting.findAll({
      where: { key: keys, group },
      transaction,
    });

    if (existing.length !== keys.length) {
      throw new AppError('Some setting keys do not exist or do not belong to this group', 400);
    }

    // 2. Perform updates in transaction
    for (const record of existing) {
      const newValue = updates[record.key];
      record.value = newValue !== undefined ? String(newValue) : null;
      await record.save({ transaction });
    }

    await transaction.commit();

    // 3. Return updated records as flat dictionary
    const updated = await Setting.findAll({ where: { group } });
    const result: Record<string, string | null> = {};
    updated.forEach((s) => {
      result[s.key] = s.value;
    });

    return result;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}
