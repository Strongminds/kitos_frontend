import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExcelExportService as APIExcelExportService } from 'src/app/api/v1';

export interface ExcelExportFile {
  blob: Blob;
  fileName: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExcelExportService {
  private basePath: string;

  constructor(
    private httpClient: HttpClient,
    @Optional() private apiExcelExportService?: APIExcelExportService,
  ) {
    // Get base path from API service configuration if available
    this.basePath = (apiExcelExportService as any)?.['configuration']?.basePath ?? '';
  }

  /**
   * Export Excel file for IT System Usage
   * @param systemUsageUuid - The IT System Usage UUID
   * @returns Observable with blob and filename extracted from Content-Disposition header
   */
  public exportITSystemUsageToExcel(systemUsageUuid: string): Observable<ExcelExportFile> {
    const url = `${this.basePath}/api/excel/it-system-usage/${systemUsageUuid}`;
    return this.exportExcelFromUrl(url);
  }

  /**
   * Export Excel file from a given URL
   * @param url - The full API endpoint URL to fetch the Excel file from
   * @returns Observable with blob and filename extracted from Content-Disposition header
   */
  public exportExcelFromUrl(url: string): Observable<ExcelExportFile> {
    return this.httpClient
      .get(url, {
        responseType: 'blob',
        observe: 'response',
        context: new HttpContext(),
      })
      .pipe(
        map((response: HttpResponse<Blob>) => {
          const fileName = this.extractFileNameFromResponse(response);
          return {
            blob: response.body || new Blob(),
            fileName,
          };
        }),
      );
  }

  /**
   * Extract filename from Content-Disposition header or return a default
   * @param response - HttpResponse with headers
   * @returns Extracted or default filename
   */
  private extractFileNameFromResponse(response: HttpResponse<Blob>): string {
    const contentDisposition = response.headers.get('Content-Disposition');
    if (contentDisposition) {
      return this.getFileNameFromContentDisposition(contentDisposition);
    }
    return this.getDefaultFileName();
  }

  /**
   * Parse filename from Content-Disposition header
   * Supports both RFC 5987 encoded and standard formats
   * @param contentDisposition - Content-Disposition header value
   * @returns Parsed filename or default
   */
  private getFileNameFromContentDisposition(contentDisposition: string): string {
    // Try RFC 5987 encoded format first: filename*=utf-8''encoded-name
    const matches = /filename\*=utf-8''([^"]+)/.exec(contentDisposition);
    if (matches) {
      return decodeURIComponent(matches[1]);
    }

    // Fall back to standard format: filename="name" or filename=name
    const fallbackMatches = /filename="?([^"]+)"?/.exec(contentDisposition);
    if (fallbackMatches) {
      return fallbackMatches[1];
    }

    return this.getDefaultFileName();
  }

  /**
   * Get default filename with current date
   * @returns Default filename
   */
  private getDefaultFileName(): string {
    return `export-${new Date().toISOString().split('T')[0]}.xlsx`;
  }
}
