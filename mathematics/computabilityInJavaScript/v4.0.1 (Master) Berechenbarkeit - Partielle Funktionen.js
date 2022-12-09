/****************************************************************************************************/
/*                                                                                                  */
/* v4.0.1 (Master) Berechenbarkeit - Partielle Funktionen.js                                        */
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

console.log( "v4.0.1 (Master) Berechenbarkeit - Partielle Funktionen" );

/* nodejs partial functions */

let f = function( x, y ) {
   let time = 0;
   let infinity = 1000000;

   if(
      typeof x == undefined ||
      typeof y == undefined
   ) return undefined;

   try {
      let r = x*y;

      while( r < 333 ) {

         // we need that in every loop
         if( ++time > infinity ) throw "fictive endless loop";

         // real work
         // ...
         // ...

         if( r < 0 ) return undefined;

      }

      // ...
      return r;
   }
   catch( error ) {
      return undefined;
   }
}


