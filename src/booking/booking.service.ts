import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/entities/booking.entity';
import { Pet } from 'src/entities/pet.entity';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { Repository } from 'typeorm';
import { BookPetSitterDto } from './dto/pet_sitter.dto';
import * as dayjs from "dayjs";
import { SitterReview } from 'src/entities/sitterreview.entity';

let customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const DATE_FORMAT = "DD/MM/YYYY"
type BookingReponse = "ACCEPT" | "DENY"

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
        private readonly bookingRepo: Repository<Booking>,
        @InjectRepository(SitterReview)
        private readonly sitterReviewRepo: Repository<SitterReview>
    ){}

    async findPetSitterById(id: number): Promise<PetSitter>{
        let pet_sitter = await this.petSitterRepo.findOne(id)
        if(!pet_sitter) throw new NotFoundException("Pet sitter not found, recheck ID")

        return pet_sitter
    }

    async findPetOwnerById(id: number): Promise<PetOwner>{
        let pet_owner = await this.petOwnerRepo.findOne(id)
        if(!pet_owner) throw new NotFoundException("Pet Owner not found, recheck ID")
        return pet_owner
    }

    async findPetsByOwnerId(id: number): Promise<Pet[]> {
        let pets = await this.petRepo.find({
            where: {
                owner: id
            }
        })
        if(!pets) throw new NotFoundException

        return pets
    }

    async handlePetSitterInfo(psid: number): Promise<BookPetSitterDto>{
        if(!this.isValidPetSitterId(psid)) throw new BadRequestException("Pet sitter ID is invalid")
        let ps = await this.findPetSitterById(psid)
        if(!ps) throw new NotFoundException("Pet sitter ID doesn't match any record")
        // get sitter reviews
        let reviews = await this.sitterReviewRepo.find({
            relations: ['owner'],
            where: {
                sitter: psid
            }
        })

        let result = new BookPetSitterDto(ps, reviews)
        return result
    }

    calculatePetSitterExp(signUpDate: Date){
        let exp = undefined
        let now = dayjs()
        let exp_y = now.diff(signUpDate, "year")
        let exp_m = now.diff(signUpDate, "month")
        if(exp_y > 1) exp = {value: exp_y, unit: "years"}
        else if(exp_y == 1) exp = {value: exp_y, unit: "year"}
        else if(exp_m > 1) exp = {value: exp_m, unit: "months"}
        else if(exp_m == 1) exp = {value: exp_m, unit: "month"}
        else exp = {value: -1, unit: "month"} // less than a month
        return exp
    }

    // po requests -> ps confirms -> paid by po
    //  requesting      pending       completed  
    async handleIncomingRequest(incoming_booking: any, poid: number): Promise<any> {
        // check if id is a pet owner id
        if(!poid) throw new UnauthorizedException("Pet owner id is required")
        if(!this.isValidPetOwnerId(poid)) throw new UnauthorizedException("Pet owner ID is invalid")

        // store booking status requesting
        let price = (await this.findPetSitterById(incoming_booking.sitterId)).priceRate
        let startDate = dayjs(incoming_booking.startDate, DATE_FORMAT).format()
        let endDate = dayjs(incoming_booking.endDate, DATE_FORMAT).format()

        incoming_booking.price = price
        incoming_booking.startDate = startDate
        incoming_booking.endDate = endDate
        incoming_booking.owner = poid

        for(let i=0; i<incoming_booking.pets.length; i++){
            let {pets, ...temp} = incoming_booking
            temp.pet = incoming_booking.pets[i]
            if(await this.bookingRepo.save(temp)) return true
        }

        return false
    }

    async handleShowingRequestForPetSitter(psid: number){
        if(!psid) throw new BadRequestException("Pet sitter ID is required")
        if(!this.isValidPetSitterId(psid)) throw new BadRequestException("Pet sitter ID is invalid")
        let requests = await this.bookingRepo.find({
            relations: ['pet', 'owner'],
            where: {
                sitter: psid
            }
        })

        return requests
    }

    handleBookingResponseForPetSitter(booking_id: number, action: BookingReponse, psid: number){
        // verify psid
        if(!psid) throw new BadRequestException("Pet sitter ID is required")
        if(!this.isValidPetSitterId(psid)) throw new UnauthorizedException("Pet sitter ID is invalid")
        // check if psid related to booking_id
        // take action on booking_id
    }

    isValidPetSitterId(id: number): boolean{
        let str_id = "" + id
        if(str_id.length != 7 || str_id[0] != '2') return false
        return true
    }

    isValidPetOwnerId(id: number): boolean{
        let str_id = "" + id
        if(str_id.length != 7 || str_id[0] != '1') return false
        return true
    }
}
