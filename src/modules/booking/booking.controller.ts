import { Body, Controller, Get, HttpStatus, NotFoundException, Param, Patch, Post, Render, Req, Response, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { viewNames } from 'src/modules/booking/viewnames';
import { NotificationService } from 'src/modules/notification/notification.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BookingService } from './booking.service';

@UseGuards(JwtAuthGuard)
@Controller('book')
export class BookingController {
    constructor(
        private readonly bookingService: BookingService,
        private readonly notificationService: NotificationService
    ){}
    
    @UseGuards(RolesGuard)
    @Roles('sitter')
    @Get('my')
    @Render(viewNames.showPetSitterViewRequests)
    async myBookingsForSitter(@Req() {user: {id}}){
        const requests = await this.bookingService.handleShowingRequestForPetSitter(id)
        const petSitter = await this.bookingService.findPetSitterById(id)
        return {requests, petSitter}
    }

    @UseGuards(RolesGuard)
    @Roles('sitter')
    @Patch()
    async sitterResponseBooking(@Req() {user: {id}}, @Body() {booking_id, action}){
        const success = await this.bookingService.handleBookingResponseForPetSitter(booking_id, action, id)
        if(success) return {
            code: HttpStatus.OK,
            status: true
        }
        else return {
            code: HttpStatus.OK,
            status: false
        }
    }

    // show pet sitter info
    @UseGuards(RolesGuard)
    @Roles('owner')
    @Get(':petSitterId')
    @Render(viewNames.showPetSitterInfo)
    async index(@Param('petSitterId') psid: number, @Req() req) {
        const psInfo = await this.bookingService.handlePetSitterInfo(psid)
        const po = await this.bookingService.findPetOwnerById(req.user.id)
        return {petSitter: psInfo, petOwner: po}
    }

    @UseGuards(RolesGuard)
    @Roles('owner')
    @Get(':petSitterId/options')
    @Render(viewNames.showBookingOptions)
    async showOptions(@Param('petSitterId') psid: number, @Req() req){
        const ownerId = req.user.id; // this should be retrieved from auth
        const petOwner = await this.bookingService.findPetOwnerById(ownerId)
        const pets = await this.bookingService.findPetsByOwnerId(ownerId)
        const petSitter = await this.bookingService.findPetSitterById(psid)
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
    @UseGuards(RolesGuard)
    @Roles('owner')
    @Post()
    async bookPetSitter(@Body() request: any, @Req() req) {
        if(await this.bookingService.handleIncomingRequest(request, req.user.id)) return {
            code: HttpStatus.OK,
            status: true
        }

        else return {
            code: HttpStatus.OK,
            status: false
        }
    }

    // My booking page
    @Get('my/petowner')
    @Render(viewNames.showMyBookingForOwner)
    @UseGuards(RolesGuard)
    @Roles('owner')
    async myBooking(@Req() req){
        const results = await this.bookingService.handleShowOwnerBooking(req.user.id)
        const po = await this.bookingService.findPetOwnerById(req.user.id)
        return {results, petOwner: po}
    }

    @Patch("my/petowner/:bookingId")
    @UseGuards(RolesGuard)
    @Roles('owner')
    petOwnerModifyBooking(@Req() req, @Param('bookingId') bid){
        return this.bookingService.handleCancleBookingForPetOwner(bid, req.user.id)
    }
}
