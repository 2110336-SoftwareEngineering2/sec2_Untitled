import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { report } from 'process';
import { Booking, SitterReview, OwnerReview, Report } from 'src/entities';
import { Repository } from 'typeorm';
import { AccountService } from '../account/account.service';
import { Status } from '../../entities/booking.entity';

@Injectable()
export class SupportService {
    constructor(
        @InjectRepository(Report) private readonly reportRepo: Repository<Report>,
        private readonly accountService: AccountService
		){}

        async getAllReports(){
            let reports:any = await this.reportRepo.find();
            for(const report of reports){
                const {reporter, suspect} = report
                if(reporter > 2000000){
                    report.reporterName = (await this.accountService.findAccountById("sitter",reporter)).fullName
                    report.suspectName = (await this.accountService.findAccountById("owner",suspect)).fullName
                }else{
                    report.reporterName = (await this.accountService.findAccountById("owner",reporter)).fullName
                    report.suspectName = (await this.accountService.findAccountById("sitter",suspect)).fullName
                }
            }
            return reports;
        }

        async updateReportStatus(reportId: number){
            let newStatus = "Cleared"
            let report:any = await this.reportRepo.findOne({
                where:  {id: reportId}
            });
            report.status = newStatus;
            await this.reportRepo.save(report);
        }
}
