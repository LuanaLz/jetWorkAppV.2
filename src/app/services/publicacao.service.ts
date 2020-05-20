import { Publicacao } from './../interfaces/publicacao';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PublicacaoService {

  private publicacaosCollection: AngularFirestoreCollection<Publicacao>;

  constructor(private afs: AngularFirestore) {
    this.publicacaosCollection = this.afs.collection<Publicacao>('Publicacaos');
  }

  getPublicacaos() {
    return this.publicacaosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        });
      })
    );
  }

  addPublicacao(publicacao: Publicacao) {
    return this.publicacaosCollection.add(publicacao);
  }

  getPublicacao(id: string) {
    return this.publicacaosCollection.doc<Publicacao>(id).valueChanges();
  }

  updatePublicacao(id: string, publicacao: Publicacao) {
    return this.publicacaosCollection.doc<Publicacao>(id).update(publicacao);
  }

  deletePublicacao(id: string) {
    return this.publicacaosCollection.doc(id).delete();
  }

}
