<?php 
// connexion à la base de données
   $dsn = 'mysql:host=127.0.0.1;dbname=senmoneydb;port=3306';
   $pdo = new PDO($dsn,'root','') or die('Erreur de connexion à la base de données');
      if(isset($_POST['numero']) && isset($_POST['option'])){
         $numero = $_POST['numero'];
         $option = $_POST['option'];
         if($option == 1){
            $query = $pdo->query('select solde from compte where numero='.$numero);
            $result = $query->fetchAll();
            echo json_encode($result);

         } else if($option == 2){
            $montEnvoie = (int)$_POST['montant'];
            $dest = $_POST['dest'];
            $code = $_POST['code'];
            $query = $pdo->query('select code from compte where numero='.$numero.' and solde >'.$montEnvoie);
            $result = $query->fetchAll();
            if(!empty($result)){
               print_r($result); 
               if($result[0]['code'] != $code) {
                  echo 'CODE_INCORRECT';
               }else {
                  // mise à jour du solde du compte qui effectue l'envoie
                  $update = $pdo->prepare('update compte set solde = solde-'.$montEnvoie.' where numero='.$numero);
                  $update->execute();

                  // mise à jour du solde du compte bénéficiaire
                  $upd = $pdo->prepare('update compte set solde = solde+'.$montEnvoie.' where numero='.$dest);
                  $upd->execute();

                  echo 'SUCCESS';
               }

            }else{
               echo 'MONT_INSUFFISANT';
            }
         }
        
   
      }
      else{
         $query = $pdo->query('select numero from compte');
         $result = $query->fetchAll();

         echo json_encode($result);
      }
        
  
  
?>