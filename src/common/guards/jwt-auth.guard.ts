import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PetOwner, PetSitter, Transaction } from 'src/entities';
import { NotificationService } from 'src/modules/notification/notification.service';
import { Repository } from 'typeorm';
import { NotificationModule } from 'src/modules/notification/notification.module';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  // private notificationService: NotificationService
  constructor(private notificationService: NotificationService) { 
    super();
  }

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) throw err || new UnauthorizedException();
    const res = context.switchToHttp().getResponse()
    var notis;
    this.getNotifications(user.id).then(notifications => {
      res.locals.notifications = notifications
    })
    res.locals.currentUser = user
    return user;
  }

  async getNotifications(id) {
    return await this.notificationService.getNotificationsFor(id)
  }

}
