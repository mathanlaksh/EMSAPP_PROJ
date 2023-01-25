export interface Employee {
    id:number;
    first_Name:string;
    last_Name:string;
    gender:string;
    dOB:string;
    emp_RollNo:string;
    designation:string;
    skill:string;
    certification:string;
    tot_Exp_In_Yrs:number;
    bio_Brief:string;
    temp_Addr:string;
    perm_Addr:string;
    email:string;
    phone:string;
    salary:number;
    inc_Percent:number;
    inc_Amt:number;
    profilePhoto?: File | null;
    }