import { Controller, Get, Param, Response } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PetSitter } from 'src/entities/petsitter.entity';
import { Repository } from 'typeorm';
import { viewNames } from 'src/booking/viewnames';
import { BookingService } from './booking.service';

@Controller('book')
export class BookingController {
    constructor(
        @InjectRepository(PetSitter)
        private petSitterRepo: Repository<PetSitter>,
        private bookingService: BookingService
    ){}

    @Get(':pet_sitter_id')
    async index(@Param('pet_sitter_id') psid: string, @Response() res) {
        let ps = await this.petSitterRepo.findOne(psid)
        res.render(viewNames.show_pet_sitter_info, {
            pet_sitter: ps
        })
    }
}
