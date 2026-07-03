/**
 * Dicionário de lições "Aprender" em português brasileiro.
 *
 * Princípio: conteúdo escrito diretamente em pt-BR, sem tradução literal do
 * inglês. Mantido separado do dicionário inglês para evitar fallback
 * acidental e garantir SEO local com textos nativos.
 */

import type { LearnDict, LearnSlug } from "./learn-i18n";

const ptTitles: Record<LearnSlug, string> = {
  "what-is-cbti": "O que é TCC-I, afinal?",
  "90-minute-sleep-cycle": "O ciclo de sono de 90 minutos",
  "4-7-8-breathing": "A respiração 4-7-8, explicada",
  "racing-thoughts-at-night": "Quando a mente não silencia à noite",
  "circadian-rhythm": "Luz, cafeína e seu relógio interno",
  "stimulus-control": "Controle de estímulos em linguagem simples",
};

const ptSummaries: Record<LearnSlug, string> = {
  "what-is-cbti": "Uma introdução acolhedora à TCC-I e por que ela funciona a longo prazo.",
  "90-minute-sleep-cycle": "Como os ciclos de sono moldam a sensação de descanso.",
  "4-7-8-breathing": "Um padrão simples de respiração que acalma o sistema nervoso.",
  "racing-thoughts-at-night": "Por que os pensamentos ficam altos à noite — e o que a TCC-I faz a respeito.",
  "circadian-rhythm": "Como a luz e a cafeína guiam, silenciosamente, seu relógio biológico.",
  "stimulus-control": "Reconstruindo a conexão cama–sono, uma noite de cada vez.",
};

const ptUi: LearnDict["ui"] = {
  learn: "Aprender",
  quickLessons: "Lições rápidas",
  cbtiGuides: "Guias TCC-I",
  readBadge: "Leitura de 5 min",
  takeawaysTitle: "O que levar daqui",
  scienceNoteTitle: "Nota científica",
  practicalTipTitle: "Experimente hoje à noite",
  relatedToolTitle: "Experimente uma ferramenta relacionada",
  relatedGuideTitle: "Aprofunde-se",
  relatedGuideCta: "Ler o guia completo",
  nextLessonTitle: "Próxima lição",
  nextLessonCta: "Continuar aprendendo",
  hubTitle: "Aprender",
  hubSub: "Uma biblioteca de guias completos de TCC-I e lições breves baseadas em evidência.",
  hubQuickLessonsLabel: "Lições rápidas",
  hubGuidesLabel: "Guias TCC-I",
  minRead: "min de leitura",
};

const ptLessons: LearnDict["lessons"] = {
  "what-is-cbti": {
    meta: {
      title: "O que é TCC-I, afinal? | somna",
      desc: "Uma explicação acessível sobre a Terapia Cognitivo-Comportamental para Insônia (TCC-I) e por que é considerada o tratamento de insônia mais eficaz a longo prazo.",
    },
    eyebrow: "LIÇÃO RÁPIDA",
    title: "O que é TCC-I, afinal?",
    subtitle:
      "A Terapia Cognitivo-Comportamental para Insônia não é um remédio para dormir — é um caminho estruturado para reeducar como seu cérebro se relaciona com o sono.",
    readingTime: "5",
    keyTakeaways: [
      "A TCC-I não é medicação — ela muda comportamentos e pensamentos em torno do sono.",
      "É recomendada por especialistas em sono do mundo todo como cuidado de primeira linha para insônia crônica.",
      "Os resultados costumam durar muito mais do que remédios para dormir.",
      "A maioria das pessoas sente uma melhora significativa entre 4 e 8 semanas.",
    ],
    sections: [
      {
        heading: "O que significa TCC-I?",
        paras: [
          "TCC-I significa Terapia Cognitivo-Comportamental para Insônia. É um programa estruturado e de duração limitada que atua nos pensamentos e comportamentos específicos que mantêm a insônia.",
          "Diferente dos remédios para dormir, a TCC-I não seda você. Em vez disso, ela ensina seu cérebro e seu corpo a recuperarem seu ritmo natural de sono — de forma gentil e sem efeitos colaterais.",
        ],
      },
      {
        heading: "Por que os problemas de sono se tornam aprendidos",
        paras: [
          "Algumas noites estressantes são normais. Elas se tornam crônicas quando o cérebro começa a associar a cama à frustração ou ao alerta, em vez de ao descanso.",
          "Ao longo de semanas ou meses, essa associação se fortalece. Seu sistema nervoso aprende: 'hora de dormir = fique alerta'. A TCC-I funciona porque trata diretamente esse aprendizado.",
        ],
      },
      {
        heading: "Os cinco componentes principais",
        paras: [
          "A TCC-I combina cinco ferramentas baseadas em evidências: restrição de sono (comprimir o tempo na cama para reconstruir a pressão do sono), controle de estímulos (reconectar a cama ao sono), reestruturação cognitiva (suavizar pensamentos ansiosos), higiene do sono (pequenos ajustes ambientais) e treinamento de relaxamento.",
          "Usadas juntas, elas atacam o ciclo da insônia por vários ângulos ao mesmo tempo.",
        ],
      },
      {
        heading: "Por que a TCC-I funciona a longo prazo",
        paras: [
          "Medicação pode mascarar sintomas enquanto você a toma. A TCC-I muda os padrões subjacentes, então as melhorias permanecem depois que o programa acaba.",
          "Estudos de acompanhamento mostram benefícios mantidos de um a três anos depois — o que é incomum para qualquer tratamento de insônia.",
        ],
      },
      {
        heading: "Quem pode se beneficiar da TCC-I?",
        paras: [
          "A maioria dos adultos com insônia crônica responde bem, incluindo idosos e pessoas que lutam há anos. A TCC-I também é eficaz junto com tratamento para ansiedade ou depressão.",
          "Se você tem apneia do sono não tratada, síndrome das pernas inquietas ou outro distúrbio do sono, converse com um clínico primeiro para que a TCC-I possa ser adaptada com segurança.",
        ],
      },
    ],
    scienceNote:
      "Grandes organizações de medicina do sono — incluindo a Academia Americana de Medicina do Sono e o Colegio Americano de Médicos — recomendam a TCC-I como tratamento de primeira linha para insônia crônica em adultos.",
    practicalTip:
      "Esta noite, use sua cama apenas para dormir e intimidade — sem rolar feeds, sem trabalho, sem se preocupar. Essa regra simples é o coração do controle de estímulos.",
    cta: { label: "Ler o guia completo de TCC-I", to: "/pt/cbt-i-guide" },
    relatedGuide: { slug: "cbt-i-guide" },
    relatedTool: {
      to: "/pt/calculator",
      label: "Calculadora de ciclos de sono",
      desc: "Planeje seus horários em torno de ciclos naturais de 90 minutos.",
    },
    faqs: [
      {
        q: "A TCC-I é um tipo de remédio?",
        a: "Não. A TCC-I é um programa comportamental e cognitivo. Ela usa técnicas estruturadas, e não drogas, para tratar as causas raiz da insônia.",
      },
      {
        q: "Quanto tempo a TCC-I leva para funcionar?",
        a: "A maioria das pessoas percebe alguma mudança em 1–2 semanas e uma melhora significativa entre 4 e 8 semanas de prática consistente.",
      },
      {
        q: "A TCC-I é melhor que remédios para dormir?",
        a: "Para insônia crônica, sim — no acompanhamento de longo prazo. Remédios podem ajudar no curto prazo, mas os ganhos raramente persistem após a interrupção.",
      },
      {
        q: "Preciso de um terapeuta para fazer TCC-I?",
        a: "Um clínico treinado produz os melhores resultados, mas programas digitais de TCC-I autoguiados também são baseados em evidências e eficazes.",
      },
      {
        q: "A TCC-I ajuda se eu tenho insônia há anos?",
        a: "Sim. Mesmo insônias de longa data respondem bem, porque a TCC-I atua nos padrões que a mantêm hoje, não apenas no gatilho original.",
      },
      {
        q: "Existem efeitos colaterais?",
        a: "O principal 'efeito colateral' é cansaço temporário durante a restrição de sono nas semanas 1–2. Não há riscos relacionados a medicação.",
      },
      {
        q: "Posso fazer TCC-I enquanto tomo remédio para dormir?",
        a: "Frequentemente sim, com orientação de um clínico. Muitas pessoas reduzem gradualmente a medicação durante ou depois da TCC-I.",
      },
    ],
    nextLesson: "stimulus-control",
  },
  "90-minute-sleep-cycle": {
    meta: {
      title: "O ciclo de sono de 90 minutos | somna",
      desc: "Entenda como os ciclos de sono funcionam e por que acordar no momento certo pode melhorar a sensação de descanso.",
    },
    eyebrow: "LIÇÃO RÁPIDA",
    title: "O ciclo de sono de 90 minutos",
    subtitle:
      "O sono não acontece em um único bloco longo — ele se move por ciclos repetidos, cada um moldando como você se sente pela manhã.",
    readingTime: "5",
    keyTakeaways: [
      "O sono ocorre em ciclos repetidos, não como um estado único e plano.",
      "Um ciclo dura cerca de 90 minutos, em média.",
      "O sono profundo e o REM têm propósitos muito diferentes.",
      "O momento importa: acordar entre ciclos tende a ser mais fácil.",
    ],
    sections: [
      {
        heading: "O que acontece durante o sono?",
        paras: [
          "O sono não é um único estado. Seu cérebro passa por diferentes estágios, cada um com seu próprio padrão de ondas cerebrais, frequência cardíaca e tônus muscular.",
          "Esses ciclos se repetem ao longo da noite, mudando gradualmente de um sono profundo e restaurador no início para períodos mais longos de REM no final.",
        ],
      },
      {
        heading: "Os quatro estágios do sono",
        paras: [
          "O estágio 1 é uma entrada breve e leve no sono. O estágio 2 é um pouco mais profundo e onde passamos a maior parte da noite. O estágio 3 é o sono profundo e de ondas lentas — vital para a recuperação física. O REM (movimento rápido dos olhos) é onde ocorrem a maioria dos sonhos vívidos e é essencial para a memória e o processamento emocional.",
          "Cada ciclo passa por esses estágios em aproximadamente a mesma ordem.",
        ],
      },
      {
        heading: "Por que 90 minutos importam",
        paras: [
          "Em média, um ciclo completo de sono leva cerca de 90 minutos. Acordar no final de um ciculo — em vez de no meio do sono profundo — geralmente parece mais leve e claro.",
          "Por isso calculadoras de sono frequentemente sugerem opções espaçadas de 90 em 90 minutos.",
        ],
      },
      {
        heading: "Por que você às vezes acorda atordoado",
        paras: [
          "Se seu despertador interrompe o sono profundo, você pode acordar confuso ou com a cabeça pesada. Essa névoa é chamada de 'inércia do sono' e pode durar 15–30 minutos.",
          "Ajustar seu horário de deitar em apenas 15–30 minutos pode fazer seu horário de acordar cair em um ponto mais amigável do ciclo.",
        ],
      },
      {
        heading: "Como calculadoras de sono usam os ciclos",
        paras: [
          "Uma calculadora de ciclos de sono trabalha de trás para frente a partir do horário em que você quer acordar, subtraindo ciclos completos de 90 minutos e uma pequena reserva para adormecer.",
          "É uma orientação, não uma garantia — mas para muitas pessoas é um ponto de partida útil para manhãs mais estáveis.",
        ],
      },
    ],
    scienceNote:
      "A duração do ciclo de sono é uma média — ciclos reais variam de cerca de 70 a 120 minutos e mudam ao longo da noite e entre indivíduos.",
    practicalTip:
      "Busque cinco ou seis ciclos completos quando possível. Para a maioria dos adultos, isso significa 7,5–9 horas de sono — bem dentro da faixa respaldada pela ciência.",
    cta: { label: "Usar a calculadora de ciclos", to: "/pt/calculator" },
    relatedGuide: { slug: "how-to-fall-asleep-fast" },
    relatedTool: {
      to: "/pt/calculator",
      label: "Calculadora de ciclos de sono",
      desc: "Ajuste seu horário de deitar aos ciclos completos.",
    },
    faqs: [
      {
        q: "Todo ciclo de sono tem exatamente 90 minutos?",
        a: "Não — 90 minutos é uma média. Ciclos variam aproximadamente entre 70 e 120 minutos e mudam ao longo da noite e entre pessoas.",
      },
      {
        q: "Quantos ciclos devo buscar?",
        a: "A maioria dos adultos se sente melhor com 5–6 ciclos por noite, o que equivale a cerca de 7,5–9 horas de sono.",
      },
      {
        q: "Por que às vezes acordo atordoado mesmo dormindo o suficiente?",
        a: "Você pode ter sido acordado no sono profundo. Ajustar o horário de deitar em 15–30 minutos pode fazer seu despertar cair mais suavemente.",
      },
      {
        q: "O sono profundo é mais importante que o REM?",
        a: "Ambos importam. O sono profundo apoia a recuperação física; o REM apoia a memória e a regulação emocional. Uma noite saudável inclui os dois.",
      },
      {
        q: "Posso rastrear meus ciclos de sono?",
        a: "Dispositivos de consumo estimam os estágios, mas não são precisos do ponto de vista médico. Padrões ao longo de semanas são mais significativos que uma única noite.",
      },
      {
        q: "Por que os ciclos mudam ao longo da noite?",
        a: "Os primeiros ciclos têm mais sono profundo; os ciclos mais tardios têm mais REM. Ambas as metades da noite importam.",
      },
      {
        q: "Sonecas também usam ciclos de sono?",
        a: "Sim. Uma soneca de 90 minutos pode incluir um ciclo completo, enquanto uma soneca de 20 minutos fica nos estágios mais leves e evita a atordoação.",
      },
    ],
    nextLesson: "4-7-8-breathing",
  },
  "4-7-8-breathing": {
    meta: {
      title: "A respiração 4-7-8, explicada | somna",
      desc: "Aprenda como o método de respiração 4-7-8 pode ajudar a reduzir o estado de alerta fisiológico antes de dormir.",
    },
    eyebrow: "LIÇÃO RÁPIDA",
    title: "A respiração 4-7-8, explicada",
    subtitle:
      "Um padrão simples de respiração que reduz suavemente o estado de alerta fisiológico — um ritual prático antes de dormir, respaldado pela fisiologia básica.",
    readingTime: "5",
    keyTakeaways: [
      "A respiração lenta afeta o sistema nervoso autônomo.",
      "Expirações longas e suaves promovem uma resposta de relaxamento.",
      "A consistência importa mais do que a intensidade.",
      "Funciona melhor como parte de uma rotina de sono mais ampla.",
    ],
    sections: [
      {
        heading: "O que é a respiração 4-7-8?",
        paras: [
          "A respiração 4-7-8 é um padrão estruturado: inspire pelo nariz por 4 segundos, segure por 7 segundos e expire lentamente pela boca por 8 segundos.",
          "Ela foi popularizada como técnica de calma, mas seu efeito tem raízes mais antigas — a influência da respiração lenta sobre a resposta de estresse do corpo.",
        ],
      },
      {
        heading: "Como praticar",
        paras: [
          "Sente-se ou deite-se confortavelmente. Coloque a ponta da língua atrás dos dentes da frente. Expire completamente pela boca.",
          "Inspire silenciosamente pelo nariz por 4 segundos. Segure a respiração por 7. Expire pelos lábios entreabertos por 8. Repita por 4 ciclos. Vá aumentando aos poucos — pode parecer intenso no início.",
        ],
      },
      {
        heading: "Por que pode parecer calmante",
        paras: [
          "Expirações longas ativam o ramo parassimpático do sistema nervoso, que diminui a frequência cardíaca e suaviza os sinais de estresse.",
          "Contar também ocupa suavemente a mente, desviando a atenção de pensamentos acelerados.",
        ],
      },
      {
        heading: "Erros comuns",
        paras: [
          "Forçar a respiração demais, segurar com muita tensão ou fazer muitos ciclos de uma vez pode parecer desconfortável.",
          "Se sentir tontura ou leveza, volte à respiração natural. O objetivo é calma, não esforço.",
        ],
      },
      {
        heading: "Como incorporar à rotina noturna",
        paras: [
          "Combine a técnica com outro sinal — diminuir as luzes, lavar o rosto, deitar na cama — para que ela se torne um sinal automático de que o dia está chegando ao fim.",
          "A maioria das pessoas percebe o maior benefício após uma a duas semanas de prática consistente.",
        ],
      },
    ],
    scienceNote:
      "Pesquisas mostraram que a respiração lenta e ritmada reduz a frequência cardíaca, a pressão arterial e o estresse autoavaliado em adultos saudáveis.",
    practicalTip:
      "Experimente apenas 2–4 ciclos de respiração 4-7-8 logo antes de apagar a luz esta noite. Você não está correndo atrás do sono — está sinalizando segurança.",
    cta: { label: "Como adormecer rápido", to: "/pt/how-to-fall-asleep-fast" },
    relatedGuide: { slug: "how-to-fall-asleep-fast" },
    relatedTool: {
      to: "/pt/relax",
      label: "Sessão guiada 4-7-8",
      desc: "Pratique com uma referência visual calma.",
    },
    faqs: [
      {
        q: "A respiração 4-7-8 faz você dormir?",
        a: "Não diretamente. Ela reduz o estado de alerta e apoia a conciliação do sono, mas não é um sedativo.",
      },
      {
        q: "Quantos ciclos devo fazer?",
        a: "Comece com 4 ciclos. Algumas pessoas aumentam ao longo de semanas. Mais nem sempre é melhor.",
      },
      {
        q: "É seguro para todos?",
        a: "É considerada segura para adultos saudáveis. Se você tem problemas pulmonares, pressão baixa ou sente tontura, respire naturalmente.",
      },
      {
        q: "Crianças podem praticar?",
        a: "Uma versão simplificada (segures mais curtos) pode funcionar para crianças maiores, mas consulte um pediatra primeiro.",
      },
      {
        q: "Por que expirar mais tempo do que inspirar?",
        a: "Expirações longas ativam o ramo parassimpático 'descansar e digerir' do sistema nervoso.",
      },
      {
        q: "E se contar me deixar mais ansioso?",
        a: "Pule a contagem. Apenas respire lentamente pelo nariz com uma expiração longa e suave. O padrão importa mais do que os números.",
      },
      {
        q: "Com que frequência devo praticar?",
        a: "Diariamente é o ideal — até fora da hora de dormir — para treinar a resposta. A maioria das pessoas percebe benefícios em 1–2 semanas.",
      },
    ],
    nextLesson: "racing-thoughts-at-night",
  },
  "racing-thoughts-at-night": {
    meta: {
      title: "Quando a mente não silencia à noite | somna",
      desc: "Entenda por que os pensamentos ficam mais altos à noite e como a TCC-I aborda pensamentos acelerados.",
    },
    eyebrow: "LIÇÃO RÁPIDA",
    title: "Quando a mente não silencia à noite",
    subtitle:
      "Pensamentos acelerados na hora de dormir não são um defeito de caráter — são uma característica previsível de um sistema nervoso em estado de alerta. A TCC-I tem ferramentas práticas para eles.",
    readingTime: "5",
    keyTakeaways: [
      "Pensamentos acelerados à noite são comuns, não anormais.",
      "A hipervigilância — física e mental — tem um papel importante.",
      "Tentar suprimir pensamentos geralmente gera o efeito oposto.",
      "A TCC-I oferece ferramentas específicas que funcionam melhor do que 'apenas relaxe'.",
    ],
    sections: [
      {
        heading: "Por que os pensamentos parecem mais altos à noite",
        paras: [
          "Durante o dia, sua atenção é puxada para fora por tarefas, conversas e movimento. À noite, essas distrações caem e os pensamentos internos têm o palco só para eles.",
          "Se você também está cansado e seu córtex pré-frontal (o planejador calmo) está menos ativo, as preocupações podem parecer mais urgentes do que realmente são.",
        ],
      },
      {
        heading: "O modelo da hipervigilância",
        paras: [
          "Pesquisadores descrevem a insônia crônica como um estado de hipervigilância — corpo e mente permanecem muito ativados para que o sono assuma.",
          "Hormônios de estresse, frequência cardíaca acelerada e uma mente ocupada se reforçam mutuamente. Uma vez iniciado, o conselho comum 'tente relaxar' frequentemente não é suficiente.",
        ],
      },
      {
        heading: "Por que tentar não pensar não funciona",
        paras: [
          "Dizer a si mesmo 'pare de pensar' geralmente faz os pensamentos ficarem mais altos. Este é o efeito 'urso polar': quanto mais você tenta suprimir algo, mais ele volta.",
          "A TCC-I muda o objetivo — em vez de parar os pensamentos, você aprende a deixá-los passar sem se envolver.",
        ],
      },
      {
        heading: "Estratégias úteis da TCC-I",
        paras: [
          "Use uma 'janela de preocupação' durante o dia: gaste 10 minutos no início da noite escrevendo preocupações e possíveis próximos passos. Feche o caderno quando acabar o tempo.",
          "Se você estiver preso rodando na cama há 20 minutos, levante. Sente-se em algum lugar com pouca luz. Leia algo leve. Volte apenas quando sentir sono. Isso é controle de estímulos — a ferramenta mais forte do kit de TCC-I.",
        ],
      },
      {
        heading: "Quando procurar ajuda profissional",
        paras: [
          "Se os pensamentos acelerados vierem com humor baixo persistente, pânico diurno ou impacto significativo na vida diária, por favor procure um clínico.",
          "Ansiedade e insônia frequentemente andam juntas e respondem bem a um tratamento coordenado.",
        ],
      },
    ],
    scienceNote:
      "A insônia é cada vez mais compreendida como um distúrbio de hipervigilância — envolvendo ativação cognitiva (mental) e fisiológica (corporal).",
    practicalTip:
      "Esta noite, escreva a lista de tarefas de amanhã antes de escovar os dentes. Externalizar a carga de amanhã diz ao cérebro que ele não precisa ensaiar isso na cama.",
    cta: { label: "Ler o guia de ansiedade e sono", to: "/pt/sleep-anxiety" },
    relatedGuide: { slug: "sleep-anxiety" },
    relatedTool: {
      to: "/pt/relax",
      label: "Respiração para acalmar",
      desc: "Acalme o corpo para acalmar a mente.",
    },
    faqs: [
      {
        q: "Por que os pensamentos acelerados sempre aparecem na hora de dormir?",
        a: "Sem as distrações do dia, os pensamentos internos não têm nada com o que competir. Um córtex pré-frontal cansado também faz as preocupações parecerem mais urgentes.",
      },
      {
        q: "Devo tentar empurrar os pensamentos para longe?",
        a: "Não — isso geralmente os amplifica. O objetivo é notar os pensamentos e deixá-los passar, como nuvens atravessando o céu.",
      },
      {
        q: "Escrever diário realmente ajuda?",
        a: "Sim, especialmente quando feito no início da noite. Uma 'janela de preocupação' externaliza as preocupações para que elas não surjam na cama.",
      },
      {
        q: "Pensamentos acelerados são a mesma coisa que ansiedade?",
        a: "Eles se sobrepõem muito. Se vierem com preocupação persistente, humor baixo ou pânico, considere falar com um clínico.",
      },
      {
        q: "A meditação pode ajudar?",
        a: "Para muitas pessoas, sim — especialmente abordagens baseadas em mindfulness que focam em notar pensamentos sem se envolver.",
      },
      {
        q: "E ouvir podcast na cama?",
        a: "Evidências mistas. Áudio leve funciona para algumas pessoas, enquanto conteúdo envolvente mantém o cérebro muito ativo.",
      },
      {
        q: "Pensamentos acelerados significam que tenho insônia?",
        a: "Não sozinhos. Insônia é definida por dificuldade para dormir que ocorre pelo menos 3 noites por semana por 3+ meses e afeta o funcionamento diurno.",
      },
    ],
    nextLesson: "circadian-rhythm",
  },
  "circadian-rhythm": {
    meta: {
      title: "Luz, cafeína e seu relógio interno | somna",
      desc: "Aprenda como a exposição à luz e a cafeína afetam o ritmo circadiano e o momento do sono.",
    },
    eyebrow: "LIÇÃO RÁPIDA",
    title: "Luz, cafeína e seu relógio interno",
    subtitle:
      "Seu corpo tem um relógio interno de 24 horas. A luz e a cafeína são dois dos sinais mais fortes que moldam quando o sono chega com facilidade.",
    readingTime: "5",
    keyTakeaways: [
      "O ritmo circadiano regula quando você sente sono e quando fica alerta.",
      "A luz da manhã fortalece e estabiliza o relógio biológico.",
      "A luz à noite pode atrasar a conciliação do sono.",
      "A cafeína pode afetar o sono por muitas horas depois do último gole.",
    ],
    sections: [
      {
        heading: "O que é ritmo circadiano?",
        paras: [
          "Seu ritmo circadiano é um ciclo interno de aproximadamente 24 horas que governa o sono, o estado de alerta, os hormônios, a temperatura corporal e muito mais.",
          "Ele funciona esteja você prestando atenção ou não — mas sinais externos, especialmente a luz, o mantêm alinhado com o mundo.",
        ],
      },
      {
        heading: "Luz da manhã e momento do sono",
        paras: [
          "Luz intensa na primeira ou nas duas primeiras horas após acordar envia um sinal claro de 'dia' para o cérebro. Isso ancor seu relógio e facilita pegar no sono na noite seguinte.",
          "A luz externa, mesmo em dias nublados, é muito mais forte que a iluminação interna — e uma caminhada curta lá fora é uma das melhorias de sono mais simples.",
        ],
      },
      {
        heading: "Exposição à luz à noite",
        paras: [
          "Luz intensa no final da noite — incluindo de telas — pode suprimir a melatonina e atrasar o relógio biológico.",
          "Diminua as luzes nos últimos 60–90 minutos antes de dormir e seu sistema nervoso recebe a mensagem de que a noite começou.",
        ],
      },
      {
        heading: "Como a cafeína afeta o sono",
        paras: [
          "A cafeína bloqueia a adenosina, a molécula que constrói a 'pressão do sono' ao longo do dia. Ela tem uma meia-vida de cerca de 5 horas, o que significa que um café às 14h ainda pode estar no seu sistema na hora de dormir.",
          "Mesmo quando você consegue dormir, a cafeína à noite pode reduzir o sono profundo — então você acorda menos descansado sem saber por quê.",
        ],
      },
      {
        heading: "Construindo hábitos de tempo melhores",
        paras: [
          "Busque um horário consistente de acordar, luz da manhã diariamente e um corte de cafeína no início da tarde. Esses três pequenos ajustes podem mudar como a semana inteira se sente.",
          "A consistência é mais importante do que a perfeição. Mudanças pequenas e sustentáveis superam reformas dramáticas.",
        ],
      },
    ],
    scienceNote:
      "A luz está entre os sinais mais fortes que moldam o relógio circadiano — especialmente luz brilhante pela manhã e condições de pouca luz à noite.",
    practicalTip:
      "Pegue luz externa dentro de uma hora de acordar — mesmo uma caminhada de 5–10 minutos já conta. E estabeleça uma regra pessoal de 'nada de cafeína depois das 14h' por duas semanas para ver como suas noites respondem.",
    cta: { label: "Usar a calculadora de hora de dormir", to: "/pt/bedtime-calculator" },
    relatedGuide: { slug: "how-to-fall-asleep-fast" },
    relatedTool: {
      to: "/pt/bedtime-calculator",
      label: "Calculadora de hora de dormir",
      desc: "Encontre o melhor horário para deitar.",
    },
    faqs: [
      {
        q: "Quanto tempo a cafeína fica no organismo?",
        a: "A cafeína tem uma meia-vida de cerca de 5 horas, então metade de um café às 14h ainda está ativa às 19h e um quarto ainda está ativo à meia-noite.",
      },
      {
        q: "A luz da manhã realmente importa?",
        a: "Sim — é um dos sinais mais fortes para ancorar seu ritmo circadiano. Mesmo 5–10 minutos ao ar livre ajudam.",
      },
      {
        q: "Óculos para luz azul valem a pena?",
        a: "Diminuir a intensidade geral de luz à noite tende a importar mais do que filtrar especificamente a luz azul.",
      },
      {
        q: "O descafeinado é totalmente livre de cafeína?",
        a: "Não totalmente — o descafeinado ainda contém uma pequena quantidade de cafeína, geralmente 2–15 mg por xícara.",
      },
      {
        q: "E se eu trabalhar em turnos noturnos?",
        a: "Busque exposição estratégica à luz intensa durante seu 'dia' e escuridão durante sua 'noite'. O trabalho em turnos perturba o ritmo circadiano e se beneficia de um plano adaptado.",
      },
      {
        q: "O álcool afeta meu relógio biológico?",
        a: "O álcool fragmenta o sono e pode alterar a arquitetura do sono mesmo quando ajuda a pegar no sono mais rápido.",
      },
      {
        q: "Quão rápido consigo resetar meu ritmo?",
        a: "A maioria dos adultos muda cerca de 1 hora por dia com luz consistente, horários de refeições e hora de acordar.",
      },
    ],
    nextLesson: "stimulus-control",
  },
  "stimulus-control": {
    meta: {
      title: "Controle de estímulos em linguagem simples | somna",
      desc: "Aprenda uma das estratégias de TCC-I mais eficazes para reconstruir uma conexão saudável entre cama e sono.",
    },
    eyebrow: "LIÇÃO RÁPIDA",
    title: "Controle de estímulos em linguagem simples",
    subtitle:
      "O controle de estímulos reeduca a conexão simples e aprendida entre cama e sono — e é uma das ferramentas mais poderosas da TCC-I.",
    readingTime: "5",
    keyTakeaways: [
      "A cama deve ser associada ao sono — não à vigília.",
      "Ficar acordado na cama reforça silenciosamente a insônia.",
      "A consistência importa mais do que a perfeição.",
      "A melhora leva prática; as primeiras noites são as mais difíceis.",
    ],
    sections: [
      {
        heading: "O que é controle de estímulos?",
        paras: [
          "Controle de estímulos é a prática de usar sua cama e quarto apenas para dormir e intimidade.",
          "O objetivo é simples: quando seu corpo atravessa a porta do quarto, ele sabe o que está prestes a acontecer.",
        ],
      },
      {
        heading: "Como a insônia muda as associações da cama",
        paras: [
          "Depois de noites suficientes deitado acordado, a cama fica pareada com frustração, alerta ou ansiedade.",
          "Isso é condicionamento — o mesmo tipo de aprendizado que faz você salivar ao ouvir um som familiar de janta. Seu cérebro não discute; ele apenas reage.",
        ],
      },
      {
        heading: "A regra dos 20 minutos",
        paras: [
          "Se você não estiver dormindo depois de cerca de 20 minutos (sem olhar o relógio — estime), saia da cama. Vá para outro espaço com pouca luz e faça algo calmo: algumas páginas de um livro leve, alongamentos lentos, uma respiração sentada tranquila.",
          "Volte para a cama apenas quando sentir sono — olhos pesados, cabeça puxando. Repita conforme necessário. Isso soa contraintuitivo, mas é o coração do controle de estímulos.",
        ],
      },
      {
        heading: "Erros comuns",
        paras: [
          "Usar o celular na cama, trabalhar na cama, assistir TV na cama ou ficar deitado 'tentando mais forte' tudo reforça a associação errada.",
          "A aplicação inconsistente também atrasa os resultados. O método funciona melhor quando aplicado todas as noites por várias semanas.",
        ],
      },
      {
        heading: "Quais resultados esperar",
        paras: [
          "A maioria das pessoas descobre que as primeiras 3–5 noites são difíceis — você pode dormir menos inicialmente porque está passando menos tempo deitado acordado.",
          "Na segunda semana, o sono geralmente se consolida: você adormece mais rápido, acorda menos e sente a cama se tornando um sinal de sono novamente.",
        ],
      },
    ],
    scienceNote:
      "O controle de estímulos está entre as técnicas de TCC-I mais bem estudadas e é recomendado como tratamento isolado baseado em evidências para insônia crônica.",
    practicalTip:
      "Mova telas, materiais de trabalho e notebook para fora do quarto esta noite. Mesmo uma pequena mudança física remodela o sinal.",
    cta: { label: "Ler o guia completo de TCC-I", to: "/pt/cbt-i-guide" },
    relatedGuide: { slug: "cbt-i-guide" },
    relatedTool: {
      to: "/pt/calculator",
      label: "Calculadora de ciclos de sono",
      desc: "Combine o horário de deitar aos ciclos naturais.",
    },
    faqs: [
      {
        q: "O que é controle de estímulos na TCC-I?",
        a: "Controle de estímulos é a prática de usar a cama apenas para dormir, sair da cama se você não estiver dormindo e manter um horário fixo de acordar — para que a cama volte a ser um sinal de sono.",
      },
      {
        q: "Quanto tempo leva para o controle de estímulos funcionar?",
        a: "Muitas pessoas percebem melhora em 1–3 semanas de prática consistente.",
      },
      {
        q: "A regra dos 20 minutos é rígida?",
        a: "É uma orientação. Não fique olhando o relógio — estime. Se você estiver claramente acordado e frustrado, saia da cama.",
      },
      {
        q: "O que faço quando saio da cama?",
        a: "Algo calmo e com pouca luz: leia um livro leve, faça alongamentos lentos, sente-se em silêncio. Evite telas, trabalho e estímulos.",
      },
      {
        q: "O controle de estímulos funciona para despertares de madrugada?",
        a: "Sim — a mesma regra dos 20 minutos se aplica. Se você acordar e não conseguir voltar a dormir, saia da cama e volte apenas com sono.",
      },
      {
        q: "E se sair da cama me deixar mais acordado?",
        a: "Mantenha luzes baixas, atividade calma e corpo relaxado. O objetivo não é ficar totalmente alerta, mas permitir que o sono retorne naturalmente.",
      },
      {
        q: "Posso fazer controle de estímulos sem outras ferramentas de TCC-I?",
        a: "Pode ser eficaz sozinho, mas combinado com restrição de sono e horários fixos de acordar produz os melhores resultados.",
      },
    ],
    nextLesson: "what-is-cbti",
  },
};

export const ptLearnDict: LearnDict = {
  ui: ptUi,
  titles: ptTitles,
  summaries: ptSummaries,
  lessons: ptLessons,
};
