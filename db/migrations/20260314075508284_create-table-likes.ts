import { type ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('likes', {
        id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
        user_id: { type: 'uuid', notNull: true, references: 'users(id)' },
        likes: { type: 'bigint', notNull: true, default: 0 }
    })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('likes')
}
