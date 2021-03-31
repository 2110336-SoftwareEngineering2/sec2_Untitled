import { Controller, Get, Post, Body, Response, Request, Param, UseGuards, Req } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { SupportService } from './support.service';

@UseGuards(JwtAuthGuard,RolesGuard)
@Roles('admin')
@Controller("support")
export class SupportController {
    constructor(private readonly supportService: SupportService) { }

    @Get()
    async renderSupportPage(@Response() res) {
        let reportLists = await this.supportService.getAllReports();
        res.render('support/showReports', {reports: reportLists})
    }
}
    