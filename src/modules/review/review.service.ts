import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {PetOwner, PetSitter, Booking, SitterReview, OwnerReview} from 'src/entities'
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(PetOwner) private readonly petOwnerRepo: Repository<PetOwner>,
        @InjectRepository(PetSitter) private readonly petSitterRepo: Repository<PetSitter>,
		@InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>, 
        @InjectRepository(SitterReview) private readonly sitterReviewRepo: Repository<SitterReview>,
		@InjectRepository(OwnerReview) private readonly ownerReviewRepo: Repository<OwnerReview>
	){}

    async handlePetsitterReview(petSitterId: number, petOwnerId: number){
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
	
	async saveOwnerReview(reviewRating:number, reviewDescription:string, petOwnerId:number, petSitterId:number){
		let petSitter = await this.petSitterRepo.findOne({
            where: {id: petSitterId}
        })
        let petOwner = await this.petOwnerRepo.findOne({
            where: {id: petOwnerId}
        })
		//import randomInt tool
		const randomInt = require('random-int');
		const uid = randomInt(100,999)
		
		const review = {id:uid, rating:reviewRating, description: reviewDescription, owner: petOwner ,sitter: petSitter }
		//console.log('This is review',review)
		return await this.sitterReviewRepo.save(review);
	}

	async saveSitterReview(reviewRating:number, reviewDescription:string, petSitterId:number, petOwnerId:number){
		let petSitter = await this.petSitterRepo.findOne({
            where: {id: petSitterId}
        })
        let petOwner = await this.petOwnerRepo.findOne({
            where: {id: petOwnerId}
        })
		//import randomInt tool
		const randomInt = require('random-int');
		const uid = randomInt(100,999)
		
		const review = {id:uid, rating:reviewRating, description: reviewDescription, owner: petOwner ,sitter: petSitter }
		//console.log('This is review',review)
		return await this.ownerReviewRepo.save(review);
	}

    async findPetSitterById(id: number): Promise<PetSitter>{
        let petSitter = await this.petSitterRepo.findOne(id)
        if(!petSitter) throw new NotFoundException("Pet sitter not found, recheck ID")
        return petSitter
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

	async calculateStarStat(petSitterId: number){
        let cnt1: number = 0
		let cnt2: number = 0
		let cnt3: number = 0
		let cnt4: number = 0
		let cnt5: number = 0
		let reviews = await this.sitterReviewRepo.find({
            where: {
				sitter: petSitterId,
			}
        })
		
        reviews.forEach(function(review) {
            if(review.rating < 2) cnt1++;
            else if (review.rating < 3) cnt2++;
            else if (review.rating < 4) cnt3++;
            else if (review.rating < 5) cnt4++;
            else cnt5++;
        })
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
            avgStar,           
            counts: reviewCount}
	}

    async updateSitterReview(petSitterId: number){
        let reviewStat = await this.calculateStarStat(petSitterId);
        let petSitter = await this.findPetSitterById(petSitterId);
        petSitter.reviewerAmount = reviewStat.counts;
        petSitter.rating = reviewStat.avgStar;
        await this.petSitterRepo.save(petSitter);
    }
/**
	async getCurrentSitter(){
		console.log(this.currentSitter)
		//return {number : currentSitter};
	 }


	async setCurrentSitter(petSitterId: number){
		let currentSitter = {number:petSitterId};
		return ;
	 }	
**/
}
