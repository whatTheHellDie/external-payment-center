<template>
  <div class="charge-code-wrap">
      <div class="special-bg">
        <div class="item">扫码支付请备注</div>
        <div class="item" style="left: 2.6rem;top: .98rem;">扫码支付请备注</div>
        <div class="item" style="left: 5.8rem; top: .5rem;">扫码支付请备注</div>
        <div class="item" style="left: -.45rem;top: 2rem;">扫码支付请备注</div>
        <div class="item" style="left: 0.27rem;top: 3rem;">扫码支付请备注</div>
        <div class="item" style="left: 0rem;top: 5rem;">扫码支付请备注</div>
        <div class="item" style="left: .4rem;top: 7rem;">扫码支付请备注</div>
        <div class="item" style="left: -.2rem;top: 9rem;">扫码支付请备注</div>
        <div class="item" style="left: 0.5rem;top: 10.5rem;">扫码支付请备注</div>
        <div class="item" style="left: 2.5rem;top: 3.1rem;">扫码支付请备注</div>
        <div class="item" style="left: 5.5rem;top: 3.1rem;">扫码支付请备注</div>
        <div class="item" style="left: 6.5rem;top: 5.1rem;">扫码支付请备注</div>
        <div class="item" style="left: 5.2rem;top: 7.6rem;">扫码支付请备注</div>
        <div class="item" style="left: 5.8rem;top: 9.6rem;">扫码支付请备注</div>
        <div class="item" style="left: 3rem;top: 8.5rem;">扫码支付请备注</div>
        <div class="item" style="left: 3.3rem;top: 10.3rem;">扫码支付请备注</div>
        <div class="item" style="left: 3.5rem;top: 5.6rem;">扫码支付请备注</div>
      </div>
      <div class="charge-code-box clearfix">
        <div class="left">
          <div class="money">
            <p><strong>￥{{payAmount}}</strong><span class="span">元</span></p>
          </div>
          <div class="qr-code">
            <img :src="qrImg" class="qr-img"  alt="二维码">
          </div>
          <p class="reminder reminder-tip" style="text-align: center;border-top:0 ;">扫码支付请备注<span><span style="color: #f24e4e;font-weight: 800;">{{otcOrderRemark}}</span><img src="/static/img/ic_copy@2x.png" class="copy copy1" @click="copyActiveCode($event,otcOrderRemark)" alt="" /></span></p>
          <div class="to-charge" @click="toPay" v-if="payWay===1">立即支付</div>
          <div class="not-need" v-if="payWay===1">（立即支付无需手动备注）</div>
          <div class="charge-code-tip" :class="{down:payStatus==2}">
            <div style="margin-bottom: .1rem;"><div class="title">支付方式：</div>
<div v-if="payWay===1">1、点击“立即支付”跳转至支付宝支付，无需手动备注备注号。（仅限支付宝）</div>
</div>
            <div><span v-if="payWay===1">2</span><span v-if="payWay===2">1</span>、扫码支付：先复制备注号，长按二维码识别或截图打开<span v-if="payWay===1">支付宝</span><span v-if="payWay===2">微信</span>扫一扫支付，粘贴备注号至备注栏，输入金额转账。<br />
 扫码支付没有手动备注备注号的订单，会导致资金无法到账。请联系游戏客服处理。</div>
          </div>
        </div>
        <div class="right">
          <div class="message" @click="getMerchantOrder" v-if="payStatus==2" style="margin-bottom: .2rem;">
            <!--v-if="payStatus!=1"-->
            <span>联系商家</span>
            <img src="/static/img/ic_message_blue@2x.png" class="ic">
          </div>
          <!--<p class="reminder clearfix">收款账户：{{receiptAccount}}</span><img src="/static/img/ic_copy@2x.png" class="copy" @click="copyActiveCode($event,receiptAccount)" alt="" /></p>
          <p class="reminder">姓名：{{receiptName}}</p>-->
        </div>
      </div>
      <div class="btn-box" style="margin-bottom: .2rem;">
        <!--<div class="btn btn-fix primary" v-if="orderStatus===100&&timeFinish" :class="{down:payStatus==2}" @click="paySuccess">我已付款成功 {{payRemainTime}}</div>-->
        <div class="btn btn-fix info" v-if="payStatus===2" :class="{down:payStatus==2}">待收币</div>
        <div class="btn btn-fix primary" v-if="payStatus===3" :class="{down:payStatus==2}">交易完成</div>
        <div class="btn btn-fix info" v-if="payStatus===4" :class="{down:payStatus==2}">超时取消</div>
        <div class="btn btn-fix info" v-if="payStatus===5" :class="{down:payStatus==2}">交易失败</div>
        <div class="btn btn-fix primary" v-if="payStatus===6" :class="{down:payStatus==2}">提币中</div>
        <div class="btn btn-fix primary" v-if="payStatus===7" :class="{down:payStatus==2}">提币成功</div>
        <div class="btn btn-fix info" v-if="payStatus===8" :class="{down:payStatus==2}">提币失败</div>
        <div class="btn btn-fix info" v-if="payStatus===9" :class="{down:payStatus==2}">交易关闭</div>
      </div>
    <!--<message-box :showMessage="showMessage" :message="message" @confirm="confirm" @cancel="showMessage=false"></message-box>-->
    <message-box :showMessage="showMessage1" :message="message1" @confirm="showMessage1=false" @cancel="showMessage1=false"></message-box>
    <message-box :showMessage="showMessage2" :message="message2" @confirm="$router.go(-1)" @cancel="$router.go(-1)"></message-box>
    <!--<message-box :showMessage="showMessage3" confirmWord="去下载"  :message="message3" @confirm="toDownloadAlipay" @cancel="showMessage3=false"></message-box>-->
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
        timeFinish:false,
        btcNum: '',
        usdtNum: '',
        btcTotal: '',
        usdtTotal: '',
        allCoinTotal: '',
        btcAddress: '',
        usdtAddress: '',
        receiptAccount: '',
        receiptName: '',
        copyTip: "复制成功",
        tipBox: false,
        orderSn: '',
        showMessage: false,
        showMessage1: false,
        showMessage2: false,
        showMessage3: false,
        message: '',
        message1: "",
        message2: "",
        message3: "若没有安装支付宝，可手动下载支付宝APP再支付",
        payStatus: null,
        code: 0,
        payWay: null,
        payAmount: null,
        qrImg: '',
        otcOrderRemark: '',
        payRemainTime: '',
        orderStatus: '',
        nowTime: '',
        pid:'',
      }
    },
    created() {
     window.copyActiveCode=this.copyActiveCode
      if(this.$route.params.payWay && this.$route.params.from == 'create') {
          this.payWay = this.$route.params.payWay
          this.$cookie.set('payWay', this.payWay)
//      localStorage.payWay = this.payWay = this.$route.params.payWay
//      localStorage.payAmount = this.payAmount = this.$route.params.payAmount
        //创建充币订单
        this.$axios({
          url: this.$http.adornUrl('/app/createRechargeOrder'),
          method: 'post',
          //发送格式为json
          data: JSON.stringify({
            "payWay": this.payWay,
            "payAmount": this.$route.params.payAmount
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'token': this.$cookie.get('token')
          }
        }).then((data) => {
          
          if(data.data.code == 200) {
            this.payAmount = data.data.data.payAmount
            this.$cookie.set('payAmount', this.payAmount)
            if(data.data.data.receiptAccount) {
              this.receiptAccount = data.data.data.receiptAccount
              this.$cookie.set('receiptAccount', this.receiptAccount)
//            localStorage.receiptAccount = this.receiptAccount
            }
            if(data.data.data.receiptName) {
              this.receiptName = data.data.data.receiptName
              this.$cookie.set('receiptName', this.receiptName)
//            localStorage.receiptName = this.receiptName
            }
            if(data.data.data.qrUrl) {
              this.qrImg = data.data.data.qrUrl
            }
            this.pid=data.data.data.receiptPid
            this.otcOrderRemark = data.data.data.otcOrderRemark
            
            this.orderSn = data.data.data.orderSn
            this.$cookie.set('chargeOrderSn', this.orderSn)
//          localStorage.chargeOrderSn = this.orderSn = data.data.data.orderSn
//          var date = new Date().getTime()
//          let nowTime = data.data.data.nowTime;
//          nowTime = nowTime.replace(/-/g, "/");
//          var gap = date - new Date(nowTime).getTime() - 1;
            var gap=this.getGap(data.data.data.nowTime)
            this.payRemainTime = this.dateToRemainTime(data.data.data.payRemainTime, gap);
            this.orderStatus = data.data.data.orderStatus
            this.watchOrder(data.data.data.payRemainTime,gap)
          } else {
            this.message2 = data.data.msg;
            this.showMessage2 = true
          }
        });
      } else if(this.$route.params.orderSn && this.$route.params.from == 'history') {
        this.payWay = this.$route.params.payWay
        this.$cookie.set('payWay', this.payWay)
        
        this.orderSn = this.$route.params.orderSn
        this.$cookie.set('chargeOrderSn', this.orderSn)
        //查询充币订单详情
        this.$axios({
          url: this.$http.adornUrl('/app/getRechargeOrderInfo'),
          method: 'post',
          //发送格式为json
          data: JSON.stringify({
            "orderSn": this.$cookie.get('chargeOrderSn')
//          "orderSn": localStorage.chargeOrderSn
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'token': this.$cookie.get('token')
          }
        }).then((data) => {
          if(data.data.code == 200) {
            if(data.data.data.receiptAccount) {
              this.receiptAccount = data.data.data.receiptAccount
            }
            if(data.data.data.receiptName) {
              this.receiptName = data.data.data.receiptName
            }
            if(data.data.data.qrUrl) {
              this.qrImg = data.data.data.qrUrl
            }
            this.payWay=data.data.data.payWay
            this.pid=data.data.data.receiptPid
            this.otcOrderRemark = data.data.data.otcOrderRemark
            this.orderSn = data.data.data.orderSn
            this.orderStatus = data.data.data.orderStatus
            this.payAmount = data.data.data.payAmount
            this.$cookie.set('payAmount', this.payAmount)
//          var date = new Date().getTime()
//          let nowTime = data.data.data.nowTime;
//          nowTime = nowTime.replace(/-/g, "/");
//          var gap = date - new Date(nowTime).getTime() - 1;
            var gap=this.getGap(data.data.data.nowTime)
            this.payRemainTime = this.dateToRemainTime(data.data.data.payRemainTime, gap);
            this.watchOrder(data.data.data.payRemainTime,gap)
          } else {
            this.message1 = data.data.msg;
            this.showMessage1 = true
          }
        });
      } 
      else if(this.$cookie.get('payWay')) {
//    else if(localStorage.payWay) {
        this.payWay = this.$cookie.get('payWay')
//      this.payWay = localStorage.payWay
        this.payAmount = this.$cookie.get('payAmount')
//      this.payAmount = localStorage.payAmount
        //查询充币订单详情
        this.$axios({
          url: this.$http.adornUrl('/app/getRechargeOrderInfo'),
          method: 'post',
          //发送格式为json
          data: JSON.stringify({
            "orderSn": this.$cookie.get('chargeOrderSn')
//          "orderSn": localStorage.chargeOrderSn
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'token': this.$cookie.get('token')
          }
        }).then((data) => {
          if(data.data.code == 200) {
            if(data.data.data.receiptAccount) {
              this.receiptAccount = data.data.data.receiptAccount
            }
            if(data.data.data.receiptName) {
              this.receiptName = data.data.data.receiptName
            }
            if(data.data.data.qrUrl) {
              this.qrImg = data.data.data.qrUrl
            }
            this.payWay=data.data.data.payWay
            this.pid=data.data.data.receiptPid
            this.otcOrderRemark = data.data.data.otcOrderRemark
            this.orderSn = data.data.data.orderSn
            this.orderStatus = data.data.data.orderStatus
//          var date = new Date().getTime()
//          let nowTime = data.data.data.nowTime;
//          nowTime = nowTime.replace(/-/g, "/");
//          var gap = date - new Date(nowTime).getTime() - 1;
            var gap=this.getGap(data.data.data.nowTime)
            this.payRemainTime = this.dateToRemainTime(data.data.data.payRemainTime, gap);
            this.watchOrder(data.data.data.payRemainTime,gap)
          } else {
            this.message1 = data.data.msg;
            this.showMessage1 = true
          }
        });
      }else{
      }

    },
    watch: {
    },
    methods: {
      getGap(nowTime){
        var date = new Date().getTime()
            nowTime = nowTime.replace(/-/g, "/");
            return date - new Date(nowTime).getTime() - 1;
      },
      getOrder(){
        if(this.$route.name!="chargeCoinCode"){return;}
        this.$axios({
            url: this.$http.adornUrl('/app/getRechargeOrderInfo'),
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
//            var date = new Date().getTime()
//             let nowTime = data.data.data.nowTime;
//            nowTime = nowTime.replace(/-/g, "/");
//            var gap = date - new Date(nowTime).getTime() - 1;
              var gap=this.getGap(data.data.data.nowTime)
              this.orderStatus = data.data.data.orderStatus
              this.watchOrder(data.data.data.payRemainTime,gap)
            } else {
              this.message1 = data.data.msg;
              this.showMessage1 = true
              clearInterval(window.StatusInterval)
            }
          });
      },
      watchOrder(payRemainTime,gap){
              var time = this.dateToRemainTime(payRemainTime, gap)
              if(time !== 0 && this.orderStatus == 100) {
                this.payStatus = 1
                this.payRemainTime = time;
              } else if(time === 0 && this.orderStatus == 100) {
                this.payStatus = 4
              } else {
                if(this.orderStatus == 101) {
                  this.payStatus = 2
                  setTimeout(this.getOrder,1000)
                  return ;
                } else if(this.orderStatus == 102) {
                  this.payStatus = 3
                } else if(this.orderStatus == 103) {
                  this.payStatus = 5
                } else if(this.orderStatus == 104) {
                  this.payStatus = 4
                }  else if(this.orderStatus == 200) {
                  this.payStatus = 6
                } else if(this.orderStatus == 201) {
                  this.payStatus = 7
                } else if(this.orderStatus == 202) {
                  this.payStatus = 8
                } else if(this.orderStatus == 999) {
                  this.payStatus = 9
                }
              }
      },
//    toDownloadAlipay(){
//      window.location.href="https://sj.qq.com/myapp/detail.htm?apkName=com.eg.android.AlipayGphone"
//    },
      toPay(){
        if(this.payWay===1){
          if(!this.pid){
            this.message1="打开支付宝转账，并备注"+this.otcOrderRemark+'<span><img src="/static/img/ic_copy@2x.png" class="copy copy1" style="width:.3rem;margin-left:.1rem;" onclick="copyActiveCode(event,'+this.otcOrderRemark.toString()+')" alt="" /></span>'
            this.showMessage1=true;
            return;
          }
          
          var merchant=this.pid
          var money=this.payAmount
          var remark=this.otcOrderRemark
          var userAgent=/Android|webOS|iPhone|iPod|BlackBerry|XiaoMi/i.test(navigator.userAgent) ? 'phone':'pc';
          if(userAgent=='pc'){
            //如果是电脑进入无感
            this.message1="若未弹出支付宝转账，请使用手机支付宝/微信扫一扫功能扫描支付并备注备注码"
            this.showMessage1=true
          }
          var url = "https://pay.biliex.com:8592/add.html?merchant="+merchant+"&money="+money+"&remark="+remark;
//        var url = "http://47.244.62.31:8781/add.html?merchant=2088522293492734&money=100.00&remark=123";
          var href = "alipays://platformapi/startapp?appId=20000067&url=" + encodeURIComponent(url);
//        var iframe = document.createElement('iframe')
//        var body = document.body
//        iframe.style.cssText = 'display:none;width=0;height=0'
//        window.timer = null
//        iframe.src = url.open
//        timer = setTimeout(()=>{
//          this.showMessage3=true
//        }, 2000)
          window.location.href = href;
          }
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
            this.message1 = data.data.msg;
            this.showMessage1 = true
          }
        });
      },
      paySuccess() {
        this.showMessage = true
        this.message = `是否确认已经成功转账，并已备注六位数字，
        <span style="color:#1B82D1;">付款成功请联系商家，提交转账截图。</span>`
      },
//    
      dateToRemainTime(s, gap) {
        s = s.replace(/-/g, "/");
        var date = new Date(s).getTime();
        var nowDate = new Date().getTime()
        var s1 = date - nowDate + gap;
        if(s1 <= 0) {
          //如果超时
          return 0
        }
        var time = parseFloat(s1) / 1000;
        if(null != time && "" != time) {
          time = parseInt(time / 3600.0) + ":" + parseInt((parseFloat(time / 3600.0) -
              parseInt(time / 3600.0)) * 60) + ":" +
            parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
              parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60);
              this.timeFinish=true
        }
        return time;

      }
    },
    destroyed() {
      clearInterval(window.StatusInterval)
    }

  }
</script>