<template>
  <div class="receipt-wrap wrap-white">
    <div class="receipt-box">
      <div v-for="(item, index) in accountList" :key="item.receiveType">
        <div v-if="item.account" class="receipt already">
          <div class="body">
            <template>
              <img v-if="item.receiveType === 1" class="ic-left" src="/static/img/ic_order_pay_big@2x.png">
              <img v-else-if="item.receiveType === 2" class="ic-left" src="/static/img/ic_order_chart_big@2x.png">
              <img v-else class="ic-left" src="/static/img/ic_order_card_big@2x.png">
            </template>
            <div class="info">
              <p>账号：{{item.account}}</p>
              <p class="name">姓名：{{item.trueName}}</p>
            </div>
          </div>
          <div class="foot">
            <span class="edit" @click="updateReceipt(item.receiveType, 'edit')">编辑</span>
          </div>
        </div>
        <div v-else class="receipt not">
          <div class="body">
            <template>
              <img v-if="item.receiveType === 1" class="ic-left" src="/static/img/ic_order_pay_big@2x.png">
              <img v-else-if="item.receiveType === 2" class="ic-left" src="/static/img/ic_order_chart_big@2x.png">
              <img v-else class="ic-left" src="/static/img/ic_order_card_big@2x.png">
            </template>
            <div class="info">
              <span>未添加</span>
            </div>
            <img class="ic-right" @click="updateReceipt(item.receiveType, 'add')" src="/static/img/ic_plus_circle@2x.png">
          </div>
        </div>
      </div>
    </div>
    <message-box :showMessage="showMessage" :message="message" @confirm="showMessage=false" @cancel="showMessage=false"></message-box>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accountList: [],
      showMessage: false,
      message: '',
    };
  },
  created() {
    this.getReceipt();
  },
  methods: {
    // 获取收款
    getReceipt() {
      this.$axios({
        url: this.$http.adornUrl('/app/getUserWithdrawList'),
        method: 'post',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'token': this.$cookie.get('token')
        }
      }).then(data => {
        if(data.data.code == 200) {
          this.accountList = data.data.data.list;
        } else {
          this.message = data.data.msg;
          this.showMessage = true;
        }
      })
    },
    // 更新收款方式
    updateReceipt(receiveType, method) {
      this.$router.push({
        name: 'receiptEdit',
        params: {
          receiveType,
          method,
        }
      });
    }
  }
};
</script>