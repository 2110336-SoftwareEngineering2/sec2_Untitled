import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { PetOwner } from "./petowner.entity";
import { PetSitter } from "./petsitter.entity";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    performerId: number;

    @Column()
    receiverId: number;

    @CreateDateColumn()
    createDatetime: Date;

    @Column({ length: 200 })
    description: string;
}