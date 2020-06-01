<template>
  <div class="withdraw-coin-wrap wrap-white">
    <div class="money-box">
      <div>
        <h1>提币数量</h1>
        <div class="rela-box">
          <input type="text" placeholder="请输入提币数量" v-model="currency" :readonly="readonly"  @blur="getBtcFromCurrency">
          <div class="withdraw-all" @click="withdrawAll">全部提币</div>
        </div>
      </div>
      <div class="mention" v-if="notFinish">可提币数量：{{balance}}</div>
      
    </div>
    <div class="money-box">
      <div>
        <h1>预计到账</h1>
        <p>{{btcNum}} {{coinName?coinName:0}}</p>
      </div>
      <div v-if="notFinish">
        <h1>验证码</h1>
        <div class="code">
          <input type="text" placeholder="请输入手机验证码" v-model="yzm">
          <span v-if="!validateStatus" @click="getValidate">获取验证码</span>
          <span v-else>剩余{{time}}秒</span>
        </div>
      </div>
    </div>
    <div class="btn-box bottom1">
      <div class="btn primary" v-if="notFinish" @click="confirmPay">确认提币</div>
      <div v-else>
      <div class="btn primary" v-if="orderStatus==200" >提币中</div>
      <div class="btn primary" v-if="orderStatus==201" >提币成功</div>
      <div class="btn info" v-if="orderStatus==202" >提币失败</div>
      <div class="btn info" v-if="orderStatus==999" >交易关闭</div>
      </div>
    </div>
    <message-box :showMessage="showMessage" :message="message" @confirm="showMessage=false" @cancel="showMessage=false"></message-box>
  </div>
</template>

<script>
  export default {
    data() {
      return {
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
        btcNum:"",
        readonly:false,
        notHistory:true,
        orderStatus:"",
        coinName:""
      };
    },
    created() {
      
      this.balance = this.$cookie.get('balance');
//    this.balance = localStorage.balance;
      
      if(this.$route.params.from){
        let withdraw=this.$route.params.withdraw
        this.currency=withdraw.withdrawAmount
        this.btcNum=withdraw.withdrawBtcAmount
        this.orderStatus=withdraw.orderStatus
        this.coinName=withdraw.otcBuyCoin
        this.notFinish=false
        this.readonly=true
      }
    },
    watch:{
      currency(val,oldVal){
        if(isNaN(Number(val))){
          this.currency=oldVal
          
        }
      }
    },
    methods: {
      withdrawAll(){
          this.currency=this.balance
          this.getBtcFromCurrency()
        },
      getBtcFromCurrency(){
        if(Number(this.currency)-Number(this.balance)>0){
          this.currency=this.balance;
        }
        if(this.currency){
          this.currency=Number(this.currency).toFixed(this.$cookie.get('projectCurrencyPoint'))
        }
//      var balance=Number(this.balance)
//      this.currency=balance.toFixed(8)
        //通过第三方代币/游戏币获取BTC数量
        this.$axios({
        url: this.$http.adornUrl('/app/getCoinFromCurrency'),
        method: 'post',
        //发送格式为json
        data: JSON.stringify({
          "currency": this.currency,
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'token': this.$cookie.get('token')
        }
      }).then((data) => {
        if(data.data.code == 200) {
          this.btcNum = data.data.data.coinNum
          this.coinName=data.data.data.coinName
        } else {
          this.message=data.data.msg
          this.showMessage=true
        }
      });
      },
      confirmPay() {
        
        if(!this.currency) {
          this.message = "请输入提币数量"
          this.showMessage = true
          return false
        }
        if(!this.yzm) {
          this.message = "请先填写验证码"
          this.showMessage = true
          return false
        }
        let loader = this.$loading.show();
        this.$axios({
          url: this.$http.adornUrl('/app/createWithdrawOrder'),
          method: 'post',
          //发送格式为json
          data: JSON.stringify({
            "currency": this.currency,
            "verifyCode": this.yzm
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'token': this.$cookie.get('token')
          }
        }).then((data) => {
          loader.hide()
          if(data.data.code == 200) {
            this.notFinish = false
            this.readonly=true
            this.orderStatus=data.data.data.orderStatus
//          window.finishInterval = setInterval(() => {
//            if(this.backTime > 0) {
//              this.backTime--
//            } else {
//              this.$router.push({
//                name: 'index'
//              })
//              clearInterval(window.finishInterval)
//            }
//          }, 1000)
          } else {
            this.message = data.data.msg
            this.showMessage = true
          }
        });

      },
      getValidate() {
        //手机号
        if(!this.currency) {
          this.message = "请输入提币数量"
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