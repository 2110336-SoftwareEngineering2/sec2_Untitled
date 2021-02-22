import { Injectable, Res } from '@nestjs/common';
import {searchvalue} from './searchvalue.entity';

import {getRepository , Repository , getConnection , getManager} from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { PetOwner } from 'src/entities/petowner.entity';
import { PetSitter } from 'src/entities/petsitter.entity';
import { Booking } from 'src/entities/booking.entity';
import { SitterAnimal } from 'src/entities/sitteranimal.entity';

//import {getConnection} from "typeorm";

@Injectable()
export class SearchService {
  
	
   constructor(
        @InjectRepository(PetOwner) private readonly petOwnerRepo: Repository<PetOwner>
	,@InjectRepository(PetSitter) private readonly PetSitterRepo: Repository<PetSitter>
	,@InjectRepository(SitterAnimal) private readonly SitterAnimalRepo: Repository<SitterAnimal>
	,@InjectRepository(Booking) private readonly BookingRepo: Repository<Booking>){}	

  getHello(): string {
    return 'Hello World!';
  }
  

	
  searchArray:searchvalue[]	= [] //Empty Array

  async renderSearch(@Res() res, ownerId: number){
	  let pet_owner = await this.petOwnerRepo.findOne(ownerId)
	  return res.render('search/search', {
		  pet_owner: pet_owner
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
