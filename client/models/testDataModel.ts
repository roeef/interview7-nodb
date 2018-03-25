import Grade from './grade';


export default class TestData {
  studentId: number;
  first_name: string;
  last_name: string;
  date?: string;
  email: string;
  address: string;
  zip?: string;
  country?: string;
  grades: Object[] = [];
}
