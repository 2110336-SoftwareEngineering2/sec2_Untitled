
import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';

import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ChatService } from './chat.service';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChatController {
    constructor(
        private readonly chatService: ChatService
    ) { }

    @Get('/chat/:otherUser')
    @Roles('owner', 'sitter')
    async index(@Res() res, @Req() { user: { id } }, @Param('otherUser') otherUser) {
        // chat with yourself
        if(otherUser == id) throw new BadRequestException("You can not chat with yourself")
        let { success, latestUpdate, messages } = await this.chatService.getMessagesFor(id, otherUser)
        let chatHistories = await this.chatService.handleGetChatHistory(id)
        if (success) {
            res.cookie('latestUpdate', latestUpdate)
                .render("testChat", { latestUpdate, messages, receiverId: otherUser, chatHistories })
        }
        else res.send("Error occured when retrieving messages")
    }

    // body {
    //     receiverId: number,
    //     message: string
    // }
    @Post('/api/chat')
    @Roles('sitter', 'owner')
    saveMessage(@Req() { user: { id } }, @Body() { receiverId, message }) {
        // id is the id of sender
        return this.chatService.handleSaveMessage(id, receiverId, message)
    }

    // (Optional parameter) onlyNewMessages : 'true' | 'false'
    @Get('/api/chat/:otherUser')
    @Roles('sitter', 'owner')
    async getMessages(@Param('otherUser') otherUser, @Query('onlyNewMessages') onlyNewMessages: Boolean, @Req() req, @Res() res) {
        let latestUpdate = req.cookies['latestUpdate']
        if (!latestUpdate) return { success: false, message: "latestUpdate is required in cookie" }

        let messages = undefined
        if (!onlyNewMessages) messages = await this.chatService.getMessagesFor(req.user.id, otherUser)
        else messages = await this.chatService.getMessagesSince(req.user.id, otherUser, latestUpdate)

        res.cookie('latestUpdate', messages.latestUpdate).send(messages)
    }
}

