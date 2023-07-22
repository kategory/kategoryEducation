/****************************************************************************************************/
/*                                                                                                  */
/* v4.0.4.2.4.3.2 (Master) Berechenbarkeit - Ackermannfunktion ist nicht primitiv rekursiv          */
/*                                           in JavaScript                                          */
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

console.log( "v4.0.4.2.4.3.2 (Master) Berechenbarkeit - Ackermannfunktion ist nicht primitiv rekursiv in JavaScript" );

/****************************************************************************************************/
/*                                                                                                  */
/* DecoratedFunction: including Ackermann-parameter                                                 */
/*                                                                                                  */
/****************************************************************************************************/
const DecoratedFunction = function( implementation, ackermann ) {
   implementation.ackermann = ackermann;
   return implementation;
};

/****************************************************************************************************/
/*                                                                                                  */
/* build: primitive recursive functions                                                             */
/*                                                                                                  */
/****************************************************************************************************/

/*------------------------------------------------------------------------------------------------*/
/* 1. composition:                                                                                */
/*------------------------------------------------------------------------------------------------*/
const composition = function( f, ...functions ) {

   let ackermann = 0;
   for( let g of functions ) {
      ackermann = 5 + Math.max( ackermann, g.ackermann )
   }
   ackermann = 5 + Math.max( ackermann, f.ackermann );

   return new DecoratedFunction(
      function( ...args ) {
         const intermediate = [];
         for( let g of functions ) intermediate.push( g( ...args ) );
         return f( ...intermediate );
      },
      ackermann
   );
};

/*------------------------------------------------------------------------------------------------*/
/* 2. recursion:                                                                                  */
/*------------------------------------------------------------------------------------------------*/
const recursion = function( initial, induction ) {

   let h = function( n, ...args ) {
      if( n == 0 )
         return initial( ...args );
      else
         return induction( n-1, h( n-1, ...args ), ...args );
   };

   return new DecoratedFunction(
      h,
      initial.ackermann + induction.ackermann + 2
   );
};

/*------------------------------------------------------------------------------------------------*/
/* 3. constant:                                                                                   */
/*------------------------------------------------------------------------------------------------*/
const constant = function( c ) {
   return new DecoratedFunction(
      function() {
         return c;
      },
      c
   );
};

/*------------------------------------------------------------------------------------------------*/
/* 4. projection:                                                                                 */
/*------------------------------------------------------------------------------------------------*/
const projection = function( i ) {
   return new DecoratedFunction(
      function() {
         return arguments[ i ];
      },
      0
   );
};

/*------------------------------------------------------------------------------------------------*/
/* 5. successor:                                                                                  */
/*------------------------------------------------------------------------------------------------*/
const successor = function() {
   return new DecoratedFunction(
      function( x ) {
         return x+1;
      },
      1
   );
};

/*------------------------------------------------------------------------------------------------*/
/* execute:                                                                                       */
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


   console.log( plus( 42, 5 ) );
   console.log( plus( 0, 5 ) );
   console.log( times( 0, 5 ) );
   console.log( times( 11, 5 ) );

   console.log( factorial( 0 ) );
   console.log( factorial( 5 ) );

   console.log( power( 3, 5 ) );

   const A = function( name, decoratedFunction ) {
      console.log( name + " is majorated by A( " + decoratedFunction.ackermann + ", n )." );
   };

   A( "s", s );
   A( "x0", x0 );
   A( "c0", c0 );
   A( "n_plus_1", n_plus_1 );
   A( "minus", minus );
   A( "plus", plus );
   A( "times", times );
   A( "factorial", factorial );
   A( "power", power );
}
