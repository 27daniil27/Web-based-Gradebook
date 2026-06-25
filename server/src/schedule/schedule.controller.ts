import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../entities/user.entity';

@Controller('schedule')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  getSchedule(@Req() req: { user: User }) {
    return this.scheduleService.getForUser(req.user);
  }
}
