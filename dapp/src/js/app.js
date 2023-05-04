App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return  App.initWeb3();
  },

  initWeb3: function() {

    if(typeof web3 !== 'undefined'){
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);  
    }
    else{
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {

    $.getJSON("TrafficRecord.json",function(record){

      App.contracts.TrafficRecord = TruffleContract(record);
      App.contracts.TrafficRecord.setProvider(App.web3Provider);


      if(window.ethereum) {
        window.ethereum.on('accountsChanged', function () {
            web3.eth.getAccounts(function(error, accounts) {
              if(error == null){
                location.reload();
              }
            });
        });
    }
      return App.render();
    });

  },

  listenEvent : function(){

    App.contracts.TrafficRecord.deployed()
    .then(function(instance){
      instance.vehRegistered({},{
        fromBlock : 0,
        toBlock : 'latest'
      }).watch(function(error,event){
        alert(event);
        App.render();
      }); 
    });

  },

  render: function() {
    var recordInstance;
    var loader = $("#loader");
    var content = $("#content");
    content.hide();
    setTimeout(function(){
      loader.hide();
      content.show();
    },2000);
    
    web3.eth.getCoinbase(function(eror,account){

     if(eror == null){
       App.account = account;
       alert("Your account is : " + account);
       var addressA = $("#address");
       addressA.text("Your account address : " + account);
       
     }
    });

    App.contracts.TrafficRecord.deployed()
    .then(function(instance){
       recordInstance = instance;
    })
    .catch(function(error){
      console.warn(error);
      alert("error");
    });
  },
  

  recordV: function(){
    var Identification = $("#Identification");
    var CollisionCount = $("#CollisionCount");
    var recordInstance;

    App.contracts.TrafficRecord.deployed()
    .then(function(instance){
       recordInstance = instance;
       return recordInstance.registerVehicle(Identification.val(),CollisionCount.val(),{from : App.account});
    })
    .then(function(receipt){
      alert(receipt.logs[0].event +"\n" + receipt.logs[0].args.id);
    })
    .catch(function(error){
      alert("You cannot register more than once"); 
    });
  },


  recordEDRinfo: function(){
    var EDRInfo = $("#EDRInfo").val();
    var CollisionCount = parseInt($("#update_count").val().trim());
    if (isNaN(CollisionCount)) {
    CollisionCount = 0;
  
  }

    var recordInstance;
  
    console.log("update_count: " + CollisionCount);
    console.log("EDRInfo: " + EDRInfo);
  
    App.contracts.TrafficRecord.deployed()
    .then(function(instance){
      recordInstance = instance;
      return recordInstance.addNewEDRInfo(EDRInfo, CollisionCount, { from : App.account });
    })
    .then(function(result){
      alert("EDR information recorded");
      location.reload();
    })
    .catch(function(err){
      console.error(err);
      alert("Error recording EDR information");
    });
  },

  

  
 

  showVehiclebyOwn: function(){

    var show_id = $("#id_display");
    var show_Identification = $("#Identification_display");
    var show_CollisionCount = $("#CollisionCount_display");
    var show_EDRInfo = $("#EDRInfo_display");

    App.contracts.TrafficRecord.deployed()
    .then(function(instance){
      return instance.viewRecord({from : App.account});
    })
    .then(function(event){
      show_id.text(event[0]);
      show_Identification.text(event[2]);
      show_CollisionCount.text(event[1]);
      show_EDRInfo.text(event[3]);
    })
    .catch(function(eror){
      alert("You may not have access to this account.");
    });

  },


};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
