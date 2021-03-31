import { Controller, Get, Post, Body, Response, Request, Param, UseGuards, Req, Header } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { NotificationService } from 'src/modules/notification/notification.service'
import { RolesGuard } from 'src/common/guards/roles.guard';

@UseGuards(JwtAuthGuard,RolesGuard)
@Controller()
export class ReviewController {
    constructor(
		private readonly reviewService: ReviewService,
		private readonly notificationService : NotificationService		
	) { }
	
	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('owner')
    @Get('/sitterReviews/:petsitter_id')
    async renderSitterReviews(@Response() res, @Request() req, @Param("petsitter_id") petsitter_id) {
		await this.reviewService.updateUserReviews(petsitter_id);
        let object = await this.reviewService.handlePetSitterReview(petsitter_id, req.user.id);
        //console.log(object.reviews)
        let user = await this.reviewService.findOwner(req.user.id);
		//console.log('This is current user', user.petOwner)		
		let starStat  = await this.reviewService.calculateStarStat(petsitter_id);
		//console.log('This is review star :', starStat.avgStar);
		//let booking = await this.reviewService.findBookingFromReview(petsitter_id)
		//console.log("SITTER REVIEW", object.reviews);
        res.render('review/showSitterReviews', {reviews: object.reviews, petSitter: object.petSitter, user: user.petOwner, stat: starStat})
    }

	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('sitter')
    @Get('/ownerReviews/:petowner_id')
    async renderOwnerReviews(@Response() res, @Request() req, @Param("petowner_id") petowner_id) {
		await this.reviewService.updateUserReviews(petowner_id);
		//console.log(petowner_id, req.user.id);
        let object = await this.reviewService.handlePetOwnerReview(req.user.id, petowner_id);
        //console.log(object.reviews)
        let user = await this.reviewService.findSitter(req.user.id);
		//console.log('This is current user', user.petSitter)
				
		let starStat = await this.reviewService.calculateStarStat(petowner_id);
		//console.log("this is the all petowner's stat", starStat)
		//console.log('This is review star :', starStat.star3);
        res.render('review/showOwnerReviews', {reviews: object.reviews, petOwner: object.petOwner, user: user.petSitter, stat: starStat})
    }

	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('owner')
    @Get('/ownerReviewForm/:bookingId')
    async renderOwnerForm(@Response() res, @Req() req, @Param("bookingId") bookingId ){
		let {Booking} = await this.reviewService.findBooking(bookingId);
		//console.log('This is booking',Booking)
		
		let petSitter = Booking.sitter;
		//console.log('This is sitter id',petSitter.id)
		
		let {petOwner} = await this.reviewService.findOwner(req.user.id);
		// console.log('This is petowner',reviewer)
		
		let starStat  = await this.reviewService.calculateStarStat(petSitter.id);
		
		let endDate = Booking.endDate.toLocaleDateString() +' ' +Booking.endDate.toLocaleTimeString();
		let startDate = Booking.startDate.toLocaleDateString() +' ' +Booking.startDate.toLocaleTimeString();
		// console.log('This is date', endDate)
        res.render('review/reviewForm1', {Booking ,petSitter, petOwner, SD:startDate, ED:endDate})
    }

	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('sitter')
    @Get('/sitterReviewForm/:bookingId')
    async renderSitterForm(@Response() res, @Req() req, @Param("bookingId") bookingId){
		let {Booking} = await this.reviewService.findBooking(bookingId);
		//console.log('This is booking',Booking)
		
		let petOwner = Booking.owner;
		//console.log('This is owner id',petOwner.id)
		
		let {petSitter} = await this.reviewService.findSitter(req.user.id);
		// console.log('This is petsitter',reviewer)
		
		let endDate = Booking.endDate.toLocaleDateString() +' ' +Booking.endDate.toLocaleTimeString();
		let startDate = Booking.startDate.toLocaleDateString() +' ' +Booking.startDate.toLocaleTimeString();
		// console.log('This is date', endDate)
        res.render('review/reviewFormS1', {Booking , petOwner, petSitter, SD:startDate, ED:endDate})
    }
	
	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('owner')
	@Post('/ownerReviewForm/:petsitterId')
	async ownerForm(@Response() res, @Body() dto, @Req() req, @Param("petsitterId") petsitterId){ 
		let {petOwner} = await this.reviewService.findOwner(req.user.id);
		//console.log('This is user who do request',req.user)
		console.log('This is parameter',dto)
		//console.log('petsitter id',petsitterId)

		res.render('review/reviewForm2',{petOwner})
		return await this.reviewService.saveOwnerReview(dto.stars, dto.feedback, req.user.id, petsitterId);
	}

	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('sitter')
	@Post('/sitterReviewForm/:petOwnerId')
	async sitterForm(@Response() res, @Body() dto, @Req() req, @Param("petOwnerId") petOwnerId){ 
		let {petSitter} = await this.reviewService.findSitter(req.user.id);
		//console.log('This is user who do request',req.user)
		console.log('This is parameter',dto)
		//console.log('petowner id',petOwnerId)
		
		res.render('review/reviewFormS2',{petSitter})
		return await this.reviewService.saveSitterReview(dto.stars, dto.feedback, req.user.id, petOwnerId);
	}

	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('owner')
    @Post('/ownerReviewForm/Report/:booking_id')
    async ownerReport(@Response() res, @Body() dto, @Req() req, @Param("booking_id") booking_id ){
		let book = await this.reviewService.findBooking(booking_id);
		//console.log('This is parameter',dto)
		//let object = book.Booking.sitter;
		//let endDate = book.Booking.endDate.toLocaleDateString() +' ' +book.Booking.endDate.toLocaleTimeString();
		//let startDate = book.Booking.startDate.toLocaleDateString() +' ' +book.Booking.startDate.toLocaleTimeString();

		await this.reviewService.saveOwnerReport(req.user.id, book.Booking.sitter.id, dto.PoorOnService, dto.NotOnTime, dto.Impoliteness, dto.Other, dto.reportDescription);
		
		let reportContent =  await this.reviewService.renderReportNotification(dto.PoorOnService, dto.NotOnTime, dto.Impoliteness);
		console.log(reportContent)
		await this.notificationService.createTransaction(999,book.Booking.sitter.id,reportContent);
		
        return res.redirect('/ownerReviewForm/'+booking_id);
    }

}
