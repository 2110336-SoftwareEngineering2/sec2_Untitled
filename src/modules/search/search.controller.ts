import { Controller , Post , Get , Body , Delete , Param , Response, Res, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import {SearchService} from './search.service';
import { Roles } from 'src/common/decorators/roles.decorator';

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
	@UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('owner')
	renderSearch(@Res() res, @Req() req){
		return this.searchservice.renderSearch(res, req.user.id)
	}

	@Get('result')
	renderSearchResult(@Res() res){
		return res.render('search/searchResult')
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
