export class PetDto{
    type: string;
    name: string;
    gender: string;
    yearOfBirth: number;
    appearance: string;
    picUrl: string;

    public get age(): number { return this.age }
    public get fullGender(): string { return this.fullGender }
}