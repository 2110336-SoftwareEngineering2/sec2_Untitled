import { Body, Controller, Get, HttpStatus, NotFoundException, Param, Patch, Post, Render, Req, Response, UnauthorizedException } from '@nestjs/common';
import { viewNames } from 'src/booking/viewnames';
import { BookingService } from './booking.service';
import { BookPetSitterDto } from './dto/pet_sitter.dto';

@Controller('book')
export class BookingController {
    constructor(
        private readonly bookingService: BookingService
    ){}
    
    // ------------ Test accept booking for pet sitter --------------------
    @Get('my')
    @Render('booking/test.hbs')
    async dashboard(){
        let requests = await this.bookingService.handleShowingRequestForPetSitter(2000001)
        return {requests: requests}
    }

    @Patch()
    sitterResponseBooking(@Req() req, @Body() body){
        // body.booking_id
        // req.uid -> this got sent with ajax because html is in the same domain as backend
        return this.bookingService.handleBookingResponseForPetSitter(body.booking_id, body.action, req.uid)
    }
    // --------------------------------------------------------------------

    // show pet sitter info
    @Get(':pet_sitter_id')
    @Render(viewNames.show_pet_sitter_info)
    async index(@Param('pet_sitter_id') psid: number, @Req() req) {
        if(!req.uid) throw new UnauthorizedException("Log in as a Pet owner first")
        if(!this.bookingService.isValidPetOwnerId(req.uid)) throw new UnauthorizedException("This page is for pet owner")
        let ps_info = await this.bookingService.handlePetSitterInfo(psid)
        let po = await this.bookingService.findPetOwnerById(req.uid)
        return {pet_sitter: ps_info, pet_owner: po}
    }

    @Get(':pet_sitter_id/options')
    @Render(viewNames.show_booking_options)
    async show_options(@Param('pet_sitter_id') psid: number, @Req() req){
        if(!req.uid) throw new UnauthorizedException("Log in as a Pet owner first")
        if(!this.bookingService.isValidPetOwnerId(req.uid)) throw new UnauthorizedException("This page is for pet owner")
        let ownerId = req.uid; // this should be retrieved from auth
        let pet_owner = await this.bookingService.findPetOwnerById(ownerId)
        let pets = await this.bookingService.findPetsByOwnerId(ownerId)
        let pet_sitter = await this.bookingService.findPetSitterById(psid)
        let exp = this.bookingService.calculatePetSitterExp(pet_sitter.signUpDate)
        let services_list = pet_sitter.services.split(', ').slice(0, -1)
        let out_sitter = Object(pet_sitter)
        out_sitter.services = services_list
        out_sitter.exp = exp
        return { pet_owner: pet_owner, pets: pets, pet_sitter: out_sitter }
    }

    // create requesting booking
    // startDate endDate sitter pet[]
    @Post()
    async book_pet_sitter(@Body() request: any, @Req() req) {
        if(!req.uid) throw new UnauthorizedException("Please sign in as a Pet Owner and try again")
        if(!this.bookingService.isValidPetOwnerId(req.uid)) throw new UnauthorizedException("Invalid Pet Owner ID")
        if(await this.bookingService.handleIncomingRequest(request, req.uid)) return {
            code: HttpStatus.OK,
            status: true
        }

        return {
            code: HttpStatus.OK,
            status: false
        }
    }
}
