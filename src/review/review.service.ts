import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { Booking } from 'src/entities/booking.entity'
import { SitterReview } from 'src/entities/sitterreview.entity';
import { OwnerReview } from 'src/entities/ownerreview.entity';
import { Report } from 'src/entities/report.entity';
import { reportStatus } from 'src/entities/report.entity';
import { MoreThan, Not, Repository } from 'typeorm';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(PetOwner) private readonly petOwnerRepo: Repository<PetOwner>,
        @InjectRepository(PetSitter) private readonly petSitterRepo: Repository<PetSitter>,
		@InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>, 
        @InjectRepository(SitterReview) private readonly sitterReviewRepo: Repository<SitterReview>,
		@InjectRepository(OwnerReview) private readonly ownerReviewRepo: Repository<OwnerReview>,
        @InjectRepository(Report) private readonly ownerReportRepo: Repository<Report>
		){}

    async handlePetSitterReview(petsitter_id: number, petowner_id: number){
        let reviews = await this.sitterReviewRepo.find({
            relations:["owner"],
            where: {sitter: petsitter_id}
        })
        let petSitter = await this.petSitterRepo.findOne({
            where: {id: petsitter_id}
        })
        let petOwner = await this.petOwnerRepo.findOne({
            where: {id: petowner_id}
        })
        return {reviews: reviews, petSitter: petSitter, petOwner: petOwner};
    }

    async handlePetOwnerReview(petsitter_id: number, petowner_id: number){
        let reviews = await this.ownerReviewRepo.find({
            relations:["sitter"],
            where: {owner: petowner_id}
        })
        let petSitter = await this.petSitterRepo.findOne({
            where: {id: petsitter_id}
        })
        let petOwner = await this.petOwnerRepo.findOne({
            where: {id: petowner_id}
        })
        return {reviews: reviews, petSitter: petSitter, petOwner: petOwner};
    }
	
	async saveOwnerReview(reviewRating:number, reviewDescription:string, petowner_id:number, petsitter_id:number){
		let petSitter = await this.petSitterRepo.findOne({
            where: {id: petsitter_id}
        })
        let petOwner = await this.petOwnerRepo.findOne({
            where: {id: petowner_id}
        })
		//import randomInt tool
		const randomInt = require('random-int');
		const uid = randomInt(100,999)
		
		const review = {id:uid, rating:reviewRating, description: reviewDescription, owner: petOwner ,sitter: petSitter }
		//console.log('This is review',review)
		return await this.sitterReviewRepo.save(review);
	}

	async saveSitterReview(reviewRating:number, reviewDescription:string, petsitter_id:number, petowner_id:number){
		let petSitter = await this.petSitterRepo.findOne({
            where: {id: petsitter_id}
        })
        let petOwner = await this.petOwnerRepo.findOne({
            where: {id: petowner_id}
        })
		//import randomInt tool
		const randomInt = require('random-int');
		const uid = randomInt(100,999)
		
		const review = {id:uid, rating:reviewRating, description: reviewDescription, owner: petOwner ,sitter: petSitter }
		//console.log('This is review',review)
		return await this.ownerReviewRepo.save(review);
	}

    async saveOwnerReport(petowner_id:number ,petsitter_id:number, service:boolean, time:boolean, impolite:boolean, other:boolean, description:string){
        let petSitter = await this.petSitterRepo.findOne({
            where: {id: petsitter_id}
        })
        let petOwner = await this.petOwnerRepo.findOne({
            where: {id: petowner_id}
        })
        const randomInt = require('random-int');
		const rid = randomInt(100,999)

        let ser:boolean =false;
        let tim:boolean =false;
        let imp:boolean =false;
        let ot:boolean=false;

        if(service) ser=true;
        if(time) tim=true;
        if(impolite) imp=true;
        if(other) ot=true;
		
		const reportTime:Date = new Date();

        const report = {id:rid, reporter:petowner_id, suspect:petsitter_id, status:reportStatus.Requesting,  createDatetime:reportTime, poorOnService: ser, notOnTime:tim, impoliteness:imp, other:ot, description:description}
        console.log('This is report info',report)
        return await this.ownerReportRepo.save(report);
    }

    async findPetSitterById(id: number): Promise<PetSitter>{
        let pet_sitter = await this.petSitterRepo.findOne(id)
        if(!pet_sitter) throw new NotFoundException("Pet Sitter not found, recheck ID")

        return pet_sitter
    }

    async findPetOwnerById(id: number): Promise<PetOwner>{
        let pet_owner = await this.petOwnerRepo.findOne(id)
        if(!pet_owner) throw new NotFoundException("Pet Owner not found, recheck ID")

        return pet_owner;
    }

	async findSitter(petsitter_id: number){
		let sitter = await this.petSitterRepo.findOne({
            where: {id: petsitter_id}
        })
		 return {petSitter : sitter};
	 }

	async findOwner(petowner_id: number){
		let owner = await this.petOwnerRepo.findOne({
            where: {id: petowner_id}
        })
		 return {petOwner : owner};
	 }

	async findBooking(booking_id: number){
		let bk = await this.bookingRepo.findOne({
            relations:['owner','sitter','pet'],
            where: {id: booking_id}
        })
		 return {Booking : bk};
	 }

    async findBookingFromReview(petsitter_id: number){
        
        let reviews = this.findPetsitterReviews(petsitter_id);
        // let startDate: Date;
        // let endDate: Date;
        let period = [];
        (await reviews).forEach(async review => {
            try {
                //booking is list of bookings
                let booking = await this.bookingRepo.findOne({
                    relations:["owner"],
                    where: {
                        owner: review.owner.id
                    }
                })
                console.log(booking.owner.id, booking.startDate, booking.endDate)
                period.push({owner_id:booking.owner.id, sd: booking.startDate, ed: booking.endDate })
                
                
            } catch (error) {
                console.log("This comment did not have booking with this sitter")
            }
            
        });
        console.log(period)    
    }

    async findPetsitterReviews(petsitter_id: number){
        let reviews = await this.sitterReviewRepo.find({
            relations:["owner"],
            where: {sitter: petsitter_id}
        })
        return reviews //return list of this petsitter reviews
    }

	async calculateStarStat(user_id: number){
        let cnt1: number = 0
		let cnt2: number = 0
		let cnt3: number = 0
		let cnt4: number = 0
		let cnt5: number = 0
        let reviews;
        if(user_id > 2000000){
            reviews = await this.sitterReviewRepo.find({
                where: {
                    sitter: user_id,
                }
            })
        }else{
            reviews = await this.ownerReviewRepo.find({
                where: {
                    owner: user_id,
                }
            })
        }
        console.log(reviews);
		if(reviews.length!=0){
            reviews.forEach(function(review) {
                if(review.rating < 2) cnt1++;
                else if (review.rating < 3) cnt2++;
                else if (review.rating < 4) cnt3++;
                else if (review.rating < 5) cnt4++;
                else cnt5++;
            })
            console.log("LOOOP")
        }else{
            return {
                star_1: 0,
                star_2: 0,
                star_3: 0, 
                star_4: 0, 
                star_5: 0,
                avg_star: 0,           
                counts: 0
            }
        }
        
		let review_count: number = cnt1+cnt2+cnt3+cnt4+cnt5
		let cnt1_p = (cnt1/review_count * 100).toFixed(0)
		let cnt2_p = (cnt2/review_count * 100).toFixed(0)
		let cnt3_p = (cnt3/review_count * 100).toFixed(0)
		let cnt4_p = (cnt4/review_count * 100).toFixed(0)
		let cnt5_p = (cnt5/review_count * 100).toFixed(0)
        let avg_star: number = (1*cnt1+ 2*cnt2+ 3*cnt3+ 4*cnt4+ 5*cnt5) / review_count;
		return {
            star_1: cnt1_p,
            star_2: cnt2_p,
            star_3: cnt3_p, 
            star_4: cnt4_p, 
            star_5: cnt5_p,
            avg_star: avg_star,           
            counts: review_count}
	}

    async updateUserReviews(user_id: number){
        let reviewStat = await this.calculateStarStat(user_id);
		console.log(reviewStat);
        if(user_id > 2000000){
            let petSitter = await this.findPetSitterById(user_id);
            petSitter.reviewerAmount = reviewStat.counts;
            petSitter.rating = reviewStat.avg_star;
            await this.petSitterRepo.save(petSitter);
        }else if(user_id > 1000000 && user_id < 2000000){
            let petOwner = await this.findPetOwnerById(user_id);
            petOwner.reviewerAmount = reviewStat.counts;
            petOwner.rating = reviewStat.avg_star;
            await this.petOwnerRepo.save(petOwner);
        }
        
        
    }
/**
	async getCurrentSitter(){
		console.log(this.currentSitter)
		//return {number : currentSitter};
	 }


	async setCurrentSitter(petsitter_id: number){
		let currentSitter = {number:petsitter_id};
		return ;
	 }	
**/
}
