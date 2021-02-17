import { Controller, Get, Response } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller()
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Get('/review')
    renderReview(@Response() res): any {
        res.render('review/reviewTest')
    }

    @Get('/test')
    renderUserReviews(@Response() res): any {
        res.render('review/reviewAndRating')
    }
}
