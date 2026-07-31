/**
 * Português do Brasil — Guided CBT-I Reflection Prompts
 *
 * Conteúdo de autoria nativa.
 * Por um educador nativo em saúde do sono brasileiro.
 * Prompts terapêuticos — NÃO traduza em tempo de execução.
 */

import type { ContentPackage } from "@/content/content-types";
import type { ReflectionPrompt } from "@/lib/reflection/reflection-types";

const PT_BR_REFLECTION_PROMPTS: ReflectionPrompt[] = [
  // Sleep Thoughts Category
  {
    id: "pt-thoughts-001",
    category: "sleep-thoughts",
    text: "O que passava pela sua mente enquanto tentava dormir ontem à noite? Escreva os pensamentos que sentiu mais presentes, sem julgamentos.",
  },
  {
    id: "pt-thoughts-002",
    category: "sleep-thoughts",
    text: "Alguma preocupação específica apareceu repetidamente enquanto você estava na cama? Descreva-a com gentileza consigo mesmo.",
  },
  {
    id: "pt-thoughts-003",
    category: "sleep-thoughts",
    text: "Que história você contou a si mesmo sobre seu sono ontem à noite? Isso ajudou ou gerou mais pressão?",
  },
  {
    id: "pt-thoughts-004",
    category: "sleep-thoughts",
    text: "Quando você acordou durante a noite, qual foi o primeiro pensamento que apareceu? Como isso afetou sua capacidade de voltar a dormir?",
  },

  // Sleep Anxiety Category
  {
    id: "pt-anxiety-001",
    category: "sleep-anxiety",
    text: "Numa escala de calmo a acelerado, como descreveria seu estado mental ao se deitar? O que contribuiu para essa sensação?",
  },
  {
    id: "pt-anxiety-002",
    category: "sleep-anxiety",
    text: "Que sensações físicas você notou no seu corpo ao tentar relaxar? Alguma se sentiu especialmente difícil de liberar?",
  },
  {
    id: "pt-anxiety-003",
    category: "sleep-anxiety",
    text: "Você se preocupou com as consequências de dormir mal antes de se deitar? Quais eram esses medos e quão realistas são?",
  },
  {
    id: "pt-anxiety-004",
    category: "sleep-anxiety",
    text: "Você pensou 'tenho que dormir AGORA!' em algum momento? Como essa pressão te fez sentir?",
  },

  // Sleep Behaviors Category
  {
    id: "pt-behaviors-001",
    category: "sleep-behaviors",
    text: "O que você fez na hora antes de se deitar ontem à noite? Quais atividades te ajudaram a descansar e quais te mantiveram alerta?",
  },
  {
    id: "pt-behaviors-002",
    category: "sleep-behaviors",
    text: "Quão consistente foi seu horário de dormir comparado ao seu padrão habitual? Que fatores o fizeram mais cedo ou mais tarde?",
  },
  {
    id: "pt-behaviors-003",
    category: "sleep-behaviors",
    text: "Você usou telas na cama? Com que conteúdo estava interagindo e como isso afetou sua transição para o sono?",
  },
  {
    id: "pt-behaviors-004",
    category: "sleep-behaviors",
    text: "Que rotina amigável com o sono você seguiu? Tem uma pequena mudança que poderia fazer no seu ritual pré-sono?",
  },

  // Relaxation Category
  {
    id: "pt-relax-001",
    category: "relaxation",
    text: "Descreva um momento de ontem em que você se sentiu realmente calmo e relaxado. O que tornou possível essa sensação?",
  },
  {
    id: "pt-relax-002",
    category: "relaxation",
    text: "Que técnica de relaxamento você achou mais útil? Quando foi a última vez que a usou e como funcionou?",
  },
  {
    id: "pt-relax-003",
    category: "relaxation",
    text: "Que sons ou experiências sensoriais te ajudam a sentir em paz? Você pode trazer mais disso para seu quarto?",
  },
  {
    id: "pt-relax-004",
    category: "relaxation",
    text: "Pense na sua respiração ao se deitar ontem à noite. Era superficial ou profunda, rápida ou lenta? Como seria uma respiração mais pausada?",
  },

  // Gratitude Category
  {
    id: "pt-gratitude-001",
    category: "gratitude",
    text: "Nomeie três coisas pequenas e específicas de ontem que você apreciou. Não precisam ser grandes nem impressionantes.",
  },
  {
    id: "pt-gratitude-002",
    category: "gratitude",
    text: "O que é uma coisa que seu corpo fez por você ontem que talvez dê por garantido? Reconheça esse esforço aqui.",
  },
  {
    id: "pt-gratitude-003",
    category: "gratitude",
    text: "Quem ou o que te fez sentir apoiado no último dia? Escreva uma breve nota de agradecimento por essa presença.",
  },
  {
    id: "pt-gratitude-004",
    category: "gratitude",
    text: "Que coisa gentil você fez por si mesmo ontem? Celebre esse ato de cuidado, por menor que seja.",
  },

  // Sleep Confidence Category
  {
    id: "pt-confidence-001",
    category: "sleep-confidence",
    text: "Quando você dormiu bem no último mês? Quais eram as circunstâncias e o que você fez que contribuiu para isso?",
  },
  {
    id: "pt-confidence-002",
    category: "sleep-confidence",
    text: "O que é uma coisa que você sabe que ajuda seu sono e na qual pode confiar? Lembre-se dessa verdade.",
  },
  {
    id: "pt-confidence-003",
    category: "sleep-confidence",
    text: "Mesmo em noites difíceis, que pequena vitória você teve com seu sono recentemente? Reconheça seu esforço.",
  },
  {
    id: "pt-confidence-004",
    category: "sleep-confidence",
    text: "Como seria confiar na capacidade do seu corpo de dormir? Descreva essa sensação de segurança e confiança.",
  },

  // Stimulus Control Category
  {
    id: "pt-stimulus-001",
    category: "stimulus-control",
    text: "Como você usa sua cama além de dormir? Poderia mover alguma dessas atividades para outro cômodo?",
  },
  {
    id: "pt-stimulus-002",
    category: "stimulus-control",
    text: "Quando você não conseguiu dormir ontem à noite, o que fez? Tem uma abordagem diferente que poderia testar da próxima vez?",
  },
  {
    id: "pt-stimulus-003",
    category: "stimulus-control",
    text: "Como é e como se sente seu ambiente do quarto? Tem um ajuste que o tornaria mais amigável com o sono?",
  },
  {
    id: "pt-stimulus-004",
    category: "stimulus-control",
    text: "Quão rápido você se levanta da cama quando não consegue dormir? Que barreira — se existir — te impede de levantar antes?",
  },

  // Sleep Restriction Category
  {
    id: "pt-restriction-001",
    category: "sleep-restriction",
    text: "Quanto tempo realmente dormiu ontem à noite versus quanto tempo passou na cama? Observe a diferença.",
  },
  {
    id: "pt-restriction-002",
    category: "sleep-restriction",
    text: "O que significa 'eficiência do sono' para você pessoalmente? Como poderia mudar suas noites construir um impulso de sono mais forte?",
  },
  {
    id: "pt-restriction-003",
    category: "sleep-restriction",
    text: "Você está passando mais tempo na cama tentando 'recuperar' sono? Como isso afetou a qualidade do seu descanso?",
  },
  {
    id: "pt-restriction-004",
    category: "sleep-restriction",
    text: "Como seria para você um horário de acordar consistente — mesmo nos finais de semana? Que benefícios poderia trazer?",
  },

  // Night Awakenings Category
  {
    id: "pt-awakenings-001",
    category: "night-awakenings",
    text: "Quando você acordou ontem à noite, qual foi sua reação imediata? Você se frustrou ou conseguiu observar com calma?",
  },
  {
    id: "pt-awakenings-002",
    category: "night-awakenings",
    text: "A que horas você acordou e não voltou a dormir rapidamente? Que pensamentos giravam durante esse tempo?",
  },
  {
    id: "pt-awakenings-003",
    category: "night-awakenings",
    text: "Acordar à noite é normal. Quando se sentiu mais manejável para você? O que era diferente nesses momentos?",
  },
  {
    id: "pt-awakenings-004",
    category: "night-awakenings",
    text: "Qual é sua estratégia habitual quando não consegue voltar a dormir? Tem uma técnica nova que gostaria de praticar?",
  },

  // Cognitive Reframing Category
  {
    id: "pt-reframing-001",
    category: "cognitive-reframing",
    text: "Que pensamento negativo sobre o sono você teve recentemente? Consegue encontrar uma forma mais equilibrada de ver a mesma situação?",
  },
  {
    id: "pt-reframing-002",
    category: "cognitive-reframing",
    text: "Em vez de 'tenho que dormir 8 horas', que pensamento mais flexível e gentil você poderia ter sobre suas necessidades de sono?",
  },
  {
    id: "pt-reframing-003",
    category: "cognitive-reframing",
    text: "Quando pensa em uma 'noite ruim', você está lembrando toda a imagem ou só a parte difícil? Escreva a história completa.",
  },
  {
    id: "pt-reframing-004",
    category: "cognitive-reframing",
    text: "Que pensamento catastrófico sobre o sono ruim você já teve? Que evidência contradiz esse medo?",
  },
];

export const PT_BR_REFLECTION_PACKAGE: ContentPackage<ReflectionPrompt[]> = {
  metadata: {
    locale: "pt-BR",
    version: "1.0.0",
    reviewedAt: "2025-01-15",
    reviewedBy: "equipe-educacao-sono-br",
    medicalReviewStatus: "approved",
    nativeReviewStatus: "approved",
    lastUpdated: "2025-01-15",
  },
  content: PT_BR_REFLECTION_PROMPTS,
};
