import { Body, Controller, Get, HttpStatus, NotFoundException, Param, Patch, Post, Render, Req, Response, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { viewNames } from 'src/booking/viewnames';
import { NotificationService } from 'src/notification/notification.service';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { BookingService } from './booking.service';
import { BookPetSitterDto } from './dto/pet_sitter.dto';

@Controller('book')
export class BookingController {
    constructor(
        private readonly bookingService: BookingService,
        private readonly notificationService: NotificationService
    ){}
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('sitter')
    @Get('my')
    @Render(viewNames.show_pet_sitter_view_requests)
    async myBookingsForSitter(@Req() req){
        let requests = await this.bookingService.handleShowingRequestForPetSitter(req.user.id)
        let pet_sitter = await this.bookingService.findPetSitterById(req.user.id)
        return {requests: requests, pet_sitter: pet_sitter}
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('sitter')
    @Patch()
    async sitterResponseBooking(@Req() req, @Body() body){
        let success = await this.bookingService.handleBookingResponseForPetSitter(body.booking_id, body.action, req.user.id)
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('owner')
    @Get(':pet_sitter_id')
    @Render(viewNames.show_pet_sitter_info)
    async index(@Param('pet_sitter_id') psid: number, @Req() req) {
        let ps_info = await this.bookingService.handlePetSitterInfo(psid)
        let po = await this.bookingService.findPetOwnerById(req.user.id)
        return {pet_sitter: ps_info, pet_owner: po}
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('owner')
    @Get(':pet_sitter_id/options')
    @Render(viewNames.show_booking_options)
    async show_options(@Param('pet_sitter_id') psid: number, @Req() req){
        let ownerId = req.user.id; // this should be retrieved from auth
        let pet_owner = await this.bookingService.findPetOwnerById(ownerId)
        let pets = await this.bookingService.findPetsByOwnerId(ownerId)
        let pet_sitter = await this.bookingService.findPetSitterById(psid)
        let exp = this.bookingService.calculatePetSitterExp(pet_sitter.signUpDate)
        let services_list = pet_sitter.services == null ? [] : pet_sitter.services.split(', ').slice(0, -1)
        let out_sitter = Object(pet_sitter)
        out_sitter.services = services_list
        out_sitter.exp = exp

        // retrieve notifications
        let notifications = await this.notificationService.getNotificationsFor(req.user.id)
        return { pet_owner: pet_owner, pets: pets, pet_sitter: out_sitter, notifications: notifications }
    }

    // create requesting booking
    // startDate endDate sitter pet[]
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('owner')
    @Post()
    async book_pet_sitter(@Body() request: any, @Req() req) {
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
    @Render(viewNames.show_my_booking_for_owner)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('owner')
    async my_booking(@Req() req){
        let results = await this.bookingService.handleShowOwnerBooking(req.user.id)
        return {results: results}
    }

    @Patch("my/petowner/:booking_id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('owner')
    pet_owner_modify_booking(@Req() req, @Param('booking_id') bid){
        let result = this.bookingService.handleCancleBookingForPetOwner(bid, req.user.id)
        return result
    }
}
