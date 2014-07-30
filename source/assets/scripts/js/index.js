/*
 * David Lettier (C) 2014.
 * http://www.lettier.com/
 * 
 */

$( document ).ready ( function ( ) {
	
	var job_objects             = $( "[job]" );	
	var number_of_jobs          = job_objects.length;	
	var sorted_by_rating        = false;	
	var job_status_options      = [ "Resume Submitted", "Phone Screen", "Code Screen", "In-person Interview", "Offer", "Hired" ];	
	var job_status_options_html = "";
	
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
		
		$( "html, body" ).animate( { scrollTop: 0 }, 1000 );
		
	} );
	
	function add_blank_job( )
	{
		
		var template_values = { 
		
			job_number:                 number_of_jobs + 1,
			job_number_minimized_class: "",
			job_form_minimized_class:   "",
			company_name:               "",
			position_title:             "",
			applied_via:                "",
			job_link:                   "",
			job_status_options:         job_status_options_html,
			contact_name:               "",
			contact_email:              "",
			contact_phone:              "",
			job_street:                 "",
			job_city:                   "",
			notes:                      "",
			rating_value:               "100",
			time_in_ms:                 Date.now( ),
			db_job_status:              "New",
			time_difference:            "0 Days 0 Hours 0 Minutes 0 Seconds"
		
		};
		
		$.get('assets/templates/job.mst', function( template ) {			
			
			var rendered_html = Mustache.render( template, template_values );
			
			$( ".container" ).append( rendered_html );
			
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
			
			$( "#job_number_" + template_values[ "job_number" ] ).on( "click", function ( ) {
				
				
				if ( $( "[job='" + template_values[ "job_number" ] + "']" ).hasClass( "job_form_min" ) === true )
				{
					
					$( "[job='" + template_values[ "job_number" ] + "']" ).removeClass( "job_form_min" );
					
					$( "#job_number_" + template_values[ "job_number" ] ).removeClass( "job_number_min" );
					
					$( "#job_number_" + template_values[ "job_number" ] ).attr( "title", "Collapse." );
					
				}
				else
				{
					
					$( "[job='" + template_values[ "job_number" ] + "']" ).addClass( "job_form_min" );
					
					$( "#job_number_" + template_values[ "job_number" ] ).addClass( "job_number_min" );
					
					$( "#job_number_" + template_values[ "job_number" ] ).attr( "title", "Expand." );
					
				}
				
			} );
			
			$( "#db_status" ).html( "" );
			
			$( "html, body" ).animate( {
				
				scrollTop: $( "[job='" + number_of_jobs + "']" ).offset( ).top
				
			}, 1000 );
			
			$( "[job='" + template_values[ "job_number" ] + "']" ).animate( { opacity: 1.0 }, 2000 );
			
			$( "#job_number_" + template_values[ "job_number" ] ).animate( { opacity: 1.0 }, 2000 );
			
		} );
		
	}
	
	function add_jobs( jobs )
	{
		
		if ( jobs.length == 0 )
		{
			
			return false;
			
		}
		
		var job = jobs.shift( );		
		
		var selected = 0;
		
		var i = 0;
		
		for ( i = 0; i < job_status_options.length; ++i )
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
		
		var template_values = { 
		
			job_number:                 job[ "number" ],
			job_number_minimized_class: "job_number_min",
			job_form_minimized_class:   "job_form_min",
			company_name:               job[ "company_name" ],
			position_title:             job[ "position_title" ],
			applied_via:                job[ "applied_via" ],
			job_link:                   job[ "job_link" ],
			job_status_options:         job_status_options_html,
			contact_name:               job[ "contact_name" ],
			contact_email:              job[ "contact_email" ],
			contact_phone:              job[ "contact_phone" ],
			job_street:                 job[ "job_street" ],
			job_city:                   job[ "job_city" ],
			notes:                      job[ "notes" ],
			rating_value:               job[ "rating" ],
			time_in_ms:                 job[ "time_entered" ],
			db_job_status:              "Saved",
			time_difference:            time_difference_string
		
		};
		
		$.get('assets/templates/job.mst', function( template ) {			
			
			var rendered_html = Mustache.render( template, template_values );
			
			$( ".container" ).append( rendered_html );
		
			job_objects = $( "[job]" );
			
			number_of_jobs = job_objects.length;
			
			$( "#total_jobs" ).html( number_of_jobs.toString( ) );
			
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
			
			$( "[job='" + job[ "number" ] + "']" ).animate( { opacity: 1.0 }, 1000 );
			
			$( "#job_number_" + job[ "number" ] ).animate( { opacity: 1.0 }, 1000 );

			add_jobs( jobs );
			
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
					
					add_jobs( data );
					
					$( "#db_status" ).html( "" );
					
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
					
					add_jobs( data );
					
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