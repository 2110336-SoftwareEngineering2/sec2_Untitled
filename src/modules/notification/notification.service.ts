import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { Transaction } from 'src/entities/transaction.entity';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc'
import * as timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepo: Repository<Transaction>,
        @InjectRepository(PetOwner)
        private readonly petOwnerRepo: Repository<PetOwner>,
        @InjectRepository(PetSitter)
        private readonly petSitterRepo: Repository<PetSitter>
    ){}

    async createTransaction(performerId: number, receiverId: number, description: string){
        return await this.transactionRepo.save({performerId,receiverId,description})
    }

    // get all transaction for receiverId
    async getNotificationsFor(receiverId: number){
        let results = Object(await this.transactionRepo.find({where: {receiverId}}))
        for(let i=0; i<results.length; i++){
            results[i].performerPicUrl = await this.getPicUrlOf(results[i].performerId)
            results[i].fromNow = this.fromNow(results[i].createDatetime)
        }
        return results
    }

    async getPicUrlOf(userId: number){
        let strId = String(userId)
        // pet owner
        if(strId[0] == '1'){
            return (await this.petOwnerRepo.findOne(userId)).picUrl
        }
        // pet sitter
        else if(strId[0] == '2'){
            return (await this.petSitterRepo.findOne(userId)).picUrl
        }
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
