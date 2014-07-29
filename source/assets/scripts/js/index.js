/*
 * David Lettier (C) 2014.
 * http://www.lettier.com/
 * 
 */

$( document ).ready ( function ( ) {
	
	var job_objects    = $( "[job]" );	
	var number_of_jobs = job_objects.length;
	
	var modifying_job = -1;
	
	var job_status_options = [ "Resume Submitted", "Phone Screen", "Code Screen", "In-person Interview", "Offer", "Hired" ];
	
	var job_status_options_html = "";
	
	var sorted_by_rating = false;
	
	for ( var i = 0; i < job_status_options.length; ++ i )
	{
		
		job_status_options_html += "<option>" + job_status_options[ i ] + "</option>";
		
	}
	
	$( window ).scroll( function( ) {
		
		if ( $( window ).scrollTop( ) > $( "#top_bar" )[ 0 ].offsetTop ) 
		{
			
			$( "#top_bar" ).addClass( "stick" );
			
		}
		else 
		{
			
			$( "#top_bar" ).removeClass( "stick" );
			
		}
		
	} );

	$( "#logo_text" ).click( function ( ) {
		
		$( "html, body" ).animate( {
			
			scrollTop: 0
				
		}, 1000 );
		
	} );
	
	function add_blank_job( )
	{
		
		var i = number_of_jobs + 1;
		
		var time_in_ms = Date.now( );
		
		$( ".container" ).append( 

			'<div class="row">' +
				'<div class="column">' +
					'<div class="job_number" id="job_number_' + i + '" title="Collapse.">' +
						i +
					'</div>' +
				'</div>' +
				'<div class="column">' +
					'<form     class="job_form" job="' + i + '">' +
						'<input    class="input_box company_name"   name="company_name"   type="text" placeholder="Company Name"   value="">' +
						'<input    class="input_box position_title" name="position_title" type="text" placeholder="Position Title" value="">' +
						'<input    class="input_box applied_via"    name="applied_via"    type="text" placeholder="Applied Via"    value="">' +
						'<input    class="input_box job_link"       name="job_link"       type="url"  placeholder="Job Link"       value="">' +
						'<div class="custom_select">' +
						'<select   class="input_box db_job_status"  name="job_status">' +
						job_status_options_html +
						'</select>' +
						'</div>' +			
						'<br>' +
						'<input    class="input_box contact_name"   name="contact_name"   type="text"  placeholder="Contact Name"   value="">' +
						'<input    class="input_box contact_email"  name="contact_email"  type="email" placeholder="Contact Email"  value="">' +
						'<input    class="input_box contact_phone"  name="contact_phone"  type="tel"   placeholder="Contact Phone"  value="" pattern="\(\d\d\d\) ?\d\d\d-\d\d\d\d">' +
						'<input    class="input_box contact_street" name="job_street"     type="text"  placeholder="Job Street"     value="">' +
						'<input    class="input_box contact_city"   name="job_city"       type="text"  placeholder="Job City"       value="">' +
						'<br>' +
						'<textarea class="input_box notes"          name="notes" placeholder="Notes"></textarea>' +
						'<span     class="star">&starf;</span>' +
						'<input    class="input_box rating"         name="rating" type="range" title="Rating" value="100">'  +
						'<span     class="input_box rating_reading">' + 100 + '</span>' +
						'<input                                     name="time_entered" type="hidden" value="' + time_in_ms + '">' +
						'<span     class="status">New.</span>' +
						'<span     class="date">0 Days 0 Hours 0 Minutes 0 Seconds</span>' +
					'</form>' +
				'</div>' +
			'</div>'
		
		);
		
		job_objects = $( "[job]" );
		
		number_of_jobs = job_objects.length;
		
		var job_number = number_of_jobs;
		
		$( "[job='" + job_number + "']" ).on( "click", update_job );
		
		$( "[job='" + job_number + "']" ).children( "[name='rating']" ).on( "mousemove", function ( ) {
			
			var value = $( this ).val( ).toString( );
			
			switch ( value.length )
			{
				
				case 1:
					
					value = "00" + value;
					break;
					
				case 2: 
					
					value = "0" + value;
					break;
					
				default:
					
					break;
					
			}
			
			$( "[job='" + job_number + "']" ).children( ".rating_reading" ).html( value );
			
		} );
		
		$( "#job_number_" + i ).on( "click", function ( ) {
			
			
			if ( $( "[job='" + i + "']" ).hasClass( "job_form_min" ) === true )
			{
				
				$( "[job='" + i + "']" ).removeClass( "job_form_min" );
				
				$( "#job_number_" + i ).removeClass( "job_number_min" );
				
				$( "#job_number_" + i ).attr( "title", "Collapse." );
				
			}
			else
			{
				
				$( "[job='" + i + "']" ).addClass( "job_form_min" );
				
				$( "#job_number_" + i ).addClass( "job_number_min" );
				
				$( "#job_number_" + i ).attr( "title", "Expand." );
				
			}
			
		} );
		
		$( "#db_status" ).html( "" );
		
		$( "html, body" ).animate( {
			
			scrollTop: $( "[job='" + number_of_jobs + "']" ).offset( ).top
			
		}, 2000 );
		
	};
	
	function add_job( job )
	{
		
		var selected = 0;
		
		for ( var i = 0; i < job_status_options.length; ++i )
		{
			
			if ( job[ "job_status" ] === job_status_options[ i ] )
			{
				
				selected = i;
				
				break;
				
			}
			
		}
		
		var job_status_options_html = "";
		
		for ( i = 0; i < job_status_options.length; ++i )
		{
			
			if ( i === selected )
			{
				
				job_status_options_html += "<option selected>" + job_status_options[ i ] + "</option>";
				
			}
			else
			{
			
				job_status_options_html += "<option>" + job_status_options[ i ] + "</option>";
				
			}
			
		} 
		
		switch ( job[ "rating" ].toString( ).length )
		{
			
			case 1:
				
				job[ "rating" ] = "00" + job[ "rating" ];
				break;
				
			case 2: 
				
				job[ "rating" ] = "0" + job[ "rating" ];
				break;
				
			default:
				
				break;
				
		}
		
		var time_difference_string = get_time_difference_string( parseInt( job[ "time_entered" ], 10 ) );
		
		$( ".container" ).append( 
		
			'<div class="row">' +
				'<div class="column">' +
				'<div class="job_number job_number_min" id="job_number_' + job[ "number" ] + '" title="Expand.">' +
						job[ "number" ] +
					'</div>' +
				'</div>' +
				'<div class="column">' +
					'<form class="job_form job_form_min" job="' + job[ "number" ] + '">' +
						'<input    class="input_box company_name"   name="company_name"   type="text" placeholder="Company Name"   value="' + job[ "company_name" ] + '">' +
						'<input    class="input_box position_title" name="position_title" type="text" placeholder="Position Title" value="' + job[ "position_title" ] + '">' +
						'<input    class="input_box applied_via"    name="applied_via"    type="text" placeholder="Applied Via"    value="' + job[ "applied_via" ] + '">' +
						'<input    class="input_box job_link"       name="job_link"       type="url"  placeholder="Job Link"       value="' + job[ "job_link" ] + '">' +
						'<div class="custom_select">' +
						'<select   class="input_box db_job_status"  name="job_status">' +
						job_status_options_html +
						'</select>' +
						'</div>' +
						'<br>' +
						'<input    class="input_box contact_name"   name="contact_name"   type="text"  placeholder="Contact Name"   value="' + job[ "contact_name" ] + '">' +
						'<input    class="input_box contact_email"  name="contact_email"  type="email" placeholder="Contact Email"  value="' + job[ "contact_email" ] + '">' +
						'<input    class="input_box contact_phone"  name="contact_phone"  type="tel"   placeholder="Contact Phone"  value="' + job[ "contact_phone" ] + '" pattern="\(\d\d\d\) ?\d\d\d-\d\d\d\d">' +
						'<input    class="input_box contact_street" name="job_street" type="text"      placeholder="Job Street"     value="' + job[ "job_street" ] + '">' +
						'<input    class="input_box contact_city"   name="job_city"   type="text"      placeholder="Job City"       value="' + job[ "job_city" ] + '">' +
						'<br>' +
						'<textarea class="input_box notes"          name="notes" placeholder="Notes">' + job[ "notes" ] + '</textarea>' +
						'<span     class="star">&starf;</span>' +
						'<input    class="input_box rating"         name="rating" type="range" title="Rating" value="' + job[ "rating" ] + '">' +
						'<span     class="input_box rating_reading">' + job[ "rating" ] + '</span>' +
						'<input                                     name="time_entered" type="hidden" value="' + job[ "time_entered" ] + '">'   +
						'<span     class="status">Saved.</span>' +
						'<span     class="date">' + time_difference_string + "</span>" +
					'</form>' +
				'</div>' +
			'</div>'
		
		);
		
		job_objects = $( "[job]" );
		
		number_of_jobs = job_objects.length;
		
		$( "[job='" + job[ "number" ] + "']" ).on( "click", update_job );
		
		$( "[job='" + job[ "number" ] + "']" ).children( "[name='rating']" ).on( "mousemove", function ( ) {
			
			var value = $( this ).val( ).toString( );
			
			switch ( value.length )
			{
				
				case 1:
					
					value = "00" + value;
					break;
					
				case 2: 
					
					value = "0" + value;
					break;
					
				default:
					
					break;
					
			}
			
			$( "[job='" + job[ "number" ] + "']" ).children( ".rating_reading" ).html( value );
			
		} );
		
		$( "#job_number_" + job[ "number" ] ).on( "click", function ( ) {
			
			
			if ( $( "[job='" + job[ "number" ] + "']" ).hasClass( "job_form_min" ) === true )
			{

				$( "[job='" + job[ "number" ] + "']" ).removeClass( "job_form_min" );
				
				$( "#job_number_" + job[ "number" ] ).removeClass( "job_number_min" );
				
				$( "#job_number_" + job[ "number" ] ).attr( "title", "Collapse." );
				
			}
			else
			{
				
				$( "[job='" + job[ "number" ] + "']" ).addClass( "job_form_min" );
				
				$( "#job_number_" + job[ "number" ] ).addClass( "job_number_min" );
				
				$( "#job_number_" + job[ "number" ] ).attr( "title", "Expand." );
				
			}
			
		} );			
			
	}
	
	function update_job( )
	{
		
		var job = $( this );
		
		var job_number = $( this ).attr( "job" );
		
		var data = { "number": job_number };
		
		for ( var i = 0; i < job[ 0 ].length; ++i )
		{

			data[ job[ 0 ][ i ].name ] = job[ 0 ][ i ].value;
			
		}
		
		var time_difference_string = get_time_difference_string( parseInt( $( "[job='" + job_number + "']" ).children( "[name='time_entered']" ).val( ), 10 ) );
		
		$( this ).children( ".status" ).html( "Saving..." );
		
		$.ajax( {
			
			type: "POST",
			url: "/update",
			data: JSON.stringify( data ),
			success: function ( data ) {
			
				$( "[job='" + job_number + "']" ).children( ".status" ).html( "Saved." );
				
				$( "[job='" + job_number + "']" ).children( ".date" ).html( time_difference_string );
				
				$( "#total_jobs" ).html( number_of_jobs.toString( ) );
				
			},
			error: function ( data ) {
				
				$( "[job='" + job_number + "']" ).children( ".status" ).html( "Error." );
				
			}
			
		} );
		
	}
	
	function get_jobs( )
	{
		
		$( "#db_status" ).html( "Getting job data..." );
		
		$( ".container" ).html( "" );
		
		$.ajax( {
			
			type: "POST",
			url: "/all",
			data: "",
			success: function ( data ) {
				
				if ( data == "" )
				{
					
					$( "#db_status" ).html( "Add a job." );
					
					$( "#add_new" ).animate( {
						
						marginRight: "200px"
						
					},
					1000,
					function ( ) {
						
						$( "#add_new" ).animate( {
							
							marginRight: "20px"
							
						},
						1000 );
						
					} );
					
				}
				else 
				{					
				
					data = JSON.parse( data ); 
					
					for ( var i = 0; i < data.length; ++i )
					{
						
						add_job( data[ i ] );
						
					}
					
					$( "#db_status" ).html( "" );
					
					$( "#total_jobs" ).html( number_of_jobs.toString( ) );
					
				}
				
			},
			error: function ( data ) {				
				
				$( "#db_status" ).html( "There was an error." );
				
			}
			
		} );
		
	}
	
	function get_jobs_by_rating( )
	{
		
		$( "#db_status" ).html( "Getting job data..." );
		
		$( ".container" ).html( "" );
		
		var data = { 
			
			"field": "rating",
			"order": -1
			
		}
		
		$.ajax( {
			
			type: "POST",
			url: "/sort",
			data: JSON.stringify( data ),
			success: function ( data ) {
				
				if ( data == "" )
				{
					
					$( "#db_status" ).html( "Add a job." );
					
					$( "#add_new" ).animate( {
						
						marginRight: "200px"
						
					},
					1000,
					function ( ) {
						
						$( "#add_new" ).animate( {
							
							marginRight: "20px"
							
						},
						1000 );
						
					} );
					
				}
				else 
				{					
					
					data = JSON.parse( data ); 
					
					for ( var i = 0; i < data.length; ++i )
					{
						
						add_job( data[ i ] );
						
					}
					
					$( "#db_status" ).html( "" );
					
					$( "#total_jobs" ).html( number_of_jobs.toString( ) );
					
				}
				
			},
			error: function ( data ) {				
				
				$( "#db_status" ).html( "There was an error." );
				
			}
			
		} );
		
	}
	
	$( "#add_new" ).on( "click", add_blank_job );
	
	$( "#sort_rating" ).on( "click", function ( ) {
		
		if ( sorted_by_rating === false )
		{
		
			get_jobs_by_rating( );
			
			sorted_by_rating = true;
			
			$( "#sort_rating" ).attr( "title", "Unsort by rating." );
			
		}			
		else if ( sorted_by_rating === true )
		{
			
			get_jobs( );
			
			sorted_by_rating = false;
			
			$( "#sort_rating" ).attr( "title", "Sort by rating." );
			
		}	
		
	} );
	
	get_jobs( );
	
} );

function get_time_difference_string( milliseconds )
{
	
	var date_now = Date.now( );
	
	var time_difference = date_now - parseInt( milliseconds, 10 );
	
	var days = Math.floor( time_difference / ( 1000 * 60 * 60 * 24 ) );
	
	time_difference -= Math.floor( days * ( 1000 * 60 * 60 * 24 ) );		
	
	var hours = Math.floor( time_difference / ( 1000 * 60 * 60 ) );
	
	time_difference -= Math.floor( hours * ( 1000 * 60 * 60 ) );
	
	var minutes = Math.floor( time_difference / ( 1000 * 60 ) );
	
	time_difference -= Math.floor( minutes * ( 1000 * 60 ) );
	
	var seconds = Math.floor( time_difference / 1000 );
	
	var time_difference_string = days + " Days " + hours + " Hours " + minutes + " Minutes " + seconds + " Seconds";
	
	return time_difference_string;
	
}