import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Pet } from "./pet.entity";
import { PetSitter } from "./petsitter.entity";

@Entity()
export class PetOwner {
    @PrimaryGeneratedColumn() 
        id: number;

    @Column({ length: 20, nullable: false})
        username: string;

    @Column({ length: 120, nullable: false})
        password: string;

    @Column({ length: 45, nullable: false})
        fname: string;

    @Column({ length: 45, nullable: false})
        lname: string;

    @CreateDateColumn()
        signUpDate: Date;

    @Column({ type: "decimal", nullable: true, precision: 2, scale: 1 })
        rating: number;

    @Column({ nullable: true, length: 1 })
        gender: string;
    
    @OneToMany(type => Pet, pet => pet.owner)
        pet: Pet;
}