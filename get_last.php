<?php

class Jornal {
  
  private static $timestamp = '';
  private static $humandate = '';
  private static $reqDate   = '';
  private static $local     = '';
  private static $name      = '';

  private static $urls = array('metro'  => 'http://metropoint.metro.lu/<<timestamp>>_Metro<<local>>.pdf',
                               'destak' => 'http://www.destakjornal.com.br/pdfedition/<<timestamp>><<local>>.pdf');

  function __construct($name  = 'metro'
                     , $local = 'SaoPaulo'){
    
    self::$name      = $name;
    self::$local     = $local;
    self::$timestamp = date("Ymd");
    self::$humandate = date("d-m-Y");
    self::$reqDate   = date("Ymd");
    
    self::backValidation();
    
    echo self::toJson();
  }
  
  public function url() {
    $url = self::$urls[self::$name];
    $url = str_replace('<<timestamp>>', self::$timestamp, $url);
    $url = str_replace('<<local>>', self::$local, $url);
    return $url;
  }
  
  public function toJson() {
    $json  = '{';
    $json .= '"url": "'.self::url().'", ';
    $json .= '"local": "'.self::$local.'", ';
    $json .= '"timestamp": "'.self::$timestamp.'", ';
    $json .= '"humandate": "'.self::$humandate.'", ';
    $json .= '"reqDate": "'.self::$reqDate.'"';
    $json .= '}';
    return  $json;
  }
  
  private function backValidation() {
    $vUrl = new ValidateUrl();
    
    $linkValid = false;
    for($i = 0; $i < 40; $i++){
      self::$timestamp = date('Ymd', strtotime('-'.$i.' day'));
      self::$humandate = date('d-m-Y', strtotime('-'.$i.' day'));
      $linkValid = $vUrl->isValid(self::url());
      if ($linkValid) { break; }
    }
    
    return self::url();
  }
}

class ValidateUrl {
  
  function isValid($url) {
    $handle = curl_init($url);
    curl_setopt($handle,  CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($handle,  CURLOPT_NOBODY        , TRUE);

    /* Get the HTML or whatever is linked in $url. */
    $response = curl_exec($handle);

    /* Check for 404 (file not found). */
    $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
    curl_close($handle);

    //echo $url.' - '.$httpCode.'<br />';
    
    /* If the document has loaded successfully without any redirection or error */
    if ($httpCode >= 200 && $httpCode < 400) {
      return true;
    } else {
      return false;
    }
  }

}

$name  = $_GET['name'];
$local = $_GET['local'];

new Jornal($name, $local);

?>
