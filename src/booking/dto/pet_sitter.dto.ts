export class BookPetSitterDto {
    id: number;
    fname: string;
    lname: string;
    signUpDate: Date;
    rating: number;
    gender: string;
    priceRate: number;
    location: string;
    picUrl: string;
    description: string;

    public get fullName(): string { return this.fullName }
    public get fullGender(): string { return this.fullGender }
}