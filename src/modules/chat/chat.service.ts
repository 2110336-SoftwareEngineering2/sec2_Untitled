import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
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
            let senderFname = (await this.getUserInfo(senderId)).fname
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
            // set offset to 0 because time is already in utc but the offset is wrong (GMT +7)
            messages[i].createDatetime = new Date(dayjs(messages[i].createDatetime).utcOffset(0, true).format())
            if (messages[i].senderId == requestingUser) messages[i].isMe = true
            else {
                messages[i].isMe = false
                // IDEA : sender will always be the same person. fetch sender info just once is enough
                messages[i].sender = await this.getUserInfo(messages[i].senderId)
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
        let sineInISOFormat = dayjs(since, "DD/MM/YYYY HH:mm:ss").format()
        let messages = Object(await this.messageRepo.find({
            where: [
                { senderId: requestingUser, receiverId: otherUser, createDatetime: MoreThan(sineInISOFormat) },
                { senderId: otherUser, receiverId: requestingUser, createDatetime: MoreThan(sineInISOFormat) }
            ]
        }))

        let latestUpdate = since
        // retrieve sender info for each message
        for (let i = 0; i < messages.length; i++) {
            // set offset to 0 because time is already in utc but the offset is wrong (GMT +7)
            messages[i].createDatetime = new Date(dayjs(messages[i].createDatetime).utcOffset(0, true).format())
            if (messages[i].senderId == requestingUser) messages[i].isMe = true
            else {
                messages[i].isMe = false
                messages[i].sender = await this.getUserInfo(messages[i].senderId)
            }
            // add one second to prevent querying the messages that are already been sent to the client
            // Problem is because createDatetime stored in datacase has 6 digits millisecond
            // with dayjs you can only use 3 ex. 12:00.123456 > 12:00.123
            if (i == messages.length - 1) latestUpdate = dayjs(messages[i].createDatetime).add(1, 'second').format("DD/MM/YYYY HH:mm:ss")

        }

        return { success: true, latestUpdate, messages }
    }

    /**
     * Helper function, Retrieve information of ID
     * @param id ID of either pet sitter or pet owner
     * @returns PetOwner or PetSitter Object according to id input
     */
    private async getUserInfo(id: number) {
        let strId = id.toString()
        // pet owner
        if (strId[0] == '1') return await this.accountService.findAccountById("owner", id)
        // pet sitter
        else if (strId[0] == '2') return await this.accountService.findAccountById("sitter", id)
    }

    async handleGetChatHistory(userId: number) {
        // Ideally, this should be done in a single SQL query.
        // but I find that hard to come up with such query.
        // so I went with get all messages and apply logic on them instead.
        let messages = await this.messageRepo.find({
            where: [
                { senderId: userId },
                { receiverId: userId }
            ]
        })
        let chatMateList = await this.getChatMateList(userId, messages)
        return await this.getLatestMessageOfEachChatPair(chatMateList, messages)
    }

    // list of IDs of those who chat with 'userId'
    private async getChatMateList(userId: number, messages: Message[]): Promise<number[]> {
        let chatMateList = []
        for (let i = 0; i < messages.length; i++) {
            let m = messages[i]
            let otherUserId = m.senderId != userId ? m.senderId : m.receiverId
            if (chatMateList.includes(otherUserId)) continue
            chatMateList.push(otherUserId)
        }
        return chatMateList
    }

    private async getLatestMessageOfEachChatPair(chatMateList: number[], messages: Message[]) {
        let latestMessageInEachChatPair = [];
        // for each person I chat with
        for (let i = 0; i < chatMateList.length; i++) {
            // Message like object but with otherUser info
            let latestMessage = undefined;
            let otherUserId = chatMateList[i]
            // find the latest message with person
            for (let j = 0; j < messages.length; j++) {
                let m = messages[j]
                if (m.senderId == otherUserId || m.receiverId == otherUserId) {
                    if (latestMessage == undefined) latestMessage = m
                    else {
                        let latestCreateDatetime = dayjs(latestMessage.createDatetime).utc()
                        // set offset to 0 because time is already in utc but the offset is wrong (GMT +7)
                        let incomingCreateDatetime = dayjs(m.createDatetime).utcOffset(0, true).utc()
                        if (incomingCreateDatetime.isAfter(latestCreateDatetime)) {
                            // set offset to 0 because time is already in utc but the offset is wrong (GMT +7)
                            m.createDatetime = new Date(incomingCreateDatetime.format())
                            latestMessage = m
                        }
                    }
                }
            }
            latestMessage.otherUser = await this.getUserInfo(otherUserId)
            latestMessageInEachChatPair.push(latestMessage)
            latestMessage = undefined
        }
        return latestMessageInEachChatPair
    }
}

