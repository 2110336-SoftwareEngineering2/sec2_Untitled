import { Controller , Post , Get , Body , Delete , Param , Response, Res } from '@nestjs/common';

import {SearchService} from './search.service';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { Booking } from 'src/entities/booking.entity';


@Controller('search')
export class SearchController {
	
	constructor (private searchservice : SearchService){}//เดี๋ยวจะมีคนส่ง object เข้ามาให้ใช้งาน
	
	// @Get()
	// getSearch(){
	// 	return this.searchservice.getSeachValue()
	// }
	// @Post()
	// searchTodo(@Body("location") location : string , @Body("Pet_type") Pet_type : string , @Body("start_date") start_date :Date , @Body("end_date") end_date : Date){
	// 	this.searchservice.searchTodo(location,Pet_type,start_date ,end_date)
	// 	return this.searchservice.getSeachValue()
	// }
	
	@Get()
	renderSearch(@Res() res){
		return this.searchservice.renderSearch(res)
	}

	@Get('result')
	renderSearchResult(@Res() res){
		return res.render('search/search-result')
	}


	@Post()
	searchTodo(@Body() body){
		const {location, Pet_type, start_date, end_date} = body		
		this.searchservice.searchTodo(location,Pet_type,start_date ,end_date)
		return this.searchservice.getSeachValue()
	}



	//for update delete
	@Delete(":/id")
	deleteTodoById(@Param("id") id : string){
		console.log(`id : ${id}`)
		return `id is ${id}`
	}

	@Post('/petsitter')
	test(@Body("location") location : string , @Body("type") type : string){
		return this.searchservice.searchPetSitter(location,type)
	}
}
