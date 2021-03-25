import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { PetOwner, PetSitter } from 'src/entities';
import { Message } from 'src/entities/message.entity';
import { Repository , getManager } from 'typeorm';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepo: Repository<Message>,
        @InjectRepository(PetOwner)
        private readonly petOwnerRepo: Repository<PetOwner>,
        @InjectRepository(PetSitter)
        private readonly petSitterRepo: Repository<PetSitter>
    ) { }

    // save message into DB
    async handleIncomingMessage(senderId, receiverId, message) {
        // validate receiverId (no need for senderId because it came from JwtAuthGuard not user's input)
        let result = await this.messageRepo.save({ senderId, receiverId, message })
        if (result) return { success: true }
        return { success: false, message: "Error occured when saving your message"}
    }

    // retrieve messages from DB corresponding to input receiver ID
    getMessagesFor(receiverId){
		
		if(receiverId == 1){ //owner
			return await entityManager.query(``);
			
		}else if(receiverId == 2){ //sitter
			return await entityManager.query(``);
			
		}
		
       
    }

    // retrieve messages from DB corresponding to input receiver ID since input time
    getMessageSince(){
        
    }
}

