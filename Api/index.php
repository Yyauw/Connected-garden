<?php

if (isset($_GET['op'])){
    $opcion=$_GET['op'];
    $mysqli = new mysqli();
    
    if($opcion == 'post'){
        $json = file_get_contents('php://input');
        $obj = json_decode($json);
        $arr = array($obj->planta1, $obj->planta2, $obj->planta3, $obj->planta4, $obj->planta5);
        $i =0;
        echo $obj->luz;
        echo $obj->planta1;
        echo $obj->planta2;
        $sql = "SELECT id, nombre, humedad, nivel_humedad, nivel_sol FROM plantas";
        $result = $mysqli->query($sql);
          while($row = $result->fetch_assoc()) {
              $nombre = $row["nombre"];
              $h = $arr[$i];
              $s = $obj->luz;
              $nh = $row["nivel_humedad"]+ $arr[$i];
              $id = $row["id"];
              $sql2 = "UPDATE plantas SET humedad='$h', nivel_humedad='$nh', nivel_sol='$s' WHERE id = '$id'";
              $mysqli->query($sql2);
              $sql2 = "UPDATE sol SET nivel='$s' WHERE id = '1'";
              $mysqli->query($sql2);
              $i+=1;
          }
        
    }
    
    if($opcion == 'consulta'){
        $sql = "SELECT nivel FROM sol";
        $result = $mysqli->query($sql);
        $sol= $result->fetch_assoc();
        $i =1;
         $arr = array(
            'sol'=>$sol['nivel']
        );
        
        $sql2 = "SELECT id, nombre, humedad, nivel_humedad, nivel_sol FROM plantas";
        $result = $mysqli->query($sql2);
        while($row = $result->fetch_assoc()) {
              $nombre = $row["nombre"];
              $h =$row["humedad"];
              $s = $row["nivel_sol"];
              $nh = $row["nivel_humedad"];
              $id = $row["id"];
              $arr["planta".$i] = ['id' => $id, "nombre" => $nombre, "humedad" => $h,'nivel_humedad' => $nh,"nivel_sol"=>$s ];
              $i+=1;
          }
        
        
        //header('Content-Type: application/json; charset=utf-8');
        echo json_encode($arr);
        
    }
    
    if($opcion == 'json'){
        //crear json
        
        $arr = array(
            'sol'=>'xd',
            'planta1'=>array(
                "id"=>1,
                "nombre" => "romerito",
                "humedad" => "23"
            ),
        );
        
        echo json_encode($arr);
    }
    
}else{
    
    echo "Bienvido al API proyecto S.O 2023";
}



?>