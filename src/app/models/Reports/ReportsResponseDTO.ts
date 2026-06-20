export type ReportFormat = 'pdf' | 'excel';
export type ReportTypeId = 'products' | 'movements' | 'sales' | 'low-stock';

export interface ProductsReportFilter {
  includeInactive?: boolean;
  sortBy: 'name' | 'stock' | 'price';
  format: ReportFormat;
}

export interface MovementsReportFilter {
  dateFrom: string; // 'yyyy-MM-dd'
  dateTo: string;
  movementType?: 'all' | 'IN' | 'OUT';
  format: ReportFormat;
}

export interface SalesReportFilter {
  dateFrom: string;
  dateTo: string;
  includeMetrics?: boolean;
  format: ReportFormat;
}

export interface LowStockReportFilter {
  threshold?: 'default' | '5' | '10' | '20';
  format: ReportFormat;
}
