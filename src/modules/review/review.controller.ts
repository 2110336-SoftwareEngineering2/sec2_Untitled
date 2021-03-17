import { Controller, Get, Post, Body, Response, Request, Param, UseGuards, Req, Header } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@UseGuards(JwtAuthGuard,RolesGuard)
@Controller()
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }
	
	@Roles('owner')
    @Get('/reviewOwnerForm/:bookingId/:petsitterId')
    async renderOwnerForm(@Response() res, @Req() req, @Param("bookingId") bookingId, @Param("petsitterId") petsitterId ){
		let {Booking} = await this.reviewService.findBooking(bookingId);
		// console.log('This is booking',book)
		
		//await this.reviewService.setCurrentSitter(petsitterId)
		let {petSitter} = await this.reviewService.findSitter(petsitterId);
		// console.log('This is petsitter',object)
		//console.log(this.reviewService.getCurrentSitter())
		
		let {petOwner} = await this.reviewService.findOwner(req.user.id);
		// console.log('This is petowner',reviewer)
		
		let starStat  = await this.reviewService.calculateStarStat(petsitterId);
		
		let endDate = Booking.endDate.toLocaleDateString() +' ' +Booking.endDate.toLocaleTimeString();
		let startDate = Booking.startDate.toLocaleDateString() +' ' +Booking.startDate.toLocaleTimeString();
		// console.log('This is date', endDate)
        res.render('review/reviewForm1', {Booking ,petSitter, petOwner, SD:startDate, ED:endDate})
    }

	@Roles('sitter')
    @Get('/reviewSitterForm/:bookingId/:petOwnerId')
    async renderSitterForm(@Response() res, @Req() req, @Param("bookingId") bookingId, @Param("petOwnerId") petOwnerId ){
		let {Booking} = await this.reviewService.findBooking(bookingId);
		// console.log('This is booking',book)
		
		//await this.reviewService.setCurrentSitter(petsitterId)
		let {petOwner} = await this.reviewService.findOwner(petOwnerId);
		// console.log('This is petowner',object)
		//console.log(this.reviewService.getCurrentSitter())
		
		let {petSitter} = await this.reviewService.findSitter(req.user.id);
		// console.log('This is petsitter',reviewer)
		
		let endDate = Booking.endDate.toLocaleDateString() +' ' +Booking.endDate.toLocaleTimeString();
		let startDate = Booking.startDate.toLocaleDateString() +' ' +Booking.startDate.toLocaleTimeString();
		// console.log('This is date', endDate)
        res.render('review/reviewFormS1', {Booking , petOwner, petSitter, SD:startDate, ED:endDate})
    }
	
	@Roles('owner')
	@Post('/reviewOwnerForm/:petsitterId')
	async ownerForm(@Response() res, @Body() dto, @Req() req, @Param("petsitterId") petsitterId){ 
		let {petOwner} = await this.reviewService.findOwner(req.user.id);
		//console.log('This is user who do request',req.user)
		// console.log('This is parameter',dto)
		// console.log('petsitter id',petsitterId)
		//console.log(dto)
		res.render('review/reviewForm2',{petOwner})
		return await this.reviewService.saveOwnerReview(dto.stars, dto.feedback, req.user.id, petsitterId);
	}

	@Roles('sitter')
	@Post('/reviewSitterForm/:petOwnerId')
	async sitterForm(@Response() res, @Body() dto, @Req() req, @Param("petOwnerId") petOwnerId){ 
		let {petSitter} = await this.reviewService.findSitter(req.user.id);
		//console.log('This is user who do request',req.user)
		// console.log('This is parameter',dto)
		// console.log('petowner id',petOwnerId)
		//console.log(dto)
		res.render('review/reviewFormS2',{petSitter})
		return await this.reviewService.saveSitterReview(dto.stars, dto.feedback, req.user.id, petOwnerId);
	}

	@Roles('owner')
    @Get('/reviews/:petsitterId')
    async renderUserReviews(@Response() res, @Request() req, @Param("petsitterId") petsitterId) {
		await this.reviewService.updateSitterReview(petsitterId);
        let {reviews, petSitter} = await this.reviewService.handlePetsitterReview(petsitterId, req.user.id);
        //console.log(object.reviews)
        let {petOwner} = await this.reviewService.findOwner(req.user.id);
		//console.log('This is current user', user.petOwner)		
		let starStat  = await this.reviewService.calculateStarStat(petsitterId);
		//console.log('This is review star :', starStat.avg_star);
		//let booking = await this.reviewService.findBookingFromReview(petsitterId)
        res.render('review/reviewAndRating', {reviews, petSitter, user: petOwner, stat: starStat})
    }

}
