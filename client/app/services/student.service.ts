import {Injectable, OnInit} from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import Grade from '../../models/grade';
import Student from '../../models/student';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {students} from '../../models/mock.data';


@Injectable()
export class StudentService {
  grades: Grade[] = [];
  students: Student[] = [];
  constructor(private afs: AngularFirestore) {
    for (const student of students) {
      const newS = new Student();
      Object.assign(newS, student);
      newS.date = new Date(newS.date);
      // newS.grades = [];
      for (const g of student.grades) {
        const newG = new Grade();
        Object.assign(newG, g);
        newG.date = new Date(newG.date);
        newG.student = newS;
        this.addOrUpdate(newG);
      }
    }
  }


  /** Stream that emits whenever the data has been modified. */
  studDataChange: BehaviorSubject<Student[]> = new BehaviorSubject<Student[]>([]);
  studDataChangeAsArray = this.studDataChange.map(x => Object.values(x));
  get studData(): Student[] { return this.studDataChange.value; }

  gradeDataChange: BehaviorSubject<Grade[]> = new BehaviorSubject<Grade[]>(this.grades);
  get gradeData(): Grade[] { return this.gradeDataChange.value; }
  set gradeData(i: Grade[]) {
    this.grades = i;
    this.gradeDataChange.next(this.grades);
  }
  private gradesPath = 'grades';
  private studentsPath = 'students';

  addOrUpdate(gradeData: Grade) {
    console.log('addStudent Started');
    if (!this.students[gradeData.student.studentId]) {
      this.students[gradeData.student.studentId] = gradeData.student;
    } else {
      Object.assign(this.students[gradeData.student.studentId], gradeData.student);
    }
      this.studDataChange.next(this.students);
      console.log(this.students);

    this.grades[gradeData.id] = gradeData;
    this.gradeDataChange.next(this.grades);
  }


  private getDbObjectFormat(studentData: Grade) {
    return {
      grade: studentData.grade,
      course: studentData.course, date: studentData.date,
      studentId: studentData.studentId, firstName: studentData.firstName,
      lastName: studentData.lastName
    };
  }

  remove(id: string): Promise<void> {
    return new Promise<void>(resolve => {
      const gradeToRemove = this.getGradeById(id);
      console.log('going to delete', gradeToRemove);
      this.grades.splice(this.grades.indexOf(gradeToRemove), 1);
      this.gradeDataChange.next(this.grades);
      resolve();
    });
  }

  private getGradeById(id: string) {
    for (let grade of this.grades) {
      if (grade && grade.id === id) { return grade; }
    }
  }

  getGrades() {
    return this.gradeDataChange;
  }
  getStudents() {
    return this.studDataChange;
  }
}
