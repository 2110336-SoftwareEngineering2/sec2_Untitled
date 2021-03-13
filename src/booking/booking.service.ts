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
import { Transaction } from 'src/entities/transaction.entity';
import { NotificationService } from 'src/notification/notification.service';

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
        private readonly notificationService: NotificationService,
        @InjectRepository(PetSitter)
        private readonly petSitterRepo: Repository<PetSitter>,
        @InjectRepository(PetOwner)
        private readonly petOwnerRepo: Repository<PetOwner>,
        @InjectRepository(Pet)
        private readonly petRepo: Repository<Pet>,
        @InjectRepository(Booking)
        private readonly bookingRepo: Repository<Booking>,
        @InjectRepository(SitterReview)
        private readonly sitterReviewRepo: Repository<SitterReview>,
        @InjectRepository(Transaction)
        private readonly transactionRepo: Repository<Transaction>
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

    // creating booking requests
    // po requests -> ps confirms -> paid by po
    //  requesting      pending       completed  
    async handleIncomingRequest(incoming_booking: any, poid: number): Promise<any> {
        if(!poid) throw new UnauthorizedException("Pet owner id is required")
        if(!this.isValidPetOwnerId(poid)) throw new UnauthorizedException("Pet owner ID is invalid")

        // store booking status requesting
        let price = (await this.findPetSitterById(incoming_booking.sitter)).priceRate
        let startDate = dayjs(incoming_booking.startDate, DATE_FORMAT).format()
        let endDate = dayjs(incoming_booking.endDate, DATE_FORMAT).format()

        incoming_booking.price = price
        incoming_booking.startDate = startDate
        incoming_booking.endDate = endDate
        incoming_booking.owner = poid

        let po = await this.findPetOwnerById(poid)

        // loop by pet#
        for(let i=0; i<incoming_booking.pets.length; i++){
            let {pets, ...temp} = incoming_booking
            temp.pet = incoming_booking.pets[i]
            if(! await this.bookingRepo.save(temp)) return false

            // create transaction
            this.notificationService.createTransaction(poid, incoming_booking.sitter, `${po.fname} requests your service`)
        }

        return true
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
            relations: ['sitter', 'owner', 'pet'],
            where: {id: booking_id}
        })

        // Error checking
        if(!record) throw new NotFoundException(`Booking ID ${booking_id} not found`)
        if(record.sitter.id != psid) throw new UnauthorizedException(`This booking record does not belong to sitter ${psid}`)
        if(record.status != Status.Requesting) throw new BadRequestException(`Booking record ID ${booking_id} has already been accepted`)

        // action taking
        if(action == BOOKING_ACTION.ACCEPT){
            record.status = Status.Pending

            // create transaction
            let ps = await this.findPetSitterById(psid)
            this.notificationService.createTransaction(psid, record.owner.id, `${ps.fname} accepts your request for ${record.pet.name}`)

            if(await this.bookingRepo.save(record)) return true
            return false
        }else if(action == BOOKING_ACTION.DENY){
            record.status = Status.Denied

            // create transaction
            let ps = await this.findPetSitterById(psid)
            this.notificationService.createTransaction(psid, record.owner.id, `${ps.fname} denies your request for ${record.pet.name}`)

            if(await this.bookingRepo.save(record)) return true
            return false
        }   
    }

    async handleShowOwnerBooking(poid : number){
        // find all booking history of poid
        let bookings = await this.bookingRepo.find({
            relations : ['pet', 'sitter'],
            where : {owner: poid}
        })
        return bookings
    }

    // Pet owner must be able to cancle within 24 hours
    async handleCancleBookingForPetOwner(bid: number, poid: number){
        // booking must be in REQUESING state
        // time since last modified must be less than 24 hours
        let booking = await this.bookingRepo.findOne({
            relations: ['owner', 'sitter', 'pet'],
            where: {id: bid}
        })

        if(booking.owner.id != poid) return {
            success: false,
            message: "You are not the owner of this booking request."
        }

        let lastModified = dayjs(booking.lastModified).add(7, 'hour') // adding like this because dayjs timezone isn't working
        let hours_since_last_modified = dayjs().diff(lastModified, "hour")

        // if conditions are fulfilled then delete the booking
        if(booking.status == Status.Requesting && hours_since_last_modified <= 24) {
            // create transaction
            this.notificationService.createTransaction(poid, booking.sitter.id, `${booking.owner.fname} cancels request for ${booking.pet.name}`)

            if(await this.bookingRepo.remove(booking)) return { success: true }
            else return { success: false, message: "Error occured when removing request."}
        }

        return { success: false, message: "Can not cancel, must be done in 24 hours."}
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
