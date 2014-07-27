/*
 * David Lettier (C) 2014.
 * http://www.lettier.com/
 * 
 */

var http    = require( "http"    );
var   fs    = require( "fs"      );
var  url    = require( "url"     );
var path    = require( "path"    );

var content_types = {
	
	".html": "text/html",
	".css":  "text/css",
	".js":   "text/javascript",
	".txt":  "text/plain",
	".ico":  "image/x-icon"
	
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
				
				response.setHeader( "Content-Type", content_type );
				response.write( file );
				response.end( );
				
			}
			
		} );
		
	} );
	
}

// Start the server.

var server = http.createServer( file_handler );

var port_number = 8888;

server.listen( port_number, function( ) {
	
	console.log( "Server started and listening on port: " + port_number );
	
} );
