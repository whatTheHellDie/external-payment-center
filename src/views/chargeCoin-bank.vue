<template>
  <div class="withdraw-coin-wrap wrap-white">
    <div class="money-box">
      <div>
        <h1>充值金额</h1>
        <p>{{money}}<img src="/static/img/ic_copy@2x.png" class="copy copy1 copy-item" @click="copyActiveCode($event,money)" alt="" /></p>
      </div>
      <div class="mention" v-if="notFinish">转账时请备注 <span class="red-mark">{{remark}}<img src="/static/img/ic_copy@2x.png" style="width: .3rem;vertical-align: -.02rem;margin-left: .04rem;" class="copy copy1" @click="copyActiveCode($event,remark)" alt="" /></span></div>

    </div>
    <div class="money-box">
      <div>
        <h1>开户银行</h1>
        <p>{{bank}}<img src="/static/img/ic_copy@2x.png" class="copy copy1 copy-item" @click="copyActiveCode($event,bank)" alt="" /></p>
      </div>
      <div>
        <h1>开户支行</h1>
        <p>{{bankBranch}}<img src="/static/img/ic_copy@2x.png" class="copy copy1 copy-item" @click="copyActiveCode($event,bankBranch)" alt="" /></p>
      </div>
      <div>
        <h1>银行卡账号</h1>
        <p>{{account}}<img src="/static/img/ic_copy@2x.png" class="copy copy1 copy-item" @click="copyActiveCode($event,account)" alt="" /></p>
      </div>
      <div>
        <h1>户名</h1>
        <p>{{username}}<img src="/static/img/ic_copy@2x.png" class="copy copy1 copy-item" @click="copyActiveCode($event,username)" alt="" /></p>
      </div>
      <div class="charge-code-box" style="padding: 0;margin: 0;">
      <div class="message" @click="getMerchantOrder" v-if="orderStatus==101" style="margin-bottom: .2rem;">
            <!--v-if="payStatus!=1"-->
            <span>联系商家</span>
            <img src="/static/img/ic_message_blue@2x.png" class="ic">
          </div>
          </div>
    </div>
    <div class="btn-box bottom1">
        <div class="btn primary" v-if="orderStatus==100">待付款</div>
        <div class="btn info" v-if="orderStatus==101">待收币</div>
        <div class="btn primary" v-if="orderStatus==102">交易完成</div>
        <div class="btn info" v-if="orderStatus==103">交易失败</div>
        <div class="btn info" v-if="orderStatus==999">取消交易</div>
    </div>
    <message-box :showMessage="showMessage" :message="message" @confirm="showMessage=false" @cancel="showMessage=false"></message-box>
    <transition name="fade">
      <div class="tip-box" v-if="tipBox">
        {{copyTip}}
      </div>
    </transition>
  </div>
</template>

<script>
  import Clipboard from 'clipboard'
  export default {
    data() {
      return {
        showMessage: false,
        message: "",
        money:'',
        bank:'',
        bankBranch:'',
        account:'',
        username:'',
        notFinish:true,
        orderStatus:null,
        remark:'',
        tipBox:false,
        copyTip:'',
        payWay:null,
        payAmount:null
      };
    },
    created(){
      if(this.$route.params.payWay && this.$route.params.from == 'create') {
        this.payWay=this.$route.params.payWay;
        this.payAmount=this.$route.params.payAmount;
        this.getInfo()
      }else if(this.$route.params.from == 'history'){
        this.$cookie.set("BankSn",this.$route.params.orderSn);
        this.getPastInfo()
      }else if(this.$cookie.get('BankSn')){
        this.getPastInfo()
      }
      this.addInterval()
    },
    methods: {
      getMerchantOrder() {
        this.$axios({
          url: this.$http.adornUrl('/app/contact'),
          method: 'post',
          //发送格式为json
          data: JSON.stringify({
            "orderSn": this.$cookie.get('BankSn'),
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
            this.message1 = data.data.msg;
            this.showMessage1 = true
          }
        });
      },
      addInterval(){
        window.bankInterval=setInterval(()=>{
          if(this.orderStatus==101){
            this.getPastInfo()
          }else{
            clearInterval(window.bankInterval)
          }
        },1000)
      },
      getPastInfo(){
        this.$axios({
          url: this.$http.adornUrl('/app/getRechargeOrderInfo'),
          method: 'post',
          //发送格式为json
          data: JSON.stringify({
            "orderSn": this.$cookie.get('BankSn')
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'token': this.$cookie.get('token')
          }
        }).then((data) => {
        if(data.data.code==200){
          this.money=data.data.data.payAmount;
          this.bank=data.data.data.bankName
          this.bankBranch=data.data.data.branchName
          this.account=data.data.data.receiptAccount
          this.username=data.data.data.receiptName
          this.orderStatus=data.data.data.orderStatus
          this.remark=data.data.data.otcOrderRemark
        }else{
          this.message=data.data.msg;
            this.showMessage=true
        }
      });
      },
      getInfo(){
        this.$axios({
          url: this.$http.adornUrl('/app/createRechargeOrder'),
          method: 'post',
          //发送格式为json
          data: JSON.stringify({
            "payWay": this.payWay,
            "payAmount": this.payAmount
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'token': this.$cookie.get('token')
          }
        }).then((data) => {
        if(data.data.code==200){
          this.money=data.data.data.payAmount;
          this.bank=data.data.data.bankName
          this.bankBranch=data.data.data.branchName
          this.account=data.data.data.receiptAccount
          this.username=data.data.data.receiptName
          this.orderStatus=data.data.data.orderStatus
          this.remark=data.data.data.otcOrderRemark
          this.$cookie.set("BankSn",data.data.data.orderSn)
        }else{
          this.message=data.data.msg;
            this.showMessage=true
        }
      });
      },
      copyActiveCode(e, text) {
        const clipboard = new Clipboard(e.target, {
          text: () => text
        })
        clipboard.on('success', e => {
          this.copyTip = "复制成功"
          this.tipBox = true;
          setTimeout(() => {
            this.tipBox = false;
          }, 3000)
          //      this.$message({ type: 'success', message: '复制成功' })
          // 释放内存
          clipboard.off('error')
          clipboard.off('success')
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          this.copyTip = "该浏览器不支持自动复制，请长按对应数字进行复制" 
          this.tipBox = true
          // 不支持复制
          //      this.$message({ type: 'waning', message: '该浏览器不支持自动复制' })
          // 释放内存
          clipboard.off('error')
          clipboard.off('success')
          clipboard.destroy()
        })
        clipboard.onClick(e)
      },
    },
    beforeDestroyed(){
      clearInterval(window.bankInterval)
    }
  }
</script>

<style type="text/css" scoped="scoped">
	.copy-item{
	  width: .3rem;margin-left: .1rem;vertical-align: -.02rem;
	}
</style>