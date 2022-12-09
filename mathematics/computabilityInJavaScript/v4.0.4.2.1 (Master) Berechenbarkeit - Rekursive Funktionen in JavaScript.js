/****************************************************************************************************/
/*                                                                                                  */
/* v4.0.4.2.1 (Master) Berechenbarkeit - Rekursive Funktionen in JavaScript.js                      */
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

console.log( "v4.0.4.2.1 (Master) Berechenbarkeit - Rekursive Funktionen in JavaScript" );

/*------------------------------------------------------------------------------------------------*/
/* 1. composition:                                                                                */
/*------------------------------------------------------------------------------------------------*/
const composition = function( f, ...functions ) {

   return function( ...args ) {
      const intermediate = [];
      for( let g of functions ) intermediate.push( g( ...args ) );
      return f( ...intermediate );
   }
};

/*------------------------------------------------------------------------------------------------*/
/* 2. recursion:                                                                                  */
/*------------------------------------------------------------------------------------------------*/
const recursion = function( initial, induction ) {

   const h = function( n, ...args ) {
      if( n == 0 )
         return initial( ...args );
      else
         return induction( n-1, h( n-1, ...args ), ...args );
   }

   return h;
};

/*------------------------------------------------------------------------------------------------*/
/* 3. constant:                                                                                   */
/*------------------------------------------------------------------------------------------------*/
const constant = function( c ) {
   return function() {
      return c;
   }
};

/*------------------------------------------------------------------------------------------------*/
/* 4. projection:                                                                                 */
/*------------------------------------------------------------------------------------------------*/
const projection = function( i ) {
   return function() {
      return arguments[ i ];
   }
};

/*------------------------------------------------------------------------------------------------*/
/* 5. successor:                                                                                  */
/*------------------------------------------------------------------------------------------------*/
const successor = function() {
   return function( x ) {
      return x+1;
   };
};

/*------------------------------------------------------------------------------------------------*/
/* 6. minimum:                                                                                    */
/*------------------------------------------------------------------------------------------------*/
const minimum = function( f ) {

   return function( ...args ) {
      let m = 0;

      while( true ) {
         if( f( m, ...args ) == 0 ) return m;
         ++m;
      }
   }
};

/*------------------------------------------------------------------------------------------------*/
/* execute:                                                                                       */
/*------------------------------------------------------------------------------------------------*/
{
   console.log( "execute: --------------------------------------------" );

   const c42 = constant( 42 );

   const p3  = projection( 3 );

   console.log( c42() );
   console.log( p3( 1,2,3,4,5,6 ) );

   const s = successor();

   console.log( s( 42 ) );

   console.log( composition( s, c42 )() );

   // n + c, n * c
   const plus      = recursion( projection( 0 ), composition( successor(), projection( 1 ) ) );
   const times     = recursion( constant( 0 ), composition( plus, projection( 1 ), projection( 2 ) ) );
   const factorial = recursion( constant( 1 ), composition( times, composition( successor(), projection( 0 ) ), projection( 1 ) ) );

   console.log( times( 0, 5 ) );
   console.log( times( 11, 5 ) );


   console.log( plus( 0, 5 ) );
   console.log( plus( 3, 5 ) );
   console.log( times( 0, 5 ) );
   console.log( times( 11, 5 ) );

   console.log( factorial( 0 ) );
   console.log( factorial( 5 ) );
}

/*------------------------------------------------------------------------------------------------*/
/* moreReadable:                                                                                  */
/*------------------------------------------------------------------------------------------------*/
{
   console.log( "" );
   console.log( "moreReadable: --------------------------------------------" );
   const s  = successor();

   const c0 = constant( 0 );
   const c1 = constant( 1 );

   const x0 = projection( 0 );
   const x1 = projection( 1 );
   const x2 = projection( 2 );

   // inside initial function h( 0, x0 ) = g( x0 )
   const initial_x = x0;

   // inside induction function: h( n+1 ) = f( n, h( n, x2 ), x2 )
   const n         = x0;
   const h         = x1;
   const x         = x2;
   const n_plus_1  = composition( s, n );

   // inside minimum
   const m = x0;

   // 0-1 := 0;
   const minusOne  = recursion( c0, n );

   // -n + x
   const minus     = recursion( initial_x, composition( minusOne, h           ) );
   const plus      = recursion( initial_x, composition( s       , h           ) );
   const times     = recursion( c0       , composition( plus    , h, x        ) );

   const factorial = recursion( c1       , composition( times   , n_plus_1, h ) );
   const power     = recursion( c1       , composition( times   , x       , h ) );


   const sqrt      = minimum( composition( minus, composition( times, m, m ), x1 ) );

   console.log( plus( 42, 5 ) );
   console.log( plus( 0, 5 ) );
   console.log( times( 0, 5 ) );
   console.log( times( 11, 5 ) );

   console.log( factorial( 0 ) );
   console.log( factorial( 5 ) );

   console.log( power( 3, 5 ) );

   console.log( sqrt( 26 ) );
   console.log( sqrt( 100 ) );
   console.log( sqrt( 101 ) );
}
