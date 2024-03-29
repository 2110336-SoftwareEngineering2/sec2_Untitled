import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking, Status, Pet, PetOwner, PetSitter, SitterReview, Transaction } from 'src/entities'
import { Repository } from 'typeorm';
import { BookPetSitterDto } from './dto/pet_sitter.dto';
import * as dayjs from "dayjs";
import { NotificationService } from 'src/modules/notification/notification.service';
import { AccountService } from '../account/account.service';

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
        private readonly accountService: AccountService
    ) { }

    async handlePetSitterInfo(psid: number): Promise<BookPetSitterDto> {
        if (!this.isValidPetSitterId(psid)) throw new BadRequestException("Pet sitter ID is invalid")
        let ps = await this.accountService.findAccountById('sitter',psid)
        if (!ps) throw new NotFoundException("Pet sitter ID doesn't match any record")
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

    calculatePetSitterExp(signUpDate: Date) {
        let exp;
        const now = dayjs()
        const expY = now.diff(signUpDate, "year")
        const expM = now.diff(signUpDate, "month")
        if (expY > 1) exp = { value: expY, unit: "years" }
        else if (expY == 1) exp = { value: expY, unit: "year" }
        else if (expM > 1) exp = { value: expM, unit: "months" }
        else if (expM == 1) exp = { value: expM, unit: "month" }
        else exp = { value: -1, unit: "month" } // less than a month
        return exp
    }

    // creating booking requests
    // po requests -> ps confirms -> paid by po
    //  requesting      pending       paid  
    async handleIncomingRequest(incomingBooking: any, poid: number): Promise<any> {
        if (!poid) throw new UnauthorizedException("Pet owner ID is required")
        if (!this.isValidPetOwnerId(poid)) throw new UnauthorizedException("Pet owner ID is invalid")

        // store booking status requesting
        incomingBooking.startDate = dayjs(incomingBooking.startDate, DATE_FORMAT).format()
        incomingBooking.endDate = dayjs(incomingBooking.endDate, DATE_FORMAT).format()
        incomingBooking.owner = poid

        const petOwner = await this.accountService.findAccountById('owner',poid)

        // loop by pet#
        for (let i = 0; i < incomingBooking.pets.length; i++) {
            let { pets, ...temp } = incomingBooking
            temp.pet = incomingBooking.pets[i]
            if (! await this.bookingRepo.save(temp)) return false

            // create transaction
            this.notificationService.createTransaction(poid, incomingBooking.sitter, `${petOwner.fname} requested your service`)
        }

        return true
    }

    async handleShowSitterBookings(psid: number) {
        let requests = await this.bookingRepo.find({
            relations: ['pet', 'owner'],
            where: {
                sitter: psid,
                // status: Status.Requesting
            }
        })

        return requests
    }

    async handleBookingResponseForPetSitter(bookingId: number, action: BookingAction, psid: number) {
        let record = await this.bookingRepo.findOne({
            relations: ['sitter', 'owner', 'pet'],
            where: { id: bookingId }
        })

        // Error checking
        if (!record) throw new NotFoundException(`Booking ID ${bookingId} not found`)
        if (record.sitter.id != psid) throw new UnauthorizedException(`This booking record does not belong to sitter ${psid}`)
        if (record.status != Status.Requesting) throw new BadRequestException(`Booking record ID ${bookingId} has already been accepted`)

        // action taking
        if (action == BOOKING_ACTION.ACCEPT) {
            record.status = Status.Pending

            // create transaction
            let petSitter = await this.accountService.findAccountById('sitter',psid)
            this.notificationService.createTransaction(psid, record.owner.id, `${petSitter.fname} accepted your request for ${record.pet.name}`)

            if (await this.bookingRepo.save(record)) return true
            return false
        } else if (action == BOOKING_ACTION.DENY) {
            record.status = Status.Denied

            // create transaction
            let petSitter = await this.accountService.findAccountById('sitter',psid)
            this.notificationService.createTransaction(psid, record.owner.id, `${petSitter.fname} denied your request for ${record.pet.name}`)

            if (await this.bookingRepo.save(record)) return true
            return false
        }
    }

    async finishJob(bookingId: number, psid: number) {
        let record = await this.bookingRepo.findOne({
            relations: ['sitter', 'owner', 'pet'],
            where: { id: bookingId }
        })

        // Error checking
        if (!record) throw new NotFoundException(`Booking ID ${bookingId} not found`)
        if (record.sitter.id != psid) throw new UnauthorizedException(`This booking record does not belong to sitter ${psid}`)
        if (record.status != Status.Paid) throw new BadRequestException(`Please ask the customer to pay the money first`) // ! uncomment after implement frontEnd
        if (!(dayjs().isAfter(dayjs(record.endDate)))) throw new BadRequestException(`The job can not be finished yet!`)

        
        // action taking
        record.status = Status.Finished // ! uncomment after implement frontEnd
        this.notificationService.createTransaction(psid, record.owner.id, `Your service of booking ${record.id} for ${record.pet.name} is done`) // ! uncomment after implement frontEnd
        if (await this.bookingRepo.save(record)) return true
        return false
    }

    async handleShowOwnerBookings(poid: number) {
        // find all booking history of poid
        let bookings = await this.bookingRepo.find({
            relations: ['pet', 'sitter'],
            where: { owner: poid }
        })
        return bookings
    }

    // Pet owner must be able to cancle within 24 hours
    async handleCancleBookingForPetOwner(bid: number, poid: number) {
        // booking must be in REQUESING state
        // time since last modified must be less than 24 hours
        let booking = await this.bookingRepo.findOne({
            relations: ['owner', 'sitter', 'pet'],
            where: { id: bid }
        })

        if (booking.owner.id != poid) return {
            success: false,
            message: "You are not the owner of this booking request."
        }

        let lastModified = dayjs(booking.lastModified).add(7, 'hour') // adding like this because dayjs timezone isn't working
        let hoursSinceLastModified = dayjs().diff(lastModified, "hour")

        // if conditions are fulfilled then delete the booking
        if (booking.status == Status.Requesting && hoursSinceLastModified <= 24) {
            // create transaction
            this.notificationService.createTransaction(poid, booking.sitter.id, `${booking.owner.fname} canceled request for ${booking.pet.name}`)

            if (await this.bookingRepo.remove(booking)) return { success: true }
            else return { success: false, message: "Error occured when removing request." }
        }

        return { success: false, message: "Can not cancel, must be done within 24 hours." }
    }

    isValidPetSitterId(id: number): boolean {
        let strId = "" + id
        if (strId.length != 7 || strId[0] != '2') return false
        return true
    }

    isValidPetOwnerId(id: number): boolean {
        let strId = "" + id
        if (strId.length != 7 || strId[0] != '1') return false
        return true
    }

    async handleBookingPayment(bookingId: number, poid: number) {
        let record = await this.bookingRepo.findOne({
            relations: ['sitter', 'owner', 'pet'],
            where: { id: bookingId }
        })
        console.dir(record)
        if (!record) throw new NotFoundException(`Booking ID ${bookingId} not found`)
        if (record.owner.id != poid) throw new UnauthorizedException(`This booking record does not belong to pet owner ${poid}`)
        if (record.status == Status.Paid) throw new BadRequestException(`Booking record ID ${bookingId} has already been paid`)
        if (record.status == Status.Requesting) throw new BadRequestException(`Booking record ID ${bookingId} is waiting for pet sitter comfirmation`)
        if (record.status == Status.Denied) throw new BadRequestException(`Booking record ID ${bookingId} has already been denied`)

        if (record.status == Status.Pending) {
            let petOwner = await this.accountService.findAccountById('owner',poid)
            let petSitter = await this.accountService.findAccountById('sitter',record.sitter.id)
            record.status = Status.Paid
            let result = await this.bookingRepo.save(record)
            if (result) {
                petSitter.balance += record.price
                this.petSitterRepo.save(petSitter)
                this.notificationService.createTransaction(poid, record.sitter.id, `${petOwner.fname} paid your booking for ${record.pet.name}`)
                return result
            }
            return false
        }
    }
}
