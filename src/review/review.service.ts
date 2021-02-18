import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { SitterReview } from 'src/entities/sitterreview.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(PetOwner) private readonly petOwnerRepo: Repository<PetOwner>,
        @InjectRepository(PetSitter) private readonly petSitterRepo: Repository<PetSitter>,
        @InjectRepository(SitterReview) private readonly sitterReviewRepo: Repository<SitterReview>){}

    async handlePetsitterReview(petsitter_id: number, petowner_id: number){
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

	 async handleReviewForm(petsitter_id: number){
		 let petSitter = await this.petSitterRepo.findOne({
            where: {id: petsitter_id}
        })
		 console.log(petSitter)
		 return {petSitter: petSitter};
	 }
	
	async saveReview(reviewRating:number, reviewDescription:string, petowner_id:number, petsitter_id:number){
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
		console.log(review)
		return await this.sitterReviewRepo.save(review);
	}
	
    async updateReviewAmount(petsitter_id: number){
         let count = (await this.sitterReviewRepo.find({
            where: {sitter: petsitter_id}
         })).length
         console.log(count)
     }
	
}
