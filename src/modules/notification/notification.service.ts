import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { Transaction } from 'src/entities/transaction.entity';
import { Repository } from 'typeorm';

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
        return await this.transactionRepo.find({where: {receiverId}})
    }

    async getPicUrlOf(user_id: number){
        let str_id = String(user_id)
        // pet owner
        if(str_id[0] == '1'){
            return (await this.petOwnerRepo.findOne(user_id)).picUrl
        }
        // pet sitter
        else if(str_id[0] == '2'){
            return (await this.petSitterRepo.findOne(user_id)).picUrl
        }
    }

    // get all tracsantion for receiverId since "date"
    getNotificationsSince(){

    }
}
