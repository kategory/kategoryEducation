/****************************************************************************************************/
/*                                                                                                  */
/* v4.0.4.2.4.1 (Master) Berechenbarkeit - Ackermannfunktion ist mu-rekursiv.js                     */
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

console.log( "v4.0.4.2.4.1 (Master) Berechenbarkeit - Ackermannfunktion ist mu-rekursiv" );

let factorial = function( n ) {
   let stack = [];

   stack.push( n );
   stack.push( "entry" );

   let result = null;

   while( stack.length ) {
      let state = stack.pop();
      let n     = stack.pop();

      if( n == 0 ) {
         result = 1;
      }
      else if( state == "entry" ) {
         stack.push( n );
         stack.push( "multiplication" );
         stack.push( n-1 );
         stack.push( "entry" );
      }
      else if( state == "multiplication" ) {
         result *= n;
      }
   }
   return result;
};

for( let i = 0; i < 26; ++i )
   console.log( "factorial( " + i + " ) = " + factorial(i) );

let ackermann = function( k, n ) {
   if     ( k == 0 ) return n+1;
   else if( n == 0 ) return ackermann( k-1, 1 );
   else              return ackermann( k-1, ackermann( k, n-1 ) );
}


let ackermannMu = function( k, n ) {
   let stack = [];

   stack.push( n );
   stack.push( k );
   stack.push( "entry" );

   let result = null;

   while( stack.length ) {
      let state = stack.pop();
      let k     = stack.pop();
      let n     = stack.pop();

      // console.log( "state = " + state );
      // console.log( "k     = " + k     );
      // console.log( "n     = " + n     );


      
      if( state == "exit" ) {
      }
      else if( k == 0 ) {
         result = n+1;
      }
      else if( n == 0 ) {
         stack.push( n );
         stack.push( k );
         stack.push( "exit" );

         stack.push( 1 );
         stack.push( k-1 );
         stack.push( "entry" );
      }
      else if( state == "entry" ) {
         stack.push( n );
         stack.push( k );
         stack.push( "inner" );

         stack.push( n-1 );
         stack.push( k );
         stack.push( "entry" );
      }
      else if( state == "inner" ) {
         stack.push( n );
         stack.push( k );
         stack.push( "exit" );

         stack.push( result );
         stack.push( k-1 );
         stack.push( "entry" );
      }
   }

   return result;
};

let testAckermann = function( k, n ) {
   console.log( "ackermann( " + k + ", " + n + " ) = " + ackermann( k, n ) );
}

testAckermann( 0,  0 );
testAckermann( 0,  1 );
testAckermann( 0,  4 );
testAckermann( 1,  0 );
testAckermann( 1,  1 );
testAckermann( 2,  2 );
testAckermann( 3,  4 );
// testAckermann( 4,  0 );
// testAckermann( 4,  1 );

let testAckermannMu = function( k, n ) {
   console.log( "ackermannMu( " + k + ", " + n + " ) = " + ackermannMu( k, n ) );
}

testAckermannMu( 0,  0 );
testAckermannMu( 0,  1 );
testAckermannMu( 0,  4 );
testAckermannMu( 1,  0 );
testAckermannMu( 1,  1 );
testAckermannMu( 2,  2 );
testAckermannMu( 3,  4 );
// testAckermannMu( 4,  0 );
// testAckermannMu( 4,  1 );
