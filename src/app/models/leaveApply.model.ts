export interface LeaveApply {
    empId: number,
    leaveId : number,
    leaveTypeId: number,
    fromDate:string,
    toDate: string,
    status: string,
    remarks: string,
    no_of_leave_taken: number, 
    no_of_availedLeave:number,   
    leaveType?:string
    max_limit: number,
    isHalfDay?: boolean,
    isHalfDayValue?:string,
    lv_approver?: any[]
}
