<template>
  <div class="charge-wrap">
    <div class="charge-money-box">
      <h1 class="clearfix">充值金额<div class="more" v-if="tooMore" @click="showMore">{{showMoney}}<img src="/static/img/ic_right_bule@2x.png" class="img" :class="{turn:!hideCharge}" alt="下拉" /></div></h1>
      <ul :class="{activeHide:hideCharge}">
        <li v-for="(item, index) in chargeMoneys" :class="{active: index == chargeMoneyIndex}" @click="chargeMoneyFn(index)">{{item}} {{unit}}</li>
      </ul>
    </div>
    <div class="price-tip"><img class="img" src="/static/img/ic_sigh@2x.png"/>因数字货币价格时时波动，到账数目以实际成交为准</div>
    <div class="charge-account-box" style="border-top: none;">
      <h2>预计到账</h2>
      <span>{{ableTransfer}}</span>
    </div>
    <div class="charge-payment-box charge-payment-box1">
      <h1>选择支付方式</h1>
      <ul>
        <li v-for="(item, index) in payments" v-if="(index+1)==payWay[0]||(index+1)==payWay[1]||(index+1)==payWay[2]" :class="{active:index==paywayIndex}" @click="paymentFn(index)">
          <img class="ic-left" :src="item.leftSrc">
          <span>{{item.name}}<span v-if="index==2" class="use-banlance" style="">可用{{btcBalance}}</span></span>
          <img class="ic-right" :src="item.rightSrc">     
        </li>
      </ul>
    </div>
    <div class="btn-box bottom1">
      <div class="btn primary" @click="chargeNow">立即充值</div>
    </div>
    <message-box :showMessage="showMessage" :message="message" @confirm="showMessage=false" @cancel="showMessage=false"></message-box>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showMessage:false,
      message:'',
      paywayIndex:null,
      chargeMoneys: [],
      payWay:[],
      ableTransfer:'',
      tooMore:false,
      hideCharge:false,
      showMoney:"更多金额",
      payments: [
        {
          name: '支付宝',
          leftSrc: '/static/img/ic_order_pay@2x.png',
          rightSrc: '/static/img/ic_check-circle_violet_not@2x.png'
        },
        {
          name: '微信',
          leftSrc: '/static/img/ic_order_chart@2x.png',
          rightSrc: '/static/img/ic_check-circle_violet_not@2x.png'
        },
        {
          name: 'BTC',
          leftSrc: '/static/img/ic_order_btc@2x.png',
          rightSrc: '/static/img/ic_check-circle_violet_not@2x.png'
        },
        {
          name:'银行卡',
          leftSrc: '/static/img/ic_order_card_big@2x.png',
          rightSrc: '/static/img/ic_check-circle_violet_not@2x.png'
        }
       
      ],
      paymentIndex: 0,
      chargeMoneyIndex: 0,
      btcBalance:'',
      fullPage: false,
      unit:""
    };
  },
   created(){
    this.$http({
          url:this.$http.adornUrl('/app/getRechargeInfo'),
          method:'POST',
//        params:this.$http.adornParams({
//          "id":e.id
//        })
        }).then(({data})=>{
          if(data.code==200){
            var payAmount=data.data.payAmount.split(',')
            this.chargeMoneys=payAmount
            if(payAmount.length>3){
              this.hideCharge=true
              this.tooMore=true
            }
            var payWay=data.data.payWay.split(',');
            this.payWay=payWay
            this.btcBalance=data.data.btcNum
            this.unit=data.data.unit
            //请求预计到账
            this.chargeMoneyFn(0)
            
          }else{
             this.message=data.msg
             this.showMessage=true
          }
            
          
        })
    },
  methods: {
    showMore(){
      if(this.hideCharge){
        this.showMoney="隐藏"
        this.hideCharge=false
      }else{
        this.showMoney="更多金额"
        this.hideCharge=true
      }
      
    },
    chargeNow(){
      if(this.paywayIndex==null){
        this.message="支付方式不能为空"
        this.showMessage=true
        return;
      }
      if(this.paywayIndex===0||this.paywayIndex===1){
        this.$router.push({name:'chargeCoinCode',params:{payWay:Number(this.paywayIndex)+1,payAmount:this.chargeMoneys[this.chargeMoneyIndex],from:'create'}})
      }else if(this.paywayIndex==3){
        this.$router.push({name:'chargeCoinBank',params:{payWay:Number(this.paywayIndex)+1,payAmount:this.chargeMoneys[this.chargeMoneyIndex],from:'create'}})
      }else{
        this.$router.push({name:'chargeCoinPay',params:{payWay:Number(this.paywayIndex)+1,payAmount:this.chargeMoneys[this.chargeMoneyIndex],from:'create'}})
      }
    },
    // 选择支付方式
    paymentFn(index) {
      this.paywayIndex=index
      this.payments.forEach((ele, i) => {
        this.payments[i].rightSrc = '/static/img/ic_check-circle_violet_not@2x.png';
        if (index == i) {
          this.payments[index].rightSrc = '/static/img/ic_check-circle_violet@2x.png';
        }
      });
    },
    // 选择充值金额
    chargeMoneyFn(index) {
      this.chargeMoneyIndex = index;
            this.$axios({
        url: this.$http.adornUrl('/app/estimateArrival'),
        method: 'post',
        //发送格式为json
        data: JSON.stringify({
          "cny":this.chargeMoneys[this.chargeMoneyIndex]
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'token':this.$cookie.get('token')
        }
      }).then((data) => {
        if(data.data.code==200){
          this.ableTransfer=data.data.data.amount
        }else{
          this.message=data.msg;
            this.showMessage=true
        }
      });
          

    }
  }
};
</script>