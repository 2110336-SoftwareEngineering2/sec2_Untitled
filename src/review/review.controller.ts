import { Controller, Get, Post, Body, Response, Request, Param, UseGuards, Req, Header } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';


@Controller()
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }
	
	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('owner')
    @Get('/reviewForm/:booking_id/:petsitter_id')
    async renderReview(@Response() res, @Req() req, @Param("booking_id") booking_id, @Param("petsitter_id") petsitter_id ){
		let book = await this.reviewService.findBooking(booking_id);
		console.log('This is booking',book)
		
		//await this.reviewService.setCurrentSitter(petsitter_id)
		let object = await this.reviewService.findSitter(petsitter_id);
		console.log('This is petsitter',object)
		//console.log(this.reviewService.getCurrentSitter())
		
		let reviewer = await this.reviewService.findOwner(req.user.id);
		console.log('This is petowner',reviewer)
		
		let endDate = book.Booking.endDate.toLocaleDateString() +' ' +book.Booking.endDate.toLocaleTimeString();
		let startDate = book.Booking.startDate.toLocaleDateString() +' ' +book.Booking.startDate.toLocaleTimeString();
		console.log('This is date', endDate)
        res.render('review/reviewForm1', {Booking: book.Booking ,petSitter: object.petSitter, petOwner:reviewer.petOwner, SD:startDate, ED:endDate})
    }

	@UseGuards(JwtAuthGuard)
	@Roles('owner')
    @Get('/reviews/:petsitter_id')
    async renderUserReviews(@Response() res, @Request() req, @Param("petsitter_id") petsitter_id) {
        let object = await this.reviewService.handlePetsitterReview(petsitter_id, req.uid);
        //console.log(object.reviews)
        //console.log(object.petSitter)
		let amount = await this.reviewService.updateReviewAmount(petsitter_id);
        res.render('review/reviewAndRating', {reviews: object.reviews, petSitter: object.petSitter})
    }
	
	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('owner')
	@Post('/reviewForm')
	async review_petsitter(@Response() res, @Body() dto, @Req() req, @Param() para){ 
		let reviewer = await this.reviewService.findOwner(req.user.id);
		//console.log('This is user who do request',req.user)
		console.log('This is parameter',dto)
		//console.log(dto)
		res.render('review/reviewForm2',{petOwner:reviewer.petOwner})
		return await this.reviewService.saveReview(dto.stars, dto.feedback, req.user.id, 2000001);
	}

}
