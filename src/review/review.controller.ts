import { Controller, Get, Response } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Get()
    renderReview(@Response() res): any {
        res.render('review/reviewTest')
    }
}
