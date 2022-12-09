/****************************************************************************************************/
/*                                                                                                  */
/* v4.0.3.3 (Master) Berechenbarkeit - Turing-Maschine Gymnastik.js                                 */
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

/*------------------------------------------------------------------------------------------------*/
/* Changes to the previous version:                                                               */
/* - the wrapper extracts some common code. Thus the transition funcitons on which we operate     */
/*   are leaner.                                                                                  */
/*                                                                                                */
/* - the sequence of the return values of a transition function is now                            */
/*   (state, character, increment) and thus follows the book and my lecture.                      */
/*                                                                                                */
/*                                                                                                */
/*                                                                                                */
/*------------------------------------------------------------------------------------------------*/

console.log( "v4.0.3.3 (Master) Berechenbarkeit - Turing-Maschine Gymnastik" );

/*------------------------------------------------------------------------------------------------*/
/* addOne:                                                                                        */
/*------------------------------------------------------------------------------------------------*/
let addOne = function( state, character ) {

   // return         [ next step, write char, tape increment ]
   switch( state.step ) {

   //----------------------------------------------------------------------------------------------
   case "start":
      if( character == null )
         return [ "end", 1, 1 ];

      else
         return [ "start", character, 1 ];

   //----------------------------------------------------------------------------------------------
   default: throw "unknown state";
   }
};

/*------------------------------------------------------------------------------------------------*/
/* shiftRight:                                                                                    */
/*------------------------------------------------------------------------------------------------*/
let shiftRight = function( state, character ) {
   let oldCharacter;

   // return         [ next step, write char, tape increment ]
   switch( state.step ) {

   //----------------------------------------------------------------------------------------------
   case "start":
      state.oldCharacter = 'A';
      return [ "shiftRight", character, 0 ];

   //----------------------------------------------------------------------------------------------
   case "shiftRight":
      oldCharacter = state.oldCharacter;
      state.oldCharacter = character;

      if( character == null )
         return [ "end", oldCharacter, 0 ];

      else {
         return [ "shiftRight", oldCharacter, 1 ];
      }

   //----------------------------------------------------------------------------------------------
   default: throw "unknown state";
   }
};

/*------------------------------------------------------------------------------------------------*/
/* rewind:                                                                                        */
/*------------------------------------------------------------------------------------------------*/
let rewind = function( state, character ) {
   let oldCharacter;

   if( !state.newStart ) {
      state.newStart = true;
      state.step = "newStart";
   }

   // return         [ next step, write char, tape increment ]
   switch( state.step ) {

   //----------------------------------------------------------------------------------------------
   case "newStart":
      state.oldCharacter = 'A';
      return [ "shiftRight", character, 0 ];

   //----------------------------------------------------------------------------------------------
   case "shiftRight":
      oldCharacter = state.oldCharacter;
      state.oldCharacter = character;

      if( character == null )
         return [ "rewind", oldCharacter, 0 ];

      else {
         return [ "shiftRight", oldCharacter, 1 ];
      }

   //----------------------------------------------------------------------------------------------
   case "rewind":
      if( character == 'A' )
         return [ "end", character, 1 ];

      else
         return [ "rewind", character, -1 ];

   //----------------------------------------------------------------------------------------------
   default: throw "unknown state";
   }
};

/*------------------------------------------------------------------------------------------------*/
/* parkHead:                                                                                      */
/*------------------------------------------------------------------------------------------------*/
let parkHead = function( transition ) {

   return function( state, character ) {

      let oldCharacter;

      if( !state.newStart ) {
         state.newStart = true;
         state.step = "newStart";
      }

      // return         [ next step, write char, tape increment ]
      switch( state.step ) {

      //--------------------------------------------------------------------------------------------
      case "newStart":
         state.oldCharacter = 'A';
         return [ "shiftRight", character, 0 ];

      //--------------------------------------------------------------------------------------------
      case "shiftRight":
         oldCharacter = state.oldCharacter;
         state.oldCharacter = character;

         if( character == null )
            return [ "rewind", oldCharacter, 0 ];

         else {
            return [ "shiftRight", oldCharacter, 1 ];
         }

      //--------------------------------------------------------------------------------------------
      case "rewind":
         if( character == 'A' )
            return [ "start", character, 1 ];

         else
            return [ "rewind", character, -1 ];

      //--------------------------------------------------------------------------------------------
      case "shiftLeft":
         oldCharacter = state.oldCharacter;
         state.oldCharacter = character;

         if( character == 'A' )
            return [ "end", oldCharacter, 0 ];

         else
            return [ "shiftLeft", oldCharacter, -1 ];

      //--------------------------------------------------------------------------------------------
      default:
         let [ nextStep, c, i ] = transition( state, character );

         if( nextStep == "end" ) nextStep = "shiftLeft";

         return [ nextStep, c, i ];
      }
   };
};

/*------------------------------------------------------------------------------------------------*/
/* wrapper:                                                                                       */
/*------------------------------------------------------------------------------------------------*/
let wrapper = function( state, character, transition ) {

   if( !state.step ) state.step = "start";

   let result = transition( state, character );

   state.step = result[0];
   result[0] = state.step == "end" ? true : false;
   return result;
};

/*------------------------------------------------------------------------------------------------*/
/* turingLoop:                                                                                    */
/*------------------------------------------------------------------------------------------------*/
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
         let result = wrapper( stateStorage, tape[ tapePosition ], transition );
         if( result == undefined )
            return undefined;

         [ isEnd, characterToWrite, increment ] = result;
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
      console.log( exception );
      return undefined;
   }

   console.log( "tapePosition: " + tapePosition );
   return tape;
}

/*------------------------------------------------------------------------------------------------*/
/* createTuringMachine:                                                                           */
/*------------------------------------------------------------------------------------------------*/
let createTuringMachine = function( transition ) {
   // Currying oder Schönfinkeln
   return function( tape ) {
      return turingLoop( tape, transition );
   };
};

/*------------------------------------------------------------------------------------------------*/
/* arrayToString:                                                                                 */
/*------------------------------------------------------------------------------------------------*/
let arrayToString = function( a ) {
   let result = "";

   if( a === undefined ) return "undefined";

   for( let element of a ) {

      if( element == null )
         break;

      else {
         if( result !== "" ) result += ",";
         result += element;
      }
   }

   if( result === "" ) result = "[]";
   return result;
};

/*------------------------------------------------------------------------------------------------*/
/* test:                                                                                          */
/*------------------------------------------------------------------------------------------------*/
let testSingle = function( tape, turingMachine ) {
   console.log(
      arrayToString( tape ) + " --> " + arrayToString( turingMachine( tape ) )
   );
}

/*------------------------------------------------------------------------------------------------*/
/* testMany:                                                                                      */
/*------------------------------------------------------------------------------------------------*/
let testMany = function( turingMachine ) {
   testSingle( [ 1, 1, 1 ], turingMachine );
   testSingle( [ 1 ]      , turingMachine );
   testSingle( []         , turingMachine );
}

/*------------------------------------------------------------------------------------------------*/
/* execute:                                                                                       */
/*------------------------------------------------------------------------------------------------*/
// testMany( createTuringMachine( addOne             ) );
// testMany( createTuringMachine( shiftRight         ) );
testMany( createTuringMachine( rewind             ) );
// testMany( createTuringMachine( parkHead( addOne ) ) );
