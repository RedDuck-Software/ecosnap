import { findPDA } from "../tests/common/utils";
import { GLOBAL_STATE_PARAMS, program, SEEDS } from "../tests/common/constants";
import {
  Keypair,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";

import anchor from "@coral-xyz/anchor";

module.exports = async function (provider: AnchorProvider) {
  anchor.setProvider(provider);
  const authority = new Keypair((provider.wallet as any).payer._keypair);

  const globalStatePda = anchor.web3.Keypair.generate();

  const [vaultPda] = findPDA(
    [SEEDS.VAULT_SEED, globalStatePda.publicKey],
    program,
  );

  // FIXME to a real reserve wallet address before deploy!
  const reserveWallet = anchor.web3.Keypair.generate();

  const initProtocolTx = new Transaction().add(
    await program.methods
      .initialize(
        provider.wallet.publicKey,
        reserveWallet.publicKey,
        GLOBAL_STATE_PARAMS.MIN_USD_THRESHOLD,
        GLOBAL_STATE_PARAMS.MAX_TOKENS_TO_SELL,
      )
      .accounts({
        authority: provider.wallet.publicKey,
        globalState: globalStatePda.publicKey,
        vault: vaultPda,
      })
      .signers([authority, globalStatePda])
      .instruction(),
  );

  try {
    const sendedTx = await sendAndConfirmTransaction(
      provider.connection,
      initProtocolTx,
      [authority, globalStatePda],
    );
    console.log("Initialized, tx id:  ", sendedTx);

    console.log("Authority: ", authority.publicKey);
    console.log("Global state PDA ", globalStatePda.publicKey);
    console.log("Vault: ", vaultPda);
  } catch (e) {
    console.error("ERROR! 🔴");
    console.error(e);
  }
};
