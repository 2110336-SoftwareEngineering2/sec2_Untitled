import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { report } from 'process';
import { Booking, SitterReview, OwnerReview, Report } from 'src/entities';
import { Repository } from 'typeorm';
import { AccountService } from '../account/account.service';

@Injectable()
export class SupportService {
    constructor(
        @InjectRepository(Report) private readonly ReportRepo: Repository<Report>,
        private readonly accountService: AccountService
		){}

        async getAllReports(){
            let reports:any = await this.ReportRepo.find();
            for(const report of reports){
                const {reporter, suspect} = report
                report.reporterName = (await this.accountService.findAccountById("owner",reporter)).fullName
                report.suspectName = (await this.accountService.findAccountById("sitter",suspect)).fullName
            }
            return reports;
        }
}
