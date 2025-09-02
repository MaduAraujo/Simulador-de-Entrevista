
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
    Você é um coach de carreira especializado em preparação para entrevistas. Sua tarefa é avaliar uma resposta de entrevista com foco no método STAR (Situação, Tarefa, Ação, Resultado).

    A pergunta da entrevista foi: 
    "${question}"

    A resposta do candidato foi: 
    "${answer}"

    Forneça um feedback construtivo e detalhado sobre como o candidato poderia melhorar sua resposta usando o método STAR. Siga esta estrutura:

    1.  **Análise Geral:** Um breve resumo da resposta.
    2.  **Feedback sobre STAR:**
        *   **Situação:** A situação foi claramente descrita? O que poderia ser melhorado?
        *   **Tarefa:** A tarefa ou objetivo foi bem definido? O que poderia ser melhorado?
        *   **Ação:** As ações tomadas pelo candidato foram específicas e detalhadas? O que poderia ser melhorado?
        *   **Resultado:** O resultado foi quantificável e demonstrou impacto? O que poderia ser melhorado?
    3.  **Sugestão de Melhoria:** Forneça uma versão reescrita ou sugestões concretas de como a resposta poderia ser aprimorada para seguir melhor o método STAR.

    Seja encorajador, claro e prático. Formate sua resposta em Markdown para uma melhor legibilidade, usando títulos (ex: ### Análise Geral), listas de marcadores (*) e negrito (**) para estruturar o feedback.
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