import { PrismaService } from './../prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';

@Injectable()
export class GoalService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateGoalDto) {
    try {
      return await this.prisma.goal.create({
        data: dto,
      });
    } catch (error) {
      console.log('error', error);
      throw new Error('Server error occurred while creating a goal.');
    }
  }

  async deleteAllGoalsByGameId(id: string) {
    try {
      return await this.prisma.goal.deleteMany({
        where: {
          gameId: {
            equals: id,
          },
        },
      });
    } catch (error) {
      throw Error('Can not delete goals');
    }
  }

  // isValidISO8601(dateString: string): boolean {
  //   const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  //   return regex.test(dateString);
  // }
}
