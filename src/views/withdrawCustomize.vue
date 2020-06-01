<template>
  <div class="withdraw-coin-wrap withdraw-customize">
    <div class="money-box">
      <div>
        <h1>提现数量</h1>
        <div class="rela-box">
          <input type="text" v-if="notFinish" placeholder="请输入提现数量" v-model="currency" :readonly="readonly"  @blur="getArrivalAmount">
          <input type="text" v-else  v-model="currency" :readonly="readonly">
          <div class="withdraw-all" @click="withdrawAll">全部提现</div>
        </div>
      </div>
      <div class="mention" v-if="notFinish">可提现数量：{{balance}}</div>
    </div>
    <div class="money-box">
      <div>
        <h1 class="nobottom clearfix">{{arriveText}}<div class="number">{{withdrawArrivalAmount}} CNY</div></h1>
      </div>
    </div>
     <div class="money-box money-box1">
       <div class="shou clearfix">收款方式<div class="edit" v-if="edit" @click="$router.push({name:'receipt'})">编辑</div></div>
      <div class="way-wrap">
        <div class="way" v-if="aliInfo.trueName" :class="{active:payWay==1}" @click="chooseWay(1)"><img src="/static/img/ic_order_pay@2x (2).png" class="img"/>支付宝</div>
        <div class="way weixin" v-if="weiXinInfo.trueName" :class="{active:payWay==2}" @click="chooseWay(2)"><img src="/static/img/ic_order_chart@2x (2).png" class="img"/>微信</div>
        <div class="way bank" v-if="bankInfo.trueName" :class="{active:payWay==3}" @click="chooseWay(3)"><img src="/static/img/ic_order_card@2x.png" class="img"/>银行转账</div>
      </div>
      <div class="info">
        <div class="detail clearfix" v-if="payWay===1">收款账户：{{aliInfo.account}}</div>
        <div class="detail clearfix" v-else-if="payWay===2">收款账户：{{weiXinInfo.account}}</div>
        <div class="detail clearfix" v-else-if="payWay===3">银行卡号：{{bankInfo.account}}</div>
        <div v-if="payWay===1">姓名：{{aliInfo.trueName}}</div>
        <div v-if="payWay===2">姓名：{{weiXinInfo.trueName}}</div>
        <div v-if="payWay===3">姓名：{{bankInfo.trueName}}</div>
      </div>
    </div>
    
    <div class="money-box" v-if="notFinish&&smsActive">
      <div>
        <h1>验证码</h1>
        <div class="code">
          <input type="text" placeholder="请输入手机验证码" v-model="yzm">
          <span v-if="!validateStatus" @click="getValidate">获取验证码</span>
          <span v-else>剩余{{time}}秒</span>
        </div>
      </div>
    </div>
    <div v-if="!notFinish" class="money-box" @click="getMerchantOrder">
      <div>
        <h1 class="nobottom clearfix">联系商家<img src="/static/img/ic_message_blue@2x.png" class="mechant" alt="" /></h1>
      </div>
    </div>
    <div v-if="!notFinish" class="money-box-contract-tip">注：若长时间未收到，可联系商家查询提现进度</div>
    <div class="btn-box bottom1">
      <div class="btn primary" v-if="notFinish" @click="confirmWithdraw">确认提现</div>
      <div v-else>
      <div class="btn primary" v-if="orderStatus==100" >待收款</div>
      <div class="btn primary" v-if="orderStatus==104" >超时取消</div>
      <div class="btn primary" v-if="orderStatus==200" >提现成功</div>
      <div class="btn info" v-if="orderStatus==999" >交易取消</div>
      </div>
     
      
    </div>
    <message-box :showMessage="showMessage" :message="message" @confirm="showMessage=false" @cancel="showMessage=false"></message-box>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        arriveText:"预计到账",
        receiveTypeName:null,
        edit:true,
        aliInfo:{},
        weiXinInfo:{},
        bankInfo:{},
        payWay:null,
        btcAmount: '',
        balance: '',
        notFinish: true,
        backTime: 3,
        time: null,
        validateStatus: false,
        currency: '',
        showMessage: false,
        message: "",
        yzm: "",
        withdrawArrivalAmount:"",
        readonly:false,
        notHistory:true,
        orderStatus:"",
        withdrawName:"",
        orderSn:"",
        smsActive:null
      };
    },
    created() {
      if(this.$route.params.obj||this.$cookie.get('withdrawCustomizeFrom')=="history"){
        
        var obj={};
        if(!this.$route.params.obj){
          //来自列表
          obj=JSON.parse(this.$cookie.get('withdrawCustomizeObj'))
        }else{
          //来自提现
        obj=this.$route.params.obj;
        this.$cookie.set('withdrawCustomizeObj',JSON.stringify(obj))
        }
        this.setWithdrawDefault(obj)
        return false
      }else if(this.$cookie.get('withdrawCustomizeFrom')=="withdrawNow"){
        
        //刚提现刷新后
            var obj=JSON.parse(this.$cookie.get('withdrawCustomizeObj'))
            this.setWithdrawDefault(obj)
        return false
      }
      if(this.$cookie.get('withdrawName')){
        
        this.withdrawName=this.$cookie.get('withdrawName')
      }else{
        this.message="您还未选择提现方式，请选择后在提现"
        this.showMessage=true
      }
      this.$http({
          url:this.$http.adornUrl('/app/getUserAssets'),
          method:'POST',
//        params:this.$http.adornParams({
//          "id":e.id
//        })
        }).then(({data})=>{
          if(data.code==200){
            this.$cookie.set("btcBalance",data.data.OtcBtcNum)
            this.$cookie.set("usdtBalance",data.data.OtcUsdtNum)
            if(this.withdrawName=="btc"){
                this.balance=data.data.OtcBtcNum
              }else if(this.withdrawName=="usdt"){
                this.balance=data.data.OtcUsdtNum
              }
          }
            
          
        })
      
      this.$axios({
        url: this.$http.adornUrl('/app/getUserWithdrawList'),
        method: 'post',
        //发送格式为json
//      data: JSON.stringify({
//        "currency": this.currency,
//      }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'token': this.$cookie.get('token')
        }
      }).then((data) => {
        if(data.data.code == 200) {
          data.data.data.list.map((item)=>{
            switch(item.receiveType){
             case 1: this.aliInfo=item;break;
             case 2: this.weiXinInfo=item;break;
             case 3: this.bankInfo=item;break;
            }
          })
        } else {
          
        }
      });
      this.getWithdrowInfo()
    },
    watch:{
      currency(val,oldVal){
        if(isNaN(Number(val))){
          this.currency=oldVal
        }
      }
    },
    destroyed(){
      clearInterval(window.withdrawInterval)
    },
    methods: {
      withdrawAll(){
          this.currency=this.balance
          this.getArrivalAmount()
        },
      setWithdrawDefault(obj){
        this.orderSn=obj.orderNo;
        this.notFinish=false
        this.currency=obj.withdrawAmount
        if(obj.actualArrivalAmount){
        //应为实际到账
        this.withdrawArrivalAmount=obj.actualArrivalAmount
        }else{
          this.withdrawArrivalAmount=obj.withdrawArrivalAmount
        }
        this.orderStatus=obj.orderStatus;
        if(this.orderStatus==200){
          this.arriveText="已到帐"
        }else if(this.orderStatus=="100"){
          window.withdrawInterval=setInterval(()=>{
            this.$axios({
        url: this.$http.adornUrl('/app/getWithdrawOrderInfo'),
        method: 'post',
        //发送格式为json
        data: JSON.stringify({
          "orderSn":this.orderSn
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'token':this.$cookie.get('token')
        }
      }).then((data) => {
        if(data.data.code==200){
          this.orderStatus=data.data.data.orderStatus
          if(this.orderStatus==200){
            clearInterval(window.withdrawInterval)
          }
        }else{
          this.message = data.data.msg;
            this.showMessage = true
        }
      });
          },1000)
        }
        let userInfo={}
        if(obj.receiveName){
        userInfo.trueName=obj.receiveName;
        }else{
          userInfo.trueName=obj.trueName;
        }
        if(obj.receiveAccount){
          userInfo.account=obj.receiveAccount;
        }else{
          userInfo.account=obj.account;
        }
        var receiveType=obj.receiveType;
        this.payWay=receiveType
        switch(receiveType){
          case 1:
            this.aliInfo=userInfo;
            
          break;
          case 2:
            this.weiXinInfo=userInfo;
          break;
          case 3:
            this.bankInfo=userInfo;
          break;
        }
        this.edit=false
        this.readonly=true
      },
      getWithdrowInfo(){
        
        this.$axios({
          url: this.$http.adornUrl('/app/getWithdrawInfo'),
          method: 'post',
          //发送格式为json
//        data: JSON.stringify({
//          "orderSn": this.orderSn,
//        }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'token': this.$cookie.get('token')
          }
        }).then((data) => {
          if(data.data.code == 200) {
            data.data.data.smsActive===1?
            this.smsActive=true:this.smsActive=false
          } else {
            this.message = data.data.msg;
            this.showMessage = true
          }
        });
      },
      getMerchantOrder() {
        this.$axios({
          url: this.$http.adornUrl('/app/contact'),
          method: 'post',
          //发送格式为json
          data: JSON.stringify({
            "orderSn": this.orderSn,
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'token': this.$cookie.get('token')
          }
        }).then((data) => {
          if(data.data.code == 200) {
            this.$router.push({
              name: 'contactMerchant',
              params: {
                chat: data.data.data
              }
            })
          } else {
            this.message = data.data.msg;
            this.showMessage = true
          }
        });
      },
      chooseWay(type){
        if(this.receiveTypeName){
          return ;
        }
        this.payWay=type
      },
      
      getArrivalAmount(){
        if(this.readonly){
          //如果输入框只能看
          return false
        }
        if(Number(this.currency)-Number(this.balance)>0){
          this.currency=this.balance;
          return;
        }
//      var balance=Number(this.balance)
//      this.currency=balance.toFixed(8)
        //通过第三方代币/游戏币获取BTC数量
        this.$axios({
        url: this.$http.adornUrl('/app/getArrivalAmount'),
        method: 'post',
        //发送格式为json
        data: JSON.stringify({
          "withdrawAmount": this.currency,
          coin:this.withdrawName
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'token': this.$cookie.get('token')
        }
      }).then((data) => {
        if(data.data.code == 200) {
          this.withdrawArrivalAmount = data.data.data.withdrawArrivalAmount
        } else {}
      });
      },
      confirmWithdraw() {
        
        if(!this.currency) {
          this.message = "请输入提现数量"
          this.showMessage = true
          return false 
        }
        if(this.smsActive){
          if(!this.yzm) {
            this.message = "请先填写验证码"
            this.showMessage = true
            return false
          }
        }
        if(!this.payWay){
          this.message = "请先选择收款方式"
          this.showMessage = true
          return false
        }
        let loader = this.$loading.show();
        this.$axios({
          url: this.$http.adornUrl('/app/createWithdrawCash'),
          method: 'post',
          //发送格式为json
          data: JSON.stringify({
            "withdrawAmount": this.currency,
            "receiveType":this.payWay,
            "coin":this.withdrawName.toUpperCase(),
            "verifyCode": this.yzm
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'token': this.$cookie.get('token')
          }
        }).then((data) => {
          loader.hide()
          if(data.data.code == 200) {
            this.$cookie.set('withdrawCustomizeFrom',"withdrawNow")
            this.$cookie.set('withdrawCustomizeObj',JSON.stringify(data.data.data))
            this.setWithdrawDefault(data.data.data)
          } else {
            this.message = data.data.msg
            this.showMessage = true
          }
        });

      },
      getValidate() {
        //手机号
        if(!this.currency) {
          this.message = "请输入提现数量"
          this.showMessage = true
          return false
        }
        let loader = this.$loading.show();
        this.$axios({
          url: this.$http.adornUrl('/app/getSmsCode'),
          method: 'post',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'token': this.$cookie.get('token')
          }
        }).then((data) => {
          loader.hide()
          if(data.data.code == 200) {
            this.validateStatus = true;
            this.time = 60;
            window.validateInterval = setInterval(() => {
              if(this.time > 0) {
                this.time--;
              } else {
                this.validateStatus = false;
                clearInterval(window.validateInterval)
              }
            }, 1000)
          } else {
            this.message = data.data.msg
            this.showMessage = true;
          }
        });
      }
    }
  }
</script>