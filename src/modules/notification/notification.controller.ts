import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService
    ) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('/notifications')
    @Roles('sitter', 'owner')
    getNotifications(@Req() { user: { id } }) {
        return this.notificationService.getNotificationsFor(id)
    }
}
