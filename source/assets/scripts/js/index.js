/*
 * David Lettier (C) 2014.
 * http://www.lettier.com/
 * 
 */

$( document ).ready ( function ( ) {
	
	var top_bar          = $( "#top_bar" );
	var top_bar_position = top_bar.position( );
	
	var job_objects    = $( "[job]" );	
	var number_of_jobs = job_objects.length;
	
	var modifying_job = -1;
	
	var job_status_options = [ "Resume Submitted", "Phone Screen", "Code Screen", "In-person Interview", "Offer", "Hired" ];
	
	var job_status_options_html = "";
	
	for ( var i = 0; i < job_status_options.length; ++ i )
	{
		
		job_status_options_html += "<option>" + job_status_options[ i ] + "</option>";
		
	}
	
	$( window ).scroll( function( ) {
		
		var window_pos = $( window ).scrollTop( );
		
		if ( window_pos >= top_bar_position.top ) 
		{
			
			top_bar.addClass( "stick" );
			
		}
		else 
		{
			
			top_bar.removeClass( "stick" );
			
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
		
		var date = new Date( ).toString( )
		
		$( ".container" ).append( 

			'<div class="row">' +
				'<div class="column">' +
					'<div class="job_number">' +
						i +
					'</div>' +
				'</div>' +
				'<div class="column">' +
					'<form     class="job_form" job="' + i + '">' +
						'<input    class="input_box company_name"   name="company_name"   type="text" placeholder="Company Name"   value="">' +
						'<input    class="input_box position_title" name="position_title" type="text" placeholder="Position Title" value="">' +
						'<input    class="input_box applied_via"    name="applied_via"    type="text" placeholder="Applied Via"    value="">' +
						'<input    class="input_box job_link"       name="job_link"       type="url"  placeholder="Job Link"       value="">' +
						'<select   class="input_box job_status"     name="job_status">' +
						job_status_options_html +
						'</select>' +			
						'<br>' +
						'<input    class="input_box contact_name"   name="contact_name"   type="text"  placeholder="Contact Name"   value="">' +
						'<input    class="input_box contact_email"  name="contact_email"  type="email" placeholder="Contact Email"  value="">' +
						'<input    class="input_box contact_phone"  name="contact_phone"  type="tel"   placeholder="Contact Phone"  value="" pattern="\(\d\d\d\) ?\d\d\d-\d\d\d\d">' +
						'<input    class="input_box contact_street" name="job_street"     type="text"  placeholder="Job Street"     value="">' +
						'<input    class="input_box contact_city"   name="job_city"       type="text"  placeholder="Job City"       value="">' +
						'<br>' +
						'<textarea class="input_box notes"  name="notes" placeholder="Notes"></textarea>' +
						'<input    class="input_box rating" name="rating" type="range" title="Rating" value="100">'  +
						'<span class="input_box rating_reading">' + 100 + '</span>' +
						'<input                             name="last_updated" type="hidden" value="' + date + '">' +
						'<span     class="status">New.</span>' +
						'<span     class="date">' + " " + date + "</span>" +
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
					
				default:
					
					break;
					
			}
			
			$( "[job='" + job_number + "']" ).children( ".rating_reading" ).html( value );
			
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
		
		switch ( job[ "rating" ].length )
		{
			
			case 1:
				
				job[ "rating" ] = "00" + job[ "rating" ];
				break;
				
			case 2: 
				
				job[ "rating" ] = "0" + job[ "rating" ];
				
			default:
				
				break;
				
		}
		
		$( ".container" ).append( 
		
			'<div class="row">' +
				'<div class="column">' +
					'<div class="job_number">' +
						job[ "number" ] +
					'</div>' +
				'</div>' +
				'<div class="column">' +
					'<form class="job_form" job="' + job[ "number" ] + '">' +
						'<input    class="input_box company_name"   name="company_name"   type="text" placeholder="Company Name"   value="' + job[ "company_name" ] + '">' +
						'<input    class="input_box position_title" name="position_title" type="text" placeholder="Position Title" value="' + job[ "position_title" ] + '">' +
						'<input    class="input_box applied_via"    name="applied_via"    type="text" placeholder="Applied Via"    value="' + job[ "applied_via" ] + '">' +
						'<input    class="input_box job_link"       name="job_link"       type="url"  placeholder="Job Link"       value="' + job[ "job_link" ] + '">' +
						'<select   class="input_box job_status"     name="job_status">' +
						job_status_options_html +
						'</select>' +			
						'<br>' +
						'<input    class="input_box contact_name"   name="contact_name"   type="text"  placeholder="Contact Name"   value="' + job[ "contact_name" ] + '">' +
						'<input    class="input_box contact_email"  name="contact_email"  type="email" placeholder="Contact Email"  value="' + job[ "contact_email" ] + '">' +
						'<input    class="input_box contact_phone"  name="contact_phone"  type="tel"   placeholder="Contact Phone"  value="' + job[ "contact_phone" ] + '" pattern="\(\d\d\d\) ?\d\d\d-\d\d\d\d">' +
						'<input    class="input_box contact_street" name="job_street" type="text"      placeholder="Job Street"     value="' + job[ "job_street" ] + '">' +
						'<input    class="input_box contact_city"   name="job_city"   type="text"      placeholder="Job City"       value="' + job[ "job_city" ] + '">' +
						'<br>' +
						'<textarea class="input_box notes"  name="notes" placeholder="Notes">' + job[ "notes" ] + '</textarea>' +
						'<input    class="input_box rating" name="rating" type="range" title="Rating" value="' + job[ "rating" ] + '">' +
						'<span class="input_box rating_reading">' + job[ "rating" ] + '</span>' +
						'<input                             name="last_updated" type="hidden" value="' + job[ "last_updated" ] + '">'   +
						'<span class="status">Saved.</span>' +
						'<span class="date">' + " " + job[ "last_updated" ] + "</span>" +
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
					
				default:
					
					break;
					
			}
			
			$( "[job='" + job[ "number" ] + "']" ).children( ".rating_reading" ).html( value );
			
		} );
		
	}
	
	function update_job( )
	{
		
		var job = $( this );
		
		var job_number = $( this ).attr( "job" );
		
		var data = { "number": job_number };
		
		var date = new Date( ).toString( );
		
		for ( var i = 0; i < job[ 0 ].length; ++i )
		{
		
			if ( job[ 0 ][ i ].name === "last_updated" )
			{
				
				data[ job[ 0 ][ i ].name ] = date;
				
			}	
			else
			{
			
				data[ job[ 0 ][ i ].name ] = job[ 0 ][ i ].value;
				
			}
			
		}
		
		var data_string = JSON.stringify( data );
		
		$( this ).children( ".status" ).html( "Saving..." );
		
		$.ajax( {
			
			type: "POST",
			url: "/update",
			data: data_string,
			success: function ( data ) {
			
				$( "[job='" + job_number + "']" ).children( ".status" ).html( "Saved." );
				
				$( "[job='" + job_number + "']" ).children( ".date" ).html( date );
				
				$( "[job='" + job_number + "']" ).children( "[name='last_updated']" ).val( date );
				
			},
			error: function ( data ) {
				
				$( "[job='" + job_number + "']" ).children( ".status" ).html( "Error." );
				
			}
			
		} );
		
	}
	
	function get_jobs( )
	{
		
		$( "#db_status" ).html( "Getting job data..." );
		
		$.ajax( {
			
			type: "POST",
			url: "/all",
			data: "",
			success: function ( data ) {
				
				if ( data == "" )
				{
					
					$( "#db_status" ).html( "Add a job." );
					
					$( "#plus_sign" ).animate( {
						
						marginRight: "200px"
						
					},
					1000,
					function ( ) {
						
						$( "#plus_sign" ).animate( {
							
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
					
				}
				
			},
			error: function ( data ) {				
				
				$( "#db_status" ).html( "There was an error." );
			}
			
		} );
		
	}
	
	$( "#plus_sign" ).on( "click", add_blank_job );
	
	get_jobs( );
	
} );