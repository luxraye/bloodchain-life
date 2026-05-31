import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'blood_units',
      columns: [
        { name: 'uuid', type: 'string', isIndexed: true },
        { name: 'blood_group', type: 'string' },
        { name: 'volume_ml', type: 'number' },
        { name: 'donor_id', type: 'string', isIndexed: true },
        { name: 'status', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'dispatches',
      columns: [
        { name: 'uuid', type: 'string', isIndexed: true },
        { name: 'courier_id', type: 'string', isIndexed: true },
        { name: 'destination_id', type: 'string', isIndexed: true },
        { name: 'status', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'donors',
      columns: [
        { name: 'uuid', type: 'string', isIndexed: true },
        { name: 'trust_tier', type: 'number' },
        { name: 'blood_group', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
})
