import { PDFDocument } from 'pdf-lib';
import type { SavedReport } from '../../core/domain/models';
import { stepLabel } from '../../core/domain/models';
import { messages } from '../../core/i18n';
import { digest } from '../../core/files/integrity';
import { MAX_FILE_BYTES, checkPdfPages } from '../../core/files/limits';
import { PdfService, inspectPdf } from '../../core/pdf/pdf-service';
import type { ProjectService } from '../steps/step-service';
export class ReportService {
  constructor(
    private log: ProjectService,
    private pdf: PdfService,
  ) {}
  createReport(
    projectId: string,
    stepId: string | null,
    full: boolean,
  ): Promise<SavedReport> {
    return this.log.queue.run(async () => {
      const data = await this.log.repository.snapshot();
      const record = data.projects.find((r) => r.id === projectId);
      if (!record) throw new Error(messages.reportContent.noProject);
      const entries = data.steps.filter(
        (e) => e.projectId === projectId && (!stepId || e.id === stepId),
      );
      if (stepId && !entries.length)
        throw new Error(messages.reportContent.noStep);
      if (!entries.length) throw new Error(messages.reportContent.noSteps);
      const createdAt = this.log.env.now();
      const bytes = await this.pdf.create(record, entries, full, {
        kind: stepId ? 'single' : 'history',
        createdAt,
      });
      const source = await inspectPdf(bytes);
      // A multipart file reserves one of its 100 pages for its own cover.
      const partCount =
        source.getPageCount() <= 100
          ? 1
          : Math.ceil(source.getPageCount() / 99);
      checkPdfPages(
        source.getPageCount() + (partCount > 1 ? partCount : 0),
        true,
      );
      const groupId = partCount > 1 ? this.log.env.id() : undefined;
      const files: string[] = [],
        reports: SavedReport[] = [];
      try {
        for (let index = 0; index < partCount; index++) {
          let part = bytes;
          if (partCount > 1) {
            const document = await PDFDocument.create();
            await this.pdf.addPartCover(
              document,
              record,
              index + 1,
              partCount,
              createdAt,
            );
            const indices = source
              .getPageIndices()
              .slice(index * 99, (index + 1) * 99);
            for (const page of await document.copyPages(source, indices))
              document.addPage(page);
            part = await document.save();
          }
          if (part.length > MAX_FILE_BYTES)
            throw new Error(
              'Der Protokollteil überschreitet die Grenze von 50 MB.',
            );
          const file = await this.log.vault.put(part, 'pdf');
          files.push(file);
          reports.push({
            id: this.log.env.id(),
            projectId,
            stepId,
            name: `${record.name.slice(0, 200)} · ${stepId ? 'Einzelprotokoll' : 'Bauverlaufsprotokoll'} · ${full ? messages.reportContent.withPhotoLabel : messages.reportContent.withoutPhotoLabel}${partCount > 1 ? ` · Teil ${index + 1} von ${partCount}` : ''}`,
            file,
            sha256: digest(part),
            size: part.length,
            summary: stepId
              ? stepLabel(entries[0]!).slice(0, 500)
              : `${entries.length} Bauschritte`,
            createdAt,
            full,
            ...(groupId ? { groupId, partIndex: index + 1, partCount } : {}),
          });
        }
        // Every part is prepared before a single transaction publishes the group.
        await this.log.repository.saveReports(reports);
        return reports[0]!;
      } catch (error) {
        await this.log.cleanup(files);
        throw error;
      }
    });
  }
}
