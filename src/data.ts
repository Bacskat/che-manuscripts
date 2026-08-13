import type { Manuscript, Quote } from './shared'

// real Che quotes, chinese + spanish — add yours here
export const QUOTES: readonly Quote[] = [
  {
    zh: '被伟大的爱所引导的，才是真正的革命者。',
    es: 'El verdadero revolucionario es guiado por grandes sentimientos de amor.',
  },
  {
    zh: '如果你为每一个不公正而颤抖，那你就是我的同志。',
    es: 'Si tiemblas de indignación ante cada injusticia, eres un camarada mío.',
  },
  {
    zh: '革命不是熟透的苹果，你必须让它掉下来。',
    es: 'La revolución no es una manzana que cae cuando está madura. Hay que hacerla caer.',
  },
  {
    zh: '我不是解放者，解放者并不存在，是人民自己解放自己。',
    es: 'No soy un libertador. Los libertadores no existen. Son los pueblos los que se liberan a sí mismos.',
  },
  {
    zh: '要坚硬起来，但永远不要失去温柔。',
    es: 'Hay que endurecerse sin perder jamás la ternura.',
  },
  {
    zh: '我知道你是来杀我的。开枪吧，懦夫，你只是杀死一个人。',
    es: 'Sé que has venido a matarme. Dispara, cobarde, solo vas a matar a un hombre.',
  },
  {
    zh: '直到胜利，永远。',
    es: 'Hasta la victoria, siempre.',
  },
]

export const MANUSCRIPTS: readonly Manuscript[] = [
  { label: '手稿:1966', href: './pdf/Diario_P1-Cuaderno.pdf' },
  { label: '手稿:1967', href: './pdf/Diario_P2-Agenda-.pdf' },
  { label: '队员评估手稿', href: './pdf/Evaluaciones-H.pdf' },
]

export const MANUSCRIPT_COVERS = Array.from(
  { length: 12 },
  (_, i) => `./manuscripts-che/Manuscripts-che-${String(i).padStart(2, '0')}.webp`,
)
