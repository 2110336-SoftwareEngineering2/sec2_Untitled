import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Pet } from "./pet.entity";
import { PetOwner } from "./petowner.entity";
import { PetSitter } from "./petsitter.entity";

export enum Status {
    Requesting = 'Requesting',
    Pending = 'Pending',
    Paid = 'Paid',
    Denied = 'Denied',
    Finished = 'Finished'
}

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price: number;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column('enum', { enum: Status })
    status: Status;

    @ManyToOne(type => PetOwner, owner => owner.booking, { nullable: false })
    owner: PetOwner;

    @ManyToOne(type => Pet, pet => pet.booking, { nullable: false })
    pet: Pet;

    @ManyToOne(type => PetSitter, sitter => sitter.booking, { nullable: false })
    sitter: PetSitter;

    @UpdateDateColumn()
    public lastModified: Date;
}