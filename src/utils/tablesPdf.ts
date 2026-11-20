import { jsPDF } from 'jspdf';
import type { AppLanguage } from '../data/mathsMaster';

export type TableChartSelection = number | 'ALL';

export const TABLE_NUMBERS = [
  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
] as const;

const HEADER_PALETTE = [
  '#2563EB', // 2
  '#059669', // 3
  '#D97706', // 4
  '#7C3AED', // 5
  '#E11D48', // 6
  '#0284C7', // 7
  '#EA580C', // 8
  '#4F46E5', // 9
  '#0D9488', // 10
  '#C026D3', // 11
  '#1D4ED8', // 12
  '#16A34A', // 13
  '#B45309', // 14
  '#6D28D9', // 15
  '#BE123C', // 16
  '#0369A1', // 17
  '#C2410C', // 18
  '#4338CA', // 19
  '#0F766E', // 20
];

export function getTableAccentHex(tableNum: number): string {
  const idx = Math.max(0, Math.min(HEADER_PALETTE.length - 1, tableNum - 2));
  return HEADER_PALETTE[idx];
}

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

export async function downloadTablesPdf(
  selection: TableChartSelection,
  lang: AppLanguage
): Promise<void> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Proceed cleanly with system fallback fonts
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

  // Pure white A4 background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  // Outer clean frame
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, 56, 52, W - 112, H - 104, 18);
  ctx.stroke();

  // Top Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1E3A8A';
  ctx.font = `800 42px ${sansFont}`;
  ctx.fillText('Maths Master Kids (mathsmasterkids.in)', W / 2, 118);

  if (selection === 'ALL') {
    ctx.fillStyle = '#0F172A';
    ctx.font = `800 30px ${sansFont}`;
    ctx.fillText(
      isHi
        ? 'पहाड़े चार्ट: 2 से 20 तक (गुणा सारणी संदर्भ चार्ट)'
        : 'Multiplication Tables Chart: 2 to 20 (A4 Reference Poster)',
      W / 2,
      166
    );

    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(84, 190);
    ctx.lineTo(W - 84, 190);
    ctx.stroke();

    // 4 Columns x 5 Rows = 20 slots (19 Tables 2..20 + 1 Study Tip slot)
    const marginX = 82;
    const gapX = 20;
    const gapY = 20;
    const cols = 4;
    const rows = 5;
    const contentW = W - marginX * 2;
    const cardW = (contentW - gapX * (cols - 1)) / cols;
    const topY = 212;
    const bottomReserved = 108;
    const availH = H - topY - bottomReserved;
    const cardH = (availH - gapY * (rows - 1)) / rows;

    TABLE_NUMBERS.forEach((n, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = marginX + col * (cardW + gapX);
      const y = topY + row * (cardH + gapY);
      const accent = getTableAccentHex(n);

      // Card container
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, x, y, cardW, cardH, 12);
      ctx.fill();
      ctx.stroke();

      // Colored Header Pill inside card
      const headerH = 44;
      ctx.fillStyle = accent;
      drawRoundedRect(ctx, x + 6, y + 6, cardW - 12, headerH, 9);
      ctx.fill();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `800 22px ${sansFont}`;
      ctx.fillText(
        isHi ? `${n} का पहाड़ा` : `Table of ${n}`,
        x + cardW / 2,
        y + 36
      );

      // 10 rows (n x 1 .. n x 10)
      const listStartY = y + headerH + 34;
      const lineStep = (cardH - headerH - 24) / 10;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0F172A';
      ctx.font = `700 22px ${mathFont}`;
      for (let m = 1; m <= 10; m++) {
        ctx.fillText(`${n} × ${m} = ${n * m}`, x + cardW / 2, listStartY + (m - 1) * lineStep);
      }
    });

    // Slot 20: Study Tip & Star Box
    const tipX = marginX + 3 * (cardW + gapX);
    const tipY = topY + 4 * (cardH + gapY);
    ctx.fillStyle = '#FEFCE8';
    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 2.5;
    drawRoundedRect(ctx, tipX, tipY, cardW, cardH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#92400E';
    ctx.font = `800 23px ${sansFont}`;
    ctx.fillText(
      isHi ? 'रोज़ 5 मिनट अभ्यास!' : '5-Min Daily Tip!',
      tipX + cardW / 2,
      tipY + 62
    );

    ctx.fillStyle = '#334155';
    ctx.font = `600 19px ${sansFont}`;
    const tipLines = isHi
      ? [
          'हर दिन 1 नया पहाड़ा',
          'ज़ोर से बोलकर पढ़ें।',
          '',
          'इस चार्ट को अपनी',
          'स्टडी टेबल के पास',
          'लगाकर रोज़ दोहराएँ।',
          '',
          '★ शाबाश चैंपियन! ★',
        ]
      : [
          'Read 1 table aloud',
          'every morning.',
          '',
          'Pin this A4 chart near',
          'your study desk for',
          'quick daily revision.',
          '',
          '★ Keep Shining! ★',
        ];
    tipLines.forEach((line, idx) => {
      ctx.fillText(line, tipX + cardW / 2, tipY + 114 + idx * 32);
    });
  } else {
    // Single Table Large A4 Reference Poster
    const n = selection;
    const accent = getTableAccentHex(n);

    ctx.fillStyle = accent;
    ctx.font = `800 38px ${sansFont}`;
    ctx.fillText(
      isHi
        ? `${n} का पहाड़ा (गुणा सारणी)`
        : `Multiplication Table of ${n}`,
      W / 2,
      180
    );

    ctx.fillStyle = '#475569';
    ctx.font = `600 22px ${sansFont}`;
    ctx.fillText(
      isHi
        ? `कक्षा 1 से 5 के लिए याद करने योग्य A4 रेफरेंस चार्ट (${n} × 1 से ${n} × 10)`
        : `Easy-to-Read A4 Reference Chart for Classes 1 to 5 (${n} × 1 to ${n} × 10)`,
      W / 2,
      222
    );

    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(96, 248);
    ctx.lineTo(W - 96, 248);
    ctx.stroke();

    // 2 columns x 5 rows large bold cards
    const marginX = 96;
    const colGap = 44;
    const colW = (W - marginX * 2 - colGap) / 2;
    const startY = 296;
    const rowStep = 286;
    const cardH = 248;

    for (let m = 1; m <= 10; m++) {
      const isRight = m > 5;
      const colIdx = isRight ? 1 : 0;
      const rowIdx = isRight ? m - 6 : m - 1;
      const x = marginX + colIdx * (colW + colGap);
      const y = startY + rowIdx * rowStep;

      // Soft card background
      ctx.fillStyle = m % 2 === 1 ? '#F8FAFC' : '#FFFFFF';
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2.5;
      drawRoundedRect(ctx, x, y, colW, cardH, 20);
      ctx.fill();
      ctx.stroke();

      // Left accent bar
      ctx.fillStyle = accent;
      drawRoundedRect(ctx, x + 14, y + 24, 14, cardH - 48, 7);
      ctx.fill();

      // Large equation
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0F172A';
      ctx.font = `800 58px ${mathFont}`;
      ctx.fillText(`${n} × ${m} = ${n * m}`, x + colW / 2 + 10, y + 132);

      // Spoken cadence helper
      ctx.fillStyle = '#64748B';
      ctx.font = `600 23px ${sansFont}`;
      ctx.fillText(
        isHi ? `${n} गुना ${m} बराबर ${n * m}` : `${n} times ${m} equals ${n * m}`,
        x + colW / 2 + 10,
        y + 196
      );
    }

    // Skip Counting Strip at bottom
    const stripY = 1765;
    ctx.fillStyle = '#EFF6FF';
    ctx.strokeStyle = '#93C5FD';
    ctx.lineWidth = 2.5;
    drawRoundedRect(ctx, marginX, stripY, W - marginX * 2, 160, 18);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#1E3A8A';
    ctx.font = `800 26px ${sansFont}`;
    ctx.fillText(
      isHi ? `स्किप काउंटिंग पैटर्न (+${n} जोड़कर गिनें):` : `Skip Counting Pattern (Add +${n} each step):`,
      W / 2,
      stripY + 54
    );

    const multiples = Array.from({ length: 10 }, (_, idx) => n * (idx + 1)).join('  ·  ');
    ctx.fillStyle = '#0F172A';
    ctx.font = `800 34px ${mathFont}`;
    ctx.fillText(multiples, W / 2, stripY + 118);

    // Parent / Student Practice Note
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, marginX, 1960, W - marginX * 2, 230, 18);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#0F172A';
    ctx.font = `700 24px ${sansFont}`;
    ctx.fillText(
      isHi
        ? 'विद्यार्थी का नाम: ____________________________    दिनांक: _______________'
        : 'Student Name: ____________________________    Date: _______________',
      marginX + 36,
      2028
    );
    ctx.fillStyle = '#475569';
    ctx.font = `600 22px ${sansFont}`;
    ctx.fillText(
      isHi
        ? 'मेमोरी चेक: [  ] बिना देखे बोलकर सुनाया   [  ] उल्टे क्रम में याद किया   [  ] मिक्स्ड क्विज़ पास किया'
        : 'Memory Check:  [  ] Recited aloud   [  ] Practiced in reverse   [  ] Passed quick test',
      marginX + 36,
      2112
    );
  }

  // Footer
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748B';
  ctx.font = `600 19px ${sansFont}`;
  ctx.fillText(
    isHi
      ? 'मैथ्स मास्टर किड्स (mathsmasterkids.in) · निःशुल्क प्रिंटेबल पहाड़े चार्ट (कक्षा 1 से 5)'
      : 'Maths Master Kids (mathsmasterkids.in) · Free Printable Multiplication Tables Chart (Classes 1 to 5)',
    W / 2,
    H - 74
  );

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const imgData = canvas.toDataURL('image/png');
  pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');

  const filename =
    selection === 'ALL'
      ? 'MathsMasterKids_All_Tables_2_to_20.pdf'
      : `MathsMasterKids_Table_${selection}.pdf`;
  pdf.save(filename);
}
