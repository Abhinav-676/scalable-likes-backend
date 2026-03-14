import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { Kysely, sql } from 'kysely';
import { DB } from '../database/generated/db';

@Injectable()
export class LikesService {
    constructor(
        @Inject('LIKES_SERVICE') private readonly client: ClientProxy,
        @Inject('DATABASE_CONNECTION') private readonly db: Kysely<DB>
    ) { }

    async incrementLike(userId: string): Promise<void> {
        // Publish message to the queue to increment the likes counter for the user
        this.client.emit('user_liked', { userId });
    }

    @EventPattern('user_liked')
    async handleUserLiked(data: { userId: string }) {
        console.log(`[Job Worker] Processing like for user: ${data.userId}`);

        // Upsert logic: insert the user with 1 like if it doesn't exist,
        // otherwise increment the existing like count by 1.
        await this.db
            .insertInto('likes')
            .values({
                user_id: data.userId,
                likes: 1n,
            })
            .onConflict((oc) =>
                oc.column('user_id').doUpdateSet({
                    likes: sql`likes.likes + 1`,
                })
            )
            .execute();

        console.log(`[Job Worker] Like successfully processed for user: ${data.userId}`);
    }
}
