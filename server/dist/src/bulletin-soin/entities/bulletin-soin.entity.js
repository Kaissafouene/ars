"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulletinSoinItem = exports.BulletinSoin = void 0;
class BulletinSoin {
    id;
    numBs;
    codeAssure;
    nomAssure;
    nomBeneficiaire;
    nomSociete;
    nomPrestation;
    nomBordereau;
    lien;
    dateCreation;
    dateMaladie;
    totalPec;
    observationGlobal;
    etat;
    ownerId;
    items;
    ocrText;
}
exports.BulletinSoin = BulletinSoin;
class BulletinSoinItem {
    id;
    nomProduit;
    quantite;
    commentaire;
    nomChapitre;
    nomPrestataire;
    datePrestation;
    typeHonoraire;
    depense;
    pec;
    participationAdherent;
    message;
    codeMessage;
    acuiteDroite;
    acuiteGauche;
    nombreCle;
    nbJourDepassement;
}
exports.BulletinSoinItem = BulletinSoinItem;
//# sourceMappingURL=bulletin-soin.entity.js.map