import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { PetOwner } from "./petowner.entity";
import { PetSitter } from "./petsitter.entity";

export enum reportStatus {
    Requesting = 'Requesting',
    Cancelled = 'Cancelled',
    Cleared = 'Cleared',
}

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    reporter: number;

    @Column()
    suspect: number;

    @Column('enum', { enum: reportStatus })
    status: reportStatus;

    @CreateDateColumn()
    createDatetime: Date;

    @Column({type:'boolean'})
    poorOnService:boolean;

    @Column({type:'boolean'})
    notOnTime:boolean;   
    
    @Column({type:'boolean'})
    impoliteness:boolean;

    @Column({type:'boolean'})
    other:boolean;

    @Column({ length: 200 })
    description: string;
}