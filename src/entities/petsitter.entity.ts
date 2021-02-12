import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Booking } from "./booking.entity";
import { OwnerReview } from "./ownerreview.entity";
import { PetOwner } from "./petowner.entity";
import { SitterReview } from "./sitterreview.entity";

@Entity()
export class PetSitter {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 20 })
    username: string;

    @Column({ length: 120 })
    password: string;

    @Column({ length: 45 })
    fname: string;

    @Column({ length: 45 })
    lname: string;

    @CreateDateColumn()
    signUpDate: Date;

    @Column({ type: "decimal", nullable: true , precision: 2, scale: 1 })
    rating: number;

    @Column({ length: 1 })
    gender: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    priceRate: number;

    @Column({ length: 200 })
    location: string;

    @Column({ length: 45 })
    bank: string;

    @Column({ length: 10 })
    bankAccount: string;

    @OneToMany(type => Booking, booking => booking.sitter)
    booking: Booking;

    @OneToMany(type => OwnerReview, ownerreview => ownerreview.sitter)
    ownerreview: OwnerReview;

    @OneToMany(type => SitterReview, sitterreview => sitterreview.sitter)
    sitterreview: SitterReview;

    @Column({ length: 45 })
    locationName: string;

    @Column({ length: 200, nullable:true })
    picUrl: string;

    @Column({default:0})
    reviewerAmount : number;

    @Column( {length: 200 })
    description: string;

    @Column({ length: 200 })
    services: string;

    public get fullGender(): string {
        return this.gender == "F" ? "Female" : "Male"
    }

    public get fullName(): string {
        return this.fname + ' ' + this.lname
    }
}