<template>
  <div class="wrap" :class="{wrap1:isContactMerchant}">
  <div class="navbar" :class="{bgw:activeBackground}"><!--白色背景还是灰色背景-->
      <img class="back" src="/static/img/ic_arrowleft@2x.png" @click="go"/>
      <div class="title">{{title}}</div>
      <div class="message" v-if="$route.name=='index'" @click="$router.push({name:'messageCenter'})">
        <img src="/static/img/ic_message@2x.png" alt="" class="img" />
        <div class="red-m">{{unreadNumber}}</div>
      </div>
      <div class="message message1" v-if="$route.name=='property'" @click="$router.push({name:'withdrawRecord'})" style="font-size: .28rem;">提现记录</div>
    </div>
    <router-view></router-view>
    <message-box :showMessage="showMessage" :message="message" @confirm="showMessage=false" @cancel="showMessage=false"></message-box>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        activeBackground:false,
        showMessage: false,
        message: "",
        unreadNumber:null,
        skipUrl:''
      }
    },
    watch:{
      '$route':{
        handler:function(val){
        if(val.name=='messageCenter'){
          this.activeBackground=true
        }else{
          this.activeBackground=false
        }
        if(val.name=='index'){
          this.getMessage()
        }
        if(window.socket){
          window.socket.on('disconnect', (timeout) => {
  // ...
  console.log("断开连接"+timeout)
});
        this.disconnect()
        
        }
      },
        immediate:true
    },
      },
    computed:mapState({
      title(){
        return this.$route.meta.title
      },
      isContactMerchant(){
        return this.$route.name=='contactMerchant'
      }
    }),
    methods:{
      disconnect(){
         window.socket.disconnect()
      },
      go(){
        
        if(this.$route.name=="index"){
          if(this.skipUrl!=="0"){
            window.open(this.skipUrl,'_self')
          }else if(this.$cookie.get("backPage")){
            window.open(this.$cookie.get("backPage"),'_self')
          }else{
//          self.location=document.referrer
            history.go(-1)
          }
          
        }else{
          this.$router.go(-1)
        }
//      self.location=document.referrer
//        this.$router.go(-1)
      },
      getMessage() {
        this.loading = true;
        this.$axios({
          url: this.$http.adornUrl('/app/getUserMessage'),
          method: 'post',
          //发送格式为json
          data: JSON.stringify({
            "pageSize": 100,
            pageNumber: 0
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'token': this.$cookie.get('token')
          }
        }).then((data) => {
          if(data.data.code == 200) {
            this.unreadNumber=data.data.data.msgTotal,
            this.skipUrl=data.data.data.skipUrl
          } else {
            this.message = data.data.msg;
            this.showMessage = true
          }
        });
      },
    },
    created(){
      
     
    }
  }
</script>

<style type="text/css">
</style>