import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { PetOwner } from "./petowner.entity";

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

    @Column({ type: "decimal", precision: 2, scale: 1 })
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

}