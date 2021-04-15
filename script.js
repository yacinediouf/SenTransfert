(function($){
    $.ajax({
    type: 'POST',
    url: 'fichier.php',
    success: function(result) {
        result = JSON.parse(result);
        for(var i=0; i < result.length; i++) {
            let option = $(<option/>, {
                value: result[i].numero
            });
            option.text(result[i].numero);
            option.appendTo($('#num'));
        }
    }
});
})(jQuery);

function getSolde(numero, option){
    $.ajax({
        type: 'post',
        url: 'fichier.php',
        data: 'numero='+numero+ '&option='+option,
        success: function(reponse){
            //traitement de la reponse ici
            reponse = JSON.parse(reponse);
            let solde = reponse[0].solde;
            afficherSolde(solde);
        },
        error:function(error){
            console.log(error);
            alert('erreur');
        }
    })

}
function setSolde(numero){

}


function menu(){
    //affichage du menu
    let menu ="---MENU SENMONEY--- \n Taper le numero du service choisi \n1: Solde de mon compte \n2: Transfert d'argent \n3:Paiement de facture \n4:Options\n";
    let choix = prompt(menu);
    let numero = $('#num option:selected').val();
    switch (choix){
        case '1':
            getSolde(numero, choix);
            break;


        case '2':
            transferer(numero, choix);
            break;

        case '3':
            PaiementFacture();
            break;

        case '4':
            let numOption = "veuillez choisir \n1: modifier son code secret \n2: cinq dernières transactions \n";
            let choix2 = prompt(numOption)
            switch (choix2){ 

                case '1':
                    
                    break;

                case '2':
                    
                    break;
                default:
                    menu();
                    break;

            }
            break;
        default:
            menu();
            break;
    
    }
}
function afficherSolde(solde) {

    if(confirm("Le solde de votre compte est " + solde + "\n Voulez-vous retourner au menu ?")){
        menu();

    }

}
function transferer(numero, option){
    let numTel = prompt("Veuillez saisir le numéro de téléphone du récepteur !");
    let  montEnvoie = prompt("Veuillez saisir le montant à transférer !");
    let code = prompt("Entrer votre code secret pour valider la transaction");
    $.ajax({
        type: 'post',
        url: 'fichier.php',
        data: 'numero='+numero+'&option='+option+'&montant='+montEnvoie+'&dest='+numTel+'&code='+code,
        success: function(reponse){
            if(reponse == 'MONT_INSUFFISANT'){
                if(confirm('Votre solde est insuffisant\n Reprendre la transaction')){
                    transferer(numero, option);
                }
            }else if (reponse == 'CODE_INCORRECT'){
                if(confirm('code secret incorrect \n reprendre la transaction')){
                    transferer(numero, option);
                }
            }else{
                if(confirm('Transfert effectué avec succés \n voulez vous retourner au menu')){
                    menu();
                }
            }
            

        },
        error:function(erreur){
            console.log(erreur);
            alert('erreur !');
        }
    })

}

