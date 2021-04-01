import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { NotificationService } from './notification.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService
    ) { }

    @Get('/notifications')
    getNotifications(@Req() { user: { id } }) {
        return this.notificationService.getNotificationsFor(id)
    }
}
