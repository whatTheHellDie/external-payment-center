<template>
  <div>
    <ul class="message-center">
      <li v-for="item in messages" @click="getMerchantOrder(item.orderSn)">
        <div class="radius">
          <img src="/static/img/ic_message_bule_btn@2x.png" class="img" alt="" />
        </div>
        <div class="content">{{item.otcOrderSn}}</div>
        <div class="read active" v-if="item.unRead>0">{{item.unRead}}条未读消息</div>
        <div class="read" v-else>已读</div>
      </li>
    </ul>
    <message-box :showMessage="showMessage" :message="message" @confirm="showMessage=false" @cancel="showMessage=false"></message-box>
    <div v-if="loading" class="no-more">加载中...</div>
    <div v-if="noMore" class="no-more">没有更多了~</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        message: "",
        showMessage: false,
        messages: [],
        loading: true,
        noData: false,
        noMore:false,
      }
    },
    created() {
      this.getMessage(0)
      window.MessageIndex = 0;
      window.addEventListener("scroll", () => {
        if(this.getScrollHeight() == this.getWindowHeight() + this.getDocumentTop()) {
          //当滚动条到底时,这里是触发内容
          //异步请求数据,局部刷新dom
          this.getMessage(++window.MessageIndex)
        }
      }, false)
    },
    methods: {
      getMessage(index) {
        if(!this.noMore){
        this.loading = true;
        }else{
          return ;
        }
        this.$axios({
          url: this.$http.adornUrl('/app/getUserMessage'),
          method: 'post',
          //发送格式为json
          data: JSON.stringify({
            "pageSize": 20,
            pageNumber: index
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'token': this.$cookie.get('token')
          }
        }).then((data) => {
          this.loading = false;
          if(data.data.code == 200) {
            var list = data.data.data.list
            if(index === 0 && list.length < 1) {
              this.noData = true;
              return;
            }

            if(list.length > 0) {
              list.map((item) => {
                this.messages.push(item)
              })
            } else {
              this.noMore = true
            }

          } else {
            this.message = data.data.msg;
            this.showMessage = true
          }
        });
      },
      getMerchantOrder(orderSn) {
        this.$axios({
          url: this.$http.adornUrl('/app/contact'),
          method: 'post',
          //发送格式为json
          data: JSON.stringify({
            "orderSn": orderSn,
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

<style>

</style>