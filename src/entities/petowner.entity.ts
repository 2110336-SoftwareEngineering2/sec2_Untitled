import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Booking } from "./booking.entity";
import { OwnerReview } from "./ownerreview.entity";
import { Pet } from "./pet.entity";
import { PetSitter } from "./petsitter.entity";
import { SitterReview } from "./sitterreview.entity";

@Entity()
export class PetOwner {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 20, nullable: false })
    username: string;

    @Column({ length: 120, nullable: false })
    password: string;

    @Column({ length: 45, nullable: false })
    fname: string;

    @Column({ length: 45, nullable: false })
    lname: string;

    @CreateDateColumn()
    signUpDate: Date;

    @Column({ type: "decimal", nullable: true, precision: 2, scale: 1 })
    rating: number;

    @Column({ nullable: true, length: 1 })
    gender: string;

    @OneToMany(type => Pet, pet => pet.owner)
    pet: Pet;

    @OneToMany(type => Booking, booking => booking.owner)
    booking: Booking;

    @OneToMany(type => OwnerReview, ownerreview => ownerreview.owner)
    ownerreview: OwnerReview;

    @OneToMany(type => SitterReview, sitterreview => sitterreview.owner)
    sitterreview: SitterReview;

    @Column({default:0})
    reviewerAmount: number;

    @Column({ length: 200, nullable:true })
    picUrl: string;

    public get fullGender(): string {
        return this.gender == "F" ? "Female" : "Male"
    }

    public get fullName(): string {
        return this.fname + ' ' + this.lname
    }
}