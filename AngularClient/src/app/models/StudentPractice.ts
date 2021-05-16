import { StudentPracticeFile } from "./StudentPracticeFile";

export class StudentPractice{
    id: number;
    practiceId: number;
    practiceName: string;
    studentId: string;
    studentFullName: string;
    subjectName: string;
    practiceScore: number;
    isAccept: boolean;
    isRevision: boolean;
    studentPracticeFiles: StudentPracticeFile[];
}