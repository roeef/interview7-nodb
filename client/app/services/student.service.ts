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
    this.getDB().subscribe(value =>
      this.studDBChange.next(value)
    );
    for (const student of students) {
      const newS = new Student(student);
      // Object.assign(newS, student);
      // newS.date = new Date(newS.date);
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
  studDBChange: BehaviorSubject<Student[]> = new BehaviorSubject<Student[]>([]);
  studDataChangeAsValuesArray = this.studDBChange.map(x => Object.values(x));
  get studData(): Student[] { return this.studDBChange.value; }

  gradeDataChange: BehaviorSubject<Grade[]> = new BehaviorSubject<Grade[]>(this.grades);
  get gradeData(): Grade[] { return this.gradeDataChange.value; }
  set gradeData(i: Grade[]) {
    this.grades = i;
    this.gradeDataChange.next(this.grades);
  }
  private gradesPath = 'grades';
  private studentsPath = 'students';

  addOrUpdate(gradeData: Grade) {
    // If no dbId and no Face match
    for (const existing of this.studData) {
      if (existing.studentId === gradeData.studentId && !gradeData.student.dbId) {
        gradeData.student.dbId = existing.dbId;
      }
    }

    if (gradeData.student && gradeData.student.dbId) {
      if (gradeData.student.dbId !== '-1') {
        gradeData.student.dbId = '-1';
        this.afs.doc(this.studentsPath + '/' + gradeData.student.dbId).set(this.toPlainObjectDeepCopy(gradeData))
      } else if (!gradeData.student.dbId === ('-1')) {
        console.log('add new student to db');
      }
    }
    this.grades[gradeData.id] = gradeData;
    this.gradeDataChange.next(this.grades);
    const toPlainObjectDeepCopy = (gradeData: Grade) => {
      return JSON.parse(JSON.stringify(gradeData.student));
    };

    // TODO
    // if(!gradeData.student.dbId) {
    //   this.afs.collection(this.studentsPath).add(this.toPlainObjectDeepCopy(gradeData));
    // } else {
    //   this.afs.doc(this.studentsPath + '/' + gradeData.student.dbId).set(this.toPlainObjectDeepCopy(gradeData));
    // }

// console.log('addStudent Started');
// if (!this.students[gradeData.student.studentId]) {
//   this.students[gradeData.student.studentId] = gradeData.student;
//     // this.studDataChange.next(this.students);
//     // console.log(this.students);
//     // this.afs.collection(this.studentsPath).add(JSON.parse(JSON.stringify(gradeData.student))).then(() => {
//     //   console.log('addStudent Done');
//     // });
// } else {
//   Object.assign(this.students[gradeData.student.studentId], gradeData.student);
// }
// TODO this.studDataChange.next(this.students);
// console.log(this.students);
// this.afs.collection(this.studentsPath).add(JSON.parse(JSON.stringify(gradeData.student))).then(() => {
//   console.log('addStudent Done');
// });
// }
// this.students[gradeData.student.dbId].grades[gradeData.id] = gradeData;

// this.afs.collection(this.gradesPath).add(JSON.parse(JSON.stringify(gradeData))).then(() => {
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
    return this.getDB();
  }

  getDB() {
    return this.afs.collection(this.studentsPath, ref => ref.orderBy('studentId')).
    snapshotChanges().map( changes => {
      console.log('snapshotChanges');
      return changes.map(a => {

        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        // if (id != data.dbId) {
        //   data.dbId = id;
        //   this.afs.doc(this.studentsPath + '/' + id).set(data);
        // }
        return new Student({id, ...data});
      });
    });

  }


//   getFgetStudents {
//
// }
}
