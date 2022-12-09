/****************************************************************************************************/
/*                                                                                                  */
/* v4.0.2 (Master) Berechenbarkeit - Alphabete und Sprachen.js                                      */
/*                                                                                                  */
/* Copyright (C) 2021 Kategory GmbH & Co. KG (joerg.kunze@kategory.de)                              */
/*                                                                                                  */
/* This program is part of kategoryEducation.                                                       */
/*                                                                                                  */
/* kategoryEducation is free software: you can redistribute it and/or modify                        */
/* it under the terms of the GNU General Public License as published by                             */
/* the Free Software Foundation, either version 3 of the License, or                                */
/* (at your option) any later version.                                                              */
/*                                                                                                  */
/* kategoryEducation is distributed in the hope that it will be useful,                             */
/* but WITHOUT ANY WARRANTY; without even the implied warranty of                                   */
/* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                                    */
/* GNU General Public License for more details.                                                     */
/*                                                                                                  */
/* You should have received a copy of the GNU General Public License                                */
/* along with this program.  If not, see <http://www.gnu.org/licenses/>.                            */
/*                                                                                                  */
/****************************************************************************************************/
"use strict";

/* nodejs ruminations about constructibilitiy */

let assert = require( "assert" );
assert( true == true );

console.log( "v4.0.2 (Master) Berechenbarkeit - Alphabete und Sprachen" );

let languageToRegexp = languageSpecification => new RegExp( "^(" + languageSpecification + ")$" )

let alphabet      =   s        => "[" + s + "]";                // A = { 1, 2, 3 }
let kleeneStar    =   l1       => "(" + l1 + ")*";              // A*
let concatenation = ( l1, l2 ) => "(" + l1 + ")("  + l2 + ")";  // AB
let union         = ( l1, l2 ) => "(" + l1 + ")|(" + l2 + ")";  // A+B

let language = kleeneStar( alphabet( "01" ) ); // "[01]*"
let regexp = languageToRegexp( language );

assert(  regexp.test( "010101111010101" ) );
assert( !regexp.test( "222101111010101" ) );


let language2 = union( language, kleeneStar( alphabet( "23" ) ) ); // "([01]*)|([23]*)"
let regexp2 = languageToRegexp( language2 );

assert(  regexp2.test( "010101111010101" ) );
assert(  regexp2.test( "2333323"         ) );
assert( !regexp2.test( "0101102333323"   ) );

