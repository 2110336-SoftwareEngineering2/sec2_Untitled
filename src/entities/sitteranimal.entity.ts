import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, PrimaryColumn } from "typeorm";
import { PetSitter } from "./petsitter.entity";

@Entity()
export class SitterAnimal {
    @PrimaryColumn({length:45})
    type: string;

    @PrimaryColumn()
    sitterId: number;

    @ManyToOne(type => PetSitter, sitter => sitter.booking, { nullable: false })
    sitter: PetSitter;
}