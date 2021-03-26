import { Controller, Get, Post, Body, Response, Request, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { SupportService } from './support.service';


@Controller("support")
export class SupportController {
    constructor(private readonly supportService: SupportService) { }

    
    @Get()
    async renderSupportPage(@Response() res, @Request() req) {
        await this.supportService.showAllReport();
        res.render('support/showReports')
    }
}
    