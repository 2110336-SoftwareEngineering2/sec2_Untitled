import { Controller, Get, Post, Body, Response, Request, Param, UseGuards, Req, Redirect } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { SupportService } from './support.service';

@UseGuards(JwtAuthGuard,RolesGuard)
@Controller("support")
export class SupportController {
    constructor(private readonly supportService: SupportService) { }

    @Get()
    @Roles('admin')
    async renderSupportPage(@Response() res) {
        let reportLists = await this.supportService.getAllReports();
        res.render('support/showReports', {reports: reportLists})
    }

    @Roles('admin')
    @Post('/resolveReport/:report_id')
    async resolveReport(@Response() res, @Param("report_id") report_id){
        console.log(report_id)
        await this.supportService.updateReportStatus(report_id)
        console.log("Successfully Clear Report id", report_id)
        res.redirect("/support")
    }
}
    