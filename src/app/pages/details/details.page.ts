import { Component, OnInit } from '@angular/core';
import { Publicacao } from 'src/app/interfaces/publicacao';
import { Subscription } from 'rxjs';
import { PublicacaoService } from 'src/app/services/publicacao.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  private publicacaoId: string = null;
  public publicacao: Publicacao = {};
  private loading: any;
  private publicacaoSubscription: Subscription;

  constructor(
    private publicacaoService: PublicacaoService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {
    this.publicacaoId = this.activatedRoute.snapshot.params['id'];

    if (this.publicacaoId) this.loadPublicacao();
  }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.publicacaoSubscription) this.publicacaoSubscription.unsubscribe();
  }

  loadPublicacao() {
    this.publicacaoSubscription = this.publicacaoService.getPublicacao(this.publicacaoId).subscribe(data => {
      this.publicacao = data;
    });
  }

  async savePublicacao() {
    await this.presentLoading();

    this.publicacao.userId = this.authService.getAuth().currentUser.uid;

    if (this.publicacaoId) {
      try {
        await this.publicacaoService.updatePublicacao(this.publicacaoId, this.publicacao);
        await this.loading.dismiss();

        this.navCtrl.navigateBack('/home');
      } catch (error) {
        this.presentToast('Erro ao tentar salvar');
        this.loading.dismiss();
      }
    } else {
      this.publicacao.createdAt = new Date().getTime();

      try {
        await this.publicacaoService.addPublicacao(this.publicacao);
        await this.loading.dismiss();

        this.navCtrl.navigateBack('/home');
      } catch (error) {
        this.presentToast('Erro ao tentar salvar');
        this.loading.dismiss();
      }
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

}
