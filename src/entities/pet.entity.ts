import * as dayjs from "dayjs";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { Booking } from "./booking.entity";
import { PetOwner } from "./petowner.entity";

@Entity()
export class Pet {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => PetOwner, owner => owner.pet, { nullable: false })
    owner: number;

    @Column({ length: 45 })
    type: string;

    @Column({ length: 45, nullable: false })
    name: string;

    @Column({ length: 1 })
    gender: string;

    @Column({ type: "int" })
    yearOfBirth: number;

    @Column({ length: 200 })
    appearance: string;

    @OneToMany(type => Booking, booking => booking.pet)
    booking: Booking;

    @Column({ length: 200, nullable:true })
    picUrl: string;

    public get age(): number {
        let now = dayjs()
        let yob = dayjs().year(this.yearOfBirth)
        return now.diff(yob, "year")
    }
    public get fullGender(): string {
        return this.gender == "F" ? "Female" : "Male"
    }

    @UpdateDateColumn()
    public lastModified: Date;
}