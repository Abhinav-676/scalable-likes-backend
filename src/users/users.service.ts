import { Inject, Injectable } from '@nestjs/common';
import { Insertable, Kysely } from 'kysely';
import { DB, Users } from 'src/database/generated/db';

@Injectable()
export class UsersService {
    constructor(@Inject('DATABASE_CONNECTION') private readonly db: Kysely<DB>) { }

    async create(data: Insertable<Users>) {
        return this.db.insertInto('users').values(data).returningAll().executeTakeFirst();
    }
}
