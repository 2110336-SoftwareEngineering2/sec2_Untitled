import { Controller, Get, Post, Body, Response, Request, Param, UseGuards, Req, Header } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';


@Controller()
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }
	
	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('owner')
    @Get('/reviewOwnerForm/:booking_id/:petsitter_id')
    async renderOwnerForm(@Response() res, @Req() req, @Param("booking_id") booking_id, @Param("petsitter_id") petsitter_id ){
		let book = await this.reviewService.findBooking(booking_id);
		console.log('This is booking',book)
		
		//await this.reviewService.setCurrentSitter(petsitter_id)
		let object = await this.reviewService.findSitter(petsitter_id);
		console.log('This is petsitter',object)
		//console.log(this.reviewService.getCurrentSitter())
		
		let reviewer = await this.reviewService.findOwner(req.user.id);
		console.log('This is petowner',reviewer)
		
		let starStat  = await this.reviewService.calculateStarStat(petsitter_id);
		
		let endDate = book.Booking.endDate.toLocaleDateString() +' ' +book.Booking.endDate.toLocaleTimeString();
		let startDate = book.Booking.startDate.toLocaleDateString() +' ' +book.Booking.startDate.toLocaleTimeString();
		console.log('This is date', endDate)
        res.render('review/reviewForm1', {Booking: book.Booking ,petSitter: object.petSitter, petOwner:reviewer.petOwner, SD:startDate, ED:endDate})
    }

	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('sitter')
    @Get('/reviewSitterForm/:booking_id/:petowner_id')
    async renderSitterForm(@Response() res, @Req() req, @Param("booking_id") booking_id, @Param("petowner_id") petowner_id ){
		let book = await this.reviewService.findBooking(booking_id);
		console.log('This is booking',book)
		
		//await this.reviewService.setCurrentSitter(petsitter_id)
		let object = await this.reviewService.findOwner(petowner_id);
		console.log('This is petowner',object)
		//console.log(this.reviewService.getCurrentSitter())
		
		let reviewer = await this.reviewService.findSitter(req.user.id);
		console.log('This is petsitter',reviewer)
		
		let endDate = book.Booking.endDate.toLocaleDateString() +' ' +book.Booking.endDate.toLocaleTimeString();
		let startDate = book.Booking.startDate.toLocaleDateString() +' ' +book.Booking.startDate.toLocaleTimeString();
		console.log('This is date', endDate)
        res.render('review/reviewFormS1', {Booking: book.Booking ,petOwner: object.petOwner, petSitter:reviewer.petSitter, SD:startDate, ED:endDate})
    }
	
	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('owner')
	@Post('/reviewOwnerForm/:petsitter_id')
	async ownerForm(@Response() res, @Body() dto, @Req() req, @Param("petsitter_id") petsitter_id){ 
		let reviewer = await this.reviewService.findOwner(req.user.id);
		//console.log('This is user who do request',req.user)
		console.log('This is parameter',dto)
		console.log('petsitter id',petsitter_id)
		//console.log(dto)
		res.render('review/reviewForm2',{petOwner:reviewer.petOwner})
		return await this.reviewService.saveOwnerReview(dto.stars, dto.feedback, req.user.id, petsitter_id);
	}

	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('sitter')
	@Post('/reviewSitterForm/:petowner_id')
	async sitterForm(@Response() res, @Body() dto, @Req() req, @Param("petowner_id") petowner_id){ 
		let reviewer = await this.reviewService.findSitter(req.user.id);
		//console.log('This is user who do request',req.user)
		console.log('This is parameter',dto)
		console.log('petowner id',petowner_id)
		//console.log(dto)
		res.render('review/reviewFormS2',{petSitter:reviewer.petSitter})
		return await this.reviewService.saveSitterReview(dto.stars, dto.feedback, req.user.id, petowner_id);
	}

	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('owner')
    @Get('/reviews/:petsitter_id')
    async renderUserReviews(@Response() res, @Request() req, @Param("petsitter_id") petsitter_id) {
		await this.reviewService.updateSitterReview(petsitter_id);
        let object = await this.reviewService.handlePetsitterReview(petsitter_id, req.user.id);
        //console.log(object.reviews)
        let user = await this.reviewService.findOwner(req.user.id);
		//console.log('This is current user', user.petOwner)		
		let starStat  = await this.reviewService.calculateStarStat(petsitter_id);
		//console.log('This is review star :', starStat.avg_star);
		//let booking = await this.reviewService.findBookingFromReview(petsitter_id)
        res.render('review/reviewAndRating', {reviews: object.reviews, petSitter: object.petSitter, user: user.petOwner, stat: starStat})
    }

}
