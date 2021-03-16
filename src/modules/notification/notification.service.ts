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
        return await this.transactionRepo.save({performerId,receiverId,description})
    }

    // get all transaction for receiverId
    async getNotificationsFor(receiverId: number){
        return await this.transactionRepo.find({where: {receiverId}})
    }

    // get all tracsantion for receiverId since "date"
    getNotificationsSince(){

    }
}
