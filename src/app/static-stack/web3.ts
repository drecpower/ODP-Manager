

export class SSWeb3 {

    public static checkChainNetwork(onChange=null, onNotChange=null,onError=null) {
      if (onError==null) onError=(error)=>{
        console.log(error);
      }

      if (onChange==null) onChange=()=>{
        console.log('change');
      }

      if (onNotChange==null) onNotChange=()=>{
        console.log('onNotChange');
      }

        if (window["ethereum"].chainId!='0x89'){
          var netparams = [{
            chainId: '0x89',
            chainName: 'Polygon Mainnet',
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
            },
            rpcUrls: ['https://polygon-rpc.com/'],
            blockExplorerUrls: ['https://polygonscan.com/']
        }];
    
        window['web3'].currentProvider.request({ method: 'wallet_addEthereumChain', params:netparams })
                        .then((d) => {
                          setTimeout(() => {
                            if ((window["ethereum"].chainId=='0x89')){
                              onChange();
                            } else {
                              onNotChange();
                            }
                        }, 1000);
                        })
                        .catch((error) => onError(error));
        }
      }
}