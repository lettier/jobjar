/*
 * David Lettier (C) 2014.
 * http://www.lettier.com/
 * 
 */

$( document ).ready ( function ( ) {
	
	var job_objects             = $( "[job]" );
	var number_of_jobs          = job_objects.length;
	var sorted_by_rating        = false;
	var sorted_by_age           = false;
	var job_status_options      = [ 
	
		{ value: "Resume Submitted",    selected: false },
		{ value: "Phone Screen",        selected: false },
		{ value: "Code Screen",         selected: false },
		{ value: "In-person Interview", selected: false },
		{ value: "Offer",               selected: false },
		{ value: "Hired",               selected: false }
	];	
	
	$( window ).scroll( function( ) {
		
		$( "#top_bar" ).css( "top", $( window ).scrollTop( ) + "px" );
		
	} );

	$( "#logo_text" ).click( function ( ) {
		
		$( "html, body" ).animate( { scrollTop: 0 }, 1000 );
		
	} );
	
	function add_blank_job( )
	{
		
		job_objects = $( "[job]" );
		
		number_of_jobs = job_objects.length;
		
		var template_values = { 
		
			job_number:                 number_of_jobs + 1,
		        job_number_title:           "Collapse",
			job_number_minimized_class: "",
			job_form_minimized_class:   "",
			company_name:               "",
			position_title:             "",
			applied_via:                "",
			job_link:                   "",
			job_status_options:         job_status_options,
			contact_name:               "",
			contact_email:              "",
			contact_phone:              "",
			job_street:                 "",
			job_city:                   "",
			notes:                      "",
			rating_value:               "100",
			time_in_ms:                 Date.now( ),
			db_job_status:              "New.",
			time_difference:            "0 Days 0 Hours 0 Minutes 0 Seconds"
		
		};
		
		$( "#add_new" ).removeClass( "beat" );
		
		$.get( "assets/templates/job.mst", function( template ) {			
			
			var rendered_html = Mustache.render( template, template_values );
			
			$( ".container" ).append( rendered_html );
			
			$( "[job='" + template_values.job_number + "']" ).on( "keyup mouseup", update_job );
			
			$( "#trash_can_" + template_values.job_number ).on( "click", delete_job );
			
			$( "#trash_can_" + template_values.job_number ).hide( );
			
			$( "[job='" + template_values.job_number + "']" ).children( "[name='rating']" ).on( "mousemove", function ( ) {
				
				$( "[job='" + template_values.job_number + "']" ).children( ".rating_reading" ).html( pad_with_zeros( $( this ).val( ).toString( ) ) );
				
			} );
			
			$( "#job_number_" + template_values.job_number ).on( "click", function ( ) {
				
				
				if ( $( "[job='" + template_values.job_number + "']" ).hasClass( "job_form_min" ) === true )
				{
					
					$( "[job='" + template_values.job_number + "']" ).animate( {
						
						height: "362px"
						
					},
					500,
					function ( ) {
						
						$( "[job='" + template_values.job_number + "']" ).removeClass( "job_form_min" );
						
						$( "[job='" + template_values.job_number + "']" ).css( "height", "" );						
						
					} );
					
					$( "#job_number_" + template_values.job_number ).animate( {
						
						fontSize: "300px"
						
					},
					500,
					function ( ) {
						
						$( "#job_number_" + template_values.job_number ).removeClass( "job_number_min" );
						
						$( "#job_number_" + template_values.job_number ).css( "font-size", "" );
						
						$( "#job_number_" + template_values.job_number ).attr( "title", "Collapse." );
						
					} );
					
				}
				else
				{	
					
					$( "[job='" + template_values.job_number + "']" ).animate( {
						
						height: "64px"
						
					},
					500,
					function ( ) {
						
						$( "[job='" + template_values.job_number + "']" ).addClass( "job_form_min" );
						
						$( "[job='" + template_values.job_number + "']" ).css( "height", "" );						
						
					} );
					
					$( "#job_number_" + template_values.job_number ).animate( {
						
						fontSize: "110px"
						
					},
					500,
					function ( ) {
						
						$( "#job_number_" + template_values.job_number ).addClass( "job_number_min" );
						
						$( "#job_number_" + template_values.job_number ).css( "font-size", "" );
						
						$( "#job_number_" + template_values.job_number ).attr( "title", "Expand." );
						
					} );
					
				}
				
			} );
			
			$( "#db_status" ).html( "" );
			
			$( "html, body" ).animate( {
				
				scrollTop: $( "[job='" + template_values.job_number + "']" ).offset( ).top
				
			}, 1000 );
			
			$( "[job='" + template_values.job_number + "']" ).animate( { opacity: 1.0 }, 2000 );
			
			$( "#job_number_" + template_values.job_number ).animate( { opacity: 1.0 }, 2000 );
			
			job_objects = $( "[job]" );
			
			number_of_jobs = job_objects.length;
			
			$( "#total_jobs" ).html( number_of_jobs.toString( ) );
			
		} );
		
	}
	
	function add_jobs( jobs )
	{
		
		if ( jobs.length === 0 )
		{
			
			job_objects    = $( "[job]" );			
			number_of_jobs = job_objects.length;
			
			return false;
			
		}
		
		var job = jobs.shift( );
		
		var time_difference_string = get_time_difference_string( parseInt( job.time_entered, 10 ) );

		job.rating = pad_with_zeros( job.rating.toString( ) );		
		
		var template_values = { 
		
			job_number:                 job.number,
		        job_number_title:           "Expand",
			job_number_minimized_class: "job_number_min",
			job_form_minimized_class:   "job_form_min",
			company_name:               job.company_name,
			position_title:             job.position_title,
			applied_via:                job.applied_via,
			job_link:                   job.job_link,
			job_status_options:         job_status_options,
			contact_name:               job.contact_name,
			contact_email:              job.contact_email,
			contact_phone:              job.contact_phone,
			job_street:                 job.job_street,
			job_city:                   job.job_city,
			notes:                      job.notes,
			rating_value:               job.rating,
			time_in_ms:                 job.time_entered,
			db_job_status:              "Saved.",
			time_difference:            time_difference_string
		
		};
		
		$.get( "assets/templates/job.mst", function( template ) {			
			
			var rendered_html = Mustache.render( template, template_values );
			
			$( ".container" ).append( rendered_html );
		
			job_objects = $( "[job]" );
			
			number_of_jobs = job_objects.length;
			
			$( "#total_jobs" ).html( number_of_jobs.toString( ) );
			
			$( "[job='" + job.number + "']" ).children( ".custom_select" ).children( "[name='job_status']" ).val( job.job_status );
			
			$( "[job='" + job.number + "']" ).on( "keyup mouseup", update_job );
			
			$( "#trash_can_" + job.number ).on( "click", delete_job );
			
			$( "[job='" + job.number + "']" ).children( "[name='rating']" ).on( "mousemove", function ( ) {
				
				
				$( "[job='" + job.number + "']" ).children( ".rating_reading" ).html( pad_with_zeros( $( this ).val( ).toString( ) ) );
				
			} );
			
			$( "#job_number_" + job.number ).on( "click", function ( ) {
				
				
				if ( $( "[job='" + job.number + "']" ).hasClass( "job_form_min" ) === true )
				{
					
					$( "[job='" + job.number + "']" ).animate( {
						
						height: "362px"
						
					},
					500,
					function ( ) {
						
						$( "[job='" + job.number + "']" ).removeClass( "job_form_min" );

						$( "[job='" + job.number + "']" ).css( "height", "" );						
						
					} );
					
					$( "#job_number_" + job.number ).animate( {
						
						fontSize: "300px"
						
					},
					500,
					function ( ) {
						
						$( "#job_number_" + job.number ).removeClass( "job_number_min" );
						
						$( "#job_number_" + job.number ).css( "font-size", "" );
						
						$( "#job_number_" + job.number ).attr( "title", "Collapse." );
						
					} );
					
				}
				else
				{
					
					$( "[job='" + job.number + "']" ).animate( {
						
						height: "64px"
						
					},
					500,
					function ( ) {
						
						$( "[job='" + job.number + "']" ).addClass( "job_form_min" );
						
						$( "[job='" + job.number + "']" ).css( "height", "" );						
						
					} );
					
					$( "#job_number_" + job.number ).animate( {
						
						fontSize: "110px"
						
					},
					500,
					function ( ) {
						
						$( "#job_number_" + job.number ).addClass( "job_number_min" );
						
						$( "#job_number_" + job.number ).css( "font-size", "" );
						
						$( "#job_number_" + job.number ).attr( "title", "Expand." );
						
					} );
					
				}
				
			} );
			
			$( "[job='" + job.number + "']" ).animate( { opacity: 1.0 }, 1000 );
			
			$( "#job_number_" + job.number ).animate( { opacity: 1.0 }, 1000 );

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
		
		$( this ).children( ".db_job_status" ).html( "Saving..." );
		
		$.ajax( {
			
			type: "POST",
			url: "/update",
			data: JSON.stringify( data ),
			success: function ( data ) {
			
				$( "[job='" + job_number + "']" ).children( ".db_job_status" ).html( "Saved." );
				
				$( "[job='" + job_number + "']" ).children( ".date" ).html( time_difference_string );
				
				job_objects = $( "[job]" );
				
				number_of_jobs = job_objects.length;
				
				$( "#total_jobs" ).html( number_of_jobs.toString( ) );
				
				$( "#trash_can_" + job_number ).show( );
				
			},
			error: function ( data ) {
				
				$( "[job='" + job_number + "']" ).children( ".db_job_status" ).html( "Error." );
				
			}
			
		} );
		
	}
	
	function delete_job( )
	{
		
		var trash_can_id = $( this )[ 0 ].id;
		
		var job_number = parseInt( trash_can_id.split( "_" )[ 2 ], 10 );
		
		$( "[job='" + job_number + "']" ).children( ".db_job_status" ).html( "Deleting..." );
		
		$.ajax( {
			
			type: "POST",
			url: "/delete",
			data: JSON.stringify( { number: job_number } ),
			success: function ( data ) {
				
				job_objects = $( "[job]" );
				
				number_of_jobs = job_objects.length;
						
				$( "[job='" + job_number + "']" ).parents( ).eq( 1 ).remove( );
				
				var i, x;
				
				for ( i = job_number + 1; i <= number_of_jobs; ++i )
				{
					
					x = i - 1;
					
					( function ( i, x ) {
						
						$( "#job_number_" + i ).off( );
						
						$( "[job='" + i + "']" ).off( );
						
						$( "[job='" + i + "']" ).children( "[name='rating']" ).off( );
						
						$( "#trash_can_" + i ).off( );
						
						$( "#job_number_" + i )[ 0 ].innerHTML = x;
						
						$( "#job_number_" + i ).attr( "id", "job_number_" + x );
						
						$( "[job='" + i + "']" ).attr( "job", x );
						
						$( "#trash_can_" + i ).attr( "id", "trash_can_" + x );					
						
						$( "[job='" + x + "']" ).on( "keyup mouseup", update_job );					
						
						$( "#trash_can_" + x ).on( "click", delete_job );					
						
						$( "[job='" + x + "']" ).children( "[name='rating']" ).on( "mousemove", function ( ) {
							
							
							$( "[job='" + x + "']" ).children( ".rating_reading" ).html( pad_with_zeros( $( this ).val( ).toString( ) ) );
							
						} );					
						
						$( "#job_number_" + x ).on( "click", function ( ) {
							
							if ( $( "[job='" + x + "']" ).hasClass( "job_form_min" ) === true )
							{
								
								$( "[job='" + x + "']" ).animate( {
									
									height: "362px"
									
								},
							500,
							function ( ) {
								
								$( "[job='" + x + "']" ).removeClass( "job_form_min" );
								
								$( "[job='" + x + "']" ).css( "height", "" );						
								
							} );
								
								$( "#job_number_" + x ).animate( {
									
									fontSize: "300px"
									
								},
							500,
							function ( ) {
								
								$( "#job_number_" + x ).removeClass( "job_number_min" );
								
								$( "#job_number_" + x ).css( "font-size", "" );
								
								$( "#job_number_" + x ).attr( "title", "Collapse." );
								
							} );
								
							}
							else
							{
								
								$( "[job='" + x + "']" ).animate( {
									
									height: "64px"
									
								},
							500,
							function ( ) {
								
								$( "[job='" + x + "']" ).addClass( "job_form_min" );
								
								$( "[job='" + x + "']" ).css( "height", "" );						
								
							} );
								
								$( "#job_number_" + x ).animate( {
									
									fontSize: "110px"
									
								},
							500,
							function ( ) {
								
								$( "#job_number_" + x ).addClass( "job_number_min" );
								
								$( "#job_number_" + x ).css( "font-size", "" );
								
								$( "#job_number_" + x ).attr( "title", "Expand." );
								
							} );
								
							}
							
						} );
					
					} ) ( i, x );
					
				}
				
				job_objects = $( "[job]" );
				
				number_of_jobs = job_objects.length;
				
				$( "#total_jobs" ).html( number_of_jobs.toString( ) );
						
			},
			error: function ( data ) {
				
				$( "[job='" + job_number + "']" ).children( ".db_job_status" ).html( "Error." );
				
			}
		
		} );
		
	}
	
	function get_jobs( )
	{
		
		$( "#db_status" ).html( "Getting job data..." );
		
		var container_children = $( ".container" ).children( );
		
		var i = container_children.length;
		
		while ( i-- )
		{
			
			container_children[ i ].remove( );
			
		}
		
		$.ajax( {
			
			type: "POST",
			url: "/all",
			data: "",
			success: function ( data ) {
				
				if ( data === "" )
				{
					
					$( "#db_status" ).html( "Add a job. &#8599;" );
						
					$( "#add_new" ).addClass( "beat" );
					
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
	
	function get_jobs_sorted( field )
	{
		
		$( "#db_status" ).html( "Getting job data..." );
		
		$( ".container" ).html( "" );
		
		var data = { 
			
			"field": field,
			"order": -1
			
		};
		
		$.ajax( {
			
			type: "POST",
			url: "/sort",
			data: JSON.stringify( data ),
			success: function ( data ) {
				
				if ( data === "" )
				{
					
					$( "#db_status" ).html( "Add a job. &#8599;" );
					
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
	
	$( "#add_new" ).on( "click", add_blank_job );
	
	$( "#sort_rating" ).on( "click", function ( ) {
		
		sorted_by_age = false;
		
		$( "#sort_age" ).attr( "title", "Sort by age." );
		
		if ( sorted_by_rating === false )
		{
		
			get_jobs_sorted( "rating" );
			
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
	
	$( "#sort_age" ).on( "click", function ( ) {
		
		sorted_by_rating = false;
		
		$( "#sort_rating" ).attr( "title", "Sort by rating." );
		
		if ( sorted_by_age === false )
		{
			
			get_jobs_sorted( "time_entered" );
			
			sorted_by_age = true;
			
			$( "#sort_age" ).attr( "title", "Unsort by age." );
			
		}			
		else if ( sorted_by_age === true )
		{
			
			get_jobs( );
			
			sorted_by_age = false;
			
			$( "#sort_age" ).attr( "title", "Sort by age." );
			
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

function pad_with_zeros( text )
{
	
	switch ( text.length )
	{
		
		case 1:
			
			text = "00" + text;
			break;
			
		case 2: 
			
			text = "0" + text;
			break;
			
		default:
			
			break;
			
	}
	
	return text;
	
}