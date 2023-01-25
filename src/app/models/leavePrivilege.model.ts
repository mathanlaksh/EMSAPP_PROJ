export interface LeavePrivilege {
    userId: number,
    empId:number,
    leaveTypeId: number,
    no_of_lv_assigned: number, 
    description: string,
    leaveType?:string
}
