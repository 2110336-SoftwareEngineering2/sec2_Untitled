import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/entities/booking.entity';
import { Pet } from 'src/entities/pet.entity';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { Repository } from 'typeorm';
import { PetDto } from './dto/pet.dto';
import { BookPetSitterDto } from './dto/pet_sitter.dto';
import * as dayjs from "dayjs";

let customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const DATE_FORMAT = "DD/MM/YYYY"

@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(PetSitter)
        private readonly petSitterRepo: Repository<PetSitter>,
        @InjectRepository(PetOwner)
        private readonly petOwnerRepo: Repository<PetOwner>,
        @InjectRepository(Pet)
        private readonly petRepo: Repository<Pet>,
        @InjectRepository(Booking)
        private readonly bookingRepo: Repository<Booking>
    ){}

    async findPetSitterById(id: number): Promise<any>{
        let pet_sitter = await this.petSitterRepo.findOne(id)
        if(!pet_sitter) throw new NotFoundException

        return pet_sitter
    }

    async findPetsByOwnerId(id: number): Promise<any> {
        let pets = await this.petRepo.find({
            where: {
                owner: id
            }
        })
        if(!pets) throw new NotFoundException

        return pets
    }

    async handlePetSitterInfo(psid: number){
        let ps = await this.findPetSitterById(psid)
        let now = dayjs()
        let year_of_exp = now.diff(ps.signUpDate, "year")
        // ps.exp = year_of_exp
    }

    // po requests -> ps confirms -> paid by po
    //  requesting      pending       completed  
    async handleIncomingRequest(incoming_booking: any): Promise<any> {
        // store booking status requesting
        let price = (await this.findPetSitterById(incoming_booking.sitterId)).priceRate
        let startDate = dayjs(incoming_booking.startDate, DATE_FORMAT).format()
        let endDate = dayjs(incoming_booking.endDate, DATE_FORMAT).format()

        incoming_booking.price = price
        incoming_booking.startDate = startDate
        incoming_booking.endDate = endDate
        incoming_booking.owner = 1000001 // retrieve from auth

        if(await this.bookingRepo.save(incoming_booking)) return true

        return false
    }
}
