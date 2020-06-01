<template>
  <div class="index-wrap wrap-white">
    <div class="assets-show-box">
      <h1>{{balance}}</h1>
      <p>账户余额</p>
    </div>
    <div class="menu-box">
      <div v-if="recharge" class="menu" @click="$router.push({name: 'chargeCoin'})">
        <img class="ic-left" src="/static/img/ic_home_coin_charging@2x.png">
        <span>充币</span>
        <img class="ic-right" src="/static/img/ic_right@2x.png">
      </div>
      <div v-if="withdraw" class="menu" @click="$router.push({name: 'withdrawCoin'})">
        <img class="ic-left" src="/static/img/ic_icon_orang@2x.png">
        <span>提币</span>
        <img class="ic-right" src="/static/img/ic_right@2x.png">
      </div>
      <div class="menu" @click="$router.push({name: 'property'})">
        <img class="ic-left" src="/static/img/ic_money@2x.png">
        <span>数字资产</span>
        <img class="ic-right" src="/static/img/ic_right@2x.png">
      </div>
      <div v-if="digitalAsset" class="menu" @click="$router.push({name: 'incomeExpenses'})">
        <img class="ic-left" src="/static/img/ic_money_red@2x.png">
        <span>收支明细</span>
        <img class="ic-right" src="/static/img/ic_right@2x.png">
      </div>
    </div>
    <message-box :showMessage="showMessage" :message="message" @confirm="$router.push({name:'login'})" @cancel="$router.push({name:'login'})"></message-box>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        balance: '',
        showMessage: false,
        message: '',
        recharge: false,
        withdraw: false,
        digitalAsset:false
      }
    },
    created() {
      this.$http({
        url: this.$http.adornUrl('/app/getUserInfo'),
        method: 'POST',
        //        params:this.$http.adornParams({
        //          "id":e.id
        //        })
      }).then(({
        data
      }) => {
        if(data.code == 200) {
          this.balance = data.data.balance
          if(data.data.frontDisplay) {
            let frontDisplay = JSON.parse(data.data.frontDisplay)
            for(let i = 0; i < frontDisplay.length; i++) {
              if(frontDisplay[i] == "recharge") {
                this.recharge = true;
              }
              if(frontDisplay[i] == "withdraw") {
                this.withdraw = true;
              }
              if(frontDisplay[i] == "digitalAsset") {
                this.digitalAsset = true;
              }
              

            }
          }
          this.$cookie.set('memberAccount', data.data.memberAccount)
          this.$cookie.set('balance', data.data.balance)
          this.$cookie.set('areaCode', data.data.areaCode)
          //设置小数点后几位
          this.$cookie.set('projectCurrencyPoint', data.data.projectCurrencyPoint)
//        localStorage.memberAccount = data.data.memberAccount
//        localStorage.balance = data.data.balance
//        localStorage.areaCode = data.data.areaCode
        } else {
          this.message = data.msg;
          this.showMessage = true
        }

      }).catch((err) => {
        //后台错误时跳转
        this.$router.push({
          name: "login"
        })
      })
    }
  }
</script>