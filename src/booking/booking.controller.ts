import { Body, Controller, Get, HttpStatus, NotFoundException, Param, Post, Render, Req, Response } from '@nestjs/common';
import { viewNames } from 'src/booking/viewnames';
import { BookingService } from './booking.service';
import { BookPetSitterDto } from './dto/pet_sitter.dto';

@Controller('book')
export class BookingController {
    constructor(
        private readonly bookingService: BookingService
    ){}

    // show pet sitter info
    @Get(':pet_sitter_id')
    @Render(viewNames.show_pet_sitter_info)
    async index(@Param('pet_sitter_id') psid: number) {
        let ps_info = await this.bookingService.handlePetSitterInfo(psid)
        return ps_info
    }

    @Get(':pet_sitter_id/options')
    @Render(viewNames.show_booking_options)
    async show_options(@Param('pet_sitter_id') psid: number){
        let ownerId = 1000001; // this should be retrieved from auth
        let pets = await this.bookingService.findPetsByOwnerId(ownerId)
        return { pets: pets}
    }

    @Post()
    async book_pet_sitter(@Body() request: any) {
        if(await this.bookingService.handleIncomingRequest(request)) return {
            code: HttpStatus.OK,
            status: true
        }

        return {
            code: HttpStatus.OK,
            status: false
        }
    }
}
