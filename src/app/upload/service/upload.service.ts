import { Inject, Injectable } from "@angular/core";
import { Pokemon } from "src/app/model/pokemon";

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  // processing functionality will likely be moved to nodeJS server later
  private readonly PKMN_FULL_PARTY_DATA_OFFSET = 0x2F2C;
  private readonly PKMN_FULL_PARTY_DATA_LENGTH = 0x194;
  constructor() { }

  public processSaveFile(file: File): void {
    let saveFileArray: Uint8Array;
    file.arrayBuffer().then((fileBuffer: ArrayBuffer) => {
      saveFileArray = new Uint8Array(fileBuffer);
      this.getPkmnFromParty(saveFileArray);
    })
  }

  private generateStat(baseValue: number, individualValue: number, effortValue: number, level: number, nature?: number): number {
    // TODO: implement stat calculation for Gen I from IV/EV
    if (nature === undefined) {
      nature = 1;
    }
    return 100;
  }

  private getPkmnFromBox(boxNumber: number): void {

  }

  private getPkmnFromParty(save: Uint8Array): void {
    const partyData = save.slice(this.PKMN_FULL_PARTY_DATA_OFFSET, this.PKMN_FULL_PARTY_DATA_OFFSET + this.PKMN_FULL_PARTY_DATA_LENGTH);
    console.log('total Pokemon in party: '.concat(partyData[0].toString()));
    let pokemonLeftInParty = true;
    let currentPartyIndex = 0;
    const partyDataOffset = 0x8;
    const partyDataNameOffset = 0x152;
    while (pokemonLeftInParty) {
      const currentPokemon = new Pokemon();
      currentPokemon.index = partyData[partyDataOffset + (currentPartyIndex * 0x2C) + UploadService.RBYPkmnDataStructure.PKMN_INDEX];
      currentPokemon.currentHp = partyData.slice(partyDataOffset + (currentPartyIndex * 0x2C) + UploadService.RBYPkmnDataStructure.PKMN_CURRENT_HP,
        partyDataOffset + (currentPartyIndex * 0x2C) + UploadService.RBYPkmnDataStructure.PKMN_FAKE_LEVEL).join('');
      currentPokemon.statusCondition = this.getStatusCondition(partyData[partyDataOffset + (currentPartyIndex * 0x2C) + UploadService.RBYPkmnDataStructure.PKMN_STATUS_CONDITION]);
      currentPokemon.typeOne = this.getType(partyData[partyDataOffset + (currentPartyIndex * 0x2C) + UploadService.RBYPkmnDataStructure.PKMN_TYPE_1]);
      currentPokemon.typeTwo = this.getType(partyData[partyDataOffset + (currentPartyIndex * 0x2C) + UploadService.RBYPkmnDataStructure.PKMN_TYPE_2]);
      currentPokemon.catchRate = partyData[partyDataOffset + (currentPartyIndex * 0x2C) + UploadService.RBYPkmnDataStructure.PKMN_CATCH_RATE_HELD_ITEM];
      currentPokemon.originalTrainerId = this.getFormattedTrainerId(partyData.slice(partyDataOffset + (currentPartyIndex * 0x2C) + UploadService.RBYPkmnDataStructure.PKMN_ORIGINAL_TRAINER_ID,
      partyDataOffset + (currentPartyIndex * 0x2C) + UploadService.RBYPkmnDataStructure.PKMN_XP));
      console.log(partyData.slice(partyDataNameOffset + (currentPartyIndex * 0xB),
      partyDataNameOffset + (currentPartyIndex * 0xB) + 0xB).toString());
      currentPokemon.nickname = this.pkmnTextToString(partyData.slice(partyDataNameOffset + (currentPartyIndex * 0xB),
      partyDataNameOffset + (currentPartyIndex * 0xB) + 0xB));
      console.log(currentPokemon.toString());
      if (currentPartyIndex >= 5) {
        pokemonLeftInParty = false;
      }
      currentPartyIndex++;
    }

  }

  private pkmnTextToString(textData: Uint8Array): string {
    const charLookupTable = this.buildTextConversionTable();
    console.log(charLookupTable);
    let text = '';
    let terminatorReached = false;
    textData.forEach((data: number) => {
      if(data === 0x50) {
        terminatorReached = true;
      }
      if (!terminatorReached) {
        text += charLookupTable.get(data) as string;
      }
    });
    return text;
  }

  private buildTextConversionTable(): Map<number, string> {
    // isn't this exciting?
    // just wait until the index to pokemon number...
    const textConversionMap = new Map<number, string>();
    // do the ascii conversions first
    const letterAsciiOffset = 0x3f;
    const numberOffset = 0xc6;
    // capital letters
    for(let i = 0x41; i <= 0x5a; i++) {
      textConversionMap.set(i + letterAsciiOffset, String.fromCharCode(i));
    }
    // lowercase letters
    for(let i = 0x61; i <= 0x7a; i++) {
      textConversionMap.set(i + letterAsciiOffset, String.fromCharCode(i));
    }
    // numbers
    for(let i = 0x30; i <= 0x39; i++) {
      textConversionMap.set(i + numberOffset, String.fromCharCode(i));
    }
    // other characters, set manually
    textConversionMap.set(0x4f, ' ');
    textConversionMap.set(0x50, '');
    textConversionMap.set(0x57, '#');
    textConversionMap.set(0x51, '*');
    textConversionMap.set(0x52, 'A1');
    textConversionMap.set(0x53, 'A2');
    textConversionMap.set(0x54, 'POKé');
    textConversionMap.set(0x55, '+');
    textConversionMap.set(0x58, '$');
    textConversionMap.set(0x75, '...');
    textConversionMap.set(0x7F, ' ');
    textConversionMap.set(0x9A, '(');
    textConversionMap.set(0x9B, ')');
    textConversionMap.set(0x9C, ':');
    textConversionMap.set(0x9D, ';');
    textConversionMap.set(0x9E, '[');
    textConversionMap.set(0x9F, ']');
    textConversionMap.set(0xBA, 'é');
    textConversionMap.set(0xBB, '\'d');
    textConversionMap.set(0xBC, '\'l');
    textConversionMap.set(0xBD, '\'s');
    textConversionMap.set(0xBE, '\'t');
    textConversionMap.set(0xBF, '\'v');
    textConversionMap.set(0xE0, '\'');
    textConversionMap.set(0xE1, 'PK');
    textConversionMap.set(0xE2, 'MN');
    textConversionMap.set(0xE3, '-');
    textConversionMap.set(0xE4, '\'r');
    textConversionMap.set(0xE5, '\'m');
    textConversionMap.set(0xE6, '?');
    textConversionMap.set(0xE7, '!');
    textConversionMap.set(0xE8, '.');
    textConversionMap.set(0xED, '→');
    textConversionMap.set(0xEE, '↓');
    textConversionMap.set(0xEF, '♂');
    textConversionMap.set(0xF0, '¥');
    textConversionMap.set(0xF1, '×');
    textConversionMap.set(0xF3, '/');
    textConversionMap.set(0xF4, ',');
    textConversionMap.set(0xF5, '♀');
    return textConversionMap;
  }

  private getStatusCondition(status: number): string {
    switch(status) {
      case 0x04:
        return 'Asleep';
      case 0x08:
        return 'Poisoned';
      case 0x10:
        return 'Burned';
      case 0x20:
        return 'Frozen';
      case 0x40:
        return 'Paralyzed';
      default:
        return 'None';
    }
  }

  private getType(type: number): string {
    switch(type) {
      case 0x00:
        return 'Normal';
      case 0x01:
        return 'Fighting';
      case 0x02:
        return 'Flying';
      case 0x03:
        return 'Poison';
      case 0x04:
        return 'Ground';
      case 0x05:
        return 'Rock';
      case 0x07:
        return 'Bug';
      case 0x08:
        return 'Ghost';
      case 0x14:
        return 'Fire';
      case 0x15:
        return 'Water';
      case 0x16:
        return 'Grass';
      case 0x17:
        return 'Electric';
      case 0x18:
        return 'Psychic';
      case 0x19:
        return 'Ice';
      case 0x1A:
        return 'Dragon';
      default:
        return 'N/A'
    }
  }

  private getFormattedTrainerId(trainerId: Uint8Array): string {
      const packedNumber = (trainerId[1] << 8) | trainerId[0];
      return packedNumber.toLocaleString('en', {minimumIntegerDigits: 5, maximumFractionDigits: 0, useGrouping: false});
  }
}

export namespace UploadService {
  export enum RBYPkmnDataStructure {
    // reference link for information: https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_data_structure_(Generation_I)
    PKMN_INDEX = 0x0, // different from pokemon # https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_index_number_(Generation_I)
    PKMN_CURRENT_HP = 0x1,
    PKMN_FAKE_LEVEL = 0x3,
    PKMN_STATUS_CONDITION = 0x4,
    PKMN_TYPE_1 = 0x5,
    PKMN_TYPE_2 = 0x6,
    PKMN_CATCH_RATE_HELD_ITEM = 0x7,
    PKMN_MOVE_1_INDEX = 0x8,
    PKMN_MOVE_2_INDEX = 0x9,
    PKMN_MOVE_3_INDEX = 0xA,
    PKMN_MOVE_4_INDEX = 0xB,
    PKMN_ORIGINAL_TRAINER_ID = 0xC,
    PKMN_XP = 0x0E,
    PKMN_HP_EV = 0x11,
    PKMN_ATK_EV = 0x13,
    PKMN_DEF_EV = 0x15,
    PKMN_SPD_EV = 0x17,
    PKMN_SPC_EV = 0x19,
    PKMN_IV = 0x1B,
    PKMN_MOVE_1_PP = 0x1D,
    PKMN_MOVE_2_PP = 0x1E,
    PKMN_MOVE_3_PP = 0x1F,
    PKMN_MOVE_4_PP = 0x20,
    PKMN_LEVEL = 0x21, //LOST IN BOX
    PKMN_MAX_HP = 0x22, //LOST IN BOX
    PKMN_ATK = 0x24, //LOST IN BOX
    PKMN_DEF = 0x26, //LOST IN BOX
    PKMN_SPD = 0x28, //LOST IN BOX
    PKMN_SPC = 0x2A //LOST IN BOX
  }
}
