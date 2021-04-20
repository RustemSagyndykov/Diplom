import { TestQuestion } from './Testquestion';

export class Test{
    id:number;
    idForView:number;
    name: string;
    ownerId:string;
    testQuestions: TestQuestion[];
}