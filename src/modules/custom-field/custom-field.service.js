'use strict';

const DB = require('../../database');

/**
 * Custom Field Service (Bab 28)
 * ─────────────────────────────────────────────────────────────
 * Memungkinkan setiap modul memiliki field dinamis tanpa mengubah schema DB.
 */
class CustomFieldService {
  /**
   * Definisi field baru untuk modul tertentu
   */
  async defineField(data) {
    const { module_name, field_name, field_type, is_required, options } = data;
    const result = await DB.table('custom_field_definitions').insert({
      module_name,
      field_name,
      field_type, // 'text', 'number', 'select', 'date'
      is_required: is_required ? 1 : 0,
      options: JSON.stringify(options), // untuk tipe 'select'
      created_at: new Date()
    });
    return { id: result.insertId || result._id };
  }

  /**
   * Ambil semua definisi field untuk modul
   */
  async getDefinitions(moduleName) {
    return DB.table('custom_field_definitions').where('module_name', moduleName).get();
  }

  /**
   * Simpan nilai custom field untuk record tertentu
   */
  async saveValues(moduleName, recordId, values) {
    for (const [fieldName, value] of Object.entries(values)) {
      const definition = await DB.table('custom_field_definitions')
        .where('module_name', moduleName)
        .where('field_name', fieldName)
        .first();

      if (definition) {
        const existing = await DB.table('custom_field_values')
          .where('definition_id', definition.id)
          .where('record_id', recordId)
          .first();

        const data = {
          definition_id: definition.id,
          record_id: recordId,
          value: String(value),
          updated_at: new Date()
        };

        if (existing) {
          await DB.table('custom_field_values').where('id', existing.id).update(data);
        } else {
          await DB.table('custom_field_values').insert({ ...data, created_at: new Date() });
        }
      }
    }
  }

  /**
   * Ambil semua nilai custom field untuk record tertentu
   */
  async getValues(moduleName, recordId) {
    const rows = await DB.table('custom_field_values')
      .join('custom_field_definitions', 'custom_field_values.definition_id', '=', 'custom_field_definitions.id')
      .where('custom_field_definitions.module_name', moduleName)
      .where('custom_field_values.record_id', recordId)
      .select('custom_field_definitions.field_name', 'custom_field_values.value')
      .get();

    const values = {};
    rows.forEach(r => { values[r.field_name] = r.value; });
    return values;
  }
}

module.exports = new CustomFieldService();
