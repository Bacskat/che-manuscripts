import type { Manuscript, Quote } from './shared'

// real Che quotes, chinese + english + spanish
export const QUOTES: readonly Quote[] = [
  {
    zh: '被伟大的爱所引导的，才是真正的革命者。',
    en: 'The true revolutionary is guided by great feelings of love.',
    es: 'El verdadero revolucionario es guiado por grandes sentimientos de amor.',
  },
  {
    zh: '如果你为每一个不公正而颤抖，那你就是我的同志。',
    en: 'If you tremble with indignation at every injustice then you are a comrade of mine.',
    es: 'Si tiemblas de indignación ante cada injusticia, eres un camarada mío.',
  },
  {
    zh: '革命不是熟透的苹果，你必须让它掉下来。',
    en: 'The revolution is not an apple that falls when it is ripe. You have to make it fall.',
    es: 'La revolución no es una manzana que cae cuando está madura. Hay que hacerla caer.',
  },
  {
    zh: '我不是解放者，解放者并不存在，是人民自己解放自己。',
    en: 'I am not a liberator. Liberators do not exist. The people liberate themselves.',
    es: 'No soy un libertador. Los libertadores no existen. Son los pueblos los que se liberan a sí mismos.',
  },
  {
    zh: '要坚硬起来，但永远不要失去温柔。',
    en: 'One must harden oneself without ever losing tenderness.',
    es: 'Hay que endurecerse sin perder jamás la ternura.',
  },
  {
    zh: '我知道你是来杀我的。开枪吧，懦夫，你只是杀死一个人。',
    en: 'I know you have come to kill me. Shoot, coward, you are only going to kill a man.',
    es: 'Sé que has venido a matarme. Dispara, cobarde, solo vas a matar a un hombre.',
  },
  {
    zh: '直到胜利，永远。',
    en: 'Ever onward to victory!',
    es: 'Hasta la victoria, siempre.',
  },
]

export const MANUSCRIPTS: readonly Manuscript[] = [
  { id: 'manuscript1966', href: './pdf/Diario_P1-Cuaderno.pdf' },
  { id: 'manuscript1967', href: './pdf/Diario_P2-Agenda-.pdf' },
  { id: 'manuscriptEvaluaciones', href: './pdf/Evaluaciones-H.pdf' },
]

export const MANUSCRIPT_COVERS = Array.from(
  { length: 12 },
  (_, i) => `./manuscripts-che/Manuscripts-che-${String(i).padStart(2, '0')}.webp`,
)
