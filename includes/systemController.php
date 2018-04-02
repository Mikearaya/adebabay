<?php

include('session.php');
include('classes.php');
include_once('errorHandler.php');


$SESSION = new SESSION();

$result = new stdclass();
$get_request = null;
$submitted_form = null;
$result->message = '';



 function generate_message($message){
 	$result = new stdclass();
	$result->message = $message;
	$result->warning =  $GLOBALS['ERROR_HANDLER']->get_all_warnings();
	$result->error = $GLOBALS['ERROR_HANDLER']->get_all_errors();
	$result->notice = $GLOBALS['ERROR_HANDLER']->get_all_notices();

	return $result;
}




if(isset($_POST['get'])){

	$get_request =  $_POST['get'];

}
if(isset($_GET['get'])){

	$get_request =  $_GET['get'];

}


if($get_request == "isSessionActive") {
$x;
if($x["active"] = $SESSION->is_loged_in()){
$x["organizerName"] = $SESSION->get_session_name();
$x["organizerId"] = $SESSION->get_session_id();
}
  echo  json_encode($x);
}

if($get_request == "closeSession") {
    $SESSION->close_session();
    $SESSION->reset_session();
}

if($get_request == "eventCatagory" ) {

  $list = DB_CONNECTION::get_event_categories();

  echo json_encode($list);
}
if($get_request == "catagory" ) {

  $list = DB_CONNECTION::get_catagories();

  echo json_encode($list);
}
if($get_request == "searchEvent" && isset($_GET['value']) ) {

  $list = DB_CONNECTION::search_Event($_GET['value']);

  echo json_encode($list);
}

if($get_request == "view_catagory" && isset($_GET['catagoryId']) ) {

  $list = DB_CONNECTION::get_event_category($_GET['catagoryId']);

  echo json_encode($list);
}

if($get_request == "emailExists" && isset($_GET["data"])) {
$response["exists"] = false;
  $value = DB_CONNECTION::check_email_availablity($_GET['data']);
if($value == "1") {
  $response["exists"] = true;
} else {
  $response["exists"] = false;
}
  echo json_encode($response);

}




if(isset($_REQUEST['form'])){
	$submitted_form = $_REQUEST['form'];

}

if($submitted_form === "updateOrganizerInfo"
    && isset($_POST["organizerId"])
    && isset($_POST["data"])
    && $_POST["organizerId"] == $SESSION->get_session_id()){

        $organizer = new Organizer();
        $organizer->set_id($_POST["organizerId"]);


        $data = $_POST["data"];

        $organizer->set_first_name($data['firstName']);
        $organizer->set_last_name($data["lastName"]);
        $organizer->set_birthdate($data["birthdate"]);
        $organizer->set_gender($data["gender"]);
        $organizer->set_title($data["prefix"]);
        $organizer->set_position($data["position"]);

  //      $organizer->set_bio($_POST['organizer-bio']);

        if($ERROR_HANDLER->get_error_count() == 0 && $organizer->update_profile()) {
              $result->success = true;
        } else {
              $result->success = false;
              $result->message = generate_message("Failed to Update Profile!!!");
        }
echo json_encode($result);
  exit;
}

if($submitted_form === "updatePhoneNumber"
    && isset($_POST["organizerId"])
    && isset($_POST["data"])
    && $_POST["organizerId"] == $SESSION->get_session_id()   ) {

      $organizer = new Organizer();
  		$organizer->set_id($SESSION->get_session_id());
      $organizer->set_organization_id($_POST["organizationId"]);

      $organizer->update_phone_number(json_decode($_POST["data"], true));

        if($ERROR_HANDLER->get_error_count() == 0 ){
          $result->success = true;
        } else {
          $result->success = false;
          $result->message = $ERROR_HANDLER->get_all_errors();
        }
        echo json_encode($result);

    exit;

}

if ($submitted_form === "updateSocialMedia"
    &&  $_POST['organizerId'] == $SESSION->get_session_id()
  && isset($_POST["data"])) {

					$organizer = new Organizer();
					$organizer->set_id($SESSION->get_session_id());


					if($ERROR_HANDLER->get_error_count() == 0 && $organizer->update_socialMedia_address(json_decode($_POST["data"], true)))  {
						$result->success = true;
					} else {
						$result->success = false;
            $result->message = generate_message('Failed to Updated Social Media Address, Please Try Again!!!');
					}
      echo json_encode($result);
			exit;
}


if($submitted_form === 'eventDiscriptionUpdate' &&
  isset($_POST["eventId"]) &&
  $_POST["organizerId"] == $SESSION->get_session_id() &&
  isset($_POST["data"])){

    $organizer = new Organizer();
    $organizer->set_id($SESSION->get_session_id());
    $event = new Event();
    $event->set_id($_POST["eventId"]);

    $event->set_discription($_POST["data"]);

    if($ERROR_HANDLER->get_error_count() == 0 && $organizer->update_event_discription($event)) {
        $result->success = true;

    } else {
      $result->success = false;
      $result->message = generate_message("Failed to Update Event Discription");
    }

echo json_encode($result);
exit;

  }






 if($submitted_form === 'log_in' && isset($_POST["data"])){
			$email = null;
			$password = null;
			$result->success = null;
			 $result->organizer_id = null;
       $data = $_POST["data"];

  		if(isset($data['email'])) {
  			$email = $data['email'];
  		}
  		if(isset($data['password'])) {

  		$password = $data['password'];

  		}
  		if(isset($email) && isset($password)){
  			$log = Organizer::log_in($email, $password, $SESSION) ;

  			if($SESSION->is_loged_in()) {

  				$result->success = 'true';
  				$result->organizerId = $log['organizerId'];
  				$result->organizerName = $log['firstName'];

  			} else {
  				$result->success = 'false';
  			}

	echo json_encode($result);
exit;
}

exit;
}

$allowed = array('png', 'jpg', 'gif','zip');


if($submitted_form === 'orderForm' &&
    isset($_POST['eventId']) &&
    isset($_POST["data"])) {

$attendee = null;
$event_id = $_POST['eventId'];


$newAttendee = $_POST["data"]["attendee"];

      			if(isset($newAttendee["firstName"])
                && isset($newAttendee["mobileNumber"]) &&
                isset($newAttendee["lastName"])){

					$subscriber = null;

		      			if(isset($newAttendee["paymentProvider"])){
		      			$subscriber  = $newAttendee["paymentProvider"];

		      			}

      			$attendee = new Attendee($event_id,
            $newAttendee["firstName"],
            $newAttendee["lastName"],
            $newAttendee["mobileNumber"], $subscriber);


      	$i = 0;

$tickets = json_decode($_POST["data"]["tickets"], true);
var_dump($tickets);
      			while($i < count($tickets)) {
              echo "in";
              var_dump($tickets);
      				if(isset($tickets[$i]["selected"]) && $tickets[$i]["selected"] != '') {
      				$book = new Booking($tickets[$i]["id"], $tickets[$i]["selected"]);

      					$attendee->set_booking($book);


					}

      				$i++;
      			}



      } else {
      	trigger_error("Required event attendee First name, Last name and phone number missing", E_USER_ERROR);

      }

      if($ERROR_HANDLER->get_error_count() == 0 ) {

      $result->success = $attendee->book_event();

      }
          if(!$result->success){
            $result->success = false;
            $result->message = "Error Occured While Processing Order Please Try Again";
          } else {
            $result->success = true;
            $result->message = $attendee->get_id();
          }


		echo json_encode($result);
		exit;
}





if($get_request === 'has_billing_address' && isset($_GET['organizer_id']) && $_GET['organizer_id'] == $SESSION->get_session_id() ){

			$organizer = Organizer::get_organizer($_GET['organizer_id']);

			if($organizer->has_billing_address() ) {
				$result->message = 'true';
				$result->success = 'true';
			} else {
				$result->message = 'false';
				$result->success = 'true';

			}

	echo json_encode($result);


}


if($submitted_form === 'new_event' && $_POST['organizer'] == $SESSION->get_session_id() ) {

		$organizer = new Organizer();
		$organizer->set_id($SESSION->get_session_id());

    $postData = json_decode($_POST["data"], true);


		$event = new Event();

				if(isset($postData["eventName"])) $event->set_name($postData["eventName"]);
				if(isset($postData["address"]["venueName"]))	$event->set_venue($postData["address"]["venueName"]);

				if(isset($postData["eventStartDate"]) && isset($postData["eventStartTime"]) )
					$event->set_start_datetime("2018-09-10", "09:00");
				if(isset($postData["eventEndDate"]) && isset($postData["eventEndTime"]) )
					$event->set_end_datetime("2018-10-10", "09:00");
				if(isset($postData["eventDiscription"]))	$event->set_discription($postData["eventDiscription"]);
				if(isset($postData["catagory"])) $event->set_category($postData["catagory"]);
				//if(isset($_POST['option']))
        		$event->set_status("OPEN");
				if(isset($_POST['event-latitude'])) 	$event->set_latitude($_POST['event-latitude']);
				if(isset($_POST['event-longitude'])) 	$event->set_longitude($_POST['event-longitude']);

        if(isset($_FILES["eventImage"]["tmp_name"])) {

            $image['tmp_name'] = $_FILES['eventImage']['tmp_name'];
            $image['name'] = $_FILES['eventImage']['name'];
            $image['size'] = $_FILES['eventImage']['size'];
            $image['type'] = $_FILES['eventImage']['type'];
            $image['error'] = $_FILES['eventImage']['error'];
					$event->set_picture($image);
      }

		$address = new Address();

				if(isset($postData["address"]["country"]))	$address->set_country($postData["address"]["country"]);
				if(isset($postData["address"]["city"])) $address->set_city($postData["address"]["city"]);
				if(isset($postData["address"]["subCity"])) $address->set_sub_city($postData["address"]["subCity"]);
				if(isset($postData['event-longitude'])) $address->set_longitude($postData['event-longitude']);
				if(isset($postData['event-latitude'])) $address->set_latitude($postData['event-latitude']);
				if(isset($postData["address"]["location"])) $address->set_location($postData["address"]["location"]);

    $postTicket = null;
		$event->set_address($address);
    if(isset($postData["eventTickets"])){
    $postTicket = $postData["eventTickets"];

	$i = 0;


						while($i < count($postTicket)){

							$ticket = new Ticket();

								if(isset($postTicket[$i]["type"]))	$ticket->set_type($postTicket[$i]["type"]);
								if(isset($postTicket[$i]["ticketName"]))		$ticket->set_name($postTicket[$i]["ticketName"]);
								if(isset($postTicket[$i]["quantity"]))		$ticket->set_quantity($postTicket[$i]["quantity"]);
								if(isset($postTicket[$i]["price"])) $ticket->set_price($postTicket[$i]["price"]);


								if(isset($postTicket[$i]["ticketDiscription"]))	$ticket->set_discription($postTicket[$i]["ticketDiscription"]);
								if(isset($postTicket[$i]["saleStart"]))	$ticket->set_sale_start("2018-06-10");
								if(isset($postTicket[$i]["saleEnd"]))	$ticket->set_sale_end("2018-07-10");

							$i++;

							$event->set_ticket($ticket);
						}


				}




		$i= 0;
				if(isset($postData['eventSponsors'])) {

					while($i < count($postData['eventSponsors'])) {

							$sponsor = new Sponsor();

							if (isset($postData['eventSponsors'][$i]['sponsorName'])) $sponsor->set_name( $postData['eventSponsors'][$i]['sponsorName']);

              if(isset($_FILES['sponsorImage']['tmp_name'][$i])){

								$image['tmp_name'] = $_FILES['sponsorImage']['tmp_name'][$i];
								$image['name'] = $_FILES['sponsorImage']['name'][$i];
								$image['size'] = $_FILES['sponsorImage']['size'][$i];
								$image['type'] = $_FILES['sponsorImage']['type'][$i];
								$image['error'] = $_FILES['sponsorImage']['error'][$i];
							$sponsor->set_image($image);
							}
						$event->set_sponsor($sponsor);
						$i++;

					}


				}


$i= 0;

			if(isset($postData['eventGuests'])) {

					while($i < count($postData['eventGuests'])) {

							$guest = new Guest();

							if(isset($postData['eventGuests'][$i]['firstName'])) 	$guest->set_first_name($postData['eventGuests'][$i]['firstName']);
							if(isset($postData['eventGuests'][$i]['lastName']))	$guest->set_last_name($postData['eventGuests'][$i]['lastName']);
							if(isset($postData['eventGuests'][$i]['akaName']) && strlen($postData['eventGuests'][$i]['akaName']) > 0 )	$guest->set_aka_name($postData['eventGuests'][$i]['akaName']);



							if(isset($_FILES['guestImage']['tmp_name'][$i])) {

								$image['tmp_name'] = $_FILES['guestImage']['tmp_name'][$i];
								$image['name'] = $_FILES['guestImage']['name'][$i];
								$image['size'] = $_FILES['guestImage']['size'][$i];
								$image['type'] = $_FILES['guestImage']['type'][$i];
								$image['error'] = $_FILES['guestImage']['error'][$i];
								$guest->set_image($image);
							}


							$event->set_guest($guest);

							$i++;
					}
			}

if($ERROR_HANDLER->get_error_count() == 0 && $organizer->add_event($event) ) {
		echo json_encode(generate_message("event Created Successfuly"));

	} else {
		echo json_encode(generate_message("Event was not created!!!"));
	}

	exit;

}



if($submitted_form === 'eventGuestsUpdate' &&
$_POST['organizerId'] == $SESSION->get_session_id() &&
isset($_POST['eventId']) &&
isset($_POST["data"])){


			$organizer = new Organizer();
			$organizer->set_id($SESSION->get_session_id());
			$event = new Event();
			$event->set_id($_POST['eventId']);

      $data = json_decode($_POST["data"], true);

  		$i= 0;

      $new = 0;
      $updated = 0;

				while($i < count($data)) {
$guest;
            if(isset($data[$i]['status']) && $data[$i]['status'] == "new") {
                $guest = new Guest();
                $new++;
            } else {
              $updated++;
              $guest = new Guest($data[$i]['guestId'], "updated");
            }


						if(isset($data[$i]['firstName']))	$guest->set_first_name($data[$i]['firstName']);

						if(isset($data[$i]['lastName'])) $guest->set_last_name($data[$i]['lastName']);


				if(isset($data[$i]['akaName']) && strlen($data[$i]['akaName']) > 0 )	$guest->set_aka_name($data[$i]['akaName']);

/*
						if(isset($_FILES['guest-image'][$i])) {
							$image = null;
							$image['tmp_name'] = $_FILES['guest-image']['tmp_name'][$i];
							$image['name'] = $_FILES['guest-image']['name'][$i];
							$image['size'] = $_FILES['guest-image']['size'][$i];
							$image['type'] = $_FILES['guest-image']['type'][$i];
							$image['error'] = $_FILES['guest-image']['error'][$i];

							$guest->set_image($image);

						}
*/
					$event->set_guest($guest);

					$i++;

          }

          $success = false;

          if(($new > 0) && ($updated > 0) ) {
            if($ERROR_HANDLER->get_error_count() == 0 &&
                $organizer->add_event_guest($event) &&
                $organizer->update_event_guest($event)) {

                  $success = true;
      			}

          } else if($new > 0) {
            if($ERROR_HANDLER->get_error_count() == 0 && $organizer->add_event_guest($event)){
      				$success = true;
              echo "new";
      			}
          } else if($updated > 0) {
            if($ERROR_HANDLER->get_error_count() == 0 && $organizer->update_event_guest($event)){
      				$success = true;
              echo "updated";
      			}
          }
			if($success){
				$result->success = true;
			} else {
        $result->success = false;
				$result->message = generate_message(' Error updating Guests ' );
			}

      echo json_encode($result);
      exit;

}




if($submitted_form === 'updateCompanyAddress' &&
    isset($_POST['organizerId'])
  &&  isset($_POST['data'])
    && $_POST['organizerId'] == $SESSION->get_session_id() ){

				$organizer = new Organizer();
				$organizer->set_id($SESSION->get_session_id());
        $data = json_decode($_POST["data"], true);

				$i = 0;
		$address;





			if(isset($data)){

								$organizer->update_address($data);


					}

					if($ERROR_HANDLER->get_error_count() == 0 && $organizer->update_address()) {
						$result->success = true;
					} else {
            $result->success = false;
            $result->message = generate_message('Failed to Update Address');

					}



echo json_encode($result);
exit;

}

if ($submitted_form === 'sponsor_update' && $_POST['organizer_id'] == $SESSION->get_session_id() && isset($_POST['event_id'])) {

		$organizer = new Organizer();
		$organizer->set_id($SESSION->get_session_id());

			$event = new Event();
			$event->set_id($_POST['event_id']);
			$success = true;


		$i= 0;
				if(isset($_POST['sponsor-name'])) {

					while($i < count($_POST['sponsor-name'])){

							$sponsor = new Sponsor();

							if (isset($_POST['sponsor-name'][$i])) {
								$sponsor_name = $_POST['sponsor-name'][$i];
								$sponsor->set_name($sponsor_name);
							}

							if(isset($_FILES['sponsor-image']['tmp_name'][$i])){
								$image = null;
								$image['tmp_name'] = $_FILES['sponsor-image']['tmp_name'][$i];
								$image['name'] = $_FILES['sponsor-image']['name'][$i];
								$image['size'] = $_FILES['sponsor-image']['size'][$i];
								$image['type'] = $_FILES['sponsor-image']['type'][$i];
								$image['error'] = $_FILES['sponsor-image']['error'][$i];

								$sponsor->set_image($image);
							}


						$event->set_sponsor($sponsor);
						$i++;


				}

			$success = ($ERROR_HANDLER->get_error_count() == 0 && $organizer->add_event_sponsor($event)) ? true : false;


			}

$i=0;

					if(isset($_POST['sponsor-name-update'])) {

					while($i < count($_POST['sponsor-name-update'])){

							if(isset($_POST['sponsor-id'][$i])) {
								$sponsor = new  Sponsor($_POST['sponsor-id'][$i], 'updated');

								if (isset($_POST['sponsor-name-update'][$i])) 	$sponsor->set_name($_POST['sponsor-name-update'][$i]);
							if(isset($_FILES['sponsor-image-update']['tmp_name'][$i])){
									$image = null;
									$image['tmp_name'] = $_FILES['sponsor-image-update']['tmp_name'][$i];
									$image['name'] = $_FILES['sponsor-image-update']['name'][$i];
									$image['size'] = $_FILES['sponsor-image-update']['size'][$i];
									$image['type'] = $_FILES['sponsor-image-update']['type'][$i];
									$image['error'] = $_FILES['sponsor-image-update']['error'][$i];

									$sponsor->set_image($image);
								}

									$event->set_sponsor($sponsor);



					}
					$i++;

					}

					$success = ($ERROR_HANDLER->get_error_count() == 0 && $organizer->update_event_sponsor($event)) ? true : false;
				}


			echo ($success) ? json_encode(generate_message("Event Sponsors Updated Successfuly!!!")) : json_encode(generate_message("Failed to Update Event Sponsor!!!"));

	exit;
}


if($submitted_form === 'comment' && isset($_POST['event_id'])){

  	$commenter = NULL;
  	$content = NULL;


  		$event = new Event();
  		$event->set_id($_POST['event_id']);


  		if(isset($_POST['commenter-name'])){
  				$commenter = $_POST['commenter-name'];
  		}

  		if(isset($_POST['comment-content'])){
  			$content = $_POST['comment-content'];
  		}


  		$comment = new Comment($commenter, $content);





	      	if($event->add_comment($comment)){

	      		    $new_comment = "<li>";
                    $new_comment .= "<h5>".$comment->get_commenter()."</h5>";

                     $new_comment .= "<p><strong>". $comment->get_comment()."</strong>.</p>";
                      $new_comment .= "<p class='ui-li-aside'><strong>just now</strong></p>";
                      $new_comment .= "</li>";
                      echo $new_comment;
	      	} else {

	      	}





      }


      if($get_request === 'available_tickets' && isset($_POST['event_id'])) {

      		      	$ticket['ticket'] = DB_CONNECTION::get_event_ticket($_POST['event_id']);

      			echo json_encode($ticket);
      }





  if($submitted_form === 'contact_organizer' && isset($_POST['event_id']) ) {
$connection = new DB_CONNECTION();
      	$id = $connection->get_organizer_id($_POST['event_id']);
      		$organizer = Organizer::get_organizer($id);

      		$sender = new Viewer();
      		if(isset($_POST['contact-org-firstname'])){
      			$fname = $_POST['contact-org-firstname'];
      			$sender->set_first_name($fname);
      		}
      		if(isset($_POST['contact-org-lastname'])){
      			$lname = $_POST['contact-org-lastname'];
      			$sender->set_last_name($lname);
      		}
      		if(isset($_POST['contact-org-email'])){
      			$email = $_POST['contact-org-email'];
      			$sender->set_mail_address($email);
      		}

      		if(isset($_POST['contact-org-message'])){
      			$mail = $_POST['contact-org-message'];
      			$sender->set_mail($mail);
      		}

      		if(isset($_POST['contact-org-subject'])){
      			$subject = $_POST['contact-org-subject'];
      			$sender->set_subject($subject);
      		}









      			$result = $sender->send_mail($organizer);
      			if($result){
      				echo "<div class='alert alert-success' > Message Sent!!! </div> ";
      			} else {
      				echo "<div class='alert alert-danger' > Sorry, Sending Message Failed Try Again </div>" ;
      			}

      }




 if($submitted_form === 'sign_up' && isset($_POST["user"])) {

    // Decode JSON object into readable PHP object

$user = $_POST["user"];
$fname = null;
$lname = null;
$mail = null;
$password = null;


    if(isset($user["firstName"])) $fname = $user["firstName"];
	if(isset($user["lastName"]))  $lname = $user["lastName"];
	if(isset($user["email"])) $mail = $user["email"];
	if(isset($user["password"])) $password = $user["password"];

    	if(($ERROR_HANDLER->get_error_count() == 0 ) &&
    		 Organizer::sign_up($fname, $lname, $mail, $password, $SESSION) &&
    		 $SESSION->is_loged_in()) {

				$result->message = "Registration Completed Successfuly!!!";
				$result->success = true;
				$result->organizer_id = $SESSION->get_session_id();
		}	else {
				$result->message = "E-mail Already Exsists!!!";
				$result->success = false;

		}

		echo  json_encode($result);

		exit;


}



if($submitted_form == 'eventGeneralUpdate' &&
    isset($_POST['eventId']) &&
    $_POST['organizerId'] == $SESSION->get_session_id() &&
  isset($_POST["data"])) {


			$event = new Event();
			$event->set_id($_POST['eventId']);

      $data = $_POST["data"];

		$organizer = new Organizer();
		$organizer->set_id($SESSION->get_session_id());


				if(isset($data["eventName"]))	$event->set_name($data["eventName"]);
				if(isset($data["venueName"]))	$event->set_venue($data["venueName"]);

				if(isset($data["catagory"]))	$event->set_category($data["catagory"]);
				if(isset($data["latitude"]))	$event->set_latitude($data["latitude"]);
				if(isset($data["longitude"]))	$event->set_longitude($data["longitude"]);


		$address = new Address();
				if(isset($data["country"]))	$address->set_country($data["country"]);
				if(isset($data["city"]))	$address->set_city($data["city"]);
				if(isset($data["subCity"]))	$address->set_sub_city($data["subCity"]);
				if(isset($data["location"]))	$address->set_location($data["location"]);
        if(isset($data["latitude"]))	$event->set_latitude($data["latitude"]);
				if(isset($data["longitude"]))	$event->set_longitude($data["longitude"]);

				$event->set_address($address);
				if($ERROR_HANDLER->get_error_count() == 0  && $organizer->update_event_information($event)) {
					$result->success = true;
				} else {
					$result->success = false;
          $result->message = generate_message("Event Update Failed!!!");
				}

	echo json_encode($result);
exit;
}




if($submitted_form === 'event_ticket_update' && $_POST['organizer_id'] == $SESSION->get_session_id() && isset($_POST['event_id'])){

			$organizer = new Organizer();
			$organizer->set_id($SESSION->get_session_id());
			$event = new Event();
			$event->set_id($_POST['event_id']);

			$success = true;

				$i = 0;
				if(isset($_POST['ticket-type']) 	) {


							while($i < count($_POST['ticket-type'])){
								$ticket = new Ticket();
								if(isset($_POST['ticket-name'][$i]))	$ticket->set_name($_POST['ticket-name'][$i]);
								if(isset($_POST['ticket-type'][$i]))	$ticket->set_type($_POST['ticket-type'][$i]);
								if(isset($_POST['ticket-quantity'][$i]))	$ticket->set_quantity($_POST['ticket-quantity'][$i]);

								if(isset($_POST['ticket-price'][$i])) {
									$ticket->set_price($_POST['ticket-price'][$i]);
								} else {
									$ticket->set_price(0);
								}
								if(isset($_POST['ticket-discription'][$i])) $ticket->set_discription($_POST['ticket-discription'][$i]);
								if(isset($_POST['ticket-sales-start-update']))	$ticket->set_sale_start($_POST['ticket-sales-start-update']);
								if(isset($_POST['ticket-sales-end-update']))	$ticket->set_sale_end($_POST['ticket-sales-end-update']);
								$i++;

							$event->set_ticket($ticket);
						}

							$success = ($ERROR_HANDLER->get_error_count() == 0  && $organizer->add_event_ticket($event)) ? true : false;

				}

		$i = 0;
					if(isset($_POST['ticket_id'])){

							while($i < count($_POST['ticket_id'])){

								if(isset($_POST['ticket_id'][$i])){

									$ticket = new Ticket($_POST['ticket_id'][$i], 'updated');

									if(isset($_POST['ticket-name-update'][$i]))		$ticket->set_name($_POST['ticket-name-update'][$i]);
									if(isset($_POST['ticket-type-update'][$i]))		$ticket->set_type($_POST['ticket-type-update'][$i]);
									if(isset($_POST['ticket-quantity-update'][$i]))	$ticket->set_quantity($_POST['ticket-quantity-update'][$i]);
									if(isset($_POST['ticket-price-update'][$i])) {
										$ticket->set_price($_POST['ticket-price-update'][$i]);
									} else {
										$ticket->set_price(0);
									}
									if(isset($_POST['ticket-name-update'][$i]))		$ticket->set_discription($_POST['ticket-discription-update'][$i]);
									if(isset($_POST['ticket-sales-start-update']))	$ticket->set_sale_start($_POST['ticket-sales-start-update']);
									if(isset($_POST['ticket-sales-end-update']))	$ticket->set_sale_end($_POST['ticket-sales-end-update']);


									$event->set_ticket($ticket);


							}
								$i++;

							}

							$success = ($ERROR_HANDLER->get_error_count() == 0 && $organizer->update_event_ticket($event)) ? true : false;
				}


								if($success) {

							 		$result = generate_message(" Ticket Updated Successfuly!! ");
								} else {
									$result = generate_message(" Failed to updated Tickets!! ");
								}

		echo json_encode($result);



}








if($submitted_form === 'event_schedule_update' && isset($_POST['event_id']) && $_POST['organizer_id'] == $SESSION->get_session_id() ){

		$organizer = new Organizer();
		$organizer->set_id($SESSION->get_session_id());

		$event = new Event();
		$event->set_id($_POST['event_id']);

		if(isset($_POST['event-start-date-update']) && isset($_POST['event-start-time-update']))
			$event->set_start_datetime($_POST['event-start-date-update'], $_POST['event-start-time-update']);

		if(isset($_POST['event-end-date-update']) && isset($_POST['event-end-time-update']))
			$event->set_end_datetime($_POST['event-end-date-update'], $_POST['event-start-time-update']);


		if($ERROR_HANDLER->get_error_count() == 0 && $organizer->update_event_schedule($event)) {
			$result = json_encode(generate_message("Event Updated Successfuly!!!"));
		} else {
			$result = json_encode(generate_message("Event Update Failed!!! "));
		}

		echo $result;
		exit;
}



if($submitted_form === "mail_change" && $_POST['organizer_id'] == $SESSION->get_session_id()) {

			$organizer = new Organizer();
			$organizer->set_id($SESSION->get_session_id());


				if(isset($_POST['changed-email'])) {
					if($ERROR_HANDLER->get_error_count() == 0 &&$organizer->change_email($_POST['changed-email']) ) {
						echo json_encode(generate_message("E-mail updated Successfuly!!!, Provide this email next time you log in. "));
					} else {
						echo json_encode(generate_message("Error updating E-mail!!!"));
					}

			}

exit;

}




if($submitted_form === 'billing_address_update' && $_POST['organizer_id'] == $SESSION->get_session_id() ){

			$organizer = Organizer::get_organizer($_POST['organizer_id']);


			if(isset($_POST['service-provider']) && isset($_POST['billing-phone'])){
				$result->success = $organizer->update_billing_address( $_POST['service-provider'], $_POST['billing-phone']);
			}

			if($result->success){
				$result->message = "<div class='alert alert-success'> Billing Address Updated Successfuly </div>";
					} else {
						$result->message =  "<div class='alert alert-danger'> Error Occured While Billing Address Address Please Try Again!!! </div>";
					}

echo $result->message;
exit;
}

if($submitted_form == "updateCompanyWebsite"
    && $_POST["organizerId"] == $SESSION->get_session_id()
    && isset($_POST["data"])){

      $organizer = new Organizer();
      $organizer->set_id($SESSION->get_session_id());

      if($ERROR_HANDLER->get_error_count() == 0 && $organizer->update_website($_POST["data"]) ) {
        $result->success = true;
      } else {
        $result->success = false;
        $result->message = generate_message("Website update failed");
      }

      echo json_encode($result);
      exit;
}


if($submitted_form === 'password_change' && $_POST['organizer_id'] == $SESSION->get_session_id() ){

			$organizer = Organizer::get_organizer($_POST['organizer_id']);

						if(isset($_POST['new-password']) && isset($_POST['current-password']) ){

							$result->success = $organizer->change_password($_POST['current-password'], $_POST['new-password']);
						}

						if($result->success){

							$result->message .= '<h5 class="alert alert-success" > Password Changed Successfuly Your New Password Wiill Be Active On Your Next Log In </h5>';
						} else {
							$result->message .= '<h5 class="alert alert-danger" > Password Was Not Changed , Please verify Your Input And Try Again </h5>';
						}

			echo $result->message;


		}


/*
		GET[] REQUEST HANDLLING SECTION

*/



if($get_request === 'event_category' && isset($_GET['category'])) {

		$category = $_GET['category'];

		$connection = new DB_CONNECTION();
		$events = $connection->get_event_category($category);

		echo json_encode($events);

	exit;
}

if($get_request === 'organizer_mail' && $SESSION->is_loged_in() ) {
	$organizer = Organizer::get_organizer($SESSION->get_session_id());

		echo json_encode($organizer->get_email());
	exit;
}

 if($get_request === 'eventDetail' && isset($_GET['eventId'])) {


		$event_detail = DB_CONNECTION::get_event_details($_GET['eventId']);

		 echo json_encode($event_detail);
exit;
 }



 if($get_request === 'eventSummary' && isset($_GET['eventId']) && isset($_GET['organizerId'])) {


    $event_detail = DB_CONNECTION::get_event_summary($_GET['organizerId'],$_GET['eventId']);

     echo json_encode($event_detail);
exit;
 }



	if($get_request === 'trending_events') {
		$connection = new DB_CONNECTION();

			$events = $connection->fetch_events();


			echo json_encode($events);
	}


if($get_request === 'organizer_mail') {

	$organizer = Organizer::get_organizer($SESSION->get_session_id());


		echo json_encode($organizer->get_email());

}


if($get_request === 'event_basics' && isset($_GET['event_id']) ){
	$connection = new DB_CONNECTION();



	$eve  = $connection->get_event($_GET['event_id']);

echo json_encode($eve);

}


if($get_request === 'event_summary' && isset($_GET['event_id']) ){

	$event = DB_CONNECTION::get_event_details($_GET['event_id']);


	echo json_encode($event);

}




if($get_request === 'event_schedule' && isset($_GET['event_id'])){

		$Schedule  = DB_CONNECTION::get_event_schedule($_GET['event_id']);

		echo json_encode($Schedule);
	exit;
}

if($get_request === 'event_guests' && isset($_GET['event_id']) && $_GET['organizer_id'] == $SESSION->get_session_id()){




	$guest  = DB_CONNECTION::get_event_guest($_GET['event_id']);

	echo json_encode($guest);

}


if($get_request === 'event_sponsors' && isset($_GET['event_id']) && $_GET['organizer_id'] == $SESSION->get_session_id()){

	$sponsor  = DB_CONNECTION::get_event_sponsor($_GET['event_id']);

	echo json_encode($sponsor);
exit;
}

if($get_request === 'event_tickets' && isset($_GET['event_id'])){

		$tickets  = DB_CONNECTION::get_event_ticket($_GET['event_id']);

		echo json_encode($tickets);
	exit;
}



	if($get_request === 'organizerEvents' && $_GET['organizerId'] == $SESSION->get_session_id())	{

		$events =	DB_CONNECTION::get_organizer_events($SESSION->get_session_id());

		echo json_encode($events);
    exit;
	}





 if($submitted_form === 'delete_event'){

	$organizer = new Organizer();
	$organizer->set_id($SESSION->get_session_id());

	if(isset($_POST['event_id'])){

		$event = new Event();
		$event->set_id($_POST['event_id']);
		$organizer = new Organizer();
		$organizer->set_id($SESSION->get_session_id());

		if($ERROR_HANDLER->get_erro_count() == 0 && $organizer->delete_event($event)) {
			$result->message = 'Event Deleted';
		} else {
			$result->message = 'Error Deleting Event';
		}
	}

	echo $result->message;
}


 if($get_request === 'delete_ticket' && isset($_GET['ticket_id']) && isset($_GET['event_id'])  ){

		$ticket = new Ticket($_GET['ticket_id'], 'deleted');

		$event = new Event();
		$event->set_id($_GET['event_id']);

		$event->set_ticket($ticket);

		$organizer = new Organizer();
		$organizer->set_id($SESSION->get_session_id());


		if($ERROR_HANDLER->get_error_count() == 0 && $organizer->delete_event_ticket($event)) {

			$result->message =  '<h5 class="alert alert-success" > Ticket Deleted Successfuly </h5>';
		} else {
			$result->message =  '<h5 class="alert alert-danger" > Error Deleting Ticket </h5>';
		}

		echo $result->message;
	}


 if($get_request === 'delete_guest' &&
 				isset($_GET['guest_id']) &&
 						isset($_GET['event_id'])
 								&& $_GET['organizer_id'] == $SESSION->get_session_id()  )	{

		$guest = new Guest($_GET['guest_id'], 'deleted');

		$organizer = new Organizer();

		$event = new Event();
		$event->set_id($_GET['event_id']);
		$event->set_guest($guest);

		$organizer->set_id($SESSION->get_session_id());


		if($ERROR_HANDLER->get_error_count() == 0 &&  $organizer->delete_event_guest($event)){
			$result->message =  '<h5 class="alert alert-success" > Guest Deleted Successfuly </h5>';
		} else {
			$result->message .=  '<h5 class="alert alert-danger" > Error Deleting Guest </h5>';
		}

		echo $result->message;
	}

 if($get_request === 'delete_sponsor' &&
 				isset($_GET['sponsor_id']) &&
 						isset($_GET['event_id'])
 								&& $_GET['organizer_id'] == $SESSION->get_session_id()  )	{


		$sponsor = Sponsor($_GET['guest_id'], 'deleted');


		$event = Event();
		$event->set_id($_GET['event_id']);
		$event->set_sponsor($sponsor);

		$organizer->set_id($SESSION->get_session_id());


		if($ERROR_HANDLER->get_error_count() == 0 && $organizer->delete_event_guest($event)){
			$result->message =  '<h5 class="alert alert-success" >'.$sponsor->get_name().' Sponsor Deleted Successfuly </h5>';
		} else {
			$result->message .=  '<h5 class="alert alert-danger" >'.$sponsor->get_name().' Error Deleting Guest </h5>';
		}

		echo $result->message;
	}


if($get_request === 'organizer_info' && $_GET['organizerId']  == $SESSION->get_session_id() ){

	$info = DB_CONNECTION::get_organizer_info($SESSION->get_session_id());
	echo	json_encode($info);

}




if($get_request === 'event_statstics' && $_GET['organizer_id'] == $SESSION->get_session_id() && isset($_GET['event_id'])) {

			$result =DB_CONNECTION::get_event_booking_stat($SESSION->get_session_id(),  $_GET['event_id']);
			echo json_encode($result);


}


if($get_request === 'check_ins' && isset($_GET['event_id']) && $_GET['organizer_id'] == $SESSION->get_session_id()){

	$checkins = CHECK_IN_CONTROLLER::get_event_check_ins(798);

	echo json_encode($checkins);

	exit;
}



if($get_request === 'manage_check_in' && isset($_GET['request']) && $_GET['organizer_id'] == $SESSION->get_session_id() && isset($_GET['reciept-id'])){

	$result;
		if($_GET['request'] == 'check_out'){
			$result =  Attendee::check_out($_GET['event_id'], $_GET['reciept-id']);

		} else {

			$result = Attendee::check_in($_GET['event_id'], $_GET['reciept-id']);
		}

		if($ERROR_HANDLER->get_error_count() == 0 ) {
			echo json_encode($reult);
		} else {
			echo json_encode(generate_message("Error"));
		}



}


if($get_request === 'check_in' &&  $_GET['organizer_id'] == $SESSION->get_session_id() && isset($_GET['reciept-id'])){
	$resu = new stdclass();
	$resu->message;
	$resu->data;
	$resu->success;
		$data = Attendee::check_in($_GET['event_id'], $_GET['reciept-id']);
		if($ERROR_HANDLER->get_error_count() == 0 ) {
			$resu->success = "true";
			 $resu->message = "Welcome!!!";
			$resu->data =$data;
		} else {
				$resu->success = "False";
			 $resu->message = "Invalid Ticket!!!";

		}

	echo json_encode($resu);

}



if($get_request === 'attendee_tickets' && isset($_GET['reservation_ID'])) {

			$attendee  = new Attendee() ;
			$attendee->set_id($_GET['reservation_ID']);

		if($reciept = $attendee->get_reciept()){


				$result->reciept = $reciept;
				$result->success = 'true';

		} else {
			$result->success = 'false';
			$result->message = "<h5 class='alert alert-danger' >   Error Creating Reciept </h5> ";
		}


echo json_encode($result);
	exit;


}



if($get_request === 'download_pdf' && isset($_GET['reservation_ID'])) {

			$bookings  = Booking::get_booking($_GET['reservation_ID']);
				$reciept = new RecieptFactory();
				$result->success = $reciept->print_reciept($_GET['reservation_ID']);


				if($result->success){
					$result->success = 'true';
				}else {
					$result->success = 'false';
				}


echo json_encode($result);

		exit;

}



if($submitted_form === 'subscriber' && isset($_POST['option']) && $_POST['option'] === 'NEW' ) {

		if(isset($_POST['subscriber-mail'])) {
			$subscriber = new subscriber($_POST['subscriber-mail']);

			if($subscriber != null) {
				$result->success = 'true';
				$result->message = "Subscription Created Successfuly";
				$result->subscriber_id = $subscriber->get_id();
			} else {
				$result->success = 'false';
				$result->message = "Subscription Failed";
			}
		}

echo json_encode($result);
exit;

}
if($submitted_form === 'subscriber' && isset($_POST['option']) && $_POST['option'] === 'UPDATE' ) {

		if(isset($_POST['subscriber-mail'])) {
			$subscriber = Subscriber::get_subscriber_by_email($_POST['subscriber-mail']);

			if($subscriber != null) {
				$result->success = 'true';
				$result->message = "Subscriber Found Successfuly";
				$result->subscriber_id = $subscriber->get_id();
			} else {
				$result->success = 'false';
				$result->message = "Subscription Was Not Found please provide a the email you used to subscribe or create a new Subscription";
			}
		}

echo json_encode($result);
exit;

}



if($submitted_form === 'subscriber' && isset($_POST['option']) && $_POST['option'] === 'DELETE' ) {

		if(isset($_POST['subscriber-mail'])) {
			$subscriber = Subscriber::get_subscriber_by_email($_POST['subscriber-mail']);

			if($subscriber != null) {
				$result->success = 'true';
				$result->message = "Subscriber Found Successfuly";
				$result->subscriber_id = $subscriber->get_id();
			} else {
				$result->success = 'false';
				$result->message = "Subscription Was Not Found Failed provide a the email you used to subscribe or create a new Subscription";
			}
		}

echo json_encode($result);
exit;

}

if($submitted_form === 'new_subscription' && isset($_POST['subscriber_id']) ) {

		$subscriber = Subscriber::get_subscriber($_POST['subscriber_id']);

		$subscription = new Subscription();

			if(isset($_POST['subscription-lists'])) {

				$result->success = $subscription->add_subscription($subscriber, $_POST['subscription-lists'] );

			} else {
				$result->success = false;
				$result->message .= 'No Subscription Was Selected ';
			}

			if($result->success) {
				$result->message = "Subscription Successfuly Saved!!! ";
				$result->success = 'true';
			} else {
				$result->success = 'false';
			}


			echo $result->message;

		exit;
}


if($submitted_form === 'update_subscription' && isset($_POST['subscriber_id']) ) {

		$subscriber = Subscriber::get_subscriber($_POST['subscriber_id']);

		$subscription = new Subscription();

			if(isset($_POST['subscription-lists'])) {

				$result->success = $subscription->update_subscription($subscriber, $_POST['subscription-lists'] );

			} else {
				$result->success = false;
				$result->message .= 'No Subscription Was Selected ';
			}

			if($result->success) {
				$result->message = "Subscription Updated Successfuly Saved!!! ";
				$result->success = 'true';
			} else {
				$result->success = 'false';
			}


			echo $result->message;

		exit;
}

if($get_request === 'organization_address' && $_GET['organizer_id'] == $SESSION->get_session_id() ){

			$address = DB_CONNECTION::get_organization_address($_GET['organizer_id']);

			echo json_encode($address);
			exit;
}



if($get_request === 'delete_address' && $_GET['organizer_id'] == $SESSION->get_session_id() && isset($_GET['address_id']) ){

			$organizer = Organizer::get_organizer($_GET['organizer_id']);
			$address = Address::get_address($_GET['address_id']);

			$result->success = $organizer->remove_address($address);

			if($result->success){
				$result->message = "<h5 class='alert alert-success' > Address Removed Successfuly </h5> ";
			} else {
				$result->message = "<h5 class='alert alert-danger' > Address Was Not Removed Successfuly </h5> ";
			}


			echo $result->message;

			exit;
}


if($get_request === 'social_addresses' && isset($_GET['organizer_id']) && $_GET['organizer_id'] == $SESSION->get_session_id() ) {


					$socialAddress = DB_CONNECTION::get_organization_socialAddress($_GET['organizer_id']);
					echo json_encode($socialAddress);

			exit;
}



if($get_request === 'change_status' && isset($_GET['event_id']) && isset($_GET['organizer_id'])
			&& $_GET['organizer_id'] == $SESSION->get_session_id()) {

			$event = Event::get_event($_GET['event_id']);

			$result->success = $event->change_status($_GET['change_to'] );

				if($result->success) {
					$result->message = '<div class="alert alert-success" > Event Status Changed Successfuly </div> ';
					$result->success = 'true';
				} else {
					$result->message = '<div class="alert alert-danger" > Event Status Change Failed </div> ';
					$result->success = 'false';
				}

echo json_encode($result);

	exit;
}





?>
