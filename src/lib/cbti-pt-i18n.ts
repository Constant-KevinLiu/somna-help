/**
 * Dicionário de artigos CBT-I em português brasileiro.
 *
 * Princípio: textos escritos diretamente em pt-BR, de forma nativa, sem
 * tradução literal do inglês. São mantidos fisicamente separados do
 * dicionário inglês para garantir SEO local e evitar fallback acidental.
 */

import type { Lang } from "./i18n";
import type { FAQ } from "./calc-i18n";
import type { CbtiDict, CbtiSlug } from "./cbti-i18n";

export type FlowNode = { q?: string; yes?: string; no?: string; action?: string };
export type ArticleFlow = { heading: string; yes: string; no: string; nodes: FlowNode[] };

type PtArticle = {
  meta: { title: string; desc: string };
  eyebrow: string;
  title: string;
  intro: string;
  readTime: string;
  takeaways: string[];
  sections: { heading: string; paras?: string[]; bullets?: string[] }[];
  strategyIntro?: string;
  strategyItems: { title: string; desc: string }[];
  flow?: ArticleFlow;
  faqs: FAQ[];
  cta: { label: string; to: string };
};

type PtCbtiDict = Omit<CbtiDict, "articles"> & {
  articles: Record<CbtiSlug, PtArticle>;
};

const ptTitles: Record<CbtiSlug, string> = {
  "cbt-i-guide": "Guia TCC-I",
  "sleep-anxiety": "Ansiedade e sono",
  "how-to-fall-asleep-fast": "Como adormecer rápido",
  "wake-up-at-3am": "Acordar às 3 da manhã",
  "insomnia-treatment": "Tratamento da insônia",
};

const ptSummaries: Record<CbtiSlug, string> = {
  "cbt-i-guide": "Uma introdução completa à Terapia Cognitivo-Comportamental para Insônia.",
  "sleep-anxiety": "Por que se preocupar com o sono piora o sono — e como quebrar esse ciclo.",
  "how-to-fall-asleep-fast": "Técnicas baseadas em evidência para adormecer mais rápido, sem remédios.",
  "wake-up-at-3am": "Causas comuns de despertar no meio da madrugada e o que fazer a respeito.",
  "insomnia-treatment": "TCC-I versus medicamentos — o que a pesquisa científica realmente diz.",
};

const ptUi: CbtiDict["ui"] = {
  guides: "Guias",
  section: "Biblioteca TCC-I",
  readTime: "min de leitura",
  badge: "Baseado em evidência",
  takeawaysTitle: "O que levar daqui",
  strategyTitle: "O que a TCC-I recomenda",
  relatedArticlesTitle: "Artigos relacionados",
  faqTitle: "Perguntas frequentes",
  sleepDiary: "Diário do sono",
  sleepDiaryDesc: "Registre suas noites sem julgamento.",
};

const ptArticles: Record<CbtiSlug, PtArticle> = {
  "cbt-i-guide": {
    meta: {
      title: "Guia TCC-I: um caminho científico para dormir melhor | somna",
      desc: "Entenda como a Terapia Cognitivo-Comportamental para Insônia (TCC-I) funciona e por que é considerada o tratamento de primeira linha para insônia crônica.",
    },
    eyebrow: "BIBLIOTECA TCC-I",
    title: "Guia TCC-I: um caminho científico para dormir melhor",
    intro:
      "A Terapia Cognitivo-Comportamental para Insônia (TCC-I) é o tratamento sem remédios de primeira linha para insônia crônica. Este guia explica como ela funciona, o que esperar e como começar.",
    readTime: "8",
    takeaways: [
      "A TCC-I é recomendada como tratamento de primeira linha para insônia crônica por grandes organizações médicas.",
      "Ela funciona reeducando a relação do cérebro com o sono — sem sedar você.",
      "A maioria das pessoas sente uma melhora significativa entre 4 e 8 semanas.",
      "Não tem efeitos colaterais e os benefícios persistem muito depois que o programa termina.",
    ],
    sections: [
      {
        heading: "O que é TCC-I?",
        paras: [
          "TCC-I é um programa estruturado e de duração limitada, que atua nos pensamentos e comportamentos que mantêm a insônia. Diferente dos remédios para dormir, ela trata as causas subjacentes em vez de apenas mascarar os sintomas.",
          "Um programa típico dura de 4 a 8 semanas, com passos semanais que reconstruím suavemente sua vontade natural de dormir e sua confiança no sono.",
        ],
      },
      {
        heading: "Por que a TCC-I funciona",
        paras: [
          "A insônia crônica costuma ser mantida por um ciclo de autorreforço: noites ruins geram ansiedade em relação ao sono, que aumenta o estado de alerta e torna a noite seguinte ainda pior. A TCC-I interrompe esse ciclo por vários lados ao mesmo tempo.",
        ],
      },
      {
        heading: "Os cinco componentes principais",
        bullets: [
          "Restrição de sono — comprime temporariamente o tempo na cama para reconstruir a pressão do sono.",
          "Controle de estímulos — reassocia a cama ao sono, não à vigília.",
          "Reestruturação cognitiva — suaviza pensamentos ansiosos sobre o sono.",
          "Higiene do sono — pequenos ajustes no ambiente e no estilo de vida.",
          "Treinamento de relaxamento — acalma a resposta de estresse do corpo à noite.",
        ],
      },
      {
        heading: "Quais resultados você pode esperar?",
        paras: [
          "Pesquisas mostram que 70–80% das pessoas com insônia crônica respondem à TCC-I. A maioria percebe que adormece mais rápido, acorda menos vezes e tem mais energia durante o dia.",
        ],
      },
      {
        heading: "Quanto tempo leva a TCC-I?",
        paras: [
          "A maioria dos programas dura de 4 a 8 semanas. Algumas melhorias aparecem já nas primeiras 1–2 semanas, mas os ganhos mais profundos vêm com a constância.",
        ],
      },
      {
        heading: "A TCC-I é melhor que remédios para dormir?",
        paras: [
          "Ambos podem ajudar no curto prazo, mas só a TCC-I mostra benefício duradouro depois que o tratamento acaba. Grandes diretrizes de sono (AASM, ACP) recomendam a TCC-I como cuidado de primeira linha.",
        ],
      },
    ],
    strategyIntro: "Se você só puder guardar algumas ideias da TCC-I, guarde estas.",
    strategyItems: [
      {
        title: "Mantenha um horário fixo de acordar",
        desc: "Todos os dias, inclusive nos fins de semana. Essa é a alavanca mais forte para o seu relógio biológico.",
      },
      {
        title: "Saia da cama se não conseguir dormir",
        desc: "Depois de cerca de 20 minutos acordado, vá para outro ambiente com luz baixa e faça algo calmo. Volte só quando sentir sono.",
      },
      {
        title: "Limite o tempo na cama ao tempo real de sono",
        desc: "Ficar horas na cama esperando o sono enfraquece a associação entre cama e sono.",
      },
      {
        title: "Trate pensamentos como pensamentos",
        desc: "Você não precisa brigar com pensamentos ansiosos sobre sono. Reconheça-os e deixe-os passar.",
      },
    ],
    cta: { label: "Começar a registrar meu sono", to: "/pt/diary" },
    faqs: [
      {
        q: "A TCC-I é adequada para mim?",
        a: "A TCC-I ajuda a maioria dos adultos com insônia crônica (dificuldade para dormir 3+ noites por semana, por 3+ meses). Se você tem apneia do sono não tratada, síndrome das pernas inquietas ou um transtorno de humor, converse com um clínico primeiro.",
      },
      {
        q: "Preciso de um terapeuta?",
        a: "Trabalhar com um clínico treinado em TCC-I traz os resultados mais fortes, mas programas digitais de TCC-I guiados por você mesmo também têm evidência científica e funcionam bem.",
      },
      {
        q: "Vou ter que abandonar as sonecas?",
        a: "Geralmente sim, pelo menos durante a fase ativa. Sonecas reduzem a pressão do sono, que é o combustível que a TCC-I usa.",
      },
      {
        q: "Qual a diferença entre TCC-I e higiene do sono?",
        a: "Higiene do sono é apenas uma pequena parte da TCC-I. Sozinha, raramente resolve a insônia crônica — os componentes comportamentais e cognitivos fazem a maior parte do trabalho.",
      },
      {
        q: "A TCC-I pode piorar minha insônia no início?",
        a: "A restrição de sono pode parecer mais difícil nas semanas 1–2 porque ela aumenta a pressão do sono de propósito. Isso é temporário, planejado e costuma melhorar rapidamente.",
      },
      {
        q: "A TCC-I funciona para idosos?",
        a: "Sim. Estudos mostram bons resultados em idosos, frequentemente melhores que medicamentos e sem efeitos colaterais.",
      },
      {
        q: "Posso fazer TCC-I enquanto tomo remédio para dormir?",
        a: "Frequentemente sim, com orientação de um clínico. Muitas pessoas vão reduzindo a medicação durante ou depois da TCC-I.",
      },
      {
        q: "Quanto tempo duram os benefícios?",
        a: "Estudos de acompanhamento mostram benefícios mantidos por 1 a 3 anos após um programa de TCC-I, o que é incomum para qualquer tratamento de insônia.",
      },
    ],
  },
  "sleep-anxiety": {
    meta: {
      title: "Ansiedade e sono: por que se preocupar com o sono piora o sono | somna",
      desc: "Entenda como a ansiedade em relação ao sono se desenvolve e descubra técnicas de TCC-I para quebrar o ciclo de preocupação e insônia.",
    },
    eyebrow: "BIBLIOTECA TCC-I",
    title: "Ansiedade e sono: por que se preocupar com o sono piora o sono",
    intro:
      "Preocupar-se com o sono é um dos fatores mais comuns que mantêm a insônia. Entender o ciclo é o primeiro passo para suavizá-lo.",
    readTime: "7",
    takeaways: [
      "A ansiedade de sono é uma resposta aprendida — seu cérebro está tentando te proteger.",
      "Quanto mais você tenta dormir à força, mais seu sistema nervoso fica em alerta.",
      "Aceitação, e não controle, é o que a TCC-I usa para romper o ciclo.",
      "Pequenas mudanças durante o dia podem transformar como a próxima noite se sente.",
    ],
    sections: [
      {
        heading: "O que é ansiedade de sono?",
        paras: [
          "Ansiedade de sono é a preocupação, o receio ou o estado de hipervigilância que aumenta perto da hora de dormir e durante a madrugada. Não é um defeito pessoal — é uma resposta condicionada de um cérebro que passou a associar a cama à luta.",
        ],
      },
      {
        heading: "O ciclo ansiedade–insônia",
        paras: [
          "Algumas noites ruins desencadeiam a preocupação com noites ruins futuras. A preocupação aumenta o cortisol e a frequência cardíaca. Esse estado de alerta torna a próxima noite mais difícil, confirmando a preocupação. E assim o ciclo continua.",
        ],
      },
      {
        heading: "Pensamentos ansiosos comuns",
        bullets: [
          '"E se eu não dormir hoje?"',
          '"Amanhã vou estar exausto e não vou conseguir funcionar."',
          '"Todo mundo consegue dormir — o que tem de errado comigo?"',
          '"Eu preciso dormir agora, senão a noite está perdida."',
        ],
      },
      {
        heading: "Por que o cérebro fica hiperalerta",
        paras: [
          "Seu cérebro aprende. Depois de noites suficientes em que a cama significa dificuldade, o simples ato de deitar pode desencadear uma resposta de alarme — coração acelerado, pensamentos acelerados, pele quente. Isso é condicionamento, não fraqueza.",
        ],
      },
      {
        heading: "Estratégias de TCC-I para ansiedade de sono",
        bullets: [
          "Controle de estímulos — saia da cama quando a vigília se arrasta.",
          "Defusão cognitiva — deixe os pensamentos passar sem se envolver.",
          "Intenção paradoxal — tente, suavemente, ficar acordado e calmo, removendo a pressão para dormir.",
          "Janela de preocupação durante o dia — processe as preocupações do dia seguinte mais cedo, não à meia-noite.",
        ],
      },
      {
        heading: "Aceitação versus controle",
        paras: [
          "O sono não pode ser forçado. Quanto mais você empurra, mais seu sistema empurra de volta. A TCC-I pede algo contraintuitivo: desista da luta. O corpo dorme quando se sente seguro.",
        ],
      },
    ],
    strategyIntro: "Quando a ansiedade de sono disparar, aposte nessas estratégias.",
    strategyItems: [
      {
        title: "Abandone a meta de dormir",
        desc: "Busque descansar, não dormir. O sono chega como um efeito colateral de se sentir seguro e tranquilo.",
      },
      {
        title: "Saia da cama se estiver rodando",
        desc: "Vá para uma atividade de pouca luz e pouco estímulo. Volte só quando sentir sono de verdade.",
      },
      {
        title: "Agende a preocupação para mais cedo",
        desc: "Gaste 10 minutos no início da noite escrevendo as preocupações. Feche o caderno.",
      },
      {
        title: "Atenue a expiração",
        desc: "Uma expiração longa e suave baixa a frequência cardíaca e sinaliza segurança ao sistema nervoso.",
      },
    ],
    cta: { label: "Ler o guia completo de TCC-I", to: "/pt/cbt-i-guide" },
    faqs: [
      {
        q: "Por que a ansiedade de sono costuma começar?",
        a: "Um evento estressante da vida, uma doença ou um período de noites ruins geralmente planta a semente. O cérebro então aprende a associar a cama à luta.",
      },
      {
        q: "Ansiedade de sono é a mesma coisa que insônia?",
        a: "Elas se sobrepõem muito. A ansiedade de sono é uma das causas mais comuns de manutenção da insônia crônica.",
      },
      {
        q: "Posso simplesmente tomar algo para relaxar?",
        a: "Sedativos podem ajudar no curto prazo, mas tendem a não tratar o condicionamento subjacente. A TCC-I reeduca a própria resposta.",
      },
      {
        q: "Por que eu só me sinto ansioso na hora de dormir?",
        a: "Porque esse é o sinal que seu cérebro aprendeu. Fora do quarto, a resposta de alarme não é ativada.",
      },
      {
        q: "Olhar o relógio ajuda?",
        a: "Não. Observar o relógio aumenta a ansiedade de forma confiável. Vire o relógio para o outro lado ou esconda-o.",
      },
      {
        q: "Quanto tempo leva para me sentir mais calmo na hora de dormir?",
        a: "A maioria das pessoas percebe algum alívio entre 2 e 4 semanas de prática consistente de TCC-I.",
      },
      {
        q: "Respirar realmente ajuda?",
        a: "Sim — expirações lentas e alongadas (por exemplo, 4-7-8 ou respiração em caixa) reduzem de forma confiável o estado de alerta fisiológico.",
      },
      {
        q: "Quando devo procurar um clínico?",
        a: "Se a ansiedade de sono vier acompanhada de pânico diurno, humor persistentemente baixo ou prejuízo significativo no dia a dia, procure apoio.",
      },
    ],
  },
  "how-to-fall-asleep-fast": {
    meta: {
      title: "Como adormecer rápido: estratégias de sono baseadas em evidência | somna",
      desc: "Descubra técnicas com respaldo científico que ajudam você a adormecer mais rápido sem depender de remédios para dormir.",
    },
    eyebrow: "BIBLIOTECA TCC-I",
    title: "Como adormecer rápido: estratégias de sono baseadas em evidência",
    intro:
      "Adormecer não pode ser forçado — mas você pode criar as condições para que o sono chegue com mais facilidade. Veja o que a pesquisa realmente apoia.",
    readTime: "6",
    takeaways: [
      "A maioria dos adultos leva 10–20 minutos para adormecer — isso é normal, não lento.",
      "Tentar mais forte dormir quase sempre gera o efeito oposto.",
      "Luz, temperatura e horário importam mais do que qualquer técnica isolada.",
      "Se estiver acordado depois de cerca de 20 minutos, saia da cama.",
    ],
    sections: [
      {
        heading: "Por que às vezes é difícil adormecer",
        paras: [
          "A conciliação do sono depende de dois sistemas: a pressão do sono (acumulada pelas horas acordado) e o ritmo circadiano (seu relógio biológico). Quando um deles está desregulado, leva mais tempo para pegar no sono.",
          "Estresse, telas, cafeína à tarde e horários irregulares atrasam a conciliação.",
        ],
      },
      {
        heading: "Erros comuns",
        bullets: [
          "Deitar antes de sentir sono de verdade.",
          "Usar o celular na cama.",
          "Ficar olhando o relógio quando não consegue dormir.",
          "Tentar forçar o sono com esforço puro.",
          "Beber álcool para relaxar — ele fragmenta o sono mais tarde.",
        ],
      },
      {
        heading: "Recomendações da TCC-I",
        bullets: [
          "Só vá para a cama quando estiver com sono, não apenas cansado.",
          "Mantenha um horário fixo de acordar, mesmo depois de noites ruins.",
          "Diminua as luzes 60–90 minutos antes de deitar.",
          "Mantenha o quarto fresco (cerca de 18°C).",
        ],
      },
      {
        heading: "Métodos de relaxamento que realmente ajudam",
        bullets: [
          "Relaxamento muscular progressivo — tensione e solte grupos musculares, da cabeça aos pés.",
          "Meditação de varredura corporal — mova a atenção lentamente pelo corpo.",
          "Embaralhamento cognitivo — imagine imagens aleatórias e sem relação para desengajar a mente.",
        ],
      },
      {
        heading: "Exercícios de respiração",
        paras: [
          "A respiração nasal lenta com expiração longa é a técnica com mais respaldo científico. Experimente 4-7-8 (inspire 4 segundos, segure 7, expire 8) por 4 ciclos, ou respiração simples 4-6.",
        ],
      },
      {
        heading: "O que fazer se você não conseguir dormir",
        paras: [
          "Se passarem 20 minutos e você ainda estiver bem acordado, levante. Sente-se em algum lugar tranquilo e com pouca luz. Leia algo leve. Volte quando sentir sono. Isso reconstrói a ligação cama–sono.",
        ],
      },
    ],
    strategyIntro: "Esta noite, experimente estas etapas — na ordem.",
    strategyItems: [
      {
        title: "Diminua tudo 60 min antes de deitar",
        desc: "A luz suprime a melatonina. Luzes mais baixas são o impulsionador de melatonina mais fácil que você tem.",
      },
      {
        title: "Deixe as telas fora do quarto",
        desc: "Ou, no mínimo, pare de rolar feeds uma vez na cama.",
      },
      {
        title: "Espere o sono chegar",
        desc: "Cansado não é a mesma coisa que com sono. Com sono = olhos pesados, cabeça puxando. Deite só nessa hora.",
      },
      {
        title: "Se estiver acordado por 20 min, saia da cama",
        desc: "Atividade calma e com pouca luz até sentir sono. Essa é a ferramenta mais poderosa da TCC-I para conciliar o sono.",
      },
    ],
    cta: { label: "Usar a calculadora de hora de dormir", to: "/pt/bedtime-calculator" },
    faqs: [
      {
        q: "Quanto tempo deveria levar para adormecer?",
        a: "Cerca de 10–20 minutos é saudável. Menos de 5 minutos pode indicar privação de sono; mais de 30 minutos com frequência sugere insônia.",
      },
      {
        q: "Contar ovelhas funciona?",
        a: "Muito pouco. O embaralhamento cognitivo — imagens aleatórias e sem relação — funciona melhor para a maioria das pessoas.",
      },
      {
        q: "Aplicativos de sono e ruído branco são eficazes?",
        a: "Um som ambiente constante ajuda algumas pessoas a mascarar ruídos repentinos. A eficácia varia.",
      },
      {
        q: "Devo ler na cama?",
        a: "Se ler costuma fazer você dormir, sim. Se você fica alerta, leia em outro lugar e volte para a cama só quando sentir sono.",
      },
      {
        q: "A melatonina me ajuda a adormecer mais rápido?",
        a: "Ela pode ajustar o horário, especialmente em jet lag ou fase tardia do sono. Não é um sedativo.",
      },
      {
        q: "E quanto ao exercício?",
        a: "Exercícios regulares melhoram a conciliação do sono. Evite atividades intensas até 2 horas antes de deitar.",
      },
      {
        q: "Qual a melhor temperatura do quarto?",
        a: "Fresco — cerca de 16–19°C para a maioria dos adultos.",
      },
      {
        q: "E se eu simplesmente não conseguir dormir?",
        a: "Levante e vá para outro ambiente com pouca luz. A luta contra a vigília só mantém o sistema nervoso ligado.",
      },
    ],
  },
  "wake-up-at-3am": {
    meta: {
      title: "Por que eu acordo às 3 da manhã todas as noites? | somna",
      desc: "Entenda as causas comuns de acordar às 3 da manhã e o que a TCC-I recomenda para melhorar a continuidade do sono.",
    },
    eyebrow: "BIBLIOTECA TCC-I",
    title: "Por que eu acordo às 3 da manhã todas as noites?",
    intro:
      "Acordar no meio da noite é um dos padrões mais comuns — e mais frustrantes — da insônia. Veja por que isso acontece e o que ajuda.",
    readTime: "6",
    takeaways: [
      "Despertares breves entre ciclos de sono são completamente normais.",
      "O problema raramente é acordar — é ter dificuldade de voltar a dormir.",
      "Estresse e hipervigilância frequentemente atingem o pico na segunda metade da noite.",
      "O que você faz nesses 20 minutos importa mais do que o motivo do despertar.",
    ],
    sections: [
      {
        heading: "Acordar às 3 da manhã é normal?",
        paras: [
          "Sim. Pessoas que dormem bem acordam brevemente entre ciclos de sono várias vezes por noite e voltam a dormir imediatamente. O problema não é o despertar — é ficar preso.",
        ],
      },
      {
        heading: "Estresse e hipervigilância",
        paras: [
          "O cortisol começa a subir naturalmente na segunda metade da noite para preparar você para acordar. Quando o estresse está alto, essa subida começa mais cedo e com mais força — te puxando para fora do sono por volta das 2–4 da manhã.",
        ],
      },
      {
        heading: "Ciclos de sono e despertares",
        paras: [
          "Às 3 da manhã, a maioria dos adultos já completou vários ciclos de sono e está passando mais tempo no sono REM mais leve, do qual é mais fácil acordar. Um pequeno barulho ou mudança de temperatura pode ser o suficiente.",
        ],
      },
      {
        heading: "Outras causas comuns",
        bullets: [
          "Álcool — relaxa no início, mas fragmenta o sono 4–6 horas depois.",
          "Refeições tardias ou queda da glicemia.",
          "Quarto muito quente.",
          "Apneia do sono ou síndrome das pernas inquietas não tratadas.",
          "Bexiga cheia (especialmente com líquidos à noite).",
        ],
      },
      {
        heading: "O que NÃO fazer",
        bullets: [
          "Olhar o relógio.",
          "Pegar o celular.",
          "Ficar deitado forçando o sono por 30+ minutos.",
          "Começar a planejar mentalmente o dia seguinte.",
        ],
      },
      {
        heading: "Recomendações da TCC-I",
        paras: [
          "Depois de cerca de 20 minutos acordado, saia da cama. Sente-se em algum lugar tranquilo com pouca luz. Faça algo suavemente envolvente. Volte só quando sentir sono. Ao longo das semanas, os despertares encurtam e frequentemente desaparecem.",
        ],
      },
      {
        heading: "Quando procurar ajuda médica",
        paras: [
          "Se os despertares vierem acompanhados de engasgos, sufocação, roncos altos, movimentos involuntários das pernas ou cansaço diurno apesar de passar horas na cama, converse com um clínico — isso pode indicar apneia do sono ou outro distúrbio tratável.",
        ],
      },
    ],
    strategyIntro: "Da próxima vez que acordar às 3 da manhã, experimente esta sequência.",
    strategyItems: [
      {
        title: "Não olhe o relógio",
        desc: "Saber que são 3 da manhã ativa o ciclo de preocupação instantaneamente.",
      },
      {
        title: "Fique parado e respire devagar",
        desc: "Expirações longas. Nenhum esforço para dormir — apenas descanse.",
      },
      {
        title: "Depois de cerca de 20 min, levante",
        desc: "Luz baixa, atividade tranquila. Volte quando sentir sono, não antes.",
      },
      {
        title: "Acorde no seu horário normal",
        desc: "Não durma mais. Proteger o horário de acordar protege a pressão do sono da noite seguinte.",
      },
    ],
    flow: {
      heading: "Fluxo para despertar à noite",
      yes: "Sim",
      no: "Não",
      nodes: [
        { q: "Você acordou?", yes: "Fique parado, respire devagar.", no: "Continue descansando." },
        {
          q: "Ainda acordado depois de cerca de 20 minutos?",
          yes: "Saia da cama. Luz baixa. Atividade calma.",
          no: "Deixe o sono voltar.",
        },
        {
          q: "Está com sono de novo?",
          yes: "Volte para a cama.",
          no: "Fique acordado até sentir sono.",
        },
        { action: "Acorde no seu horário habitual — não durma mais." },
      ],
    },
    cta: { label: "Acompanhar meus padrões de sono", to: "/pt/diary" },
    faqs: [
      {
        q: "Por que especificamente às 3 da manhã?",
        a: "O cortisol sobe naturalmente na segunda metade da noite e o sono está mais leve nessa hora. A janela das 2–4 da manhã é a mais comum para despertares.",
      },
      {
        q: "Isso significa que tem algo de errado clinicamente?",
        a: "Geralmente não. Mas despertares persistentes no meio da noite acompanhados de sintomas diurnos merecem uma avaliação clínica.",
      },
      {
        q: "Por que não consigo voltar a dormir?",
        a: "Muitas vezes porque a mente ativa no momento em que percebe que está acordada — e a preocupação bloqueia o retorno ao sono.",
      },
      {
        q: "Devo comer alguma coisa?",
        a: "Só se a fome for claramente o gatilho. Caso contrário, comer reforça a vigília no meio da noite.",
      },
      {
        q: "O álcool está piorando isso?",
        a: "Muito provavelmente. O álcool fragmenta o sono, especialmente na segunda metade da noite.",
      },
      {
        q: "Isso significa que tenho insônia?",
        a: "Despertares frequentes no meio da noite com dificuldade de voltar a dormir, 3+ noites por semana por 3+ meses, atendem à definição de insônia.",
      },
      {
        q: "A melatonina pode ajudar com despertares às 3 da manhã?",
        a: "Normalmente não — a melatonina afeta o momento do sono, não a manutenção do sono.",
      },
      {
        q: "A TCC-I ajuda?",
        a: "Sim — a TCC-I é altamente eficaz tanto para demorar a pegar no sono quanto para despertares no meio da noite.",
      },
    ],
  },
  "insomnia-treatment": {
    meta: {
      title: "Tratamento da insônia: TCC-I ou remédios? | somna",
      desc: "Compare a TCC-I e medicamentos para dormir e saiba quais opções de tratamento têm respaldo científico.",
    },
    eyebrow: "BIBLIOTECA TCC-I",
    title: "Tratamento da insônia: TCC-I ou remédios?",
    intro:
      "Remédios funcionam rápido. A TCC-I vai mais fundo. Veja uma comparação honesta e baseada em evidências para que você possa escolher bem.",
    readTime: "7",
    takeaways: [
      "A TCC-I é recomendada como tratamento de primeira linha pelas principais diretrizes de sono.",
      "Medicamentos podem ajudar no curto prazo, mas raramente resolvem a insônia crônica.",
      "A TCC-I tem benefícios duradouros e sem efeitos colaterais.",
      "Os dois podem ser combinados com orientação clínica.",
    ],
    sections: [
      {
        heading: "O que é insônia?",
        paras: [
          "Insônia é a dificuldade de pegar no sono, manter o sono ou acordar muito cedo — pelo menos 3 noites por semana, por 3+ meses, com impacto diurno. É uma condição clínica, não um traço de personalidade.",
        ],
      },
      {
        heading: "Opção 1 — TCC-I",
        paras: [
          "Um programa estruturado e baseado em evidências que atua nos pensamentos e comportamentos que mantêm a insônia. Dura 4–8 semanas. Sem medicação. Os efeitos persistem muito depois que o programa termina.",
        ],
      },
      {
        heading: "Opção 2 — Medicamentos para dormir",
        paras: [
          "Incluem hipnóticos prescritos (z-drugs, benzodiazepínicos), antidepressivos sedativos e medicamentos de venda livre. Eles podem reduzir o tempo para pegar no sono, mas muitas vezes perdem eficácia, podem causar dependência e não tratam as causas raiz.",
        ],
      },
      {
        heading: "Prós e contras",
        bullets: [
          "TCC-I — duradoura, sem efeitos colaterais, exige esforço e paciência.",
          "Medicamento — alívio rápido, efeitos colaterais possíveis, frequentemente insônia de rebote ao parar.",
        ],
      },
      {
        heading: "Qual abordagem funciona a longo prazo?",
        paras: [
          "A pesquisa é clara: a TCC-I supera os medicamentos no acompanhamento de 6–12 meses. O benefício do medicamento diminui ao interrompê-lo; o da TCC-I geralmente se mantém.",
        ],
      },
      {
        heading: "Podem ser combinados?",
        paras: [
          "Sim. Muitos clínicos usam medicamento de curto prazo junto com a TCC-I e depois fazem uma redução gradual. Sempre coordene com quem prescreve.",
        ],
      },
    ],
    strategyIntro: "Se você está escolhendo por onde começar, considere isso.",
    strategyItems: [
      {
        title: "Experimente a TCC-I primeiro, quando possível",
        desc: "Recomendada pela AASM e ACP como cuidado de primeira linha para insônia crônica.",
      },
      {
        title: "Use medicamento como ponte, não como destino",
        desc: "Curto prazo, dose mínima eficaz, com um plano de redução gradual.",
      },
      {
        title: "Trate os hábitos diurnos",
        desc: "O momento da cafeína, o álcool, a exposição à luz e o exercício moldam suas noites.",
      },
      {
        title: "Acompanhe seu sono",
        desc: "Um diário do sono simples revela padrões que nenhum aplicativo consegue adivinhar.",
      },
    ],
    cta: { label: "Explorar o guia de TCC-I", to: "/pt/cbt-i-guide" },
    faqs: [
      {
        q: "A TCC-I é realmente melhor que remédios para dormir?",
        a: "Para insônia crônica, sim — no acompanhamento de longo prazo. Para insônia aguda pontual, medicamentos de curto prazo podem ser apropriados.",
      },
      {
        q: "Remédios para dormir são seguros?",
        a: "Quando usados por curto prazo e conforme prescrito, geralmente sim. Os riscos incluem dependência, sonolência no dia seguinte, quedas (especialmente em idosos) e insônia de rebote.",
      },
      {
        q: "E os remédios para dormir de venda livre?",
        a: "A maioria usa anti-histamínicos sedativos. Podem causar sonolência no dia seguinte e a tolerância aumenta rapidamente. Não são recomendados a longo prazo.",
      },
      {
        q: "A melatonina é um remédio para dormir?",
        a: "Não — ela ajusta o momento do sono em vez de sedar. É mais útil para jet lag e fase tardia do sono.",
      },
      {
        q: "Quanto custa a TCC-I?",
        a: "Varia. Terapia presencial é a mais cara, programas em grupo têm custo intermediário e a TCC-I digital (inclusive autoguiada) costuma ser a mais acessível.",
      },
      {
        q: "E se eu já uso medicamento há anos?",
        a: "Muitas pessoas conseguem reduzir gradativamente enquanto fazem TCC-I, com o apoio de quem prescreve. Não pare de repente.",
      },
      {
        q: "Planos de saúde cobrem TCC-I?",
        a: "Em muitas regiões, sim, especialmente quando conduzida por um clínico licenciado. A cobertura para programas digitais varia.",
      },
      {
        q: "Como sei se o tratamento está funcionando?",
        a: "Você adormece mais rápido, acorda menos, mantém horários mais regulares e tem mais energia durante o dia. Um diário do sono ajuda a ver o progresso com objetividade.",
      },
    ],
  },
};

export const ptCbtiDict: CbtiDict = {
  ui: ptUi,
  titles: ptTitles,
  summaries: ptSummaries,
  articles: ptArticles as CbtiDict["articles"],
};
