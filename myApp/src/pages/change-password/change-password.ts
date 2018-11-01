import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {NativeServiceProvider} from '../../providers/native-service/native-service';
import {Storage} from "@ionic/storage";
import {UserServiceProvider} from "../../providers/user-service/user-service";

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  newpassword;
  public params = {
    newpassword: '',
    oldpassword: '',
    account:'',
  };
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public nativeService: NativeServiceProvider,
              public storge: Storage,
              public userService: UserServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }


  // 保存
  save() {
    console.log("旧密码" + this.params.oldpassword);
    //获取缓存中的账号,通过缓存的值判断输入的旧密码是否错误
    this.storge.get("USER_INFO").then(value => {
      //获取当前用户的账号,用于修改密码
      this.params.account = value.account;
      var password = value.password;
      if (password == this.params.oldpassword) {
        console.log("输入的旧密码和数据库的旧密码相同");
        if (this.params.newpassword == this.newpassword) {
          let alert = this.alertCtrl.create({
            title: '否确定保存,修改后需要重新登录?',
            buttons: [
              {
                text: '否',
                handler: () => {
                }
              },
              {
                text: '是',
                handler: () => {

                  this.userService.changePassword(this.params).then(value1 => {
                    console.log("修改密码的返回参数"+value1.msg);
                    if(value1.msg=="success"){
                      this.nativeService.showToast("修改密码成功");
                      this.userService.logout().then(value2 => {
                        console.log(value2);
                        //清除缓存
                        this.userService.logout().then(() => {
                          console.log("清除缓存");
                        });
                        this.navCtrl.remove(1);
                        //重新登录
                        this.navCtrl.push("LoginPage");
                      });
                    }
                    else {
                      this.nativeService.showToast("修改失败,"+value1.msg);
                    }
                  })
                }
              }
            ]
          });
          alert.present();
        } else {
          this.nativeService.showToast('两次输入密码不一致');
        }

      }
      else {
        this.nativeService.showToast('旧密码输入错误');
        return;
      }


    })

  }


}
