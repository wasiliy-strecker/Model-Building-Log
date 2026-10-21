import type { SavedReport } from '../domain/models';
import type { ProjectService } from '../../features/steps/step-service';
import type { ModelLogNative, PdfSession } from '../native/model-native';
import { verifiedFile } from '../files/integrity';
import { messages } from '../i18n';
export type OpenPdf = SavedReport & {
  uri: string;
  preview: PdfSession;
  parts: SavedReport[];
};
export class PdfViewerService {
  constructor(
    private log: ProjectService,
    private native: ModelLogNative,
  ) {}
  async open(id: string): Promise<OpenPdf> {
    const data = await this.log.repository.snapshot();
    const report = data.reports.find((r) => r.id === id);
    if (!report) throw new Error(messages.reportContent.missingPdf);
    await verifiedFile(this.log.vault, report);
    const uri = this.log.vault.uri(report.file);
    return {
      ...report,
      uri,
      preview: await this.native.openPdfPreview(uri),
      parts: report.groupId
        ? data.reports
            .filter((r) => r.groupId === report.groupId)
            .sort((a, b) => a.partIndex! - b.partIndex!)
        : [report],
    };
  }
  page(pdf: OpenPdf, index: number, width: number) {
    return this.native.renderPdfPage(pdf.preview.session, index, width);
  }
  close(pdf: OpenPdf) {
    return this.native.closePdfPreview(pdf.preview.session);
  }
  async print(pdf: OpenPdf) {
    await verifiedFile(this.log.vault, pdf);
    await this.native.printPdf(pdf.uri, pdf.name + '.pdf');
  }
  async share(reports: SavedReport[]) {
    for (const report of reports) await verifiedFile(this.log.vault, report);
    await this.native.sharePdfs(reports.map((r) => this.log.vault.uri(r.file)));
  }
}
