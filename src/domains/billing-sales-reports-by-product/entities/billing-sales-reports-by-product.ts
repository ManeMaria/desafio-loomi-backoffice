// Uncomment the next lines if you need
/*
* import {
*   EntityIncludedIntoClient,
* } from '@/domains/client/entities';
*/

export type BillingSalesReportsByProductParams = {
  id: string;
  csvPath: string;
  startDate: Date;
  endDate: Date;
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

}

export class BillingSalesReportsByProduct {
  id: string;
  csvPath: string;
  startDate: Date;
  endDate: Date;
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(clientParams: BillingSalesReportsByProductParams) {
    const {
      id,
      csvPath,
      startDate,
      endDate,
      enabled,
      createdAt,
      updatedAt,
    } = clientParams;

    this.id = id;
    this.csvPath = csvPath;
    this.startDate = startDate;
    this.endDate = endDate;
    this.enabled = enabled;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    Object.freeze(this);
  }
}
