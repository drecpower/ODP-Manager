import { IdentityProvider } from "./identity-provider-interface"
import { ethers } from "ethers"


export class EthIdentityProvider extends IdentityProvider {
    provider;
    wallet;
    
    static _type=<any>"ethereum";

  constructor (options:any = {}) {
    super()
    this.provider= (window as any).ethereum ? (new ethers.providers.Web3Provider((window as any).ethereum)) : new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/");
    this.wallet = (window as any).ethereum ? this.provider.getSigner():ethers.Wallet.createRandom();
    this.wallet = options.wallet
  }

  // Returns the type of the identity provider
  static get type () { return this._type }

  // Returns the signer's id
  async getId (options = {}) {
    var ssW= (sessionStorage.getItem("wallet_getId"));
    if (ssW!=null){
        return ssW;
    } else {
        if (!this.wallet) {
            this.wallet = ((await this._createWallet(options)) as any )
          }
          let ret=await (this.wallet.getAddress() as any)
          sessionStorage.setItem("wallet_getId",ret);
          return ret
    }
  }

  // Returns a signature of pubkeysignature
  async signIdentity (data, options = {}) {
    var ssSI=(sessionStorage.getItem("wallet_signedid"));
    if (ssSI!=null){
        return ssSI;
    } else {
        const wallet = this.wallet
        if (!wallet) { throw new Error('wallet is required') }
    
        let ret=await (wallet.signMessage(data) as any)
        sessionStorage.setItem("wallet_signedid",ret);
        return ret;
    }
  }

  static async verifyIdentity(identity) {
    // Verify that identity was signed by the id
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const wallet = provider.getSigner();
    const verifyMessage=ethers.utils.verifyMessage;
    const signerAddress = verifyMessage(identity.publicKey + identity.signatures.id, identity.signatures.publicKey)
    return (signerAddress === identity.id)
  }

  async _createWallet (options:any = {}) {
    if (options.mnemonicOpts) {
      if (!options.mnemonicOpts.mnemonic) {
        throw new Error('mnemonic is required')
      }
      const Wallet = ethers.Wallet;
      return Wallet.fromMnemonic(options.mnemonicOpts.mnemonic, options.mnemonicOpts.path, options.mnemonicOpts.wordlist)
    }
    if (options.encryptedJsonOpts) {
      if (!options.encryptedJsonOpts.json) {
        throw new Error('encrypted json is required')
      }
      if (!options.encryptedJsonOpts.password) {
        throw new Error('password for encrypted json is required')
      }
      const Wallet = ethers.Wallet;
      return Wallet.fromEncryptedJson(options.encryptedJsonOpts.json, options.encryptedJsonOpts.password, options.encryptedJsonOpts.progressCallback)
    }
    const Wallet = ethers.Wallet;
    return Wallet.createRandom()
  }
}
