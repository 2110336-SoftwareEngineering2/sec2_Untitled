import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PetOwner, PetSitter, Booking, SitterReview, OwnerReview, Report } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SupportService {
    constructor(
        
		){}

        async showAllReport(){
            console.log("This is report page")
        }
}
