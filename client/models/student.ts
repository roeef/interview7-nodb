import Grade from './grade';

const defaultStudent = {studentId: null, first_name: '', last_name: '', date: null, email: '',
  address: '', zip: '', country: '', grades: [], dbId: null, id: null }
export default class Student {
  static count = 1;
  constructor(param?) {
    if (!param) {param = defaultStudent; }
    this.dbId = param.dbId;
    this.studentId = param.studentId;
    this.first_name = param.first_name;
    this.last_name = param.last_name;
    this.date = new Date(param.date);
    this.email = param.email;
    this.address = param.address;
    this.zip = param.zip;
    this.country = param.country;
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
}
