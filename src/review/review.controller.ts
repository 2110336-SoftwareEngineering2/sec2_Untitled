import { Controller, Get, Post, Body, Response, Request, Param, UseGuards, Req, Header, Redirect } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';


@Controller()
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }
	
	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('owner')
    @Get('/reviewOwnerForm/:booking_id')
    async renderOwnerForm(@Response() res, @Req() req, @Param("booking_id") booking_id ){
		let book = await this.reviewService.findBooking(booking_id);
		console.log('This is booking',book)
		
		//await this.reviewService.setCurrentSitter(petsitter_id)
		let object = book.Booking.sitter;
		console.log('This is petsitter',object)
		//console.log(this.reviewService.getCurrentSitter())
		
		let reviewer = await this.reviewService.findOwner(req.user.id);
		console.log('This is petowner',reviewer)
		
		//let starStat  = await this.reviewService.calculateStarStat(petsitter_id);
		
		let endDate = book.Booking.endDate.toLocaleDateString() +' ' +book.Booking.endDate.toLocaleTimeString();
		let startDate = book.Booking.startDate.toLocaleDateString() +' ' +book.Booking.startDate.toLocaleTimeString();
		console.log('This is date', endDate)
        res.render('review/reviewForm1', {Booking: book.Booking ,petSitter: object, petOwner:reviewer.petOwner, SD:startDate, ED:endDate})
    }

	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('sitter')
    @Get('/reviewSitterForm/:booking_id')
    async renderSitterForm(@Response() res, @Req() req, @Param("booking_id") booking_id){
		let book = await this.reviewService.findBooking(booking_id);
		console.log('This is booking',book)
		
		//await this.reviewService.setCurrentSitter(petsitter_id)
		let object = book.Booking.owner;
		console.log('This is petowner',object)
		//console.log(this.reviewService.getCurrentSitter())
		
		let reviewer = await this.reviewService.findSitter(req.user.id);
		console.log('This is petsitter',reviewer)
		
		let endDate = book.Booking.endDate.toLocaleDateString() +' ' +book.Booking.endDate.toLocaleTimeString();
		let startDate = book.Booking.startDate.toLocaleDateString() +' ' +book.Booking.startDate.toLocaleTimeString();
		console.log('This is date', endDate)
        res.render('review/reviewFormS1', {Booking: book.Booking ,petOwner: object, petSitter:reviewer.petSitter, SD:startDate, ED:endDate})
    }
	
	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('owner')
	@Post('/reviewOwnerForm/finish/:booking_id')
	async ownerForm(@Response() res, @Body() dto, @Req() req, @Param("booking_id") booking_id){ 
		let book = await this.reviewService.findBooking(booking_id);
		let reviewer = await this.reviewService.findOwner(req.user.id);
		//console.log('This is user who do request',req.user)
		console.log('This is parameter',dto)
		console.log('petsitter id',book.Booking.sitter.id)
		//console.log(dto)
		res.render('review/reviewForm2',{petOwner:reviewer.petOwner})
		return await this.reviewService.saveOwnerReview(dto.stars, dto.feedback, req.user.id, book.Booking.sitter.id );
	}

	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('sitter')
	@Post('/reviewSitterForm/finish/:booking_id')
	async sitterForm(@Response() res, @Body() dto, @Req() req, @Param("booking_id") booking_id){ 
		let book = await this.reviewService.findBooking(booking_id);
		let reviewer = await this.reviewService.findSitter(req.user.id);
		//console.log('This is user who do request',req.user)
		console.log('This is parameter',dto)
		console.log('petowner id',book.Booking.owner.id)
		//console.log(dto)
		res.render('review/reviewFormS2',{petSitter:reviewer.petSitter})
		return await this.reviewService.saveSitterReview(dto.stars, dto.feedback, req.user.id, book.Booking.owner.id);
	}

	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('owner')

    @Post('/reviewOwnerForm/Report/:booking_id')
    async ownerReport(@Response() res, @Body() dto, @Req() req, @Param("booking_id") booking_id ){
		let book = await this.reviewService.findBooking(booking_id);
		console.log('This is parameter',dto)
		//let object = book.Booking.sitter;
		//let endDate = book.Booking.endDate.toLocaleDateString() +' ' +book.Booking.endDate.toLocaleTimeString();
		//let startDate = book.Booking.startDate.toLocaleDateString() +' ' +book.Booking.startDate.toLocaleTimeString();

		await this.reviewService.saveOwnerReport(req.user.id, book.Booking.sitter.id, dto.PoorOnService, dto.NotOnTime, dto.Impoliteness, dto.Other, dto.reportDescription);
        return res.redirect('/reviewOwnerForm/'+booking_id);
    }



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
		//console.log('This is review star :', starStat.avg_star);
		//let booking = await this.reviewService.findBookingFromReview(petsitter_id)
		//console.log("SITTER REVIEW PAGE");
        res.render('review/showSitterReviews', {reviews: object.reviews, petSitter: object.petSitter, user: user.petOwner, stat: starStat})
    }

	@UseGuards(JwtAuthGuard,RolesGuard)
	@Roles('sitter')
    @Get('/ownerReviews/:petowner_id')
    async renderOwnerReviews(@Response() res, @Request() req, @Param("petowner_id") petowner_id) {
		await this.reviewService.updateUserReviews(petowner_id);
		console.log(petowner_id, req.user.id);
        let object = await this.reviewService.handlePetOwnerReview(req.user.id, petowner_id);
        //console.log(object.reviews)
        let user = await this.reviewService.findSitter(req.user.id);
		//console.log('This is current user', user.petOwner)		
		let starStat  = await this.reviewService.calculateStarStat(petowner_id);
		//console.log('This is review star :', starStat.avg_star);
        res.render('review/showOwnerReviews', {reviews: object.reviews, petOwner: object.petOwner, user: user.petSitter, stat: starStat})
    }

}
