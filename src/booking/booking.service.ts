import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking, Status } from 'src/entities/booking.entity';
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
const BOOKING_ACTION = {
    ACCEPT: "ACCEPT",
    DENY: "DENY"
}
type BookingAction = "ACCEPT" | "DENY"

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
            console.log(temp)
            await this.bookingRepo.save(temp)
        }

        return false
    }

    async handleShowingRequestForPetSitter(psid: number){
        let requests = await this.bookingRepo.find({
            relations: ['pet', 'owner'],
            where: {
                sitter: psid,
                status: Status.Requesting
            }
        })

        return requests
    }

    async handleBookingResponseForPetSitter(booking_id: number, action: BookingAction, psid: number){
        let record = await this.bookingRepo.findOne({
            relations: ['sitter'],
            where: {id: booking_id}
        })

        // Error checking
        if(!record) throw new NotFoundException(`Booking ID ${booking_id} not found`)
        if(record.sitter.id != psid) throw new UnauthorizedException(`This booking record does not belong to sitter ${psid}`)
        if(record.status != Status.Requesting) throw new BadRequestException(`Booking record ID ${booking_id} has already been accepted`)

        // action taking
        if(action == BOOKING_ACTION.ACCEPT){
            record.status = Status.Pending
            if(await this.bookingRepo.save(record)) return true
            return false
        }else if(action == BOOKING_ACTION.DENY){
            record.status = Status.Denied
            if(await this.bookingRepo.save(record)) return true
            return false
        }   
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
