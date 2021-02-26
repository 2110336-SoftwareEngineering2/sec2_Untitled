import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";

@Entity()
export class Employee {
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

    @Column({ length: 1 })
    gender: string;
}