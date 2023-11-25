

import { BillingSalesReportsByProduct } from '@/domains/billing-sales-reports-by-product/entities';
import { ReportDefaultPresenter } from '@/domains/billing-sales-reports-by-product/interface/presenters';

export class ReportTransformers {
  static generateDefaultPresenter(Report: Pick<BillingSalesReportsByProduct, 'csvPath'>): ReportDefaultPresenter {
    return {
      csvPath: Report.csvPath,
    };
  }
}
