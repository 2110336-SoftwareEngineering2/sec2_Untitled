
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ChatService } from './chat.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(
        private readonly chatService: ChatService
    ) { }

    @Post('/chat')
    @UseGuards(RolesGuard)
    @Roles('sitter', 'owner')
    // {
    //     receiverId: number,
    //     message: string
    // }
    incomingMessage(@Req() { user: { id } }, @Body() { receiverId, message }) {
        // id is the id of sender
        return this.chatService.handleIncomingMessage(id, receiverId, message)
    }
}

