import { Controller, Get, Post, Body, Response, Request, Param, UseGuards, Req } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { SupportService } from './support.service';

@UseGuards(JwtAuthGuard,RolesGuard)
@Controller("support")
export class SupportController {
    constructor(private readonly supportService: SupportService) { }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin')
    @Get()
    async renderSupportPage(@Response() res, @Request() req) {
        let reportLists = await this.supportService.getAllReports();
        console.log("this is report lists",reportLists);
        //let petowner = await this.supportService.findPetOwnerById()
        res.render('support/showReports', {reports: reportLists})
    }
}
    