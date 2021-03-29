import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PetOwner, PetSitter, Booking, SitterReview, OwnerReview, Report } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SupportService {
    constructor(
        @InjectRepository(PetOwner) private readonly petOwnerRepo: Repository<PetOwner>,
        @InjectRepository(PetSitter) private readonly petSitterRepo: Repository<PetSitter>,
        @InjectRepository(Report) private readonly ReportRepo: Repository<Report>
		){}

        async getAllReports(){
            return await this.ReportRepo.find();
        }
}
