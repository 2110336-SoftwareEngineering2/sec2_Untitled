import * as dayjs from "dayjs";
import { PetSitter } from "src/entities/petsitter.entity";
import { SitterReview } from "src/entities/sitterreview.entity";

type sitterReview = {
    owner: {
        id: number,
        fname: string,
        lname: string,
        picUrl: string,
    },
    description: string,
    rating: number
}

export class BookPetSitterDto {
    id: number;
    fname: string;
    lname: string;
    signUpDate: Date;
    rating: number;
    gender: string;
    priceRate: number;
    location: string;
    picUrl: string;
    description: string;
    reviews: sitterReview[];
    services: string[]

    exp: {
        value: number,
        unit: string
    }
    fullName: string;
    fullGender: string;

    constructor(ps: PetSitter, reviews: SitterReview[]){
        // assign everything
        Object.assign(this, ps)

        // calculate year of experience
        let now = dayjs()
        let exp_y = now.diff(ps.signUpDate, "year")
        let exp_m = now.diff(ps.signUpDate, "month")
        if(exp_y > 1) this.exp = {value: exp_y, unit: "years"}
        else if(exp_y == 1) this.exp = {value: exp_y, unit: "year"}
        else if(exp_m > 1) this.exp = {value: exp_m, unit: "months"}
        else if(exp_m == 1) this.exp = {value: exp_m, unit: "month"}
        else this.exp = {value: -1, unit: "month"} // less than a month

        this.reviews = reviews // assign reviews
        this.services = ps.services == null ? [] : ps.services.split(', ').slice(0, -1) // assign services

        this.fullName = ps.fullName
        this.fullGender = ps.fullGender
    }
}