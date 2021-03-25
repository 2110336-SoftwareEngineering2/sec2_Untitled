import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PetOwner, PetSitter } from 'src/entities';
import { Message } from 'src/entities/message.entity';
import { MoreThan, Repository } from 'typeorm';
import * as dayjs from "dayjs";
import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as utc from 'dayjs/plugin/utc'
import { AccountService } from '../account/account.service';
dayjs.extend(utc)
dayjs.extend(customParseFormat)

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepo: Repository<Message>,
        @InjectRepository(PetOwner)
        private readonly petOwnerRepo: Repository<PetOwner>,
        @InjectRepository(PetSitter)
        private readonly petSitterRepo: Repository<PetSitter>,
        private readonly accountService: AccountService
    ) { }

    // save message into DB
    async handleIncomingMessage(senderId, receiverId, message) {
        // validate receiverId (no need for senderId because it came from JwtAuthGuard not user's input)
        let result = await this.messageRepo.save({ senderId, receiverId, message })
        if (result) return { success: true }
        return { success: false, message: "Error occured when saving your message" }
    }

    // retrieve messages from DB corresponding to input receiver ID
    getMessagesFor(receiverId, senderId) {

    }

    // retrieve messages from DB corresponding to input receiver ID since input time
    async getMessageSince(receiverId, senderId, since) {
        // validate "since" format to be in "DD/MM/YYYY HH:mm:ss" utc
        if (!dayjs(since, "DD/MM/YYYY HH:mm:ss", true).isValid()) return {
            success: false,
            message: "Expected since format is \"DD/MM/YYYY HH:mm:ss\" in UTC time"
        }

        let sinceUtcFormat = dayjs(since, "DD/MM/YYYY HH:mm:ss").utc().format()
        let messages = Object(await this.messageRepo.find({
            createDatetime: MoreThan(sinceUtcFormat),
            receiverId: receiverId,
            senderId: senderId
        }))

        // retrieve sender info for each message
        for (let i = 0; i < messages.length; i++) {
            messages[i].sender = await this.getSenderInfo(messages[i].senderId)
        }

        let latestUpdate = dayjs.utc().format("DD/MM/YYYY HH:mm:ss")

        return { success: true, latestUpdate, messages }
    }

    async getSenderInfo(id) {
        let strId = String(id)
        // pet owner
        if (strId[0] == '1') return await this.accountService.findAccountById("owner", id)
        // pet sitter
        else if (strId[0] == '2') return await this.accountService.findAccountById("sitter", id)
    }
}
