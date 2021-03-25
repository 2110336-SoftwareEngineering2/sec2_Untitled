
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

    @Get('/chat')
    index(@Res() res){
        // render with cooking
    }

    // {
    //     receiverId: number,
    //     message: string
    // }
    @Roles('sitter', 'owner')
    @Post('/api/chat')
    incomingMessage(@Req() { user: { id } }, @Body() { receiverId, message }) {
        // id is the id of sender
        return this.chatService.handleIncomingMessage(id, receiverId, message)
    }

    // {
    //     (Optional) since: "DD/MM/YYYY HH:mm:ss" utc time zone
    // }
    @Roles('sitter', 'owner')
    @Get('/api/chat/:receiverId')
    getMessages(@Param('receiverId') receiverId, @Body() { since }, @Req() {user: {id}}) {

        if (!since) return this.chatService.getMessagesFor(id,receiverId)
        else return this.chatService.getMessageSince(receiverId, since)
    }
}

