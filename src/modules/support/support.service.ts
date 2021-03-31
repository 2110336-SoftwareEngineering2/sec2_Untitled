import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { report } from 'process';
import { PetOwner, PetSitter, Booking, SitterReview, OwnerReview, Report } from 'src/entities';
import { Repository } from 'typeorm';
import { AccountService } from '../account/account.service';

@Injectable()
export class SupportService {
    constructor(
        @InjectRepository(Report) private readonly ReportRepo: Repository<Report>,
        private readonly accountService: AccountService
		){}

        async getAllReports(){
            let reports = await this.ReportRepo.find();
            const modReports = []
            for(const report of reports){
                const {reporter, suspect} = report
                const modReport:any = {...report}
                modReport.reporterName = (await this.accountService.findAccountById("owner",reporter)).fullName
                modReport.suspectName = (await this.accountService.findAccountById("sitter",suspect)).fullName
                modReports.push(modReport)
            }
            return modReports;
        }
}
