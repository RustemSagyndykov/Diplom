import { LectureFile } from "./LectureFile";

export class Lecture {
    id:number;
    name: string;
    content: string;
    ownerId:string;
    lectureFiles:LectureFile[];
}
