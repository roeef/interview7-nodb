import Grade from './grade';


export default class Student {
  static count = 1;
  constructor(studentId: string= null, first_name: string= '', last_name: string= '', date: Date = null, email: string = '',
              address: string= '', zip: string= '', country: string= '', grades: Grade[]= []) {
    this.dbId = (Student.count++).toString();
    this.studentId = studentId;
    this.first_name = first_name;
    this.last_name = last_name;
    this.date = date;
    this.email = email;
    this.address = address;
    this.zip = zip;
    this.country = country;
    // this.grades = grades;
  }
  dbId?: string;
  studentId: string;
  first_name: string;
  last_name: string;
  date?: Date = new Date();
  email: string;
  address: string;
  zip?: string;
  country?: string;
  // grades: Grade[] = [];
}
