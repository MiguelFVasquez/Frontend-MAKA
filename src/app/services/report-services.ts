import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import {ProductsReportFilter} from '../models/Reports/ReportsResponseDTO';
import {MovementsReportFilter} from '../models/Reports/ReportsResponseDTO';
import {SalesReportFilter} from '../models/Reports/ReportsResponseDTO';
import {LowStockReportFilter} from '../models/Reports/ReportsResponseDTO';
import {ReportFormat, ReportTypeId} from '../models/Reports/ReportsResponseDTO';  
interface ApiResponse<T> {
  error: boolean;
  respuesta: T;
}

@Injectable({
  providedIn: 'root',
})
export class Report {
  private apiUrl = environment.apiUrl + '/reports';

  constructor(private http: HttpClient) {}

  /**
   * ⚠️ Apuntaba a GET /reports/gains, que ya no existe en el controller actual
   * (esa lógica quedó dentro de /reports/sales con includeMetrics=true).
   * Si nada más en el front lo consume, se puede eliminar.
   */
  getGains(): Observable<number> {
    return this.http
      .get<ApiResponse<any>>(`${this.apiUrl}/gains`)
      .pipe(map((response) => response.respuesta));
  }

  // ---------- Reportes descargables (PDF/Excel) ----------

  getProductsReport(filter: ProductsReportFilter): Observable<HttpResponse<Blob>> {
    const params = new HttpParams()
      .set('includeInactive', String(filter.includeInactive ?? false))
      .set('sortBy', filter.sortBy)
      .set('format', filter.format);

    return this.http.get(`${this.apiUrl}/products`, {
      params,
      responseType: 'blob',
      observe: 'response',
    });
  }

  getMovementsReport(filter: MovementsReportFilter): Observable<HttpResponse<Blob>> {
    const params = new HttpParams()
      .set('dateFrom', filter.dateFrom)
      .set('dateTo', filter.dateTo)
      .set('movementType', filter.movementType ?? 'all')
      .set('format', filter.format);

    return this.http.get(`${this.apiUrl}/movements`, {
      params,
      responseType: 'blob',
      observe: 'response',
    });
  }

  getSalesReport(filter: SalesReportFilter): Observable<HttpResponse<Blob>> {
    const params = new HttpParams()
      .set('dateFrom', filter.dateFrom)
      .set('dateTo', filter.dateTo)
      .set('includeMetrics', String(filter.includeMetrics ?? false))
      .set('format', filter.format);

    return this.http.get(`${this.apiUrl}/sales`, {
      params,
      responseType: 'blob',
      observe: 'response',
    });
  }

  getLowStockReport(filter: LowStockReportFilter): Observable<HttpResponse<Blob>> {
    const params = new HttpParams()
      .set('threshold', filter.threshold ?? 'default')
      .set('format', filter.format);

    return this.http.get(`${this.apiUrl}/low-stock`, {
      params,
      responseType: 'blob',
      observe: 'response',
    });
  }

  /**
   * Dispatcher genérico: recibe el id del reportConfig actual y el form.value
   * tal cual los expone el componente, y llama al endpoint correcto.
   */
  generateReport(type: ReportTypeId, formValue: any): Observable<HttpResponse<Blob>> {
    switch (type) {
      case 'products':
        return this.getProductsReport(formValue as ProductsReportFilter);
      case 'movements':
        return this.getMovementsReport(formValue as MovementsReportFilter);
      case 'sales':
        return this.getSalesReport(formValue as SalesReportFilter);
      case 'low-stock':
        return this.getLowStockReport(formValue as LowStockReportFilter);
      default:
        throw new Error(`Tipo de reporte no soportado: ${type}`);
    }
  }

  /**
   * Dispara la descarga en el navegador a partir de la respuesta del backend.
   * Usa el filename del header Content-Disposition si está disponible;
   * si no (p. ej. por CORS sin Access-Control-Expose-Headers), usa fallbackName.
   */
  downloadFile(response: HttpResponse<Blob>, fallbackName: string): void {
    const blob = response.body;
    if (!blob) return;

    const filename = this.extractFilename(response) ?? fallbackName;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private extractFilename(response: HttpResponse<Blob>): string | null {
    const disposition = response.headers.get('content-disposition');
    if (!disposition) return null;
    const match = disposition.match(/filename="?([^"]+)"?/);
    return match ? match[1] : null;
  }
}