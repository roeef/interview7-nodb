import {Injectable, OnInit} from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import Grade from '../../models/grade';
import Student from '../../models/student';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {students} from "../../models/mock.data";


@Injectable()
export class StudentService {
  grades: Grade[] = [];
  students: Student[] = [];
  constructor(private afs: AngularFirestore) {
    // For generating Mocks for dev test usage you run a few:
    // for (let i = 0; i < 100; i++) { this.addUser(); }
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
      this.studDataChange.next(this.students);
    }
    // this.students[gradeData.student.dbId].grades[gradeData.id] = gradeData;

    this.grades[gradeData.id] = gradeData;
    this.gradeDataChange.next(this.grades);
    // this.afs.collection(this.gradesPath).add(this.getDbObjectFormat(gradeData)).then(() => {
    //   console.log('addStudent Done');
    // });
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
      this.grades.splice(this.grades.indexOf(this.grades[id]), 1);
      this.gradeDataChange.next(this.grades);
      resolve();
    });
    // return this.afs.doc(`${this.gradesPath}/${id}`).delete();
  }

  getGrades() {
    return this.gradeDataChange;
    // return this.afs.collection(this.gradesPath, ref => ref.orderBy('studentId')).
    // snapshotChanges().map( changes => {
    //   console.log('snapshotChanges');
    //   return changes.map(a => {
    //     const data = a.payload.doc.data();
    //     const id = a.payload.doc.id;
    //     return {id, ...data};
    //   });
    // });
  }
  getStudents() {
    return this.studDataChange;
  }
}
