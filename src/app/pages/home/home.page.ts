import { AuthService } from 'src/app/services/auth.service';
import { PublicacaoService } from './../../services/publicacao.service';
import { Publicacao } from './../../interfaces/publicacao';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastController, LoadingController, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  private loading: any;
  public publicacaos = new Array<Publicacao>();
  private publicacaosSubscription: Subscription;


  constructor(
    private loadingCtrl: LoadingController,
    private publicacaoService: PublicacaoService,
    private toastCtrl: ToastController,
    private authService: AuthService,
    public actionSheetCtrl: ActionSheetController,
    public router: Router
    
    ) 
    
    {
    this.publicacaosSubscription = this.publicacaoService.getPublicacaos().subscribe(data => {
      this.publicacaos = data;
      
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.publicacaosSubscription.unsubscribe();
  }

  async logout() {
    // await this.presentLoading();

    try {
      await this.authService.logout();
    } catch (error) {
      console.error(error);
    } 
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async deletePublicacao(id: string) {
    try {
      await this.publicacaoService.deletePublicacao(id);
    } catch (error) {
      this.presentToast('Erro ao tentar deletar');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

}
