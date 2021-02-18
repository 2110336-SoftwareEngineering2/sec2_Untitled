import { Controller, Get, Post, Body, Response, Request, Param } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller()
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Get('/reviewForm/:petsitter_id')
    async renderReview(@Response() res, @Param("petsitter_id") petsitter_id){
		let object = await this.reviewService.handleReviewForm(petsitter_id);
        res.render('review/reviewForm1', {petSitter: object.petSitter})
    }

    @Get('/reviews/:petsitter_id')
    async renderUserReviews(@Response() res, @Request() req, @Param("petsitter_id") petsitter_id) {
        let object = await this.reviewService.handlePetsitterReview(petsitter_id, req.uid);
        //console.log(object.reviews)
        //console.log(object.petSitter)
		let amount = await this.reviewService.updateReviewAmount(petsitter_id);
        res.render('review/reviewAndRating', {reviews: object.reviews, petSitter: object.petSitter})
    }

	@Post('/reviewForm')
	async review_petsitter(@Body() dto){ 
		console.log(dto)
		return await this.reviewService.saveReview(dto.stars, dto.feedback,1000013,2000001);
	}

}
