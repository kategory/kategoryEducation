/****************************************************************************************************/
/*                                                                                                  */
/* v4.0.3.1 (Master) Berechenbarkeit - Turing-Maschine in JavaScript.js                             */
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

console.log( "v4.0.3.1 (Master) Berechenbarkeit - Turing-Maschine in JavaScript" );

let shiftLeftTransition = function( state, c ) {

   if( !state.isInitialized ) {
      state.step = "start";
      state.isInitialized = true;
   };

   let stepSwitch = function() {
      switch( state.step ) {

      // return         [ write char, then goto tape position, then continue with step ]
      case "read":
         if( c == 666 )
            throw "bad character";

         if( c == null ) {
            return         [ null           ,  0, "end"   ];
         } else {
            state.character = c;
            return         [ null           , -1, "write" ];
         }

      case "write": return [ state.character,  1, "next"  ];
      case "next" : return [ null           ,  1, "read"  ];
      case "start": return [ null           ,  1, "read"  ];
      default: throw "unknown state";
      }
   };

   let result = stepSwitch();

   state.step = result[2];
   result[2] = state.step == "end" ? true : false;
   return result;
};

let turingLoop = function( tape, transition ) {

   let tapePosition     = 0;
   let increment        = 0;
   let characterToWrite = null;
   let isEnd            = false;
   let stateStorage     = {};

   let time             = 0;
   let infinity         = 1000000;

   try {
      do {
         let result = transition( stateStorage, tape[ tapePosition ] );
         if( result == undefined )
            return undefined;

         [ characterToWrite, increment, isEnd ] = result;
         if(
            result    == undefined ||
            increment == undefined ||
            isEnd     == undefined
         ) return undefined;

         tape[ tapePosition ] = characterToWrite;
         tapePosition += increment;

         if( ++time > infinity ) throw "fictive endless loop";
      } while( !isEnd );
   }
   catch( exception ) {
      return undefined;
   }

   return tape;
}

let createTuringMachine = function( transition ) {
   // Currying oder Schönfinkeln
   return function( tape ) {
      return turingLoop( tape, transition );
   };
};

let shiftLeftTuringMachine = createTuringMachine( shiftLeftTransition );

let arrayToString = function( a ) {
   let result = "";

   if( a === undefined ) return "undefined";

   for( let element of a ) {

      if( element !== null ) {
         if( result !== "" ) result += ",";
         result += element;
      }
      else
         break;
   }

   if( result === "" ) result = "[]";
   return result;
};

let shiftLeftTest = function( tape ) {
   console.log(
      arrayToString( tape ) + " --> " + arrayToString( shiftLeftTuringMachine( tape ) )
   );
}

shiftLeftTest( [ 0, 1, 1, 0 ] );
shiftLeftTest( [ 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0 ] );
shiftLeftTest( [ 0 ] );
shiftLeftTest( [ 0, 3, 2, 5, 666 ] ); // this should give "undefined"


