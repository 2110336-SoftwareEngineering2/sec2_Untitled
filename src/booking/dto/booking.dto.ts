import { Status } from "src/entities/booking.entity";
import { Pet } from "src/entities/pet.entity";
import { PetOwner } from "src/entities/petowner.entity";
import { PetSitter } from "src/entities/petsitter.entity";

export class IncomingBookingDto {
    startDate: string;
    endDate: string;
    sitter: number;
    pet: number;
}

// export class RequestingBookingDto{
//     startDate: Date;
//     endDate: Date;
//     status: Status;
//     price: number;
//     sitter: PetSitter;
//     pet: Pet;
//     owner: PetOwner;
// }