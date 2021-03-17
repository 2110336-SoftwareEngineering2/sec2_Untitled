import {Module,Global} from '@nestjs/common';
import {NotificationService} from '../notification/notification.service';

@Global()
@Module({
    providers: [ NotificationService ],
    exports: [NotificationService]
})
export class NotificationGuardModule {}