import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { viewNames } from 'src/modules/booking/viewnames';
import { NotificationService } from 'src/modules/notification/notification.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BookingService } from './booking.service';
import { AccountService } from '../account/account.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('book')
export class BookingController {
    constructor(
        private readonly bookingService: BookingService,
        private readonly notificationService: NotificationService,
        private readonly accountService: AccountService
    ) { }

    // TODO
    // Refactor 1. Sitter accept/deny and owner cancel to be the same url (PATCH /book with bookingId in body)

    // My bookings page
    @Get('my')
    @Roles('sitter', 'owner')
    async myBookings(@Req() { user }, @Res() res) {
        let bookingList = undefined
        let user_info = undefined
        switch (user.role) {
            case "owner": // If the user is a pet owner
                user_info = await this.accountService.findAccountById("owner",user.id)
                bookingList = await this.bookingService.handleShowOwnerBookings(user.id)
                res.render(viewNames.myBookingsForOwner, { bookingList, petOwner: user_info })
                break
            case "sitter": // If the user is a pet sitter
                user_info = await this.accountService.findAccountById('sitter',user.id)
                bookingList = await this.bookingService.handleShowSitterBookings(user.id)
                res.render(viewNames.myBookingsForSitter, { bookingList, petSitter: user_info })
                break
        }
    }

    @Roles('sitter')
    @Patch()
    async sitterResponseBooking(@Req() { user: { id } }, @Body() { booking_id, action }) {
        const success = await this.bookingService.handleBookingResponseForPetSitter(booking_id, action, id)
        if (success) return {
            code: HttpStatus.OK,
            status: true
        }
        else return {
            code: HttpStatus.OK,
            status: false
        }
    }

    // show pet sitter info
    @Roles('owner')
    @Get(':petSitterId')
    @Render(viewNames.petSitterBookingInfo)
    async index(@Param('petSitterId') psid: number, @Req() { user }) {
        const psInfo = await this.bookingService.handlePetSitterInfo(psid)
        const po = await this.accountService.findAccountById('owner',user.id)
        let notifications = await this.notificationService.getNotificationsFor(user.id)
        return { petSitter: psInfo, petOwner: po, notifications }
    }

    @Roles('owner')
    @Get(':petSitterId/options')
    @Render(viewNames.bookingOptions)
    async showOptions(@Param('petSitterId') psid: number, @Req() req) {
        const ownerId = req.user.id; // this should be retrieved from auth
        const petOwner = await this.accountService.findAccountById('owner',ownerId)
        const pets = await this.accountService.findPetbyOwnerId('owner',ownerId)
        const petSitter = await this.accountService.findAccountById('sitter',psid)
        const exp = this.bookingService.calculatePetSitterExp(petSitter.signUpDate)
        const servicesList = petSitter.services == null ? [] : petSitter.services.split(', ').slice(0, -1)
        const outOitter = Object(petSitter)
        outOitter.services = servicesList
        outOitter.exp = exp

        // retrieve notifications
        const notifications = await this.notificationService.getNotificationsFor(req.user.id)
        return { petOwner, pets, petSitter: outOitter, notifications }
    }

    // create requesting booking
    // startDate endDate sitter pet[]
    @Roles('owner')
    @Post()
    async bookPetSitter(@Body() request: any, @Req() req) {
        if (await this.bookingService.handleIncomingRequest(request, req.user.id)) return {
            code: HttpStatus.OK,
            status: true
        }

        else return {
            code: HttpStatus.OK,
            status: false
        }
    }

    @Patch("my/petowner/:bookingId")
    @Roles('owner')
    petOwnerModifyBooking(@Req() req, @Param('bookingId') bid) {
        return this.bookingService.handleCancleBookingForPetOwner(bid, req.user.id)
    }

    @Roles('owner')
    @Patch('pay')
    async ownerBookingPayment(@Req() { user: { id } }, @Body() { booking_id }) {
        const result = await this.bookingService.handleBookingPayment(booking_id, id)
        if (result) return {
            result,
            code: HttpStatus.OK,
            status: true
        }
        else return {
            code: HttpStatus.OK,
            status: false
        }
    }
}
