import { PREFIX } from "../../config.js";
import { isTrue, isFalse } from "../../utils/index.js";
import {
  isActiveGroupRestriction,
  updateIsActiveGroupRestriction,
} from "../../utils/database.js";

export default {
  name: "antiflood",
  description: "Ativa ou desativa a proteção contra flood.",
  commands: ["antiflood", "anti-flood"],
  usage: `${PREFIX}antiflood (1/0)`,

  handle: async ({
    args,
    remoteJid,
    sendReply,
  }) => {
    const on = isTrue(args[0]);
    const off = isFalse(args[0]);

    if (!on && !off) {
      await sendReply(
        `⚠️ Use:\n\n${PREFIX}antiflood 1 — ativar\n${PREFIX}antiflood 0 — desativar`
      );
      return;
    }

    const active = isActiveGroupRestriction(remoteJid, "antiflood");

    if (on && active) {
      await sendReply("🛡️ O anti-flood já está ativado.");
      return;
    }

    if (off && !active) {
      await sendReply("🛡️ O anti-flood já está desativado.");
      return;
    }

    updateIsActiveGroupRestriction(remoteJid, "antiflood", on);

    await sendReply(
      on
        ? "🛡️ Anti-flood ativado com sucesso!"
        : "🛡️ Anti-flood desativado com sucesso!"
    );
  },
};
