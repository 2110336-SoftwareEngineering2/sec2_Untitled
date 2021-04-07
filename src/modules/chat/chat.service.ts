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
            let senderFname = (await this.getUserInfo(senderId)).fname
            await this.notificationService.createTransaction(senderId, receiverId, `${senderFname} sent you a message`)
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
        let otherUserInfo = await this.getUserInfo(otherUser)

        let latestUpdate = dayjs.utc().format("DD/MM/YYYY HH:mm:ss") // default is current time
        for (let i = 0; i < messages.length; i++) {
            messages[i].isMe = messages[i].senderId == requestingUser
            if (i == messages.length - 1) latestUpdate = dayjs(messages[i].createDatetime).add(1, 'second').format("DD/MM/YYYY HH:mm:ss")
        }
        return { success: true, latestUpdate, messages, otherUserInfo }
    }

    // retrieve messages from DB corresponding to input receiver ID since input time
    async getMessagesSince(requestingUser, otherUser, since) {
        if (!dayjs(since, "DD/MM/YYYY HH:mm:ss", true).isValid()) return {
            success: false,
            message: "Expected since format is \"DD/MM/YYYY HH:mm:ss\" in UTC time"
        }

        // set utcOffSet to 0 because the incoming "since" is already in utc
        let sineInISOFormat = dayjs(since, "DD/MM/YYYY HH:mm:ss").utcOffset(0, true).format()
        let messages = Object(await this.messageRepo.find({
            where: [
                { senderId: requestingUser, receiverId: otherUser, createDatetime: MoreThan(sineInISOFormat) },
                { senderId: otherUser, receiverId: requestingUser, createDatetime: MoreThan(sineInISOFormat) }
            ]
        }))
        let otherUserInfo = await this.getUserInfo(otherUser)

        let latestUpdate = since
        // retrieve sender info for each message
        for (let i = 0; i < messages.length; i++) {
            messages[i].isMe = messages[i].senderId == requestingUser
            if (i == messages.length - 1) {
                latestUpdate = dayjs(messages[i].createDatetime).add(1, 'second').format("DD/MM/YYYY HH:mm:ss")
            }

        }

        return { success: true, latestUpdate, messages, otherUserInfo }
    }

    /**
     * Helper function, Retrieve information of ID
     * @param id ID of either pet sitter or pet owner
     * @returns PetOwner or PetSitter Object according to id input
     */
    private async getUserInfo(id: number) {
        let strId = id.toString()
        let idLength = strId.length
        let role = undefined
        if (idLength == 7) {
            // pet owner
            if (strId[0] == '1') role = "owner"
            // pet sitter
            else if (strId[0] == '2') role = "sitter"
        } else if (idLength < 7) role = "admin"

        return await this.accountService.findAccountById(role, id)
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
    async getChatMateList(userId: number, messages: Message[]): Promise<number[]> {
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

    // return an id of someone that userId had chat with
    // if userId never chat before this function will return 1000039
    async handleChatIndex(userId: number): Promise<number> {
        let messages = await this.messageRepo.find({
            where: [
                { senderId: userId },
                { receiverId: userId }
            ]
        })
        if (!messages.length) return 1000039
        else {
            let chatMateList = await this.getChatMateList(userId, messages)
            return chatMateList[chatMateList.length - 1] // latest person userId had chat with
        }
    }
}

