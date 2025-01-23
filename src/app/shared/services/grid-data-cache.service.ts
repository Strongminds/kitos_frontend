import { Injectable } from '@angular/core';
import { chunk } from 'cypress/types/lodash';


export interface GridDataCacheChunk{
  skip: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
}
@Injectable({
  providedIn: 'root'
})
export class GridDataCacheService {

  private cache: (GridDataCacheChunk | undefined)[] = [];

  constructor() { }


  public get(startIndex: number, chunkCount: number){
    if (this.cache.length === 0) return undefined;
    //todo if any undefineds in the chunk slice, return undef
    const chunksInSlice = this.cache.slice(startIndex, startIndex + chunkCount);

    if (chunksInSlice.length !== chunkCount) return undefined;

    const concatenatedData = [];

    for(const chunk of chunksInSlice){
      if(chunk === undefined){
        return undefined;
      }
      concatenatedData.push(...chunk.data);
    }
    return concatenatedData;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public set(index: number, count: number, data: any[]){
    let currentPass = 0;
    const passesToDo = count / 50;
    while (currentPass < passesToDo){
      this.cache[index] = {
        skip: index++ * 50,
        data: data.slice(currentPass * 50, ++currentPass * 50)
      };
    }
    console.log('done')
  }

  public reset(){
    this.cache = [];
  }
}
