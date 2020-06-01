<template>
  <message-box :showMessage="showMessage" :message="message" @confirm="confirm" @cancel="confirm"></message-box>
</template>

<script>
  export default {
    data() {
      return {
        showMessage: false,
        message: '',
        msg: "无效登录"
      }
    },
    created() {
      if(this.$route.params.tip){
        this.message=this.$route.params.tip
        this.showMessage=true
      }
      if(this.$cookie.get('token')){
        this.$cookie.delete('token')
      }
      var token = encodeURI(this.$route.query.token)
      var orderSn = encodeURI(this.$route.query.ordersn)
      var Sn2 = encodeURI(this.$route.query.orderSn)
      var back=encodeURI(this.$route.query.back)
      if(back&&back !== "undefined"){
        this.$cookie.set("backPage",back)
      }
      
      if(Sn2 !== "undefined") {
        orderSn = Sn2
      }
      var router = encodeURI(this.$route.query.router)

      if(token !== "undefined") {

        //如果有默认token
        this.$cookie.set('token', token)
        this.$http({
          url: this.$http.adornUrl('/app/getUserInfo'),
          method: 'POST',
        }).then(({
          data
        }) => {
          if(data.code == 200) {
            if(router !== "undefined"&&router!=="charge") {//router!=="charge"是修复历史写参数charge的问题
              this.$router.replace({
                name: router
              })

            } else if(orderSn === "undefined") {
              this.$router.replace({
                name: "index"
              })
            } else {
              this.getOrderSn()
            }
          } else {
            this.msg = data.msg
            this.failedBox()
          }
        })

      } else {
          this.msg = "无效登录，没有token"
          this.failedBox()
      }

    },
    methods: {
      getOrderSn() {
        var payWay = encodeURI(this.$route.query.payWay)
        var router="chargeCoinCode"
        if(payWay==4){
          router="chargeCoinBank"
        }
        this.$router.replace({
          name: router,
          params: {
            orderSn: encodeURI(this.$route.query.ordersn),
            from: 'history'
          }
        })
      },
      confirm() {
        history.go(-1)
      },
      failedBox() {
        this.$cookie.delete('token')
        this.message = this.msg
        this.showMessage = true
      }

    }
  }
</script>

<style>

</style>