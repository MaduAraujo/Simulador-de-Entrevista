
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateQuestion(jobDescription: string, resume: string): Promise<string> {
  const prompt = `
    Você é um recrutador experiente. 
    Com base na descrição da vaga e no currículo fornecidos, gere UMA pergunta de entrevista comportamental concisa e relevante que permita ao candidato demonstrar suas habilidades usando o método STAR.

    Vaga: 
    ---
    ${jobDescription}
    ---

    Currículo: 
    ---
    ${resume}
    ---

    Retorne apenas a pergunta, sem nenhum texto ou formatação adicional.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating question:", error);
    throw new Error("Failed to generate question from Gemini API.");
  }
}

export async function evaluateAnswer(question: string, answer: string): Promise<string> {
  const prompt = `
    Você é um coach de carreira sênior e especialista em entrevistas, avaliando uma resposta de um candidato com base no método STAR (Situação, Tarefa, Ação, Resultado).

    A pergunta da entrevista foi: 
    "${question}"

    A resposta do candidato foi: 
    "${answer}"

    Sua tarefa é fornecer um feedback detalhado, incluindo notas de 1 a 10 para cada pilar do STAR e uma média geral. Siga RIGOROSAMENTE a estrutura abaixo, usando Markdown para formatação.

    ---

    ### Avaliação Geral
    **Nota Média:** [Insira a nota média de 1 a 10, pode ser um número decimal como 8.5]
    **Pontos Fortes:** [Liste os 1-2 pilares do STAR onde o candidato se saiu melhor. Ex: Situação e Ação]
    **Pontos a Melhorar:** [Liste os 1-2 pilares do STAR que mais precisam de atenção. Ex: Tarefa e Resultado]

    ---

    ### Feedback Detalhado por Pilar

    **1. Situação (Nota: [Nota de 1 a 10])**
    *   **Análise:** [Análise concisa sobre como o candidato descreveu a situação.]
    *   **Sugestão:** [Sugestão de melhoria específica para a Situação.]

    **2. Tarefa (Nota: [Nota de 1 a 10])**
    *   **Análise:** [Análise concisa sobre como o candidato descreveu a tarefa.]
    *   **Sugestão:** [Sugestão de melhoria específica para a Tarefa.]

    **3. Ação (Nota: [Nota de 1 a 10])**
    *   **Análise:** [Análise concisa sobre as ações descritas pelo candidato.]
    *   **Sugestão:** [Sugestão de melhoria específica para a Ação.]

    **4. Resultado (Nota: [Nota de 1 a 10])**
    *   **Análise:** [Análise concisa sobre os resultados apresentados.]
    *   **Sugestão:** [Sugestão de melhoria específica para o Resultado.]

    ---

    ### Sugestão de Resposta Aprimorada
    [Forneça uma versão reescrita da resposta do candidato, ou um parágrafo com sugestões concretas, que incorpore as melhorias e siga o método STAR de forma exemplar.]

    ---

    Seja encorajador, mas direto e prático no seu feedback. Se a resposta do candidato for muito curta ou não tiver relação com a pergunta, atribua notas baixas e explique o porquê.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error evaluating answer:", error);
    throw new Error("Failed to evaluate answer from Gemini API.");
  }
}
