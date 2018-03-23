import Student from './student';
export default class Grade {
  static id = 1;
  constructor(course: string= '', grade: number= null, date: Date= new Date(), student: Student= new Student()) {
    this.id = (Grade.id++).toString();
    this.course = course;
    this.grade = grade;
    this.date = date;
    this.student = student;
  }
  id?: string;
  course: string;
  grade: number;
  date?: Date;
  student?: Student;
  get studentId() {
    return this.student.studentId;
  }
  get firstName() {
    return this.student.first_name;
  }

  get lastName() {
    return this.student.last_name;
  }
}
