import { Controller, Post, Param, ParseUUIDPipe } from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':userId')
  async likeUser(@Param('userId', ParseUUIDPipe) userId: string) {
    await this.likesService.incrementLike(userId);
    return { success: true, message: 'Like event published' };
  }
}
