import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/entities'
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc'
import * as timezone from 'dayjs/plugin/timezone'
import { AccountService } from '../account/account.service';
dayjs.extend(utc)
dayjs.extend(timezone)

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepo: Repository<Transaction>,
        private readonly accountService: AccountService
    ) { }

    async createTransaction(performerId: number, receiverId: number, description: string) {
        return await this.transactionRepo.save({ performerId, receiverId, description })
    }

    // get all transaction for receiverId
    async getNotificationsFor(receiverId: number) {
        const results: any = await this.transactionRepo.find({ receiverId })
        for (const result of results) {
            // datetime queried from database is already in utc but offset is local offset which is wrong
            // therefore I set its offset to 0 and keeping its local time
            result.createDatetime = new Date(dayjs(result.createDatetime).utcOffset(0, true).format())
            result.performerPicUrl = await this.getPicUrlOf(result.performerId)
            if (!result.performerPicUrl) result.performerPicUrl = '/image/profile.png'
            result.fromNow = this.fromNow(result.createDatetime)
            const index = result.description.split(' ').indexOf('booking')
            if (index !== -1) result.bookingId = +result.description.split(' ')[index + 1]
        }
        return results.reverse()
    }

    async getPicUrlOf(userId: number) {
        let strId = userId.toString()
        let idLength = strId.length
        let role = undefined
        if (idLength == 7) {
            if (strId[0] == '1') role = "owner"
            else if (strId[0] == '2') role = "sitter"
        } else if (idLength < 7) role = "admin"

        if(!role) throw new BadRequestException("User ID can only be an ID of PetOwner PetSitter or Admin")

        return (await this.accountService.findAccountById(role, userId)).picUrl
    }

    fromNow(inDate) {
        let now = dayjs.utc()
        let date = dayjs(inDate).utc()
        if (now.diff(date, 'second') < 60) return `${now.diff(date, 'second')} seconds ago`
        if (now.diff(date, 'minute') < 60) return `${now.diff(date, 'minute')} minutes ago`
        if (now.diff(date, 'hour') < 24) return `${now.diff(date, 'hour')} hours ago`
        if (now.diff(date, 'day') < 31) return `${now.diff(date, 'day')} days ago`
        if (now.diff(date, 'month') < 12) return `${now.diff(date, 'month')} months ago`
        return `${now.diff(date, 'year')} years ago`
    }
}
