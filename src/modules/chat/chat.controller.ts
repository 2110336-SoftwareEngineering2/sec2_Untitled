import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ChatService } from './chat.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(
        private readonly chatService: ChatService
    ) { }

    @Get('/chat/index')
    async chatIndex(@Req() { user: { id } }, @Res() res) {
        let latestChatPairId = await this.chatService.handleChatIndex(id)
        res.redirect(`/chat/${latestChatPairId}`)
    }

    @Get('/chat/:otherUser')
    async index(@Res() res, @Req() { user: { id } }, @Param('otherUser') otherUser) {
        // chat with yourself
        if (otherUser == id) throw new BadRequestException("You can not chat with yourself")
        let { success, latestUpdate, messages, otherUserInfo } = await this.chatService.getMessagesFor(id, otherUser)
        let chatHistories = await this.chatService.handleGetChatHistory(id)
        if (success) {
            res.cookie('latestUpdate', latestUpdate)
                .render("chat/chatIndex", { latestUpdate, messages, receiverId: otherUser, chatHistories, otherUserInfo })
        }
        else res.send("Error occured when retrieving messages")
    }

    // body {
    //     receiverId: number,
    //     message: string
    // }
    @Post('/api/chat')
    async saveMessage(@Req() { user: { id } }, @Body() { receiverId, message }) {
        // id is the id of sender
        return await this.chatService.handleSaveMessage(id, receiverId, message)
    }

    // (Optional query string) onlyNewMessages : 'true' | 'false'
    @Get('/api/chat/:otherUser')
    async getMessages(@Param('otherUser') otherUser, @Query('onlyNewMessages') onlyNewMessages: Boolean, @Req() req, @Res() res) {
        let latestUpdate = req.cookies['latestUpdate']
        if (!latestUpdate) return { success: false, message: "latestUpdate is required in cookie" }

        let messages = undefined
        if (!onlyNewMessages) messages = await this.chatService.getMessagesFor(req.user.id, otherUser)
        else messages = await this.chatService.getMessagesSince(req.user.id, otherUser, latestUpdate)

        res.cookie('latestUpdate', messages.latestUpdate).send(messages)
    }
}

