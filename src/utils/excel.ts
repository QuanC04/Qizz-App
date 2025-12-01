    import type { Question } from "@/stores/useForm";
import Excel from "exceljs";
    import { saveAs } from "file-saver";



    /* ----------------- EXPORT QUESTIONS ----------------- */
    export async function exportQuestions(questions: Question[]) {
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet("Questions");

    sheet.columns = [
        { header: "ID", key: "id", width: 20 },
        { header: "Type", key: "type", width: 15 },
        { header: "Question", key: "questionText", width: 50 },
        { header: "Options", key: "options", width: 50 },
        { header: "Correct Answer", key: "correctAnswer", width: 20 },
        { header: "Score", key: "score", width: 10 }
    ];

    questions.forEach((q, index) => {
        sheet.addRow({
        id: index+1,
        type: q.type,
        questionText: q.questionText,
        options: JSON.stringify(q.options),
        correctAnswer:
      q.type === "text"
        ? q.correctAnswer // giữ dạng ["hello","hi"]
        : JSON.stringify(q.correctAnswer), // các loại khác vẫn stringify

        score: q.score
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
        new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
        "questions.xlsx"
    );
    }

    /* ----------------- IMPORT QUESTIONS ----------------- */
    export async function importQuestions(file: File): Promise<Question[]> {
    const workbook = new Excel.Workbook();
    const arrayBuffer = await file.arrayBuffer();
    await workbook.xlsx.load(arrayBuffer);

    const sheet = workbook.getWorksheet("Questions");
    const questions: Question[] = [];

    sheet?.eachRow((row, index) => {
        if (index === 1) return; // skip header

        const [
        id,
        type,
        questionText,
        options,
        correctAnswer,
        score
        ] = row.values.slice(1); // vì row.values[0] là undefined

        questions.push({
        id,
        type,
        questionText,
        options: type === "text" ? JSON.parse(correctAnswer) as string[] : JSON.parse(options),

  // Nếu text → giữ nguyên text
  correctAnswer:
    type === "text"
      ? correctAnswer
      : JSON.parse(correctAnswer),
        score: Number(score)
        });
    });

    return questions;
    }
