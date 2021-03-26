
import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';

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
        let { success, latestUpdate, messages } = await this.chatService.getMessagesFor(id, otherUser)
        if (success) res.render("testChat", { latestUpdate, messages })
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

    // body {
    //     (Optional) since: "DD/MM/YYYY HH:mm:ss" utc time zone
    // }
    @Get('/api/chat/:otherUser')
    @Roles('sitter', 'owner')
    getMessages(@Param('otherUser') otherUser, @Body() { since }, @Req() { user: { id } }) {
        if (!since) return this.chatService.getMessagesFor(id, otherUser)
        else return this.chatService.getMessagesSince(id, otherUser, since)
    }
}

