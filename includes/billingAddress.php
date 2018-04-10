<?php



class BillingAddress {

  private $PROVIDER_ID;
  private $ACCOUNT_ID;
  private $mobile_number;
  private $status;

      function __construct($id = null, $status = "new") {
        self::set_id($id);
        self::set_status($status);
      }

    public function set_id($value){
      return $this->ACCOUNT_ID = $value;
    }
    public function set_bank_id($value){
      return $this->PROVIDER_ID = $value;
    }
    public function set_mobile_number($value) {
      return $this->mobile_number = $value;
    }
    public function set_status($value) {
      return $this->status = $value;
    }

    public function get_id() {
      return $this->ACCOUNT_ID;
    }
    public function get_bank_id() {
      return $this->PROVIDER_ID;
    }

    public function get_mobile_number() {
      return $this->mobile_number;
    }

    public function get_status() {
      return $this->status;
    }



}


?>
