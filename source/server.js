/*
 * David Lettier (C) 2014.
 * http://www.lettier.com/
 * 
 */

var http    = require( "http"    );
var   fs    = require( "fs"      );
var  url    = require( "url"     );
var path    = require( "path"    );
var mongojs = require( "mongojs" );

var uri = "mongodb://localhost:27017/jobjartest";

// Connect to the database and select the collection.

var db = mongojs.connect( uri, [ "jobs" ] );

var content_types = {
	
	".html": "text/html",
	".css":  "text/css",
	".js":   "text/javascript",
	".txt":  "text/plain",
	".ico":  "image/x-icon",
	".mst":  "text/html"
	
};

function file_handler( request, response )
{
	
	var uri               = url.parse( request.url ).pathname;
	
	var filename_and_path = path.join( __dirname, uri );
	
	fs.exists( filename_and_path, function ( exists ) {
		
		// IF GET / add index.html to the file path.
		
		if ( !exists )
		{
			
			console.log( "File not found: ", filename_and_path );
			
			response.writeHead( 404, { "Content-type": "text/plain" } );
			response.write( "File not found." );
			response.end();
			
			return false;
			
		}
		
		if ( fs.statSync( filename_and_path ).isDirectory( ) ) 
		{
			
			filename_and_path += 'index.html';
			
		}
		
		// Get the MIME type based on the file extension.
		
		var content_type = content_types[ path.extname( filename_and_path ) ];
		
		// Read in the file.
		
		fs.readFile( filename_and_path, function( error, file ) {
			
			
			if ( error ) 
			{
				
				response.writeHead( 404, { "Content-type": "text/plain" } );
				response.write( error + "\n" );
				response.end();
				
			} 
			else 
			{
				
				console.log( "File found: ", filename_and_path );
				
				response.setHeader( "Content-Type", content_type );
				response.write( file );
				response.end( );
				
			}
			
		} );
		
	} );
	
}

function db_handler( request, response, uri )
{
	
	// An plain text response.
	
	response.writeHead( 200, { "Content-Type": "text/plain" } );

	var body = "";
	
	if ( uri === "/all" )
	{
		
		request.on( "data" , function ( data ) {
			
			
		} );
		
		request.on( "end", function ( ) {
			
			db.jobs.find( { } ).sort( { "number": 1 } , function ( error, records  ) {
				
				if ( records.length === 0  )
				{
					
					response.write( "" );
					
					response.end( );
					
				}
				else
				{
				
					var data = JSON.stringify( records );
					
					response.write( data );
					
					response.end( );
					
				}
				
			} );			
			
		} );
		
	}
	else if ( uri === "/sort" )
	{
		
		// Gather the POST body.
		
		body = "";
		
		request.on( "data", function ( data ) {
			
			body += data;
			
			// Avoid large POST bodies.
			
			if ( body.length > 1e6 )
			{
				
				request.connection.destroy( );
				
			}
			
		} );
		
		request.on( "end", function ( ) {
			
			var data = JSON.parse( body );
			
			if ( data.field === undefined )
			{
				
				response.write( "" );
				
				response.end( );
				
				return false;
				
			}
			
			var sort_by = { };
			
			sort_by[ data.field ] = parseInt( data.order, 10 );
			
			db.jobs.find( { } ).sort( sort_by, function ( error, records  ) {
				
				if ( records.length === 0  )
				{
					
					response.write( "" );
					
					response.end( );
					
				}
				else
				{
					
					var data = JSON.stringify( records );
					
					response.write( data );
					
					response.end( );
					
				}
				
			} );			
			
		} );
		
	}
	else if ( uri === "/update" )
	{
		
		// Gather the POST body.
		
		body = "";
		
		request.on( "data", function ( data ) {
			
			body += data;
			
			// Avoid large POST bodies.
			
			if ( body.length > 1e6 )
			{
				
				request.connection.destroy( );
				
			}
			
		} );
		
		request.on( "end", function ( ) {
			
			var data = JSON.parse( body );
			
			data.rating = parseInt( data.rating, 10 );
			
			data.number = parseInt( data.number, 10 );
			
			data.time_entered = parseInt( data.time_entered, 10 );
			
			db.jobs.update( { "number": data.number }, data, { upsert: true }, function ( ) {
				
				console.log( "Job " + data.number + " updated." );
				
				response.write( JSON.stringify( data ) );
				
				response.end( );
				
			} );
			
		} );
		
	}
	else if ( uri === "/delete" )
	{
		
		// Gather the POST body.
		
		body = "";
		
		request.on( "data", function ( data ) {
			
			body += data;
			
			// Avoid large POST bodies.
			
			if ( body.length > 1e6 )
			{
				
				request.connection.destroy( );
				
			}
			
		} );
		
		request.on( "end", function ( ) {
			
			var data = JSON.parse( body );
			
			db.jobs.remove( { "number": data.number }, { justOne: true }, function (   ) {
				
				console.log( "Job " + data.number + " deleted." );
				
				db.jobs.update( { "number": { $gte: data.number } }, { $inc: { "number": -1 } }, { multi: true }, function ( ) {
					
					response.write( JSON.stringify( data ) );					
					
					response.end( );
					
				} );
				
			} );
			
		} );
		
	}	
	
}

function server_handler( request, response )
{
	
	var uri = url.parse( request.url ).pathname;

	if ( request.method === "POST" && uri === "/all" )
	{
		
		db_handler( request, response, uri );
		
	}
	else if ( request.method === "POST" && uri === "/sort" ) 
	{
		
		db_handler( request, response, uri );
		
	}
	else if ( request.method === "POST" && uri === "/update" ) 
	{
		
		db_handler( request, response, uri );
		
	}
	else if ( request.method === "POST" && uri === "/delete" ) 
	{
		
		db_handler( request, response, uri );
		
	}	
	else
	{
		
		file_handler( request, response );
		
	}
	
}

// Start the server.

var server = http.createServer( server_handler );

var port_number = 8888;

server.listen( port_number, function( ) {
	
	console.log( "Server started and listening on port: " + port_number );
	
} );
