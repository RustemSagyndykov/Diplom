import { LectureFile } from "./LectureFile";

export class Lecture {
    id: number;
    name: string;
    content: string;
    ownerId: string;
    ownerName: string;
    testId: number;
    testName: string;
    subjectId: number;
    subjectName: string;
    practiceId: number;
    practiceName: string;
    lectureFiles:LectureFile[];
}
