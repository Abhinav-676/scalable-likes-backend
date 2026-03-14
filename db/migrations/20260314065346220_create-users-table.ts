import { type ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('users', {
        id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
        name: { type: 'varchar', notNull: true },
        email: { type: 'varchar', notNull: true },
        password: { type: 'varchar', notNull: true }
    })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable('users')
}
