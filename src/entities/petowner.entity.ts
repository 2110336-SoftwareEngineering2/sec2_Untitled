import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PetOwner {
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
    @Column()
        signUpDate: Date;
    @Column({ type: "decimal", nullable: true, precision: 2, scale: 1 })
        rating: number;
    @Column({ nullable: true, length: 1 })
        gender: string
}