import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepo: Repository<Transaction>,
    ){}

    async createTransaction(performerId: number, receiverId: number, description: string){
        let result = await this.transactionRepo.save({
            performerId: performerId,
            receiverId: receiverId,
            description: description
        })
        return result
    }

    // get all transaction for receiverId
    async getNotificationsFor(receiverId: number){
        let results = await this.transactionRepo.find({
            where: {receiverId: receiverId}
        })

        return results
    }

    // get all tracsantion for receiverId since "date"
    getNotificationsSince(){

    }
}
