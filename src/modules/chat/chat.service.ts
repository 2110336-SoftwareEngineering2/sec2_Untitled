import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { MoreThan, Repository } from 'typeorm';
import * as dayjs from "dayjs";
import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as utc from 'dayjs/plugin/utc'
import { AccountService } from '../account/account.service';
import { NotificationService } from '../notification/notification.service';
dayjs.extend(utc)
dayjs.extend(customParseFormat)

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepo: Repository<Message>,
        private readonly accountService: AccountService,
        private readonly notificationService: NotificationService
    ) { }

    // save message into DB
    async handleSaveMessage(senderId, receiverId, message) {
        // validate receiverId (no need for senderId because it came from JwtAuthGuard not user's input)
        if (message == '') return { success: false, message: "Message cannot be empty" }
        let result = await this.messageRepo.save({ senderId, receiverId, message })
        if (result) {
            let senderFname = (await this.getSenderInfo(senderId)).fname
            this.notificationService.createTransaction(senderId, receiverId, `${senderFname} sent you a message`)
            return { success: true }
        }
        return { success: false, message: "Error occured when saving your message" }
    }

    // retrieve messages from DB corresponding to input receiver ID
    async getMessagesFor(requestingUser, otherUser) {
        let messages = Object(await this.messageRepo.find({
            where: [
                { senderId: requestingUser, receiverId: otherUser },
                { senderId: otherUser, receiverId: requestingUser }
            ]
        }))

        let latestUpdate = dayjs.utc().format("DD/MM/YYYY HH:mm:ss") // default is current time
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].senderId == requestingUser) messages[i].isMe = true
            else {
                messages[i].isMe = false
                messages[i].sender = await this.getSenderInfo(messages[i].senderId)
            }
            if (i == messages.length - 1) latestUpdate = dayjs(messages[i].createDatetime).add(1, 'second').format("DD/MM/YYYY HH:mm:ss")
        }

        return { success: true, latestUpdate, messages }
    }

    // retrieve messages from DB corresponding to input receiver ID since input time
    async getMessagesSince(requestingUser, otherUser, since) {
        // validate "since" format to be in "DD/MM/YYYY HH:mm:ss" utc
        if (!dayjs(since, "DD/MM/YYYY HH:mm:ss", true).isValid()) return {
            success: false,
            message: "Expected since format is \"DD/MM/YYYY HH:mm:ss\" in UTC time"
        }

        // set utcOffSet to 0 because the incoming "since" is already in utc
        let sinceInUtcFormat = dayjs(since, "DD/MM/YYYY HH:mm:ss").utcOffset(0, true).format()
        let messages = Object(await this.messageRepo.find({
            where: [
                { senderId: requestingUser, receiverId: otherUser, createDatetime: MoreThan(sinceInUtcFormat) },
                { senderId: otherUser, receiverId: requestingUser, createDatetime: MoreThan(sinceInUtcFormat) }
            ]
        }))

        // let latestUpdate = dayjs.utc().format("DD/MM/YYYY HH:mm:ss") // default is current time
        let latestUpdate = since
        // retrieve sender info for each message
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].senderId == requestingUser) messages[i].isMe = true
            else {
                messages[i].isMe = false
                messages[i].sender = await this.getSenderInfo(messages[i].senderId)
            }
            // add one second to prevent querying the messages that are already been sent to the client
            // Problem is because createDatetime stored in datacase has 6 digits millisecond
            // with dayjs you can only use 3 ex. 12:00.123456 > 12:00.123
            if (i == messages.length - 1) latestUpdate = dayjs(messages[i].createDatetime).add(1, 'second').format("DD/MM/YYYY HH:mm:ss")

        }

        return { success: true, latestUpdate, messages }
    }


    /**
     * Retrieve information of ID
     * @param id ID of either pet sitter or pet owner
     * @returns PetOwner or PetSitter Object according to id input
     */
    async getSenderInfo(id: number) {
        let strId = id.toString()
        // pet owner
        if (strId[0] == '1') return await this.accountService.findAccountById("owner", id)
        // pet sitter
        else if (strId[0] == '2') return await this.accountService.findAccountById("sitter", id)
    }
}

