import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { CustomerAppEndpoint, HashData } from 'src/app/api/models';
import { BrandService, HashDataService, MerchantGroupService, MerchantService, ProductService } from 'src/app/api/services';
import { CouponService } from 'src/app/api/services/coupon.service';
import { CustomerAppEndpointService } from 'src/app/api/services/customer-app-endpoint.service';
import { PaymentMethodService } from 'src/app/api/services/payment-method.service';
import { SystemService } from 'src/app/services/system.service';
import { SSIpfs } from 'src/app/static-stack/ipfs';
import { Buffer } from 'buffer'
import { SSUuid } from 'src/app/static-stack/uuid';
import { CatalogDataService } from 'src/app/services/catalog/catalog-data.service';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat'

import all from 'it-all';
import { SSLoadLib } from 'src/app/static-stack/loadlib';
import { SSWeb3 } from 'src/app/static-stack/web3';
import { ImgService } from 'src/app/services/img.service';
import { SSOrbitdb } from 'src/app/static-stack/orbitdb';
import Enumerable from 'linq';
@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {



  static ipfsW3GWList = 'https://gw.crustapps.net/;https://crustwebsites.net/;https://crustipfs.xyz/;https://ipfs-gw.decloud.foundation/;https://ipfs.opendelivery.app/;CUSTOM GATEWAY';
  static ipfsOdpCustomerAppPublication = "QmPdmjW4JeApPxgvXWmEe8BrejvpHU833iuzgmDLjTH4Dy";//Qmd4BNZnLf9Fwj2bkNWDjqxhFL7FCUrKFHd1swn5wonmJ1 "QmXGEvrWhs6P5R2SJ8QnsNZbhgrMPzfoieryDjqUjSiN6M";// "Qmec5wW8AosWUnzEi3ou2a9niPFwDaWSr71LemJrGaZvvv";
  static odpStoreNamesContractAddress = "0xa126495c83e5ebcb98a7e71f02449dc8434f804b";
  static odpStoreNamesContractAbi = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_appBaseUri",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_contractMetaData",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "foundationWallet",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "codename",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "ipfs_app",
          "type": "string"
        }
      ],
      "name": "createNewStore",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "newBaseUri",
          "type": "string"
        }
      ],
      "name": "updateBaseUri",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "newUri",
          "type": "string"
        }
      ],
      "name": "updateContractMetaUri",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newPrice",
          "type": "uint256"
        }
      ],
      "name": "updateCurrentChangeCodeNamePrice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newPrice",
          "type": "uint256"
        }
      ],
      "name": "updateCurrentCreatePrice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newPrice",
          "type": "uint256"
        }
      ],
      "name": "updateCurrentUpdatePrice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "codename",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "updateTokenCodename",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "newUri",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "updateTokenURI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "codeName_to_tokenId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "contractURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentChangeCodeNamePrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentCreatePrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentUpdatePrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "foundationPublicWallet",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "tokenByIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "tokenId_to_codeName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "tokenId_to_hashCustomerApp",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "tokenOfOwnerByIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  constructor(
    public brandSvc: BrandService,
    public systemSvc: SystemService,
    public couponSvc: CouponService,
    public paymentMethodSvc: PaymentMethodService,
    public customerAppEndpointSvc: CustomerAppEndpointService,
    public productSvc: ProductService,
    public hashdataSvc: HashDataService,
    public catalogDataSvc: CatalogDataService,
    public imgSvc: ImgService,
    public merchantGroupSvc: MerchantGroupService,
    public merchantSvc: MerchantService
  ) { }
  lastKnownPublications = [];

  lastPublication = "";
  lastAppPublication = "";
  lastIPNSPublication = "";
  lastResultTokenMeta = "";
  lastPubHash;

  publishingHashData = 0;
  publishingAppData = 0;
  publishingIPNS = 0;
  publishingNFT = 0;

  generateCustomerAppEnabled = true;
  publishCustomerAppEnabled = true;
  pushHashDataToOrbitDbEnabled = true;
  updateNFTEnabled = true;
  useCustomIpfsGatewayEnabled = false;
  selectedIpfsGateway = PublishComponent.ipfsW3GWList.split(";")[0];
  listGateways = PublishComponent.ipfsW3GWList.split(";");
  customGateway = "http://127.0.0.1:5001/";

  odpStoreNameValue = "";
  appname: string = "";
  shortname: string = "";

  isNftOwner = false;
  isNftFree = true;
  isWrongNetwork = false;
  nftHash = "";
  appicon = "";
  showmoreoptions = false;

  genHashDataMsg = "";
  genCustomerAppMsg = "";
  genIpnsMsg = "";
  workingWeb3 = false;
  workingWeb3Msg = "";
  workingWeb3Title = "";
  hasMintedOrUpdatedNftFlag=false;
  hasMintedOrUpdatedErrorNftFlag=false;
  lastMintedNftName="";
  lastHashdata="";
  lastHashApp="";

  setCurrentGateway(value) {
    this.checkCustomGW();
    localStorage.setItem("publish_current_ipfs_gateway", this.selectedIpfsGateway);
  }

  checkCustomGW() {
    if (this.selectedIpfsGateway == "CUSTOM GATEWAY") {
      this.useCustomIpfsGatewayEnabled = true;
    } else {
      this.useCustomIpfsGatewayEnabled = false;
    }
  }

  getLoweredUnspacedName(strName: string) {
    return strName.toLowerCase().replace(/ /g, "");
  }

  ngOnInit(): void {
    this.catalogDataSvc.start();
    this.catalogDataSvc.load();
    this.loadHashes();
    var pwaManifest = JSON.parse(this.systemSvc.selectedMerchantGroup.pwaManifest);
    this.odpStoreNameValue = this.getLoweredUnspacedName(pwaManifest.odpStoreName ? pwaManifest.odpStoreName : pwaManifest.name);
    this.appname = pwaManifest.name;
    this.shortname = pwaManifest.short_name;
    if (pwaManifest.odpName) {
      this.odpStoreNameValue = pwaManifest.odpName;
    }
    this.imgSvc.getBlobUrlFromHashAsync(pwaManifest.app_icon_ipfs).then(d => {
      this.appicon = d;
    });
    if (this.updateNFTEnabled) {
      this.checkNFT();
    }

    let stgGateway = (localStorage.getItem("publish_current_ipfs_gateway"));
    if (stgGateway) {
      this.selectedIpfsGateway = stgGateway;
      this.checkCustomGW();
    }

  }

  _web3: any = null;
  async web3() {
    if (!this._web3) {
      var web3HTMLElement = await SSLoadLib.loadJSLib("web3lib", "libs/web3.min.js");
      var w3 = new window['Web3'](window['Web3'].givenProvider || "ws://localhost:8545");
      this._web3 = w3;
      this.checkNetwork();
    }
    return this._web3;
  }

  async checkNetwork() {
    SSWeb3.checkChainNetwork(
      () => {
        document.location.reload();
      },
      () => {
        this.isWrongNetwork = true;
      });
  }

  async loadHashes() {
    let hashes = await this.hashdataSvc.getApiHashData().toPromise();
    hashes = Enumerable.from(hashes).orderByDescending(p => p.createdAt).toArray();
    this.lastKnownPublications = hashes;
    try {
      let onlyNameds=Enumerable.from(hashes).where(p=>(p.odpName!=undefined && p.odpName.length>0)).orderByDescending(p=>p.createdAt).toArray();
      if (onlyNameds.length>0) {
        if (onlyNameds[0].hash)
        this.lastHashdata=onlyNameds[0].hash;
  
        if (onlyNameds[0].hashApp)
        this.lastHashApp=onlyNameds[0].hashPackage;
      } 
    } catch (error) {
      
    }
    
  }

  async checkNFT(popAlert = false) {
    this.isNftOwner = false;
    var web3 = await this.web3();
    var odpStoreContract = new web3.eth.Contract(PublishComponent.odpStoreNamesContractAbi, PublishComponent.odpStoreNamesContractAddress);

    var tokenFromCodename = parseInt(await odpStoreContract.methods.codeName_to_tokenId(this.odpStoreNameValue).call());
    if (tokenFromCodename == 0) {
      this.isNftFree = true;
    } else {
      this.isNftFree = false;
      var tokenOwner = await odpStoreContract.methods.ownerOf(tokenFromCodename).call();
      this.nftHash = (await odpStoreContract.methods.tokenId_to_hashCustomerApp(tokenFromCodename).call());
      var web3Accounts = await web3.eth.requestAccounts();
      if (tokenOwner != web3Accounts[0]) {
        if (popAlert) {
          alert("NFT already exists");
        }
        this.isNftOwner = false;
      } else {
        this.isNftOwner = true;
      }
    }
    if (this.isNftOwner || this.isNftFree) {
      let mgroup = this.systemSvc.selectedMerchantGroup;
      var pwaManifest = JSON.parse(mgroup.pwaManifest);
      pwaManifest.odpName = this.odpStoreNameValue;
      mgroup.pwaManifest = JSON.stringify(pwaManifest);
      let mgroupupdated = await this.merchantGroupSvc.putApiMerchantGroupId({ id: mgroup.id, body: mgroup }).toPromise();
      this.systemSvc.selectedMerchantGroup = mgroupupdated;
    }
    return (this.isNftOwner || this.isNftFree);
  }


  async mintNFT() {
    try {
      this.isNftFree = false;
      this.hasMintedOrUpdatedErrorNftFlag=false;
      this.hasMintedOrUpdatedNftFlag=false;
      let Web3 = <any>window['Web3'];
      let web3 = await this.web3();
      var odpStoreContract = new web3.eth.Contract(PublishComponent.odpStoreNamesContractAbi, PublishComponent.odpStoreNamesContractAddress);
      var gasPrice = await web3.eth.getGasPrice();
      var pwaManifest = JSON.parse(this.systemSvc.selectedMerchantGroup.pwaManifest);
      var web3Accounts = await web3.eth.requestAccounts();
      var mintPrice = parseInt(await odpStoreContract.methods.currentCreatePrice().call());
      var createNewStoreMethodCall = (await odpStoreContract.methods.createNewStore(this.odpStoreNameValue, this.lastResultTokenMeta));
      var estimatedGas = parseInt(await createNewStoreMethodCall.estimateGas({ from: web3Accounts[0], value: mintPrice * 1.1, gasPrice: gasPrice, gasLimit: "1000000" }));
      var estimatedGasCost = estimatedGas * gasPrice;
      this.workingWeb3 = true;
      this.workingWeb3Title = "Minting";
      this.lastMintedNftName=this.odpStoreNameValue;
      this.workingWeb3Msg="waiting for metamask transaction confirmation";
      var mintTx = await createNewStoreMethodCall.send({ from: web3Accounts[0], value: mintPrice + estimatedGasCost, gasPrice: gasPrice, gasLimit: "1000000" });
      console.log(mintTx);
      var hashp: HashData = JSON.parse(JSON.stringify(this.lastPubHash));
      hashp.odpName = this.odpStoreNameValue;
      var hashOdpName = await this.hashdataSvc.postApiHashDataResponse(hashp).toPromise();
      this.lastPubHash = hashOdpName;
      this.hasMintedOrUpdatedNftFlag=true;
      this.workingWeb3Msg="";
      this.loadHashes();
      setTimeout(() => {
        this.checkNFT();
      }, 5000);
    } catch (error) {
      this.workingWeb3Msg = "Error minting NFT";
      try {
        this.workingWeb3Msg+=": ("+error.code+") "+error.message;
      } catch (err) {
        
      }
      this.hasMintedOrUpdatedErrorNftFlag=true;
      setTimeout(() => {
        this.checkNFT();
      }, 100);
    }
    this.workingWeb3Title="";
    this.workingWeb3 = false;

  }

  async updateNFT() {

    try {
      this.isNftFree = false;
      this.hasMintedOrUpdatedErrorNftFlag=false;
      this.hasMintedOrUpdatedNftFlag=false;
      this.nftHash = this.lastAppPublication;
      let Web3 = <any>window['Web3'];
      let web3 = await this.web3();
      var odpStoreContract = new web3.eth.Contract(PublishComponent.odpStoreNamesContractAbi, PublishComponent.odpStoreNamesContractAddress);
      var gasPrice = await web3.eth.getGasPrice();
      var pwaManifest = JSON.parse(this.systemSvc.selectedMerchantGroup.pwaManifest);
      var web3Accounts = await web3.eth.requestAccounts();

      var tokenFromCodename = parseInt(await odpStoreContract.methods.codeName_to_tokenId(this.odpStoreNameValue).call());

      var currentUpdatePrice = parseInt(await odpStoreContract.methods.currentChangeCodeNamePrice().call());
      var updateURIMethodCall = (await odpStoreContract.methods.updateTokenURI(this.lastResultTokenMeta, tokenFromCodename.toString()));
      this.workingWeb3 = true;
      this.workingWeb3Title = "Updating";
      this.lastMintedNftName=this.odpStoreNameValue;
      this.workingWeb3Msg="waiting for metamask transaction confirmation";
      var mintTx = await updateURIMethodCall.send({ from: web3Accounts[0], value: currentUpdatePrice, gasPrice: gasPrice, gasLimit: "1000000" });
      console.log(mintTx);
      var hashp: HashData = JSON.parse(JSON.stringify(this.lastPubHash));
      hashp.odpName = this.odpStoreNameValue;
      var hashOdpName = await this.hashdataSvc.postApiHashDataResponse(hashp).toPromise();
      this.lastPubHash = hashOdpName;
      this.hasMintedOrUpdatedNftFlag=true;
      this.workingWeb3Msg="";
      this.loadHashes();
      setTimeout(() => {
        this.checkNFT();
      }, 5000);
    } catch (error) {
      this.workingWeb3Msg = "Error updating NFT";
      try {
        this.workingWeb3Msg+=": ("+error.code+") "+error.message;
      } catch (err) {
        
      }
      this.hasMintedOrUpdatedErrorNftFlag=true;
      setTimeout(() => {
        this.checkNFT();
      }, 100);
    }
    this.workingWeb3Title="";
    this.workingWeb3 = false;


  }


  getIpfsGWLink(cid) {
    return (this.useCustomIpfsGatewayEnabled ? this.customGateway : this.selectedIpfsGateway) + "ipfs/" + cid;
  }

  getIpfsGWLinkView(cid) {
    return "ipfs://" + cid;
  }

  getIpnsGWLink(ipns) {
    return (this.useCustomIpfsGatewayEnabled ? this.customGateway : this.selectedIpfsGateway) + "ipns/" + ipns;
  }

  getOdpStoreLink(cid) {
    let _odpStoreLink = "ipfs://" + PublishComponent.ipfsOdpCustomerAppPublication + "/#/?cid=" + cid;
    return _odpStoreLink;
  }

  getOdpStoreGatewayLink(cid) {
    let _odpStoreLink = (this.useCustomIpfsGatewayEnabled ? this.customGateway : this.selectedIpfsGateway) + "ipfs/" + PublishComponent.ipfsOdpCustomerAppPublication + "/#/?cid=" + cid;
    return _odpStoreLink;
  }

  async onUploadIcon(metadata) {
    let mgroup = this.systemSvc.selectedMerchantGroup;
    this.appicon = await this.imgSvc.getBlobUrlFromHashAsync(metadata.ipfsHash);
    var pwaManifest = JSON.parse(mgroup.pwaManifest);
    pwaManifest.app_icon_ipfs = metadata.ipfsHash;
    mgroup.pwaManifest = JSON.stringify(pwaManifest);
    let mgroupupdated = await this.merchantGroupSvc.putApiMerchantGroupId({ id: mgroup.id, body: mgroup }).toPromise();
    this.systemSvc.selectedMerchantGroup = mgroupupdated;
    console.log(this.systemSvc.selectedMerchantGroup);
  }

  cleanStringify(object) {
    if (object && typeof object === 'object') {
      object = this.copyWithoutCircularReferences([object], object);
    }
    return JSON.stringify(object);
  }

  copyWithoutCircularReferences(references, object, maxDepth = 10, depth = 0) {
    var _self = this;
    var cleanObject = {};
    Object.keys(object).forEach(function (key) {
      var value = object[key];
      if (value && typeof value === 'object') {
        if (references.indexOf(value) < 0 || depth < maxDepth) {
          references.push(value);
          cleanObject[key] = _self.copyWithoutCircularReferences(references, value, maxDepth, depth + 1);
          references.pop();
        } else {
          cleanObject[key] = '###_Circular_###';
        }
      } else if (typeof value !== 'function') {
        cleanObject[key] = value;
      }
    });
    return cleanObject;
  }



  async generateAndPublish() {
    console.log("publishing");
    this.hasMintedOrUpdatedErrorNftFlag=false;
    this.hasMintedOrUpdatedNftFlag=false;
    this.lastMintedNftName="";
    this.genHashDataMsg = "collecting data";
    let mgroup = this.systemSvc.selectedMerchantGroup;
    var pwaManifest = JSON.parse(mgroup.pwaManifest);
    pwaManifest.name = this.appname;
    pwaManifest.short_name = this.shortname;
    pwaManifest.odpName = this.odpStoreNameValue;
    mgroup.pwaManifest = JSON.stringify(pwaManifest);
    this.systemSvc.selectedMerchantGroup = mgroup;

    this.publishingHashData = 1;
    if (this.generateCustomerAppEnabled) this.publishingAppData = 1;
    if (this.publishCustomerAppEnabled) this.publishingIPNS = 1;

    this.genHashDataMsg = "setting ipfs gateway";

    var ipfsGw = this.useCustomIpfsGatewayEnabled ? this.customGateway : this.selectedIpfsGateway;

    const ipfsScript = (await SSIpfs.getIpfsHttpScriptInstance());
    const Ipfs = window["IpfsHttpClient"];

    const pair = ethers.Wallet.createRandom();
    const sig = await pair.signMessage(pair.address);
    const authHeaderRaw = `eth-${pair.address}:${sig}`;
    const authHeader = Buffer.from(authHeaderRaw).toString('base64');

    var datahashChannel = "";
    var logDatahashChannel: any = null;


    const ipfs = Ipfs.create({
      url: `${ipfsGw}api/v0`,
      headers: this.useCustomIpfsGatewayEnabled ? undefined : {
        authorization: `Basic ${authHeader}`
      }
    });

    if (this.pushHashDataToOrbitDbEnabled) {
      try {
        var _ipfsNode = await SSIpfs.getNode();
        var scriptElm = await SSOrbitdb.GetOrbitDbInstance(_ipfsNode);
        logDatahashChannel = await SSOrbitdb.GetLogInstancePool(this.systemSvc.selectedMerchant.id + "_hashdata");

        datahashChannel = logDatahashChannel.id;
        console.log("dataHashChannel: " + datahashChannel);
        this.genHashDataMsg = "creating dataHash channel";
      } catch (error) {

      }

    }

    this.genHashDataMsg = "collecting brand data";
    var brandObj = await this.brandSvc.getApiBrandId(this.systemSvc.selectedMerchantGroup.id).toPromise();
    if (brandObj != null && brandObj) {
      brandObj.merchant.forEach(_merc => {
        _merc.delinetPrivateKey = datahashChannel;
        _merc.catalog.forEach(_catalog => {
          try {
            _catalog.merchantIdNavigation.delinetPrivateKey = "*";
            delete _catalog.merchantIdNavigation;
          } catch (error) {
          }
        });
      });

      const files: {
        path: string;
        content: string | Blob;
      }[] = [
          {
            path: `/data/${brandObj!['id']}.json`,
            content: JSON.stringify(brandObj)
          },
          {
            path: `/data/id`,
            content: brandObj!['id']
          }
        ];


      this.genHashDataMsg = "collecting products data";
      var productRequest = await this.productSvc.getApiProductMerchantGroupMerchantGroupIdResponse(this.systemSvc.selectedMerchantGroup.id).toPromise();
      if (productRequest != null && productRequest.body) {
        files.push({
          path: `/data/product-list.json`,
          content: JSON.stringify(productRequest.body)
        })

        for (let index = 0; index < productRequest.body.length; index++) {
          const p = productRequest.body[index];
          files.push({
            path: `/data/product/${p.id}.json`,
            content: JSON.stringify(p)
          });

          if (p.image) {
            files.push({
              path: "/data/images/" + p.id,
              content: (await SSIpfs.getImageBlobFromIpfs(p.image))
            })
          }

        }
      }

      this.genHashDataMsg = "collecting merchants data";
      for (let idxMerchant = 0; idxMerchant < brandObj.merchant.length; idxMerchant++) {
        const brandMerchant = brandObj.merchant[idxMerchant];
        let merchant = await this.merchantSvc.getApiMerchantId(brandMerchant.id).toPromise();

        var couponsRequest = await this.couponSvc.getApiCouponMerchantMerchantIdResponse(merchant.id).toPromise();
        if (couponsRequest != null && couponsRequest.body) {
          files.push({
            path: `/data/merchant/${merchant.id}/coupon-list.json`,
            content: JSON.stringify(couponsRequest.body)
          })
        }

        var paymentMethodRequest = await this.paymentMethodSvc.getApiPaymentMethodMerchantMerchantIdResponse(merchant.id).toPromise();
        if (paymentMethodRequest != null && paymentMethodRequest.body) {
          files.push({
            path: `/data/merchant/${merchant.id}/payment-method-list.json`,
            content: JSON.stringify(paymentMethodRequest.body)
          })
        }

        var catalogsM = merchant.catalog;
        files.push({
          path: `/data/merchant/${merchant.id}/catalog-list.json`,
          content: JSON.stringify(catalogsM)
        });
        catalogsM.forEach(_catalog => {
          files.push({
            path: `/data/merchant/${merchant.id}/catalog/${_catalog.id}/category-list.json`,
            content: JSON.stringify(_catalog.category)
          });

          _catalog.category.forEach(_category => {
            console.log("CATITEM>");
            console.log(_catalog);
            files.push({
              path: `/data/merchant/${merchant.id}/catalog/${_catalog.id}/category/${_category.id}/items-list.json`,
              content: JSON.stringify(_category.item)
            });
            _category.item.forEach(_itm => {
              files.push({
                path: `/data/item/${_itm.id}.json`,
                content: JSON.stringify(_itm)
              });
            })
          })
        })

        this.genHashDataMsg = "collecting endpoints data";
        var customerAppEndPointRequest = await this.customerAppEndpointSvc.getApiCustomerAppEndpointMerchantMerchantIdResponse(merchant.id).toPromise();
        if (customerAppEndPointRequest != null && customerAppEndPointRequest.body) {
          if (customerAppEndPointRequest.body.length > 0) {
            files.push({
              path: `/data/merchant/${merchant.id}/customer-app-endpoint-list.json`,
              content: JSON.stringify(customerAppEndPointRequest.body)
            })
          } else {
            var custAppEndpoints: CustomerAppEndpoint[] = [];
            custAppEndpoints.push({
              id: merchant.id,
              createdAt: this.systemSvc.selectedMerchantGroup.createdAt,
              protocolType: "ORBIT_DB",
              uri: merchant.delinetEndpoint,
              type: "ORDER",
              publicKey: merchant.delinetPublicKey,
              privateKey: merchant.delinetPrivateKey,
              merchantId: merchant.id,
              status: "active"
            })
            files.push({
              path: `/data/merchant/${merchant.id}/customer-app-endpoint-list.json`,
              content: JSON.stringify(custAppEndpoints)
            })
          }

        }
      }

      console.log(files);
      var lastResult = null;
      this.genHashDataMsg = "uploading data";
      for await (const result of ipfs.addAll(files)) {
        console.log(result)
        this.genHashDataMsg = "uploading " + result.path;
        lastResult = result;
      };
      console.log("PUBLISHED HASH: " + lastResult.cid.toString());
      this.genHashDataMsg = "";
      this.lastPublication = lastResult.cid.toString();
      this.publishingHashData = 2;

      if (lastResult.cid) {
        var hash = await this.hashdataSvc.postApiHashDataResponse({ id: SSUuid.GenerateV4(), hash: lastResult.cid.toString(), merchantGroupId: this.systemSvc.selectedMerchantGroup.id, createdAt: (new Date()).toISOString() }).toPromise();
        this.lastPubHash = hash.body;
        this.loadHashes();
        if (this.pushHashDataToOrbitDbEnabled) {
          var hashP2p = await logDatahashChannel.add(lastResult.cid.toString());
          console.log("hashP2p: " + hashP2p);
        }

      }

      if (this.generateCustomerAppEnabled) {
        this.genCustomerAppMsg = "generating customer app";
        var customerAppIpfsDir = await this.getCustomerAppIpfsFiles(this.lastPublication, datahashChannel, 0, null, "", ipfs);

        var lastResultApp = null;
        var results = [];
        console.log("ready to upload files");
        console.log(customerAppIpfsDir);
        this.genCustomerAppMsg = "uploading files";
        for await (const result of ipfs.addAll(customerAppIpfsDir, { pin: true })) {
          console.log(result);
          this.genCustomerAppMsg = "uploading '" + result.path + "'";
          results.push(result);
          lastResultApp = result;
        };

        let list1 = Enumerable.from(customerAppIpfsDir).select(p => p.path).toArray();
        let list2 = Enumerable.from(results).select(p => '/' + p.path).toArray();
        let diff = Enumerable.from(list1).where(p => list2.indexOf(p) < 0).toArray();

        this.lastAppPublication = lastResultApp.cid.toString();
        console.log("PUBLISHED APP HASH: " + lastResultApp.cid.toString());
        this.publishingAppData = 2;
        this.genCustomerAppMsg = "";

        var hashPackage = await this.hashdataSvc.postApiHashDataResponse({ id: hash.body.id, hash: lastResult.cid.toString(), hashPackage: lastResultApp.cid.toString(), hashApp: PublishComponent.ipfsOdpCustomerAppPublication, merchantGroupId: this.systemSvc.selectedMerchantGroup.id, createdAt: hash.body.createdAt }).toPromise();
        this.lastPubHash = hashPackage.body;
        this.loadHashes();
        console.log(hashPackage);
        if (this.updateNFTEnabled) {
          var pwaManifest = JSON.parse(this.systemSvc.selectedMerchantGroup.pwaManifest);

          var nftCodename = "livepizza";
          var nftFiles = [
            {
              path: `token-meta.json`,
              content: JSON.stringify({
                name: pwaManifest.name,
                description: pwaManifest.description ? pwaManifest.description : "A ODP Store",
                image: `ipfs://${pwaManifest.app_icon_ipfs}`,
                external_url: `${(this.useCustomIpfsGatewayEnabled ? "https://crustwebsites.net/" : this.selectedIpfsGateway)}ipfs/${this.lastAppPublication}`,
                attributes: [
                  {
                    "trait_type": "subcategory",
                    "name": "subcategory",
                    "value": "pizza"
                  },
                  {
                    "trait_type": "category",
                    "name": "category",
                    "value": "food"
                  },
                  {
                    "trait_type": "operation",
                    "name": "operation",
                    "value": "delivery"
                  }
                ]
              })
            }
          ];

          var lastResultTokenMeta = null;
          for await (const result of ipfs.addAll(nftFiles)) {
            console.log(result)
            lastResultTokenMeta = result;
            console.log("PUBLISHED TOKEN META HASH: " + lastResultTokenMeta.cid.toString());
            this.lastResultTokenMeta = lastResultTokenMeta.cid.toString();

            this.publishingNFT = 2;
          };
        }

        if (this.publishCustomerAppEnabled) {
          this.genIpnsMsg = "updating IPNS link";
          const res = await ipfs.name.publish(this.lastAppPublication);
          this.lastIPNSPublication = res.name;
          this.publishingIPNS = 2;
          this.genIpnsMsg = "";
          var hashp = JSON.parse(JSON.stringify(this.lastPubHash));
          hashp.ipns = this.lastIPNSPublication;
          var hashIpns = await this.hashdataSvc.postApiHashDataResponse(hashp).toPromise();
          this.lastPubHash = hashIpns.body;
          this.loadHashes();
          console.log(hashIpns);
        }


      }

      //API Add new Hash
    }

  }

  async getCustomerAppIpfsFiles(lastPublication: string, datahashChannel: string, depth: number = 0, cid = null, path = "", ipfsnode = null) {
    const ipfs = ipfsnode ? ipfsnode : await SSIpfs.getNode();
    this.genCustomerAppMsg = "searching for customerApp files";
    const files = await all(ipfs.ls(`/ipfs/${cid ? cid : PublishComponent.ipfsOdpCustomerAppPublication}`));
    console.log("ls fils getted: " + path + " / " + cid);
    var ret = [];
    try {
      let pwaManifest = JSON.parse(this.systemSvc.selectedMerchantGroup.pwaManifest);
      for (let index = 0; index < files.length; index++) {
        const file = <any>files[index];
        console.log("getting file: " + file.name);

        this.genCustomerAppMsg = "getting '" + file.name +"'";

        console.log(file);
        console.log(file.cid.toString());
        if (file.type == "file") {
          if (file.name == "manifest.webmanifest") {
            console.log("adding webmanifest");
            ret.push({
              path: "/app/" + path + file.name,
              content: `
            {
              "name": "${pwaManifest.name}",
              "short_name": "${pwaManifest.short_name}",
              "theme_color": "#1976d2",
              "background_color": "#fafafa",
              "display": "standalone",
              "scope": "./",
              "start_url": "./",
              "merchantGroupId": "${this.systemSvc.selectedMerchantGroup.id}",
              "endpoints": [
                {
                  "createdAt": "",
                  "headers": "",
                  "index": 0,
                  "merchantId": "${this.systemSvc.selectedMerchant.id}",
                  "params": "",
                  "privateKey": "",
                  "publicKey": "${lastPublication}",
                  "status": "ACTIVE",
                  "type": "DATA",
                  "protocolType": "IPFS",
                  "uri": "${(this.useCustomIpfsGatewayEnabled ? "https://crustwebsites.net/" : this.selectedIpfsGateway)}ipfs/{publicKey}",
                  "uriFallback":"${PublishComponent.ipfsW3GWList}"
                },
                {
                  "createdAt": "",
                  "headers": "",
                  "index": 1,
                  "merchantId": "${this.systemSvc.selectedMerchant.id}",
                  "params": "",
                  "privateKey": "",
                  "publicKey": "${lastPublication}",
                  "status": "ACTIVE",
                  "type":"HASH_DATA",
                  "protocolType": "ORBIT_DB",
                  "uri": "${datahashChannel}"
                }
              ],
              "icons": [
                {
                  "src": "assets/icons/app-icon.png",
                  "sizes": "192x192",
                  "type": "image/png"
                }
              ]
            }
            `
            });

            console.log("adding app-icon.png");
            console.log(pwaManifest);
            if (pwaManifest.app_icon_ipfs) {
              ret.push({
                path: "/app/assets/icons/app-icon.png",
                content: (await SSIpfs.getImageBlobFromIpfs(pwaManifest.app_icon_ipfs))
              });
            }

            console.log("File '" + file.name + "' loaded")
          }
          else {
            if (file.name.toLowerCase().endsWith(".js") || file.name.toLowerCase().endsWith(".html")) {
              var dataFromIpfs = uint8ArrayConcat(await all(ipfs.cat(file.cid.toString())));
              var string = new TextDecoder().decode(dataFromIpfs);

              ret.push({
                path: "/app/" + path + file.name,
                content: string
              });
            } else {
              ret.push({
                path: "/app/" + path + file.name,
                content: uint8ArrayConcat(await all(ipfs.cat(file.cid.toString())))
              });
            }

          }



        } else if (file.type == "dir") {
          console.log("getting dir: " + path + file.name + " / cid: " + file.cid.toString());

          var subFiles = await this.getCustomerAppIpfsFiles(lastPublication, datahashChannel, depth + 1, file.cid, path + file.name + "/", ipfs);
          ret = ret.concat(subFiles);
        }
      }
    } catch (error) {
      console.log(error);
      console.log(ret);
      console.log(files);
      console.log(cid);
    }

    return ret;
  }

}
