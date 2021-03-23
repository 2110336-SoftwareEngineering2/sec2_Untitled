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

    async handlePetSitterReview(petSitterId: number, petOwnerId: number){
        let reviews = await this.sitterReviewRepo.find({
            relations:["owner"],
            where: {sitter: petSitterId}
        })
        let petSitter = await this.petSitterRepo.findOne({
            where: {id: petSitterId}
        })
        let petOwner = await this.petOwnerRepo.findOne({
            where: {id: petOwnerId}
        })
        return {reviews, petSitter, petOwner};
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
        return {reviews, petSitter, petOwner};
    }
	
	async saveOwnerReview(reviewRating:number, reviewDescription:string, petOwnerId:number, petSitterId:number){
		let petSitter = await this.petSitterRepo.findOne({
            where: {id: petSitterId}
        })
        let petOwner = await this.petOwnerRepo.findOne({
            where: {id: petOwnerId}
        })
		
		const review = {rating:reviewRating, description: reviewDescription, owner: petOwner ,sitter: petSitter }
		
		return await this.sitterReviewRepo.save(review);
	}

	async saveSitterReview(reviewRating:number, reviewDescription:string, petSitterId:number, petOwnerId:number){
		let petSitter = await this.petSitterRepo.findOne({
            where: {id: petSitterId}
        })
        let petOwner = await this.petOwnerRepo.findOne({
            where: {id: petOwnerId}
        })
		

		const review = {rating:reviewRating, description: reviewDescription, owner: petOwner ,sitter: petSitter }
		
		return await this.ownerReviewRepo.save(review);
	}

    async saveOwnerReport(petowner_id:number ,petsitter_id:number, service:boolean, time:boolean, impolite:boolean, other:boolean, description:string){
        let petSitter = await this.petSitterRepo.findOne({
            where: {id: petsitter_id}
        })
        let petOwner = await this.petOwnerRepo.findOne({
            where: {id: petowner_id}
        })
    
        let ser:boolean =false;
        let tim:boolean =false;
        let imp:boolean =false;
        let ot:boolean=false;

        if(service) ser=true;
        if(time) tim=true;
        if(impolite) imp=true;
        if(other) ot=true;
		
		const reportTime:Date = new Date();

        const report = {reporter:petowner_id, suspect:petsitter_id, status:reportStatus.Requesting,  createDatetime:reportTime, poorOnService: ser, notOnTime:tim, impoliteness:imp, other:ot, description:description}
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

	async findSitter(petSitterId: number){
		let sitter = await this.petSitterRepo.findOne({
            where: {id: petSitterId}
        })
		 return {petSitter : sitter};
	 }

	async findOwner(petOwnerId: number){
		let owner = await this.petOwnerRepo.findOne({
            where: {id: petOwnerId}
        })
		 return {petOwner : owner};
	 }

	async findBooking(bookingId: number){
		let bk = await this.bookingRepo.findOne({
            relations:['owner','sitter','pet'],
            where: {id: bookingId}
        })
		 return {Booking : bk};
	 }

    async findBookingFromReview(petSitterId: number){
        
        let reviews = this.findPetsitterReviews(petSitterId);
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
                period.push({ownerId:booking.owner.id, sd: booking.startDate, ed: booking.endDate })
                
                
            } catch (error) {
                console.log("This comment did not have booking with this sitter")
            }
            
        });
        console.log(period)    
    }

    async findPetsitterReviews(petSitterId: number){
        let reviews = await this.sitterReviewRepo.find({
            relations:["owner"],
            where: {sitter: petSitterId}
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

		if(reviews.length!=0){
            reviews.forEach(function(review) {
                if(review.rating < 2) cnt1++;
                else if (review.rating < 3) cnt2++;
                else if (review.rating < 4) cnt3++;
                else if (review.rating < 5) cnt4++;
                else cnt5++;
            })
        }else{
            return {
                star1: 0,
                star2: 0,
                star3: 0, 
                star4: 0, 
                star5: 0,
                avgStar: 0,           
                counts: 0
            }
        }
        
		let reviewCount: number = cnt1+cnt2+cnt3+cnt4+cnt5
		let cnt1P = (cnt1/reviewCount * 100).toFixed(0)
		let cnt2P = (cnt2/reviewCount * 100).toFixed(0)
		let cnt3P = (cnt3/reviewCount * 100).toFixed(0)
		let cnt4P = (cnt4/reviewCount * 100).toFixed(0)
		let cnt5P = (cnt5/reviewCount * 100).toFixed(0)
        let avgStar: number = (1*cnt1+ 2*cnt2+ 3*cnt3+ 4*cnt4+ 5*cnt5) / reviewCount;
		return {
            star1: cnt1P,
            star2: cnt2P,
            star3: cnt3P, 
            star4: cnt4P, 
            star5: cnt5P,
            avgStar: avgStar,           
            counts: reviewCount}
	}

    async updateUserReviews(user_id: number){
        let reviewStat = await this.calculateStarStat(user_id);

        if(user_id > 2000000){
            let petSitter = await this.findPetSitterById(user_id);
            
            petSitter.reviewerAmount = reviewStat.counts;
            petSitter.rating = reviewStat.avgStar;
            await this.petSitterRepo.save(petSitter);
        }
        else{
            let petOwner = await this.findPetOwnerById(user_id);

            petOwner.reviewerAmount = reviewStat.counts;
            petOwner.rating = reviewStat.avgStar;
            await this.petOwnerRepo.save(petOwner);
        }
        
        
    }

}
