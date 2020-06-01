<template>
  <div class="receipt-edit-wrap wrap-white">
    <template>
      <div v-if="receiveType === 1 || receiveType === 2" class="receipt-edit-box">
        <div class="head">
          <div class="receipt-edit">
            <h1>收款方式</h1>
            <span>{{receiveType === 1 ? '支付宝' : '微信'}}</span>
          </div>
          <div class="receipt-edit name">
            <h1>姓名</h1>
            <input type="text" v-model="trueName" placeholder="请输入姓名">
          </div>
        </div>
        <div class="body">
          <div class="receipt-edit">
            <h1>{{receiveType === 1 ? '支付宝账号' : '微信支付账号'}}</h1>
            <div class="cont">
              <input type="text" v-model="account" :placeholder="receiveType === 1 ? '请输入支付宝账号' : '请输入微信支付账号'">
            </div>
          </div>
          <div class="receipt-edit verify-code">
            <h1>验证码</h1>
            <div class="cont">
              <input type="text" v-model="verifyCode" placeholder="请输入账号验证码">
              <span v-if="!validateStatus" @click="getValidate">获取验证码</span>
              <span v-else>剩余{{time}}秒</span>
            </div>
          </div>
          <div class="receipt-edit qr-code">
            <h1>上传收款二维码</h1>
            <div class="cont">
              <img v-if="this.receivePicUrl" :src="receivePicUrl" />
              <img v-else class="add" src="/static/img/ic_add_icon@2x.png" />
              <input @change='add_img($event,0)' accept="image/*;capture=camera" type="file" id="saveImage">
            </div>
          </div>
        </div>
      </div>
      <div v-else class="receipt-edit-box">
        <div class="head">
          <div class="receipt-edit">
            <h1>收款方式</h1>
            <span>银行转账</span>
          </div>
          <div class="receipt-edit name">
            <h1>姓名</h1>
            <input type="text" v-model="trueName" placeholder="请输入姓名">
          </div>
        </div>
        <div class="body">
          <div class="receipt-edit">
            <h1>开户银行</h1>
            <div class="cont">
              <input type="text" v-model="bankName" placeholder="请输入开户银行">
            </div>
          </div>
          <div class="receipt-edit">
            <h1>开户支行</h1>
            <div class="cont">
              <input type="text" v-model="bankBranchName" placeholder="请输入开户支行">
            </div>
          </div>
          <div class="receipt-edit">
            <h1>银行卡账号</h1>
            <div class="cont">
              <input type="text" v-model="account" placeholder="请输入银行卡账号">
            </div>
          </div>
          <div class="receipt-edit verify-code">
            <h1>验证码</h1>
            <div class="cont">
              <input type="text" style="height: .64rem;" v-model="verifyCode" placeholder="请输入账号验证码">
              <span v-if="!validateStatus" style="overflow: hidden;" @click="getValidate">获取验证码</span>
              <span v-else>剩余{{time}}秒</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="btn-box bottom1">
      <div class="btn primary" @click="confirmEdit">确认</div>
    </div>
    <message-box :showMessage="showMessage" :message="message" @confirm="showMessage=false" @cancel="showMessage=false"></message-box>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        receiveType: 1, // 收款方式
        receiveTypeName: '', // 收款名
        trueName: '', // 真实姓名
        account: '', // 收款账号
        bankName: '', // 开户银行
        bankBranchName: '', // 开户支行
        receivePicUrl: '', //收款二维码图片 
        verifyCode: '', // 验证码
        time: '', // 验证码剩余时间
        validateStatus: false,
        showMessage: false,
        message: '',
        method: '', // add or edit
      };
    },
    created() {
      this.getRouteParams();
      if(this.method === 'edit') {
        this.findReceipt();
      }
    },
    methods: {
      // 获取路由参数
      getRouteParams() {
        let params = this.$route.params;
        if(Object.keys(params).length !== 0 || this.$cookie.get('receiptEditParams')) {
          if(this.$cookie.get('receiptEditParams') && Object.keys(params).length === 0) {
            params = JSON.parse(this.$cookie.get('receiptEditParams'))
          } else {
            this.$cookie.set('receiptEditParams', JSON.stringify(params))
          }
          this.receiveType = params.receiveType;
          this.method = params.method;

        }
      },
      // 查询收款
      findReceipt() {
        this.$axios({
          url: this.$http.adornUrl('/app/findUserReceipt'),
          method: 'post',
          data: JSON.stringify({
            "receiveType": this.receiveType
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'token': this.$cookie.get('token')
          }
        }).then(data => {
          if(data.data.code == 200) {
            const res = data.data.data;
            this.receiveTypeName = res.receiveTypeName;
            this.trueName = res.trueName;
            this.account = res.account;
            this.bankBranchName = res.bankBranchName;
            this.bankName = res.bankName;
            this.receivePicUrl = res.receivePicUrl;
          } else {
            this.message = data.data.msg;
            this.showMessage = true;
          }
        });
      },
      // 更新收款
      updateReceipt() {
        this.$axios({
          url: this.$http.adornUrl('/app/updateUserReceipt'),
          method: 'post',
          data: JSON.stringify({
            "receiveType": this.receiveType,
            "trueName": this.trueName,
            "account": this.account,
            "receivePicUrl": this.receivePicUrl,
            "verifyCode": this.verifyCode,
            "bankName": this.bankName,
            "bankBranchName": this.bankBranchName
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'token': this.$cookie.get('token')
          }
        }).then(data => {
          if(data.data.code == 200) {
            this.$router.replace({
              name: 'withdraw'
            });
          } else {
            this.message = data.data.msg;
            this.showMessage = true;
          }
        });
      },
      // 获取验证码
      getValidate() {
        //手机号
        let loader = this.$loading.show();
        this.$axios({
          url: this.$http.adornUrl('/app/getSmsCode'),
          method: 'post',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'token': this.$cookie.get('token')
          }
        }).then((data) => {
          loader.hide();
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
      },
      // 确认编辑
      confirmEdit() {
        if(!this.trueName) {
          this._showMessage('请填写姓名');
          return;
        }
        if(this.receiveType === 3 && !this.bankName) {
          this._showMessage('请填写开户银行');
          return;
        }
        if(this.receiveType === 3 && !this.bankBranchName) {
          this._showMessage('请填写开户支行');
          return;
        }
        const account = this.account;
        const phone = /^1[3456789]\d{9}$/.test(account);
        const email = /[\w]+(\.[\w]+)*@[\w]+(\.[\w])+/.test(account);
        const zfb = phone || email;
        const wx = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/.test(account);
        const card = /^([1-9]{1})(\d{14,18})$/.test(account);
        if(!account) {
          this._showMessage('请填写账号');
          return;
        } else if(this.receiveType === 1 && !zfb) {
          this._showMessage('账号格式不正确');
          return;
        } else if(this.receiveType === 2 && !wx) {
          this._showMessage('账号格式不正确,微信号应为英文开头，只可以使用6-20个子母,数字,和下划线和减号;');
          return;
        } else if(this.receiveType === 3 && !card) {
          this._showMessage('账号格式不正确');
          return;
        }
        if(!this.verifyCode) {
          this._showMessage('请填写验证码');
          return;
        }
        if(this.receiveType !== 3 && !this.receivePicUrl) {
          this._showMessage('请上传收款二维码');
          return;
        }
        this.updateReceipt();
      },
      // 上传图片
      add_img(event, index) {
        var img1 = event.target.files[0]


        if(index == 0) {
          let x = document.getElementById('saveImage').files[0];
          let params = new FormData()
          params.append('file', x)
          params.append('receiveType', this.receiveType)
          this.$axios.post(this.$http.adornUrl('/app/uploadImage'),
            params, {
              headers: {
                "Content-Type": "multipart/form-data",
                'token': this.$cookie.get('token')
              }
            }).then(({
            data
          }) => {
            if(data.code == 200) {
              this.receivePicUrl = data.data.url;

            } else {
              this.message = data.msg;
              this.showMessage = true
            }
          }).catch(({
            error
          }) => {

          })
        }
      },
      _showMessage(msg) {
        this.message = msg;
        this.showMessage = true;
      }
    }
  };
</script>