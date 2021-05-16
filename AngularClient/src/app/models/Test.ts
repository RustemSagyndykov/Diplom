import { TestQuestion } from './Testquestion';

export class Test{
    id:number;
    idForView:number;
    name: string;
    ownerId:string;
    subjectId: number;
    subjectName: string;
    amountTestQuestions: string;
    testQuestions: TestQuestion[];
}