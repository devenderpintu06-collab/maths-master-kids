import { jsPDF } from 'jspdf';
import type { AppLanguage, MathOperation } from '../data/mathsMaster';
import type { MathWorksheet } from '../data/worksheets';

const OP_LABELS: Record<MathOperation, { en: string; hi: string }> = {
  ADDITION: { en: 'Addition', hi: 'जोड़' },
  SUBTRACTION: { en: 'Subtraction', hi: 'घटाव' },
  MULTIPLICATION: { en: 'Multiplication', hi: 'गुणा' },
  DIVISION: { en: 'Division', hi: 'भाग' },
};

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export async function downloadWorksheetPdf(
  worksheet: MathWorksheet,
  lang: AppLanguage
): Promise<void> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Proceed cleanly with system fallback fonts if font readiness throws
    }
  }

  const isHi = lang === 'hi';
  // A4 Portrait at 200 DPI (210mm x 297mm)
  const W = 1654;
  const H = 2339;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not initialize 2D canvas for PDF generation');
  }

  const sansFont = '"Plus Jakarta Sans", "Noto Sans Devanagari", system-ui, sans-serif';
  const mathFont = '"JetBrains Mono", "Plus Jakarta Sans", ui-monospace, monospace';

  // Pure white A4 page background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  // Clean printable outer frame
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, 64, 60, W - 128, H - 120, 18);
  ctx.stroke();

  // Brand Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1E3A8A';
  ctx.font = `800 44px ${sansFont}`;
  ctx.fillText('Maths Master Kids (mathsmasterkids.in)', W / 2, 128);

  const opLabel = isHi
    ? OP_LABELS[worksheet.operation].hi
    : OP_LABELS[worksheet.operation].en;

  ctx.fillStyle = '#0F172A';
  ctx.font = `700 28px ${sansFont}`;
  ctx.fillText(
    isHi
      ? `कक्षा ${worksheet.classNumber} · ${opLabel} (${worksheet.symbol}) · वर्कशीट ${worksheet.worksheetNumber}`
      : `Class ${worksheet.classNumber} · ${opLabel} (${worksheet.symbol}) · Worksheet ${worksheet.worksheetNumber}`,
    W / 2,
    176
  );

  ctx.fillStyle = '#475569';
  ctx.font = `500 21px ${sansFont}`;
  ctx.fillText(isHi ? worksheet.focusHi : worksheet.focusEn, W / 2, 212);

  // Header divider
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(92, 236);
  ctx.lineTo(W - 92, 236);
  ctx.stroke();

  // Student Details Strip
  ctx.fillStyle = '#F8FAFC';
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 92, 256, W - 184, 88, 12);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#0F172A';
  ctx.font = `700 22px ${sansFont}`;
  if (isHi) {
    ctx.fillText('विद्यार्थी का नाम: ___________________', 116, 308);
    ctx.fillText('कक्षा: _______', 660, 308);
    ctx.fillText('दिनांक: ___________', 895, 308);
    ctx.fillText('अंक: _____ / 15', 1245, 308);
  } else {
    ctx.fillText('Student Name: ___________________', 116, 308);
    ctx.fillText('Class: _______', 660, 308);
    ctx.fillText('Date: ____________', 895, 308);
    ctx.fillText('Score: _____ / 15', 1245, 308);
  }

  // Instructions line
  ctx.fillStyle = '#334155';
  ctx.font = `600 21px ${sansFont}`;
  ctx.fillText(
    isHi
      ? 'निर्देश: सभी 15 प्रश्नों को हल करें और खाली स्थान पर अपना अंतिम उत्तर लिखें।'
      : 'Instructions: Solve all 15 questions carefully and write your answer on the blank line.',
    96,
    386
  );

  // 2-Column Layout for all 15 questions (Questions 1-8 left, Questions 9-15 right)
  const marginX = 92;
  const contentW = W - marginX * 2;
  const colGap = 44;
  const colW = (contentW - colGap) / 2;
  const yStart = 418;
  const rowStep = 220;
  const cardH = 196;

  worksheet.questions.forEach((q, idx) => {
    const isRightCol = idx >= 8;
    const colIdx = isRightCol ? 1 : 0;
    const rowIdx = isRightCol ? idx - 8 : idx;

    const x = marginX + colIdx * (colW + colGap);
    const y = yStart + rowIdx * rowStep;

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, x, y, colW, cardH, 14);
    ctx.fill();
    ctx.stroke();

    // Question number + equation + blank answer line
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0F172A';
    ctx.font = `700 31px ${mathFont}`;
    const lineText = `${q.number})  ${q.text} = _______`;
    ctx.fillText(lineText, x + 28, y + 74);

    // Light rough-work guide label at bottom-left of box
    ctx.fillStyle = '#94A3B8';
    ctx.font = `500 16px ${sansFont}`;
    ctx.fillText(isHi ? 'रफ़ कार्य / उत्तर' : 'Work space', x + 28, y + cardH - 22);
  });

  // 16th slot on bottom right: Parent / Teacher Remarks box for clean 2x8 symmetry
  const remarkX = marginX + (colW + colGap);
  const remarkY = yStart + 7 * rowStep;
  ctx.fillStyle = '#F8FAFC';
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, remarkX, remarkY, colW, cardH, 14);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#334155';
  ctx.font = `700 21px ${sansFont}`;
  ctx.fillText(
    isHi ? 'अभिभावक / शिक्षक टिप्पणी व हस्ताक्षर:' : 'Parent / Teacher Remarks & Signature:',
    remarkX + 26,
    remarkY + 46
  );

  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(remarkX + 26, remarkY + 102);
  ctx.lineTo(remarkX + colW - 26, remarkY + 102);
  ctx.moveTo(remarkX + 26, remarkY + 154);
  ctx.lineTo(remarkX + colW - 26, remarkY + 154);
  ctx.stroke();

  // Footer
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748B';
  ctx.font = `500 19px ${sansFont}`;
  ctx.fillText(
    isHi
      ? 'मैथ्स मास्टर किड्स (mathsmasterkids.in) · निःशुल्क प्रिंटेबल अभ्यास वर्कशीट'
      : 'Maths Master Kids (mathsmasterkids.in) · Free Printable Practice Worksheet',
    W / 2,
    H - 86
  );

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const imgData = canvas.toDataURL('image/png');
  pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');

  const safeOp = OP_LABELS[worksheet.operation].en;
  const filename = `MathsMasterKids_Class${worksheet.classNumber}_${safeOp}_Worksheet${worksheet.worksheetNumber}.pdf`;
  pdf.save(filename);
}
