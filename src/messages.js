/**
 * Utilize este arquivo para definir as mensagens de boas-vindas e despedidas do grupo.
 * As mensagens podem conter a menção ao membro que entrou ou saiu do grupo.
 * Você pode personalizar as mensagens conforme necessário.
 *
 * Para colocar a menção ao membro, use "@member" na mensagem.
 *
 * @author Dev Gui
 */
export const welcomeMessage = `╭━━━〔 👋 BEM-VINDO(A) 〕━━━╮

👤 @member entrou no grupo.

Seja muito bem-vindo(a)! Esperamos que sua experiência aqui seja agradável e que você aproveite a comunidade.

📌 Antes de participar, confira as regras do grupo e respeite os demais membros.

🤖 Desejamos uma ótima permanência por aqui.

╰━━━━━━━━━━━━━━━━━━━━━━╯`;

export const exitMessage =
  "Poxa, @member saiu do grupo... Sentiremos sua falta!";

export function clearChat() {
  return `🗑️${"\n".repeat(1891)}🗑️`;
}
