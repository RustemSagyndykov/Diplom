import { TestQuestionAnswer } from "./TestQuestionAnswer";

export class TestQuestion{
    id:number;
    idForView:number;
    name: string;
    testId:number;
    testQuestionAnswer: TestQuestionAnswer[];
}