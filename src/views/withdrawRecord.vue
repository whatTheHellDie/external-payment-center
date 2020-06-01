<template>
  <div class="income-expenses-wrap wrap-white" style="height: auto; min-height: 100%;">
    <div class="income-expenses-box">
      <div v-if="userOrder.length" v-for="item in userOrder" class="income" @click="toOrder(item)" :class="{expenses:item.orderType==2}">
        <div class="left">
          <div v-if="item.withdrawCoin=='BTC'" ><img src="/static/img/ic_btc_coin_charging@2x.png" class="round round1" alt="" /></div>
          <div v-if="item.withdrawCoin=='USDT'" ><img src="/static/img/ic_icon_usdt@2x.png" class="round round1" alt="" /></div>
        </div>
        <div class="left box">
          <div class="clearfix">
          <div class="left">
          <div class="text">
            <b>{{item.withdrawCoin}}提现</b>
            </div>
            </div>
            <div class="right">
          <p><span class="span">-{{item.withdrawAmount}}</span>
          </p>
        </div>
        
          </div>
           <div class="clearfix">
          <div class="left">
          <div class="text">
            <span v-html="getLocalTime(item.createTime)"></span>
            </div>
            </div>
            <div class="right">
          <span v-if="item.orderStatus==100" class="blue">待收款</span>
          <span v-if="item.orderStatus==104" class="red">超时取消</span>
          <span v-if="item.orderStatus==200" class="blue">提现成功</span>
          <span v-if="item.orderStatus==999" class="red">交易取消</span>
        </div>
        
          </div>
        </div>
        
      </div>
      <div v-if="noData" class="no-data">
        <img src="/static/img/ic_not_data@2x.png" class="img" /> 暂无数据
      </div>
      <div v-if="loading" class="no-more">加载中...</div>
      <div v-if="noMore" class="no-more">没有更多了~</div>
    </div>
    <message-box :showMessage="showMessage" :message="message" @confirm="$router.push({name:'login'})" @cancel="$router.push({name:'login'})"></message-box>
    
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userOrder: [],
        noMore: false,
        loading:true,
        noData:false,
        showMessage:false,
      message:'',
      };
    },
    created() {
            this.getData(1)
            window.incomePage=1;
            window.addEventListener("scroll",()=>{
              if(this.getScrollHeight() == this.getWindowHeight() + this.getDocumentTop()){
              //当滚动条到底时,这里是触发内容
              //异步请求数据,局部刷新dom
              this.getData(++window.incomePage)
          }
            },false)
    },
    methods: {
      getLocalTime(timestamp) {
        var date = new Date(timestamp),
                          Y = date.getFullYear() + '-',
                          M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
                          D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ',
                          h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':',
                          m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
        //                        s = (date.getSeconds()<10?'0'+(date.getSeconds()):date.getSeconds());
                        
        return Y + M + D + h + m;
      },
      getData(index) {
        
        this.$axios({
          url: this.$http.adornUrl('/app/getWithdrawOrderList'),
          method: 'POST',
          data: JSON.stringify({
            "pageNumber": index,
            "pageSize": 20
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'token': this.$cookie.get('token')
          }
        }).then(({
          data
        }) => {
          this.loading=false;
          if(data.code == 200) {
            var page = data.data.list
            if(index===1&&page.length<1){
              this.noData=true;
              return ;
            }
            if(page.length > 0) {
              for(let i = 0; i < page.length; i++) {
                this.userOrder.push(page[i])
              }
            } else {
              this.noMore = true
            }
          }else{
            this.message=data.msg;
            this.showMessage=true
          }

        })
      },
      toOrder(obj){
        this.$cookie.set('withdrawCustomizeFrom',"history")
            this.$router.push({name:'withdrawCustomize',params:{obj,from:'history'}})
      },
      getDocumentTop() {
        var scrollTop = 0,
          bodyScrollTop = 0,
          documentScrollTop = 0;
        if(document.body) {
          bodyScrollTop = document.body.scrollTop;
        }
        if(document.documentElement) {
          documentScrollTop = document.documentElement.scrollTop;
        }
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        return scrollTop;
      },
      getWindowHeight() {
        var windowHeight = 0;
        if(document.compatMode == "CSS1Compat") {
          windowHeight = document.documentElement.clientHeight;
        } else {
          windowHeight = document.body.clientHeight;
        }
        return windowHeight;
      },
      getScrollHeight() {
        var scrollHeight = 0,
          bodyScrollHeight = 0,
          documentScrollHeight = 0;
        if(document.body) {
          bodyScrollHeight = document.body.scrollHeight;
        }
        if(document.documentElement) {
          documentScrollHeight = document.documentElement.scrollHeight;
        }
        scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
        return scrollHeight;
      }
    }
  }
</script>