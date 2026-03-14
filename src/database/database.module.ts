import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB } from './generated/db';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: (ConfigService: ConfigService) => {
        const connStr = ConfigService.get<string>('DATABASE_URL')

        const dialect = new PostgresDialect({
          pool: new Pool({
            connectionString: connStr
          })
        })

        const db = new Kysely<DB>({
          dialect
        })

        return db
      }
    }
  ],
  exports: ['DATABASE_CONNECTION']
})
export class DatabaseModule { }
