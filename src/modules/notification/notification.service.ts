import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Transaction} from 'src/entities'
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
    ){}

    async createTransaction(performerId: number, receiverId: number, description: string){
        return await this.transactionRepo.save({performerId,receiverId,description})
    }

    // get all transaction for receiverId
    async getNotificationsFor(receiverId: number){
        const results:any = await this.transactionRepo.find({where: {receiverId}})
        for (const result of results){
            result.performerPicUrl = await this.getPicUrlOf(result.performerId)
            result.fromNow = this.fromNow(result.createDatetime)
            const index  = result.description.split(' ').indexOf('booking')
            console.log(index)
            if (index !== -1) result.bookingId = +result.description.split(' ')[index+1]
        }
        return results.reverse()
    }

    async getPicUrlOf(userId: number){
        const role = userId.toString()[0] == '1' ? "owner" : "sitter"
        return (await this.accountService.findAccountById(role,userId)).picUrl
    }

    private fromNow(inDate){
        let offSet = - inDate.getTimezoneOffset() / 60
        let now = dayjs.utc()
        let date = dayjs(inDate).add(offSet, 'hour').utc()
        if (now.diff(date, 'second') < 60) return `${now.diff(date, 'second')} seconds ago`
        if (now.diff(date, 'minute') < 60) return `${now.diff(date, 'minute')} minutes ago`
        if (now.diff(date, 'hour') < 24) return `${now.diff(date, 'hour')} hours ago`
        if (now.diff(date, 'day') < 31) return `${now.diff(date, 'day')} days ago`
    }

    // get all tracsantion for receiverId since "date"
    getNotificationsSince(){

    }
}
