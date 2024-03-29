import { Injectable, Res } from '@nestjs/common';
import {searchvalue} from './searchvalue.entity';
import {getRepository , Repository , getConnection , getManager} from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import {PetOwner,PetSitter, Booking, SitterAnimal} from 'src/entities'

@Injectable()
export class SearchService {
  
	
   constructor(
		
    	@InjectRepository(PetOwner) private readonly petOwnerRepo: Repository<PetOwner>
	,@InjectRepository(PetSitter) private readonly PetSitterRepo: Repository<PetSitter>
	,@InjectRepository(SitterAnimal) private readonly SitterAnimalRepo: Repository<SitterAnimal>
	,@InjectRepository(Booking) private readonly BookingRepo: Repository<Booking>
	){}	
  

	
  searchArray:searchvalue[]	= [] //Empty Array

  async renderSearch(@Res() res, ownerId: number){
	  let petOwner = await this.petOwnerRepo.findOne(ownerId)
	  return res.render('search/search', {
		  petOwner
	  })
  }

  async searchTodo( location : string ,  Pet_type : string , start_date : Date, end_date : Date){
	//console.log(`location : ${location},Pet_type : ${Pet_type} , start_date : ${start_date} , end_date : ${end_date}`)
	  const value = new searchvalue; //new entity
	  value.id = "1";
	  value.location = location;
	  value.Pet_type = Pet_type;
	  value.start_date = start_date;
	  value.end_date = end_date;
	  
	  this.searchArray.push(value)
	  
	  const searchAnswer = await this.FindPetSitterFromSearch(value.location,value.Pet_type,value.start_date,value.end_date);
	  console.dir(searchAnswer);
	  
  }
  
  async FindPetSitterFromSearch(location : string , Pet_type : string , start_date : Date , end_date : Date){
	  
	  //let search = await
	  const id = 2000023;
	  
	  //console.dir(location);
	  
	  //fetch Date and Type
	  const TypeTable =  await this.SitterAnimalRepo.createQueryBuilder("Sitter").where("Sitter.type = :Pet_type" , {Pet_type : Pet_type}).getMany();
	  //we have pet type with user id of petsitter now
	  //const DateTable = await this.BookingRepo.createQueryBuilder("Booking").where("Booking.start_date <=  :start_date" , {start_date : start_date}).andWhere("Booking.end_date >= :end_date", {end_date : end_date}).getMany();
	  
	//   const PetSitterRepo.createQueryBuilder("user").from("(" + TypeTable.getQuery() + ")", "TypeTable").setParameters(TypeTable.getParameters()).getRawMany();
	  
	  //console.dir(TypeTable);
	  
	  
   	  //not yet finish
	  

  }

  async searchPetSitter(location : string , type : string){
	const entityManager = getManager();
	if(type=='All') return await entityManager.query(`select distinct id,username,password,fname,lname,signUpDate,rating,gender,priceRate,location,bank,bankAccount,locationName,picUrl,reviewerAmount,description,services 
	from pet_sitter left join sitter_animal 
	on pet_sitter.id = sitter_animal.sitterId 
	where pet_sitter.location like '%${location}%'`);
	  
	return await entityManager.query(`select * from pet_sitter join sitter_animal 
	on pet_sitter.id = sitter_animal.sitterId 
	where pet_sitter.location like '%${location}%' and sitter_animal.type = '${type}'`);
  }
/*
  insertDataBooking(data) {
    const photo = new Photo();
    photo.name = data.name;
    photo.description = data.description;
    photo.filename = data.filename;
    photo.views = data.views;
    photo.isPublished = data.isPublished;
    this.photoRepository.save(photo);
  }	*/

  getSeachValue(){
	  return this.searchArray;
  }
	
}
