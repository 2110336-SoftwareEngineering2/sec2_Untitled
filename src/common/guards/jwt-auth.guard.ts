import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from 'src/modules/notification/notification.service';


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
    res.locals.currentUser = user
    // if (!res.locals.notifications) return setTimeout(() => {this.handleRequest(err,user,info,context)},500)
    return user
    // return user;
  }

  async getNotifications(id) {
    return await this.notificationService.getNotificationsFor(id)
  }

  wait(notification,user){
    if (!notification){
      console.log(notification, user)
      setTimeout(() => {this.wait(notification,user)},100);
    } else {
      console.log("ha")
      return user
    }
  }

}
