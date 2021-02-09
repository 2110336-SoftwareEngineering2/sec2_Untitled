import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { PetOwner } from "./petowner.entity";
import { PetSitter } from "./petsitter.entity";

@Entity()
export class OwnerReview{
    @PrimaryGeneratedColumn()
        id:number;

    @Column({ type: "decimal", precision: 2, scale: 1 })
        rating: number;

    @Column({ length: 120})
        description: string;

    @ManyToOne(type => PetOwner, owner => owner.booking,{nullable:false})
        owner: PetOwner;

    @ManyToOne(type => PetSitter, sitter => sitter.booking,{nullable:false})
        sitter: PetSitter;
        
}